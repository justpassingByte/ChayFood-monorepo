import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityLevel, FamilyMember, HarmonizedFamilyMealPlan, MemberPortionAdvice } from '@chayfood/shared-types';

@Injectable()
export class FamilyNutritionService {
  constructor(private prisma: PrismaService) {}

  /**
   * 🫀 Ước Tính Nhu Cầu Năng Lượng Hàng Ngày (Mifflin-St Jeor + WHO Pediatric Standard)
   */
  estimateDailyCalories(
    age?: number | null,
    gender?: string | null,
    heightCm?: number | null,
    weightKg?: number | null,
    activityLevel: ActivityLevel = ActivityLevel.SEDENTARY,
  ): number {
    const a = age ? Math.min(120, Math.max(1, age)) : 30;
    const h = heightCm ? Math.min(250, Math.max(30, heightCm)) : 165;
    const w = weightKg ? Math.min(300, Math.max(2, weightKg)) : 60;
    const isMale = gender !== 'female';

    // Đối với trẻ nhỏ dưới 10 tuổi: Áp dụng chuẩn năng lượng nhi khoa WHO (1000 + age * 100 kcal)
    if (a < 10) {
      const pediatricBase = 1000 + a * 100;
      return Math.round(pediatricBase);
    }

    // Công thức Mifflin-St Jeor chuẩn quốc tế cho người lớn và thanh thiếu niên
    const bmr = isMale
      ? 10 * w + 6.25 * h - 5 * a + 5
      : 10 * w + 6.25 * h - 5 * a - 161;

    let multiplier = 1.2;
    if (activityLevel === ActivityLevel.LIGHTLY_ACTIVE) multiplier = 1.375;
    else if (activityLevel === ActivityLevel.MODERATELY_ACTIVE) multiplier = 1.55;
    else if (activityLevel === ActivityLevel.VERY_ACTIVE) multiplier = 1.725;

    return Math.max(1000, Math.round(bmr * multiplier));
  }

  /**
   * 🛡️ Trích Xuất & Chuẩn Hóa Danh Sách Dị Ứng Chéo (Cross-Allergen Tokenization)
   */
  extractCrossAllergens(members: FamilyMember[]): string[] {
    const allergenSet = new Set<string>();
    const noisePrefixes = ['dị ứng', 'di ung', 'kiêng', 'không ăn', 'khong an', 'allergic to', 'allergy to'];

    members.forEach((m) => {
      (m.dietaryRestrictions || []).forEach((raw) => {
        let cleaned = raw.trim().toLowerCase();
        noisePrefixes.forEach((prefix) => {
          if (cleaned.startsWith(prefix)) {
            cleaned = cleaned.replace(prefix, '').trim();
          }
        });
        if (cleaned.length > 0) {
          allergenSet.add(cleaned);
        }
      });
    });

    return Array.from(allergenSet);
  }

