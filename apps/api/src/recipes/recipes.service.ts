import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRecipeDto, UpdateRecipeDto } from './dto/recipe.dto';

interface RecipeWithRelations {
  id: string;
  menuItemId: string;
  name: string;
  description: string | null;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servingSize: number;
  instructions: Prisma.JsonValue;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  menuItem?: {
    id: string;
    name: string;
    price: Prisma.Decimal | number;
    image?: string | null;
    category?: string | null;
  } | null;
  items?: Array<{
    id: string;
    ingredientId: string;
    quantity: Prisma.Decimal | number;
    unit: string;
    isOptional: boolean;
    notes?: string | null;
    ingredient?: {
      name?: string;
      costPerUnit?: Prisma.Decimal | number;
      currentStock?: Prisma.Decimal | number;
      minThreshold?: Prisma.Decimal | number;
    } | null;
  }>;
}

@Injectable()
export class RecipesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query?: string) {
    const where: Prisma.RecipeWhereInput = {};
    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { menuItem: { name: { contains: query, mode: 'insensitive' } } },
      ];
    }

    const recipes = await this.prisma.recipe.findMany({
      where,
      include: {
        menuItem: {
          select: {
            id: true,
            name: true,
            price: true,
            image: true,
            category: true,
          },
        },
        items: {
          include: {
            ingredient: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return recipes.map((r) => this.mapRecipeWithCost(r as unknown as RecipeWithRelations));
  }

  async findById(id: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
      include: {
        menuItem: true,
        items: {
          include: { ingredient: true },
        },
      },
    });

    if (!recipe) {
      throw new NotFoundException(`Không tìm thấy công thức với mã ${id}`);
    }

    return this.mapRecipeWithCost(recipe as unknown as RecipeWithRelations);
  }

  async findByMenuItemId(menuItemId: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { menuItemId },
      include: {
        menuItem: true,
        items: {
          include: { ingredient: true },
        },
      },
    });

    if (!recipe) {
      return null;
    }

    return this.mapRecipeWithCost(recipe as unknown as RecipeWithRelations);
  }

  async create(dto: CreateRecipeDto) {
    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id: dto.menuItemId },
    });

    if (!menuItem) {
      throw new NotFoundException(`Không tìm thấy món ăn với mã ${dto.menuItemId}`);
    }

    const existing = await this.prisma.recipe.findUnique({
      where: { menuItemId: dto.menuItemId },
    });

    if (existing) {
      throw new BadRequestException('Món ăn này đã có công thức định lượng (BOM). Vui lòng cập nhật thay vì tạo mới');
    }

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
        menuItem: true,
        items: {
          include: { ingredient: true },
        },
      },
    });

    return this.mapRecipeWithCost(created as unknown as RecipeWithRelations);
  }

  async update(id: string, dto: UpdateRecipeDto) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!recipe) {
      throw new NotFoundException(`Không tìm thấy công thức với mã ${id}`);
    }

    return this.prisma.$transaction(async (tx) => {
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
            },
          },
          items: {
            include: { ingredient: true },
          },
        },
      });

      return this.mapRecipeWithCost(updated as unknown as RecipeWithRelations);
    });
  }

  async delete(id: string) {
    const recipe = await this.prisma.recipe.findUnique({ where: { id } });
    if (!recipe) {
      throw new NotFoundException(`Không tìm thấy công thức với mã ${id}`);
    }

    await this.prisma.recipe.delete({ where: { id } });
    return { success: true, message: 'Đã xóa công thức thành công' };
  }

  private mapRecipeWithCost(recipe: RecipeWithRelations) {
    const sellingPrice = Number(recipe.menuItem?.price ?? 0);
    let totalCost = 0;

    const itemCosts = (recipe.items || []).map((item) => {
      const qty = Number(item.quantity);
      const unitCost = Number(item.ingredient?.costPerUnit ?? 0);
      const itemTotal = qty * unitCost;
      totalCost += itemTotal;

      return {
        id: item.id,
        ingredientId: item.ingredientId,
        ingredientName: item.ingredient?.name ?? 'Nguyên liệu',
        quantity: qty,
        unit: item.unit,
        unitCost,
        totalCost: itemTotal,
        isOptional: item.isOptional,
        notes: item.notes,
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

    const grossMargin = sellingPrice > 0 ? sellingPrice - totalCost : 0;
    const grossMarginPercentage = sellingPrice > 0 ? (grossMargin / sellingPrice) * 100 : 0;

    return {
      ...recipe,
      menuItem: recipe.menuItem
        ? {
            ...recipe.menuItem,
            price: Number(recipe.menuItem.price),
          }
        : undefined,
      items: itemCosts,
      costAnalysis: {
        sellingPrice,
        totalCost,
        grossMargin,
        grossMarginPercentage: Math.round(grossMarginPercentage * 10) / 10,
        foodCostPercentage: sellingPrice > 0 ? Math.round((totalCost / sellingPrice) * 1000) / 10 : 0,
      },
    };
  }
}
