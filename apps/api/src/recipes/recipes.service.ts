import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { IngredientUnit, Prisma } from '@chayfood/db';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRecipeDto, QueryRecipeDto, UpdateRecipeDto } from './dto/recipe.dto';

// 🛡️ Kiểu dữ liệu chặt chẽ từ Prisma Payload (Tuân thủ RULE-CODE-001: Zero any, Zero unknown)
type RecipeWithFullRelations = Prisma.RecipeGetPayload<{
  include: {
    menuItem: {
      select: {
        id: true;
        name: true;
        price: true;
        image: true;
        category: true;
        isAvailable: true;
      };
    };
    items: {
      include: {
        ingredient: true;
      };
    };
  };
}>;

@Injectable()
export class RecipesService {
  constructor(private prisma: PrismaService) {}

  /**
   * 📏 Helper Quy Đổi Thứ Nguyên Đơn Vị Tính (Unit Conversion Engine)
   * Đảm bảo tính toán chính xác giá vốn khi đơn vị trong công thức khác đơn vị lưu kho
   */
  private convertQuantity(quantity: number, fromUnit: string, toUnit: string): number {
    if (fromUnit === toUnit) return quantity;

    // Hệ Khối Lượng: GRAM <-> KILOGRAM (1 kg = 1000 g)
    if (fromUnit === IngredientUnit.GRAM && toUnit === IngredientUnit.KILOGRAM) return quantity / 1000;
    if (fromUnit === IngredientUnit.KILOGRAM && toUnit === IngredientUnit.GRAM) return quantity * 1000;

    // Hệ Thể Tích: MILLILITER <-> LITER (1 L = 1000 mL)
    if (fromUnit === IngredientUnit.MILLILITER && toUnit === IngredientUnit.LITER) return quantity / 1000;
    if (fromUnit === IngredientUnit.LITER && toUnit === IngredientUnit.MILLILITER) return quantity * 1000;

    // Hệ Đếm hoặc trường hợp đặc thù
    return quantity;
  }

  async findAll(query?: QueryRecipeDto) {
    const page = query?.page ? Math.max(1, Number(query.page)) : 1;
    const limit = query?.limit ? Math.min(100, Math.max(1, Number(query.limit))) : 20;
    const skip = (page - 1) * limit;

    const where: Prisma.RecipeWhereInput = {};
    if (query?.query) {
      where.OR = [
        { name: { contains: query.query, mode: 'insensitive' } },
        { menuItem: { name: { contains: query.query, mode: 'insensitive' } } },
      ];
    }

    const [recipes, total] = await Promise.all([
      this.prisma.recipe.findMany({
        where,
        include: {
          menuItem: {
            select: {
              id: true,
              name: true,
              price: true,
              image: true,
              category: true,
              isAvailable: true,
            },
          },
          items: {
            include: {
              ingredient: true,
            },
          },
        },
        orderBy: { name: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.recipe.count({ where }),
    ]);

    return {
      recipes: recipes.map((r) => this.mapRecipeWithCost(r, query?.servings)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string, targetServings?: number) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
      include: {
        menuItem: {
          select: {
            id: true,
            name: true,
            price: true,
            image: true,
            category: true,
            isAvailable: true,
          },
        },
        items: {
          include: { ingredient: true },
        },
      },
    });

    if (!recipe) {
      throw new NotFoundException(`Không tìm thấy công thức với mã ${id}`);
    }

    return this.mapRecipeWithCost(recipe, targetServings);
  }

  async findByMenuItemId(menuItemId: string, targetServings?: number) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { menuItemId },
      include: {
        menuItem: {
          select: {
            id: true,
            name: true,
            price: true,
            image: true,
            category: true,
            isAvailable: true,
          },
        },
        items: {
          include: { ingredient: true },
        },
      },
    });

    if (!recipe) {
      return null;
    }

