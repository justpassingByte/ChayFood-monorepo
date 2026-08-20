import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';
import { OrderStatus, StockTransactionType } from '@chayfood/shared-types';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateOrderDto) {
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
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        items: {
          include: { menuItem: true },
        },
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { menuItem: true } },
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
    });

    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }

    return order;
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.findById(id);

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

      return tx.order.update({
        where: { id },
        data: {
          status: dto.status,
          ...(dto.paymentStatus && { paymentStatus: dto.paymentStatus }),
        },
        include: { items: { include: { menuItem: true } } },
      });
    });
  }
}