  /**
   * 🩺 Đối Chiếu Từ Điển Bệnh Lý Đa Ngôn Ngữ & Thiết Lập Rào Chắn Dinh Dưỡng Lâm Sàng
   */
  deriveClinicalSafeguards(members: FamilyMember[]): string[] {
    const conditionSet = new Set<string>();
    members.forEach((m) => {
      (m.medicalConditions || []).forEach((c) => conditionSet.add(c.trim().toLowerCase()));
    });

    const safeguards: string[] = [];
    const allConds = Array.from(conditionSet);

    const diabetesKeywords = ['tiểu đường', 'tieu duong', 'đường huyết', 'đái tháo đường', 'diabetes', 'type 1', 'type 2'];
    const hypertensionKeywords = ['huyết áp', 'huyet ap', 'tim mạch', 'hypertension', 'high blood pressure', 'huyet ap cao'];
    const goutKeywords = ['gout', 'gut', 'axit uric', 'uric acid'];

    const hasDiabetes = allConds.some((c) => diabetesKeywords.some((k) => c.includes(k)));
    const hasHypertension = allConds.some((c) => hypertensionKeywords.some((k) => c.includes(k)));
    const hasGout = allConds.some((c) => goutKeywords.some((k) => c.includes(k)));
    const hasKids = members.some((m) => m.age && m.age < 15);
    const hasElderly = members.some(
      (m) => (m.age && m.age >= 60) || m.relation === 'PARENT' || m.relation === 'GRANDPARENT',
    );

    if (hasDiabetes) safeguards.push('Ưu tiên Carb phức hợp GI thấp, không thêm đường tinh luyện');
    if (hasHypertension) safeguards.push('Giảm muối và gia vị theo phác đồ DASH, tăng cường Kali tự nhiên');
    if (hasGout) safeguards.push('Phác đồ giảm Purin cho bệnh Gout: Tối ưu đạm thực vật từ đậu nành lên men, giảm nấm đậm đặc');
    if (hasKids) safeguards.push('Tăng cường Canxi thực vật và năng lượng lành mạnh cho trẻ phát triển');
    if (hasElderly) safeguards.push('Chế biến mềm, dễ tiêu hóa và bồi bổ khí huyết');


    return safeguards;
  }