    return this.mapRecipeWithCost(recipe, targetServings);
  }

  async create(dto: CreateRecipeDto) {
    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id: dto.menuItemId },
    });

    if (!menuItem) {
      throw new NotFoundException(`Không tìm thấy món ăn với mã ${dto.menuItemId}`);
    }

    try {
      const created = await this.prisma.recipe.create({
        data: {
          menuItemId: dto.menuItemId,
          name: dto.name,
          description: dto.description,
          prepTimeMinutes: dto.prepTimeMinutes ?? 15,
          cookTimeMinutes: dto.cookTimeMinutes ?? 15,
          servingSize: dto.servingSize ?? 1,
          instructions: (dto.instructions as unknown as Prisma.InputJsonValue) ?? [],
          notes: dto.notes,
          items: dto.items
            ? {
                create: dto.items.map((item) => ({
                  ingredientId: item.ingredientId,
                  quantity: item.quantity,
                  unit: item.unit,
                  isOptional: item.isOptional ?? false,
                  notes: item.notes,
                })),
              }
            : undefined,
        },
        include: {
          menuItem: {
            select: {
              id: true,
              name: true,
              price: true,
              image: true,
              category: true,
              isAvailable: true,
            },
          },
          items: {
            include: { ingredient: true },
          },
        },
      });

      return this.mapRecipeWithCost(created);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Món ăn này đã có công thức định lượng (BOM)');
        }
        if (error.code === 'P2003') {
          throw new BadRequestException('Một hoặc nhiều nguyên liệu không tồn tại trong hệ thống');
        }
      }
      throw error;
    }
  }

  async update(id: string, dto: UpdateRecipeDto) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!recipe) {
      throw new NotFoundException(`Không tìm thấy công thức với mã ${id}`);
    }

    try {
      return await this.prisma.$transaction(async (tx) => {
        if (dto.items) {
          await tx.recipeItem.deleteMany({ where: { recipeId: id } });
          await tx.recipeItem.createMany({
            data: dto.items.map((item) => ({
              recipeId: id,
              ingredientId: item.ingredientId,
              quantity: item.quantity,
              unit: item.unit,
              isOptional: item.isOptional ?? false,
              notes: item.notes,
            })),
          });
        }

        const updated = await tx.recipe.update({
          where: { id },
          data: {
            name: dto.name,
            description: dto.description,
            prepTimeMinutes: dto.prepTimeMinutes,
            cookTimeMinutes: dto.cookTimeMinutes,
            servingSize: dto.servingSize,
            instructions: dto.instructions ? (dto.instructions as unknown as Prisma.InputJsonValue) : undefined,
            notes: dto.notes,
          },
          include: {
            menuItem: {
              select: {
                id: true,
                name: true,
                price: true,
                image: true,
                category: true,
                isAvailable: true,
              },
            },
            items: {
              include: { ingredient: true },
            },
          },
        });

        return this.mapRecipeWithCost(updated);
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new BadRequestException('Một hoặc nhiều nguyên liệu không tồn tại trong hệ thống');
        }
      }
      throw error;
    }
  }

  async delete(id: string) {
    const recipe = await this.prisma.recipe.findUnique({ where: { id } });
    if (!recipe) {
      throw new NotFoundException(`Không tìm thấy công thức với mã ${id}`);
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.recipeItem.deleteMany({ where: { recipeId: id } });
      await tx.recipe.delete({ where: { id } });
    });

    return { success: true, message: 'Đã xóa công thức thành công' };
  }

  /**
   * 🪙 Thuật Toán Tính Giá Vốn Món Ăn (BOM Food Costing) & Biên Lợi Nhuận
   */
  private mapRecipeWithCost(recipe: RecipeWithFullRelations, targetServings?: number) {
    const baseServingSize = recipe.servingSize || 1;
    const scaleFactor = targetServings && targetServings > 0 ? targetServings / baseServingSize : 1;
    const sellingPrice = Math.round(Number(recipe.menuItem?.price ?? 0) * scaleFactor);

    let totalCost = 0;
    let hasUnavailableIngredients = false;

    const itemCosts = (recipe.items || []).map((item) => {
      const originalQty = Number(item.quantity);
      const scaledQty = originalQty * scaleFactor;
      const ingredientUnit = item.ingredient?.unit || item.unit;
      const unitCost = Number(item.ingredient?.costPerUnit ?? 0);

      // Quy đổi định lượng theo đơn vị lưu kho của Ingredient
      const normalizedQty = this.convertQuantity(scaledQty, item.unit, ingredientUnit);
      const itemTotal = Math.round(normalizedQty * unitCost);
      totalCost += itemTotal;

      const isUnavailable = !item.isOptional && item.ingredient?.isAvailable === false;
      if (isUnavailable) {
        hasUnavailableIngredients = true;
      }

      return {
        id: item.id,
        ingredientId: item.ingredientId,
        ingredientName: item.ingredient?.name ?? 'Nguyên liệu',
        quantity: Math.round(scaledQty * 1000) / 1000,
        unit: item.unit,
        unitCost,
        totalCost: itemTotal,
        isOptional: item.isOptional,
        notes: item.notes,
        isUnavailable,
        ingredient: item.ingredient
          ? {
              ...item.ingredient,
              currentStock: Number(item.ingredient.currentStock),
              minThreshold: Number(item.ingredient.minThreshold),
              costPerUnit: Number(item.ingredient.costPerUnit),
            }
          : undefined,
      };
    });

    // Biên Lợi Nhuận Gộp (Bảo toàn chi phí thực tế cho món 0đ và món bán lỗ)
    const grossMargin = Math.round(sellingPrice - totalCost);
    const grossMarginPercentage = sellingPrice > 0 ? Math.round((grossMargin / sellingPrice) * 1000) / 10 : 0;
    const foodCostPercentage = sellingPrice > 0 ? Math.round((totalCost / sellingPrice) * 1000) / 10 : 0;

    return {
      ...recipe,
      servingSize: targetServings && targetServings > 0 ? targetServings : baseServingSize,
      isCookable: !hasUnavailableIngredients,
      hasUnavailableIngredients,
      menuItem: recipe.menuItem
        ? {
            ...recipe.menuItem,
            price: Number(recipe.menuItem.price),
          }
        : undefined,
      items: itemCosts,
      costAnalysis: {
        sellingPrice,
        totalCost: Math.round(totalCost),
        grossMargin,
        grossMarginPercentage,
        foodCostPercentage,
        servingCount: targetServings && targetServings > 0 ? targetServings : baseServingSize,
      },
    };
  }
}
