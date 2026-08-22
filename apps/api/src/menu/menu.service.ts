import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuItemDto, QueryMenuDto, UpdateMenuItemDto } from './dto/menu.dto';
import { MenuCategory } from '@chayfood/db';

type UnformattedMenuItem = {
  price: Prisma.Decimal | number;
  protein: Prisma.Decimal | number;
  carbs: Prisma.Decimal | number;
  fat: Prisma.Decimal | number;
};

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryMenuDto) {
    const { category, query: searchText, minCalories, maxCalories, minProtein, maxProtein, page = 1, limit = 20 } = query;

    const where: Prisma.MenuItemWhereInput = { isAvailable: true };

    // Kiểm tra danh mục an toàn chống Prototype Property Pollution
    if (category) {
      const upper = category.toUpperCase();
      const validCategories = Object.values(MenuCategory) as string[];
      if (validCategories.includes(upper)) {
        where.category = upper as MenuCategory;
      }
    }

    if (searchText) {
      where.OR = [
        { name: { contains: searchText, mode: 'insensitive' } },
        { description: { contains: searchText, mode: 'insensitive' } },
      ];
    }

    if (minCalories !== undefined || maxCalories !== undefined) {
      where.calories = {};
      if (minCalories !== undefined) where.calories.gte = minCalories;
      if (maxCalories !== undefined) where.calories.lte = maxCalories;
    }

    if (minProtein !== undefined || maxProtein !== undefined) {
      where.protein = {};
      if (minProtein !== undefined) where.protein.gte = minProtein;
      if (maxProtein !== undefined) where.protein.lte = maxProtein;
    }

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.menuItem.findMany({
        where,
        include: { tag: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.menuItem.count({ where }),
    ]);

    return {
      items: items.map((item) => this.formatMenuItem(item)),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    const item = await this.prisma.menuItem.findUnique({
      where: { id },
      include: { tag: true },
    });

    if (!item) {
      throw new NotFoundException('Không tìm thấy món ăn này');
    }

    return this.formatMenuItem(item);
  }

  async create(dto: CreateMenuItemDto) {
    const item = await this.prisma.menuItem.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        category: dto.category,
        image: dto.image,
        calories: dto.calories || 0,
        protein: dto.protein || 0,
        carbs: dto.carbs || 0,
        fat: dto.fat || 0,
        isAvailable: dto.isAvailable ?? true,
        preparationTime: dto.preparationTime || 15,
        ingredients: dto.ingredients || [],
        allergens: dto.allergens || [],
      },
      include: { tag: true },
    });

    return this.formatMenuItem(item);
  }

  async update(id: string, dto: UpdateMenuItemDto) {
    await this.findById(id);

    const updated = await this.prisma.menuItem.update({
      where: { id },
      data: dto,
      include: { tag: true },
    });

    return this.formatMenuItem(updated);
  }

  async remove(id: string) {
    await this.findById(id);
    // Soft Deactivation: Ngừng phục vụ món ăn để bảo toàn lịch sử các đơn hàng cũ (Cascade Safety)
    await this.prisma.menuItem.update({
      where: { id },
      data: { isAvailable: false },
    });
    return { message: 'Đã ngừng phục vụ món ăn thành công' };
  }

  private formatMenuItem<T extends UnformattedMenuItem>(item: T) {
    return {
      ...item,
      price: Number(item.price),
      protein: Number(item.protein),
      carbs: Number(item.carbs),
      fat: Number(item.fat),
    };
  }
}