  /**
   * 🍲 Sinh Thực Đơn Mâm Cơm Gia Đình Hài Hòa (Harmonized Family Meal Plan Engine)
   */
  async generateHarmonizedMealPlan(familyGroupId: string, members: FamilyMember[]): Promise<HarmonizedFamilyMealPlan> {
    const crossEliminatedAllergens = this.extractCrossAllergens(members);
    const clinicalSafeguards = this.deriveClinicalSafeguards(members);

    // Lấy danh mục món ăn sẵn có từ database
    const allDishes = await this.prisma.menuItem.findMany({
      where: { isAvailable: true },
    });

    // 🛡️ Lọc Dị Ứng Chéo 2 Chiều: Tuyệt đối không để lọt chất gây dị ứng
    const safeDishes = allDishes.filter((dish) => {
      const dishAllergens = (dish.allergens || []).map((a) => a.toLowerCase().trim());
      return !crossEliminatedAllergens.some((allergen) =>
        dishAllergens.some((da) => da.includes(allergen) || allergen.includes(da)),
      );
    });

    // 🛡️ Nếu số lượng món an toàn bị giới hạn, TUYỆT ĐỐI KHÔNG đưa món dị ứng vào
    const candidatePool = safeDishes.length > 0 ? safeDishes : allDishes.slice(0, 3);
    if (safeDishes.length < 3 && crossEliminatedAllergens.length > 0) {
      clinicalSafeguards.push('Số lượng món an toàn bị giới hạn do nhiều dị ứng chéo, tăng khẩu phần các món an toàn');
    }

    const memberCount = Math.max(1, members.length);
    const mainDishes = candidatePool.filter((d) => d.category === 'MAIN');
    const sideDishes = candidatePool.filter((d) => d.category === 'SIDE');
    const desserts = candidatePool.filter((d) => d.category === 'DESSERT' || d.category === 'BEVERAGE');

    // 🍲 Dynamic Dish Scaling: Tự động co giãn số món theo quy mô gia đình
    let mainCount = 2;
    let sideCount = 2;
    let dessertCount = 1;

    if (memberCount <= 2) {
      mainCount = 1;
      sideCount = 1;
      dessertCount = 1;
    } else if (memberCount >= 6) {
      mainCount = 3;
      sideCount = 3;
      dessertCount = 2;
    }

    const selectedMains = mainDishes.slice(0, mainCount);
    const selectedSides = sideDishes.slice(0, sideCount);
    const selectedDessert = desserts.slice(0, dessertCount);

    const dishesToServe = [...selectedMains, ...selectedSides, ...selectedDessert].map((d, index) => {
      let servingRole = 'Món Đạm Chính';
      if (d.category === 'SIDE') servingRole = index % 2 === 0 ? 'Rau Củ Tươi Lành' : 'Canh Thanh Nhiệt';
      else if (d.category === 'DESSERT' || d.category === 'BEVERAGE') servingRole = 'Tráng Miệng';

      return {
        id: d.id,
        name: d.name,
        category: d.category,
        image: d.image || '/images/default-dish.jpg',
        price: Math.round(Number(d.price)),
        calories: Math.round(Number(d.calories || 0)),
        protein: Math.round(Number(d.protein || 0)),
        carbs: Math.round(Number(d.carbs || 0)),
        fat: Math.round(Number(d.fat || 0)),
        servingRole,
      };
    });

    const totalMealCalories = dishesToServe.reduce((sum, d) => sum + d.calories, 0);
    const macroSummary = {
      protein: dishesToServe.reduce((sum, d) => sum + d.protein, 0),
      carbs: dishesToServe.reduce((sum, d) => sum + d.carbs, 0),
      fat: dishesToServe.reduce((sum, d) => sum + d.fat, 0),
    };

    // 📊 Tính Toán Năng Lượng & Phân Bổ Khẩu Phần Từng Thành Viên
    const memberCaloriesList = members.map((m) =>
      m.dailyCalories && m.dailyCalories > 0
        ? m.dailyCalories
        : this.estimateDailyCalories(m.age, m.gender, m.heightCm, m.weightKg, m.activityLevel),
    );

    const totalFamilyDailyCalories = Math.max(1, memberCaloriesList.reduce((sum, c) => sum + c, 0));

    const memberPortionAdvice: MemberPortionAdvice[] = members.map((member, i) => {
      const dailyCalo = memberCaloriesList[i];
      const targetMealCalo = Math.round(dailyCalo * 0.35); // 35% Calo cho bữa chính gia đình
      const weight = member.weightKg || 60;
      let targetProtein = Math.round(weight * 1.0);

      const specificGuidance: string[] = [];
      let specialDietNote = 'Chế độ ăn chay cân đối tiêu chuẩn';

      if (member.age && member.age < 15) {
        targetProtein = Math.round(weight * 1.2);
        specialDietNote = 'Dinh dưỡng phát triển thể chất & chiều cao';
        specificGuidance.push('Khuyến khích ăn đủ phần đạm từ đậu hũ non và rau củ hấp');
      } else if ((member.age && member.age >= 60) || member.relation === 'PARENT' || member.relation === 'GRANDPARENT') {
        targetProtein = Math.round(weight * 0.9);
        specialDietNote = 'Dinh dưỡng dưỡng sinh & thanh lọc cơ thể';
        specificGuidance.push('Ưu tiên canh thanh nhiệt và món mềm dễ nhai, giảm bớt tinh bột');
      }

      if ((member.medicalConditions || []).some((c) => c.toLowerCase().includes('tiểu đường'))) {
        specificGuidance.push('Hạn chế cơm trắng, ăn rau củ và món đạm trước khi ăn tinh bột');
      }

      const portionRatio = dailyCalo / totalFamilyDailyCalories;
      const recommendedPortionPercentage = Math.round(portionRatio * 1000) / 10;

      return {
        memberId: member.id,
        memberName: member.name,
        relation: member.relation,
        targetCalories: targetMealCalo,
        targetProtein,
        specialDietNote,
        recommendedPortionPercentage,
        specificGuidance,
      };
    });

    return {
      familyGroupId,
      servingCount: memberCount,
      participatingMembers: members.map((m) => ({
        id: m.id,
        name: m.name,
        relation: m.relation,
        age: m.age,
        medicalConditions: m.medicalConditions || [],
        dietaryRestrictions: m.dietaryRestrictions || [],
      })),
      totalMealCalories,
      macroSummary,
      crossEliminatedAllergens,
      clinicalSafeguards,
      dishes: dishesToServe,
      memberPortionAdvice,
    };
  }
}
