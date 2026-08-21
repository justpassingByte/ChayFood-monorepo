import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateIngredientDto,
  CreateStockTransactionDto,
  QueryIngredientDto,
  QueryStockTransactionDto,
  UpdateIngredientDto,
} from './dto/inventory.dto';
import { StockTransactionType } from '@chayfood/shared-types';

type UnformattedIngredient = {
  currentStock: Prisma.Decimal | number;
  minThreshold: Prisma.Decimal | number;
  costPerUnit: Prisma.Decimal | number;
};

type UnformattedTransaction = {
  quantity: Prisma.Decimal | number;
  previousStock: Prisma.Decimal | number;
  newStock: Prisma.Decimal | number;
  unitCost: Prisma.Decimal | number | null;
  totalCost: Prisma.Decimal | number | null;
};

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  /**
   * Lấy danh sách nguyên vật liệu kho hỗ trợ tìm kiếm, phân trang an toàn
   */
  async findAll(query: QueryIngredientDto) {
    const { query: searchText, category, isLowStockOnly, page = 1, limit = 50 } = query;
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

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.ingredient.findMany({
        where,
        orderBy: { name: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.ingredient.count({ where }),
    ]);

    const formattedItems = items.map((item) => this.formatIngredient(item));

    if (isLowStockOnly) {
      const filtered = formattedItems.filter((item) => item.isLowStock);
      return {
        items: filtered,
        pagination: {
          total: filtered.length,
          page,
          limit,
          totalPages: Math.ceil(filtered.length / limit),
        },
      };
    }

    return {
      items: formattedItems,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Lấy chi tiết nguyên vật liệu và lịch sử 20 giao dịch gần nhất
   */
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
      ...this.formatIngredient(item),
      transactions: item.transactions.map((tx) => this.formatTransaction(tx)),
    };
  }

  /**
   * Thống kê tổng quan kho hàng sử dụng Database Aggregation hiệu năng cao
   */
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
      totalStockValue: Math.round(totalStockValue),
    };
  }

  /**
   * Tạo mới nguyên vật liệu kèm xử lý chống xung đột mã P2002 và khởi tạo tồn kho ban đầu
   */
  async create(dto: CreateIngredientDto, performedBy = 'Admin') {
    const existing = await this.prisma.ingredient.findUnique({
      where: { code: dto.code },
    });

    if (existing) {
      throw new BadRequestException(`Mã nguyên liệu '${dto.code}' đã tồn tại trong hệ thống`);
    }

    const currentStock = dto.currentStock ?? 0;

    try {
      return await this.prisma.$transaction(async (tx) => {
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
              totalCost: Math.round(currentStock * dto.costPerUnit),
              notes: 'Khởi tạo số lượng tồn ban đầu',
              performedBy,
            },
          });
        }

        return this.formatIngredient(created);
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new BadRequestException(`Mã nguyên liệu '${dto.code}' đã tồn tại trong hệ thống`);
      }
      throw error;
    }
  }

  /**
   * Cập nhật thông tin nguyên vật liệu (cấm sửa trực tiếp currentStock để bảo toàn Audit Trail)
   */
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

    try {
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

      return this.formatIngredient(updated);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new BadRequestException(`Mã nguyên liệu '${dto.code}' đã tồn tại`);
      }
      throw error;
    }
  }

  /**
   * Tạo phiếu giao dịch kho ACID: Hỗ trợ WAC, Chống Nhập Trùng, Chống Âm Kho, Ghi nhận Performer
   */
  async createTransaction(dto: CreateStockTransactionDto, performedBy = 'Admin') {
    // Chặn số lượng âm cho phiếu xuất và nhập
    if (dto.quantity <= 0 && dto.type !== StockTransactionType.ADJUSTMENT) {
      throw new BadRequestException('Số lượng giao dịch phải lớn hơn 0');
    }

    if (dto.type === StockTransactionType.ADJUSTMENT && dto.quantity < 0) {
      throw new BadRequestException('Số lượng kiểm kê thực tế không được âm');
    }

    return this.prisma.$transaction(async (tx) => {
      const ingredient = await tx.ingredient.findUnique({
        where: { id: dto.ingredientId },
      });

      if (!ingredient) {
        throw new NotFoundException(`Không tìm thấy nguyên liệu ${dto.ingredientId}`);
      }

      // Idempotency: Kiểm tra chống nhập trùng phiếu theo referenceId
      if (dto.referenceId) {
        const duplicateTx = await tx.stockTransaction.findFirst({
          where: {
            ingredientId: dto.ingredientId,
            referenceId: dto.referenceId,
            type: dto.type,
          },
        });

        if (duplicateTx) {
          throw new BadRequestException(
            `Giao dịch với mã tham chiếu '${dto.referenceId}' đã được xử lý trước đó`,
          );
        }
      }

      const prevStock = Number(ingredient.currentStock);
      let newStock = prevStock;
      const unitCost = dto.unitCost !== undefined ? dto.unitCost : Number(ingredient.costPerUnit);
      let totalCost: number | null = null;
      let newCostPerUnit = Number(ingredient.costPerUnit);

      if (dto.type === StockTransactionType.IMPORT) {
        newStock = prevStock + dto.quantity;
        totalCost = Math.round(dto.quantity * unitCost);

        // Thuật toán Giá Vốn Bình Quân Gia Quyền (Weighted Average Costing)
        const totalStockAfterImport = prevStock + dto.quantity;
        if (totalStockAfterImport > 0 && dto.unitCost !== undefined) {
          const totalValue = prevStock * Number(ingredient.costPerUnit) + dto.quantity * dto.unitCost;
          newCostPerUnit = Math.round(totalValue / totalStockAfterImport);
        } else if (dto.unitCost !== undefined) {
          newCostPerUnit = dto.unitCost;
        }
      } else if (
        dto.type === StockTransactionType.EXPORT_ORDER ||
        dto.type === StockTransactionType.EXPORT_WASTE
      ) {
        if (prevStock < dto.quantity) {
          throw new BadRequestException(
            `Tồn kho không đủ để xuất (Tồn hiện tại: ${prevStock} ${ingredient.unit}, yêu cầu xuất: ${dto.quantity} ${ingredient.unit})`,
          );
        }
        newStock = prevStock - dto.quantity;
        totalCost = Math.round(dto.quantity * unitCost);
      } else if (dto.type === StockTransactionType.ADJUSTMENT) {
        newStock = dto.quantity; // Số lượng sau kiểm kê thực tế
        totalCost = Math.round(Math.abs(newStock - prevStock) * unitCost);
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
          performedBy: dto.performedBy || performedBy,
        },
      });

      await tx.ingredient.update({
        where: { id: dto.ingredientId },
        data: {
          currentStock: newStock,
          costPerUnit: newCostPerUnit,
        },
      });

      return this.formatTransaction(transaction);
    });
  }

  /**
   * Lấy lịch sử biến động kho hỗ trợ phân trang, lọc theo nguyên liệu, loại giao dịch và ngày tháng
   */
  async getTransactions(query: QueryStockTransactionDto) {
    const { ingredientId, type, startDate, endDate, page = 1, limit = 50 } = query;
    const where: Prisma.StockTransactionWhereInput = {};

    if (ingredientId) {
      where.ingredientId = ingredientId;
    }

    if (type) {
      where.type = type;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;
    const [txs, total] = await Promise.all([
      this.prisma.stockTransaction.findMany({
        where,
        include: {
          ingredient: {
            select: {
              id: true,
              name: true,
              code: true,
              unit: true,
              currentStock: true,
              minThreshold: true,
              costPerUnit: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.stockTransaction.count({ where }),
    ]);

    return {
      transactions: txs.map((tx) => ({
        ...this.formatTransaction(tx),
        ingredient: tx.ingredient
          ? {
              ...tx.ingredient,
              currentStock: Number(tx.ingredient.currentStock),
              minThreshold: Number(tx.ingredient.minThreshold),
              costPerUnit: Number(tx.ingredient.costPerUnit),
            }
          : undefined,
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private formatIngredient<T extends UnformattedIngredient>(item: T) {
    const currentStock = Number(item.currentStock);
    const minThreshold = Number(item.minThreshold);
    return {
      ...item,
      currentStock,
      minThreshold,
      costPerUnit: Number(item.costPerUnit),
      isLowStock: currentStock <= minThreshold,
    };
  }

  private formatTransaction<T extends UnformattedTransaction>(tx: T) {
    return {
      ...tx,
      quantity: Number(tx.quantity),
      previousStock: Number(tx.previousStock),
      newStock: Number(tx.newStock),
      unitCost: tx.unitCost !== null ? Number(tx.unitCost) : null,
      totalCost: tx.totalCost !== null ? Number(tx.totalCost) : null,
    };
  }
}
