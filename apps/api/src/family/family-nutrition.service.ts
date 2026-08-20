import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GenerateHarmonizedFamilyPlanDto } from './dto/family.dto';
import { ActivityLevel, FamilyMember } from '@chayfood/shared-types';

@Injectable()
export class FamilyNutritionService {
  constructor(private prisma: PrismaService) {}

  estimateDailyCalories(
    age?: number,
    gender?: string,
    heightCm?: number,
    weightKg?: number,
    activityLevel: ActivityLevel = ActivityLevel.SEDENTARY,
  ): number {
    const a = age || 30;
    const h = heightCm || 165;
    const w = weightKg || 60;
    const isMale = gender !== 'female';

    // Công thức Mifflin-St Jeor chuẩn quốc tế
    const bmr = isMale
      ? 10 * w + 6.25 * h - 5 * a + 5
      : 10 * w + 6.25 * h - 5 * a - 161;

    let multiplier = 1.2;
    if (activityLevel === ActivityLevel.LIGHTLY_ACTIVE) multiplier = 1.375;
    else if (activityLevel === ActivityLevel.MODERATELY_ACTIVE) multiplier = 1.55;
    else if (activityLevel === ActivityLevel.VERY_ACTIVE) multiplier = 1.725;

    return Math.round(bmr * multiplier);
  }

  extractCrossAllergens(members: FamilyMember[]): string[] {
    const allergenSet = new Set<string>();
    members.forEach((m) => {
      (m.dietaryRestrictions || []).forEach((r) => allergenSet.add(r.trim().toLowerCase()));
    });
    return Array.from(allergenSet);
  }

  deriveClinicalSafeguards(members: FamilyMember[]): string[] {
    const conditionSet = new Set<string>();
    members.forEach((m) => {
      (m.medicalConditions || []).forEach((c) => conditionSet.add(c.trim().toLowerCase()));
    });

    const safeguards: string[] = [];
    const allConds = Array.from(conditionSet);

    const hasDiabetes = allConds.some((c) => c.includes('tiểu đường') || c.includes('đường huyết'));
    const hasHypertension = allConds.some((c) => c.includes('huyết áp') || c.includes('tim mạch'));
    const hasGout = allConds.some((c) => c.includes('gout') || c.includes('axit uric'));
    const hasKids = members.some((m) => m.age && m.age < 15);
    const hasElderly = members.some(
      (m) => (m.age && m.age >= 60) || m.relation === 'PARENT' || m.relation === 'GRANDPARENT',
    );

    if (hasDiabetes) safeguards.push('Ưu tiên Carb phức hợp GI thấp, không thêm đường tinh luyện');
    if (hasHypertension) safeguards.push('Giảm muối & gia vị theo phác đồ DASH, tăng cường Kali tự nhiên');
    if (hasGout) safeguards.push('Tối ưu đạm thực vật từ đậu nành lên men, giảm nấm đậm đặc');
    if (hasKids) safeguards.push('Tăng cường Canxi thực vật & năng lượng lành mạnh cho trẻ phát triển');
    if (hasElderly) safeguards.push('Chế biến mềm, dễ tiêu hóa và bồi bổ khí huyết');

    return safeguards;
  }

  async generateHarmonizedMealPlan(familyGroupId: string, members: FamilyMember[]) {
    const crossEliminatedAllergens = this.extractCrossAllergens(members);
    const clinicalSafeguards = this.deriveClinicalSafeguards(members);

    // Lấy món ăn từ database và lọc bỏ dị ứng giao thoa
    const allDishes = await this.prisma.menuItem.findMany({
      where: { isAvailable: true },
    });

    const safeDishes = allDishes.filter((dish) => {
      const dishAllergens = (dish.allergens || []).map((a) => a.toLowerCase());
      return !crossEliminatedAllergens.some((allergen) =>
        dishAllergens.some((da) => da.includes(allergen)),
      );
    });

    const candidatePool = safeDishes.length >= 4 ? safeDishes : allDishes;

    const mainProteins = candidatePool.filter((d) => d.category === 'MAIN');
    const sideDishes = candidatePool.filter((d) => d.category === 'SIDE');
    const desserts = candidatePool.filter((d) => d.category === 'DESSERT' || d.category === 'BEVERAGE');

    const selectedMains = mainProteins.slice(0, 2);
    const selectedSides = sideDishes.slice(0, 2);
    const selectedDessert = desserts.slice(0, 1);

    const dishesToServe = [...selectedMains, ...selectedSides, ...selectedDessert].map((d, index) => ({
      id: d.id,
      name: d.name,
      category: d.category,
      image: d.image,
      price: Number(d.price),
      calories: d.calories,
      protein: Number(d.protein),
      carbs: Number(d.carbs),
      fat: Number(d.fat),
      servingRole:
        index === 0
          ? 'Món Đạm Thực Vật Chính'
          : index === 1
          ? 'Món Đạm Phụ / Sốt Đậm Đà'
          : index === 2
          ? 'Canh Dưỡng Sinh Thanh Nhiệt'
          : index === 3
          ? 'Rau Củ Tươi Lành Hấp / Xào'
          : 'Tráng Miệng / Nước Thảo Mộc',
    }));

    let totalMealCalories = 0;
    let totalP = 0;
    let totalC = 0;
    let totalF = 0;

    dishesToServe.forEach((d) => {
      totalMealCalories += d.calories;
      totalP += d.protein;
      totalC += d.carbs;
      totalF += d.fat;
    });

    // Sinh lời khuyên phân bổ khẩu phần riêng cho từng người
    const memberPortionAdvice = members.map((m) => {
      const dailyCal = m.dailyCalories || 1800;
      const targetMealCal = Math.round(dailyCal * 0.35);
      const targetProtein = Math.round((targetMealCal * 0.2) / 4);

      const guidance: string[] = [];
      const conds = (m.medicalConditions || []).map((c) => c.toLowerCase());

      if (conds.some((c) => c.includes('tiểu đường'))) {
        guidance.push('Dùng 1/2 chén cơm, ưu tiên ăn nhiều rau củ trước khi ăn món đạm');
      } else if (conds.some((c) => c.includes('huyết áp'))) {
        guidance.push('Hạn chế chấm thêm nước sốt đậm đặc, dùng nhiều canh thanh nhiệt');
      } else if (m.age && m.age < 15) {
        guidance.push('Khuyến khích ăn thêm 1 phần đạm đậu phụ & uống nước thảo mộc');
      } else {
        guidance.push('Khẩu phần tiêu chuẩn 1 suất cân bằng dinh dưỡng');
      }

      return {
        memberId: m.id,
        memberName: m.name,
        relation: m.relation,
        targetCalories: targetMealCal,
        targetProtein,
        specialDietNote: m.medicalConditions.length > 0 ? m.medicalConditions.join(', ') : 'Thể trạng bình thường',
        recommendedPortionPercentage: Math.round((1 / members.length) * 100),
        specificGuidance: guidance,
      };
    });

    return {
      familyGroupId,
      servingCount: members.length,
      participatingMembers: members.map((m) => ({
        id: m.id,
        name: m.name,
        relation: m.relation,
        age: m.age,
        medicalConditions: m.medicalConditions,
        dietaryRestrictions: m.dietaryRestrictions,
      })),
      totalMealCalories,
      macroSummary: {
        protein: Math.round(totalP),
        carbs: Math.round(totalC),
        fat: Math.round(totalF),
      },
      crossEliminatedAllergens,
      clinicalSafeguards,
      dishes: dishesToServe,
      memberPortionAdvice,
    };
  }
}
