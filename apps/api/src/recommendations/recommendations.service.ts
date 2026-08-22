import { Injectable } from '@nestjs/common';
import { Prisma } from '@chayfood/db';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePreferenceDto } from './dto/preference.dto';

@Injectable()
export class RecommendationsService {
  constructor(private prisma: PrismaService) {}

  /**
   * 🌟 Gợi ý món ăn thông minh theo sở thích dinh dưỡng & Calo/Protein:
   * 1. Tra cứu UserPreference theo userId.
   * 2. Lọc món ăn thỏa mãn maxCalories và minProtein.
   * 3. Chỉ lấy các món đang hoạt động (`isAvailable: true`).
   */
  async getRecommendations(userId?: string) {
    let preference = null;
    if (userId) {
      preference = await this.prisma.userPreference.findUnique({
        where: { userId },
      });
    }

    const where: Prisma.MenuItemWhereInput = { isAvailable: true };

    if (preference) {
      if (preference.maxCalories) {
        where.calories = { lte: preference.maxCalories };
      }
      if (preference.minProtein) {
        where.protein = { gte: Number(preference.minProtein) };
      }
    }

    const items = await this.prisma.menuItem.findMany({
      where,
      take: 8,
      orderBy: { createdAt: 'desc' },
    });

    return items.map((i) => ({
      ...i,
      price: Number(i.price),
      protein: Number(i.protein),
      carbs: Number(i.carbs),
      fat: Number(i.fat),
    }));
  }

  /**
   * 🛡️ Cập nhật sở thích dinh dưỡng người dùng (Upsert)
   */
  async updatePreference(userId: string, dto: UpdatePreferenceDto) {
    return this.prisma.userPreference.upsert({
      where: { userId },
      update: {
        favoriteCategories: dto.favoriteCategories || [],
        dislikedIngredients: dto.dislikedIngredients || [],
        minProtein: dto.minProtein,
        maxCalories: dto.maxCalories,
        dietaryRestrictions: dto.dietaryRestrictions || [],
      },
      create: {
        userId,
        favoriteCategories: dto.favoriteCategories || [],
        dislikedIngredients: dto.dislikedIngredients || [],
        minProtein: dto.minProtein,
        maxCalories: dto.maxCalories,
        dietaryRestrictions: dto.dietaryRestrictions || [],
      },
    });
  }
}

