import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIngredientDto, CreateStockTransactionDto, QueryIngredientDto, UpdateIngredientDto } from './dto/inventory.dto';
import { StockTransactionType } from '@chayfood/shared-types';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryIngredientDto) {
    const { query: searchText, category, isLowStockOnly } = query;
    const where: Prisma.IngredientWhereInput = {};

    if (searchText) {
      where.OR = [
        { name: { contains: searchText, mode: 'insensitive' } },
        { code: { contains: searchText, mode: 'insensitive' } },
        { supplier: { contains: searchText, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = { contains: category, mode: 'insensitive' };
    }

    const items = await this.prisma.ingredient.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    const mapped = items.map((item) => ({
      ...item,
      currentStock: Number(item.currentStock),
      minThreshold: Number(item.minThreshold),
      costPerUnit: Number(item.costPerUnit),
      isLowStock: Number(item.currentStock) <= Number(item.minThreshold),
    }));

    if (isLowStockOnly) {
      return mapped.filter((item) => item.isLowStock);
    }

    return mapped;
  }

  async findById(id: string) {
    const item = await this.prisma.ingredient.findUnique({
      where: { id },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!item) {
      throw new NotFoundException(`Không tìm thấy nguyên liệu với mã ${id}`);
    }

    return {
      ...item,
      currentStock: Number(item.currentStock),
      minThreshold: Number(item.minThreshold),
      costPerUnit: Number(item.costPerUnit),
      isLowStock: Number(item.currentStock) <= Number(item.minThreshold),
      transactions: item.transactions.map((tx) => ({
        ...tx,
        quantity: Number(tx.quantity),
        previousStock: Number(tx.previousStock),
        newStock: Number(tx.newStock),
        unitCost: tx.unitCost ? Number(tx.unitCost) : null,
        totalCost: tx.totalCost ? Number(tx.totalCost) : null,
      })),
    };
  }

  async getOverviewStats() {
    const all = await this.prisma.ingredient.findMany();
    let totalStockValue = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    for (const item of all) {
      const stock = Number(item.currentStock);
      const cost = Number(item.costPerUnit);
      const threshold = Number(item.minThreshold);

      totalStockValue += stock * cost;
      if (stock <= 0) {
        outOfStockCount++;
      } else if (stock <= threshold) {
        lowStockCount++;
      }
    }

    return {
      totalIngredients: all.length,
      lowStockCount,
      outOfStockCount,
      totalStockValue,
    };
  }

  async create(dto: CreateIngredientDto) {
    const existing = await this.prisma.ingredient.findUnique({
      where: { code: dto.code },
    });

    if (existing) {
      throw new BadRequestException(`Mã nguyên liệu '${dto.code}' đã tồn tại trong hệ thống`);
    }

    const currentStock = dto.currentStock ?? 0;

    return this.prisma.$transaction(async (tx) => {
      const created = await tx.ingredient.create({
        data: {
          name: dto.name,
          code: dto.code,
          unit: dto.unit,
          currentStock,
          minThreshold: dto.minThreshold ?? 0,
          costPerUnit: dto.costPerUnit,
          supplier: dto.supplier,
          category: dto.category,
          isAvailable: dto.isAvailable ?? true,
        },
      });

      if (currentStock > 0) {
        await tx.stockTransaction.create({
          data: {
            ingredientId: created.id,
            type: StockTransactionType.IMPORT,
            quantity: currentStock,
            previousStock: 0,
            newStock: currentStock,
            unitCost: dto.costPerUnit,
            totalCost: currentStock * dto.costPerUnit,
            notes: 'Khởi tạo số lượng tồn ban đầu',
            performedBy: 'Admin',
          },
        });
      }

      return {
        ...created,
        currentStock: Number(created.currentStock),
        minThreshold: Number(created.minThreshold),
        costPerUnit: Number(created.costPerUnit),
      };
    });
  }

  async update(id: string, dto: UpdateIngredientDto) {
    const item = await this.prisma.ingredient.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Không tìm thấy nguyên liệu với mã ${id}`);
    }

    if (dto.code && dto.code !== item.code) {
      const duplicate = await this.prisma.ingredient.findUnique({ where: { code: dto.code } });
      if (duplicate) {
        throw new BadRequestException(`Mã nguyên liệu '${dto.code}' đã tồn tại`);
      }
    }

    const updated = await this.prisma.ingredient.update({
      where: { id },
      data: {
        name: dto.name,
        code: dto.code,
        unit: dto.unit,
        minThreshold: dto.minThreshold,
        costPerUnit: dto.costPerUnit,
        supplier: dto.supplier,
        category: dto.category,
        isAvailable: dto.isAvailable,
      },
    });

    return {
      ...updated,
      currentStock: Number(updated.currentStock),
      minThreshold: Number(updated.minThreshold),
      costPerUnit: Number(updated.costPerUnit),
    };
  }

  async createTransaction(dto: CreateStockTransactionDto) {
    return this.prisma.$transaction(async (tx) => {
      const ingredient = await tx.ingredient.findUnique({
        where: { id: dto.ingredientId },
      });

      if (!ingredient) {
        throw new NotFoundException(`Không tìm thấy nguyên liệu ${dto.ingredientId}`);
      }

      const prevStock = Number(ingredient.currentStock);
      let newStock = prevStock;
      const unitCost = dto.unitCost ?? Number(ingredient.costPerUnit);
      let totalCost: number | null = null;

      if (dto.type === StockTransactionType.IMPORT) {
        newStock = prevStock + dto.quantity;
        totalCost = dto.quantity * unitCost;
      } else if (
        dto.type === StockTransactionType.EXPORT_ORDER ||
        dto.type === StockTransactionType.EXPORT_WASTE
      ) {
        if (prevStock < dto.quantity) {
          throw new BadRequestException(
            `Tồn kho không đủ để xuất! Tồn hiện tại: ${prevStock} ${ingredient.unit}, yêu cầu xuất: ${dto.quantity} ${ingredient.unit}`,
          );
        }
        newStock = prevStock - dto.quantity;
        totalCost = dto.quantity * unitCost;
      } else if (dto.type === StockTransactionType.ADJUSTMENT) {
        newStock = dto.quantity; // Số lượng sau kiểm kê
        totalCost = Math.abs(newStock - prevStock) * unitCost;
      }

      const transaction = await tx.stockTransaction.create({
        data: {
          ingredientId: dto.ingredientId,
          type: dto.type,
          quantity: dto.quantity,
          previousStock: prevStock,
          newStock,
          unitCost,
          totalCost,
          referenceId: dto.referenceId,
          notes: dto.notes,
          performedBy: dto.performedBy ?? 'Admin',
        },
      });

      await tx.ingredient.update({
        where: { id: dto.ingredientId },
        data: {
          currentStock: newStock,
          costPerUnit: dto.type === StockTransactionType.IMPORT && dto.unitCost ? dto.unitCost : ingredient.costPerUnit,
        },
      });

      return {
        ...transaction,
        quantity: Number(transaction.quantity),
        previousStock: Number(transaction.previousStock),
        newStock: Number(transaction.newStock),
        unitCost: transaction.unitCost ? Number(transaction.unitCost) : null,
        totalCost: transaction.totalCost ? Number(transaction.totalCost) : null,
      };
    });
  }

  async getTransactions(ingredientId?: string, limit = 50) {
    const where: Prisma.StockTransactionWhereInput = {};
    if (ingredientId) {
      where.ingredientId = ingredientId;
    }

    const txs = await this.prisma.stockTransaction.findMany({
      where,
      include: {
        ingredient: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return txs.map((tx) => ({
      ...tx,
      quantity: Number(tx.quantity),
      previousStock: Number(tx.previousStock),
      newStock: Number(tx.newStock),
      unitCost: tx.unitCost ? Number(tx.unitCost) : null,
      totalCost: tx.totalCost ? Number(tx.totalCost) : null,
      ingredient: tx.ingredient
        ? {
            ...tx.ingredient,
            currentStock: Number(tx.ingredient.currentStock),
            minThreshold: Number(tx.ingredient.minThreshold),
            costPerUnit: Number(tx.ingredient.costPerUnit),
          }
        : undefined,
    }));
  }
}
