import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateOrderStatusDto } from './dto/order.dto';
import {
  type CreateOrderInput,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  StockTransactionType,
  isValidTransition,
  ORDER_STATUS_LABELS,
} from '@chayfood/shared-types';

export interface OrderQueryFilters {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  search?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'createdAt' | 'totalAmount';
  sortOrder?: 'asc' | 'desc';
}

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 🌟 Tạo đơn hàng mới (Server-Authoritative Pricing & Catalog Drift Defense):
   * 1. Tuyệt đối không nhận giá từ client: Query trực tiếp MenuItem từ Database để lấy giá niêm yết.
   * 2. Kiểm tra cờ `isAvailable`: Chặn khách đặt món khi Admin đã tắt phục vụ hoặc hết nguyên liệu.
   * 3. Snapshot Pattern: Lưu bản sao giá tại thời điểm đặt hàng vào `OrderItem.price` để bảo toàn lịch sử hóa đơn.
   * 4. Bảo toàn số học VND: Làm tròn `Math.round(totalAmount)` chống sai số dấu phẩy động (Floating Point Error).
   */
  async create(userId: string, dto: CreateOrderInput) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Giỏ hàng trống');
    }

    return this.prisma.$transaction(async (tx) => {
      const itemIds = dto.items.map((i) => i.menuItemId);
      const dbItems = await tx.menuItem.findMany({
        where: { id: { in: itemIds } },
      });

      const itemMap = new Map(dbItems.map((item) => [item.id, item]));

      let totalAmount = 0;
      const orderItemsData = dto.items.map((item) => {
        const dbItem = itemMap.get(item.menuItemId);
        if (!dbItem) {
          throw new BadRequestException(`Không tìm thấy món ăn ID: ${item.menuItemId}`);
        }
        // 🛡️ Catalog Drift Defense: Ngăn đặt món đã tạm ngừng bán
        if (!dbItem.isAvailable) {
          throw new BadRequestException(`Món ăn "${dbItem.name}" hiện đang tạm ngừng phục vụ`);
        }
        // 🛡️ Server-Authoritative Pricing & Snapshot
        const price = Math.round(Number(dbItem.price));
        totalAmount += price * item.quantity;
        return {
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          price,
          specialInstructions: item.specialInstructions || null,
        };
      });

      totalAmount = Math.round(totalAmount);
      const orderNumber = `CF-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

      // 🛡️ Type-safe JSON Object (Không sử dụng as unknown)
      const deliveryAddressJson: Prisma.InputJsonObject = {
        street: dto.deliveryAddress.street,
        city: dto.deliveryAddress.city,
        state: dto.deliveryAddress.state || 'Việt Nam',
        postalCode: dto.deliveryAddress.postalCode || '70000',
        ...(dto.deliveryAddress.additionalInfo ? { additionalInfo: dto.deliveryAddress.additionalInfo } : {}),
      };

      const order = await tx.order.create({
        data: {
          orderNumber,
          userId,
          totalAmount,
          deliveryAddress: deliveryAddressJson,
          paymentMethod: dto.paymentMethod,
          paymentStatus: PaymentStatus.PENDING,
          status: OrderStatus.PENDING,
          specialInstructions: dto.specialInstructions,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: {
            include: { menuItem: true },
          },
        },
      });

      return order;
    });
  }



  async findUserOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: { menuItem: true },
        },
        paymentTransactions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll(filters?: OrderQueryFilters) {
    const where: Prisma.OrderWhereInput = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.paymentStatus) {
      where.paymentStatus = filters.paymentStatus;
    }

    if (filters?.paymentMethod) {
      where.paymentMethod = filters.paymentMethod;
    }

    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        const end = new Date(filters.endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    if (filters?.search) {
      const q = filters.search.trim();
      where.OR = [
        { orderNumber: { contains: q, mode: 'insensitive' } },
        { user: { name: { contains: q, mode: 'insensitive' } } },
        { user: { phone: { contains: q, mode: 'insensitive' } } },
        { user: { email: { contains: q, mode: 'insensitive' } } },
      ];
    }

    const sortField = filters?.sortBy || 'createdAt';
    const sortDirection = filters?.sortOrder || 'desc';

    return this.prisma.order.findMany({
      where,
      include: {
        items: {
          include: { menuItem: true },
        },
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
        paymentTransactions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { [sortField]: sortDirection },
    });
  }

  /**
   * 🛡️ Lấy chi tiết đơn hàng (Phòng thủ IDOR Ownership):
   * Khách hàng chỉ được xem đơn hàng của chính mình. Admin có quyền xem tất cả.
   */
  async findById(id: string, userId?: string, isAdmin = false) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { menuItem: true } },
        user: { select: { id: true, name: true, email: true, phone: true } },
        paymentTransactions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }

    // 🛡️ IDOR Check: Chặn người dùng đọc trộm thông tin đơn hàng người khác
    if (userId && !isAdmin && order.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền truy cập đơn hàng này');
    }

    return order;
  }

  /**
   * 📏 Helper Quy Đổi Thứ Nguyên Đơn Vị Tính (Unit Conversion Engine)
   * Đảm bảo tính toán chính xác số lượng nguyên liệu trừ kho khi đơn vị công thức khác đơn vị kho
   */
  private convertQuantity(quantity: number, fromUnit: string, toUnit: string): number {
    if (fromUnit === toUnit) return quantity;

    // Hệ Khối Lượng: GRAM <-> KILOGRAM (1 kg = 1000 g)
    if (fromUnit === 'GRAM' && (toUnit === 'KILOGRAM' || toUnit === 'KG')) return quantity / 1000;
    if ((fromUnit === 'KILOGRAM' || fromUnit === 'KG') && toUnit === 'GRAM') return quantity * 1000;

    // Hệ Thể Tích: MILLILITER <-> LITER (1 L = 1000 mL)
    if ((fromUnit === 'MILLILITER' || fromUnit === 'ML') && (toUnit === 'LITER' || toUnit === 'L')) return quantity / 1000;
    if ((fromUnit === 'LITER' || fromUnit === 'L') && (toUnit === 'MILLILITER' || toUnit === 'ML')) return quantity * 1000;

    return quantity;
  }

  /**
   * 🛡️ Cập nhật trạng thái đơn hàng theo State Machine & Trừ kho BOM tự động (RULE-CONC-002 & RULE-ACID-001):
   * 1. Kiểm tra tính hợp lệ chuyển trạng thái qua `isValidTransition`.
   * 2. Khi chuyển sang `CONFIRMED` hoặc `PREPARING`: Bóc tách công thức `Recipe` và trừ kho `Ingredient` trong Prisma Transaction.
   * 3. Trừ kho nguyên tử với fresh fetch và quy đổi đơn vị (convertQuantity) để chống Stale Read & Dimensional Mismatch.
   * 4. Ghi nhật ký kiểm toán `StockTransaction` với type `EXPORT_ORDER`.
   * 5. Tự động set `isAvailable: false` khi nguyên liệu cạn kiệt về 0.
   */
  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.findById(id, undefined, true);

    // 1. Kiểm tra tính hợp lệ của chuyển đổi trạng thái (State Machine)
    if (!isValidTransition(order.status as OrderStatus, dto.status as OrderStatus)) {
      const fromLabel = ORDER_STATUS_LABELS[order.status as OrderStatus] || order.status;
      const toLabel = ORDER_STATUS_LABELS[dto.status as OrderStatus] || dto.status;
      throw new BadRequestException(
        `Không thể chuyển trạng thái từ "${fromLabel}" sang "${toLabel}"`,
      );
    }

    const isTransitioningToKitchen =
      (dto.status === OrderStatus.CONFIRMED || dto.status === OrderStatus.PREPARING) &&
      order.status !== OrderStatus.CONFIRMED &&
      order.status !== OrderStatus.PREPARING &&
      order.status !== OrderStatus.DELIVERING &&
      order.status !== OrderStatus.READY &&
      order.status !== OrderStatus.DELIVERED;

    return this.prisma.$transaction(async (tx) => {
      if (isTransitioningToKitchen) {
        // Tự động trừ kho nguyên liệu theo định lượng BOM công thức
        for (const orderItem of order.items) {
          const recipe = await tx.recipe.findUnique({
            where: { menuItemId: orderItem.menuItemId },
            include: { items: { include: { ingredient: true } } },
          });

          if (recipe && recipe.items.length > 0) {
            for (const recipeItem of recipe.items) {
              const freshIngredient = await tx.ingredient.findUnique({
                where: { id: recipeItem.ingredientId },
              });
              if (!freshIngredient) continue;

              const rawQty = Number(recipeItem.quantity) * orderItem.quantity;
              const requiredQuantity = this.convertQuantity(rawQty, recipeItem.unit, freshIngredient.unit);
              const prevStock = Number(freshIngredient.currentStock);
              const newStock = Math.max(0, prevStock - requiredQuantity);

              await tx.stockTransaction.create({
                data: {
                  ingredientId: freshIngredient.id,
                  type: StockTransactionType.EXPORT_ORDER,
                  quantity: requiredQuantity,
                  previousStock: prevStock,
                  newStock,
                  unitCost: freshIngredient.costPerUnit,
                  totalCost: requiredQuantity * Number(freshIngredient.costPerUnit),
                  referenceId: order.orderNumber,
                  notes: `Tự động trừ kho theo đơn hàng ${order.orderNumber} (Món: ${recipe.name}, SL: ${orderItem.quantity})`,
                  performedBy: 'Hệ Thống Bếp Tự Động',
                },
              });

              await tx.ingredient.update({
                where: { id: freshIngredient.id },
                data: { currentStock: newStock },
              });

              // Nếu hết nguyên liệu, tự động tắt khả dụng món ăn
              if (newStock <= 0) {
                await tx.menuItem.update({
                  where: { id: orderItem.menuItemId },
                  data: { isAvailable: false },
                });
              }
            }
          }
        }
      }

      // Nguyên tử hóa cập nhật với điều kiện status hiện tại (RULE-CONC-002)
      return tx.order.update({
        where: { id, status: order.status },
        data: {
          status: dto.status,
          ...(dto.paymentStatus && { paymentStatus: dto.paymentStatus }),
        },
        include: {
          items: { include: { menuItem: true } },
          paymentTransactions: { orderBy: { createdAt: 'desc' }, take: 1 },
        },
      });
    });
  }

  /**
   * 🛡️ Khách hàng hoặc Admin hủy đơn hàng:
   * - Hoàn trả tồn kho nguyên liệu (Stock Compensation) nếu đơn đã xuất kho tại trạng thái CONFIRMED.
   */
  async cancelOrder(id: string, userId: string, isAdmin = false) {
    const order = await this.findById(id, userId, isAdmin);

    if (!isAdmin && order.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền hủy đơn hàng này');
    }

    if (!isAdmin && order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Chỉ có thể hủy đơn hàng khi đang ở trạng thái Chờ xử lý');
    }

    if (isAdmin && order.status !== OrderStatus.PENDING && order.status !== OrderStatus.CONFIRMED) {
      throw new BadRequestException('Không thể hủy đơn hàng đã bắt đầu chế biến hoặc giao');
    }

    const isConfirmed = order.status === OrderStatus.CONFIRMED;

    return this.prisma.$transaction(async (tx) => {
      // 🛡️ Hoàn nhập kho nguyên liệu nếu đơn đã được xác nhận trước đó
      if (isConfirmed) {
        for (const orderItem of order.items) {
          const recipe = await tx.recipe.findUnique({
            where: { menuItemId: orderItem.menuItemId },
            include: { items: { include: { ingredient: true } } },
          });

          if (recipe && recipe.items.length > 0) {
            for (const recipeItem of recipe.items) {
              const freshIngredient = await tx.ingredient.findUnique({
                where: { id: recipeItem.ingredientId },
              });
              if (!freshIngredient) continue;

              const rawQty = Number(recipeItem.quantity) * orderItem.quantity;
              const returnedQuantity = this.convertQuantity(rawQty, recipeItem.unit, freshIngredient.unit);
              const prevStock = Number(freshIngredient.currentStock);
              const newStock = prevStock + returnedQuantity;

              await tx.stockTransaction.create({
                data: {
                  ingredientId: freshIngredient.id,
                  type: StockTransactionType.IMPORT,
                  quantity: returnedQuantity,
                  previousStock: prevStock,
                  newStock,
                  unitCost: freshIngredient.costPerUnit,
                  totalCost: returnedQuantity * Number(freshIngredient.costPerUnit),
                  referenceId: order.orderNumber,
                  notes: `Hoàn kho do hủy đơn hàng đã xác nhận ${order.orderNumber} (Món: ${recipe.name}, SL: ${orderItem.quantity})`,
                  performedBy: 'Hệ Thống Tự Động Hoàn Kho',
                },
              });

              await tx.ingredient.update({
                where: { id: freshIngredient.id },
                data: { currentStock: newStock },
              });

              // Bật lại khả dụng món ăn nếu trước đó bị tắt do hết hàng
              if (newStock > 0) {
                await tx.menuItem.update({
                  where: { id: orderItem.menuItemId },
                  data: { isAvailable: true },
                });
              }
            }
          }
        }
      }

      return tx.order.update({
        where: { id },
        data: { status: OrderStatus.CANCELLED },
        include: { items: { include: { menuItem: true } } },
      });
    });
  }


  /**
   * Khách hàng xác nhận đã nhận hàng (khi DELIVERING)
   */
  async markAsReceived(id: string, userId: string) {
    const order = await this.findById(id, userId, false);

    if (order.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền thao tác trên đơn hàng này');
    }

    if (order.status !== OrderStatus.DELIVERING) {
      throw new BadRequestException('Chỉ có thể xác nhận khi đơn hàng đang được giao');
    }

    return this.prisma.order.update({
      where: { id },
      data: {
        status: OrderStatus.DELIVERED,
        // Nếu là COD thì khi nhận hàng đánh dấu đã thanh toán
        ...(order.paymentMethod === PaymentMethod.COD && {
          paymentStatus: PaymentStatus.PAID,
        }),
      },
      include: { items: { include: { menuItem: true } } },
    });
  }
}

