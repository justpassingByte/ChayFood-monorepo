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

  async create(userId: string, dto: CreateOrderInput) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Giỏ hàng trống');
    }

    const itemIds = dto.items.map((i) => i.menuItemId);
    const dbItems = await this.prisma.menuItem.findMany({
      where: { id: { in: itemIds } },
    });

    const itemMap = new Map(dbItems.map((item) => [item.id, item]));

    let totalAmount = 0;
    const orderItemsData = dto.items.map((item) => {
      const dbItem = itemMap.get(item.menuItemId);
      if (!dbItem) {
        throw new BadRequestException(`Không tìm thấy món ăn ID: ${item.menuItemId}`);
      }
      const price = Number(dbItem.price);
      totalAmount += price * item.quantity;
      return {
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price,
        specialInstructions: item.specialInstructions || null,
      };
    });

    const orderNumber = `CF-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const order = await this.prisma.order.create({
      data: {
        orderNumber,
        userId,
        totalAmount,
        deliveryAddress: dto.deliveryAddress as unknown as Prisma.InputJsonValue,
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

  async findById(id: string) {
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

    return order;
  }

  /**
   * Cập nhật trạng thái đơn hàng theo State Machine (RULE-CONC-002)
   */
  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.findById(id);

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
              const requiredQuantity = Number(recipeItem.quantity) * orderItem.quantity;
              const ingredient = recipeItem.ingredient;
              const prevStock = Number(ingredient.currentStock);
              const newStock = Math.max(0, prevStock - requiredQuantity);

              await tx.stockTransaction.create({
                data: {
                  ingredientId: ingredient.id,
                  type: StockTransactionType.EXPORT_ORDER,
                  quantity: requiredQuantity,
                  previousStock: prevStock,
                  newStock,
                  unitCost: ingredient.costPerUnit,
                  totalCost: requiredQuantity * Number(ingredient.costPerUnit),
                  referenceId: order.orderNumber,
                  notes: `Tự động trừ kho theo đơn hàng ${order.orderNumber} (Món: ${recipe.name}, SL: ${orderItem.quantity})`,
                  performedBy: 'Hệ Thống Bếp Tự Động',
                },
              });

              await tx.ingredient.update({
                where: { id: ingredient.id },
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
   * Khách hàng hoặc Admin hủy đơn hàng
   */
  async cancelOrder(id: string, userId: string, isAdmin = false) {
    const order = await this.findById(id);

    if (!isAdmin && order.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền hủy đơn hàng này');
    }

    if (!isAdmin && order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Chỉ có thể hủy đơn hàng khi đang ở trạng thái Chờ xử lý');
    }

    if (isAdmin && order.status !== OrderStatus.PENDING && order.status !== OrderStatus.CONFIRMED) {
      throw new BadRequestException('Không thể hủy đơn hàng đã bắt đầu chế biến hoặc giao');
    }

    return this.prisma.order.update({
      where: { id },
      data: { status: OrderStatus.CANCELLED },
      include: { items: { include: { menuItem: true } } },
    });
  }

  /**
   * Khách hàng xác nhận đã nhận hàng (khi DELIVERING)
   */
  async markAsReceived(id: string, userId: string) {
    const order = await this.findById(id);

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
