import { PrismaClient, MenuCategory, Role, FamilyRelation, ActivityLevel, IngredientUnit, StockTransactionType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Bắt đầu nạp dữ liệu mẫu (Seeding) cho ChayFood PostgreSQL...');

  // 1. Tạo tài khoản Admin
  const hashedPassword = await bcrypt.hash('Admin@123456', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@chayfood.vn' },
    update: {},
    create: {
      email: 'admin@chayfood.vn',
      name: 'Quản Trị Viên ChayFood',
      passwordHash: hashedPassword,
      phone: '0901234567',
      address: 'Số 123 Đường Ẩm Thực Chay, TP. Hồ Chí Minh',
      role: Role.ADMIN,
    },
  });
  console.log(`✅ Đã tạo tài khoản Admin: ${admin.email} (Password: Admin@123456)`);

  // 2. Tạo các gói ăn chay (Plans)
  const plans = [
    {
      name: 'Gói Chay Thanh Tịnh Tuần',
      code: 'WEEKLY_CLEANSE',
      price: 350000,
      duration: 7,
      description: 'Gói 7 ngày thanh lọc cơ thể với các món chay thanh đạm, giàu chất xơ và vitamin.',
      mealsPerDay: 1,
      snacksPerDay: 1,
      features: ['1 Bữa chính/ngày', '1 Nước thảo mộc/ngày', 'Thực đơn đổi món mỗi ngày', 'Miễn phí giao hàng'],
      isRecommended: true,
      hasDietitianSupport: true,
    },
    {
      name: 'Gói Chay Năng Lượng Gym & Fit',
      code: 'HIGH_PROTEIN_FIT',
      price: 550000,
      duration: 7,
      description: 'Gói ăn chay giàu đạm thực vật từ đậu nành hữu cơ, nấm đùi gà, các loại hạt cho người tập luyện thể thao.',
      mealsPerDay: 2,
      snacksPerDay: 1,
      features: ['2 Bữa chính giàu Protein (>=30g đạm/bữa)', '1 Sinh tố hạt dinh dưỡng', 'Tư vấn chế độ ăn cùng chuyên gia'],
      isRecommended: false,
      isPremiumMenu: true,
      hasDietitianSupport: true,
      hasCustomization: true,
    },
    {
      name: 'Gói Chay Tháng Trọn Vẹn',
      code: 'MONTHLY_FULL_LIFE',
      price: 1350000,
      duration: 30,
      description: 'Chăm sóc sức khỏe toàn diện trong 30 ngày với đầy đủ các món cơm, lẩu, bún phở chay phong phú.',
      mealsPerDay: 1,
      snacksPerDay: 1,
      features: ['30 Bữa ăn chất lượng cao', 'Ưu tiên giờ giao hàng', 'Tặng kèm 4 set lẩu mini cuối tuần', 'Hỗ trợ đổi món 24/7'],
      isRecommended: false,
      hasPriorityDelivery: true,
      has24HrSupport: true,
    },
    {
      name: 'Gói Đôi An Lành (Gia Đình 2 Người)',
      code: 'PLAN_FAMILY_2',
      price: 1190000,
      duration: 7,
      description: 'Khẩu phần 2 người hoàn hảo cho các cặp đôi hoặc gia đình nhỏ, tiết kiệm 15% so với đặt lẻ.',
      mealsPerDay: 2,
      snacksPerDay: 0,
      isFamilyPlan: true,
      targetMembersCount: 2,
      features: ['2 Khẩu phần chính/ngày', 'Tiết kiệm 15% chi phí', 'Tự động trừ dị ứng chéo', 'Đổi món mỗi ngày'],
      isRecommended: false,
    },
    {
      name: 'Mâm Cơm Tam Đại Đồng Đường (Gia Đình 4 Người)',
      code: 'PLAN_FAMILY_4',
      price: 2290000,
      duration: 7,
      description: 'Mâm cơm 4 người đa thế hệ, tối ưu chỉ số dinh dưỡng cho cả ông bà, bố mẹ và con nhỏ, tiết kiệm 20%.',
      mealsPerDay: 4,
      snacksPerDay: 0,
      isFamilyPlan: true,
      targetMembersCount: 4,
      features: ['4 Khẩu phần chính/ngày', 'Tiết kiệm 20% chi phí', 'Thực đơn hài hòa huyết áp & tiểu đường', 'Tư vấn dinh dưỡng định kỳ'],
      isRecommended: true,
      hasDietitianSupport: true,
    },
    {
      name: 'Gói Đại Gia Đình Đầm Ấm (Gia Đình 6 Người)',
      code: 'PLAN_FAMILY_6',
      price: 3290000,
      duration: 7,
      description: 'Mâm cơm đại gia đình 6 người với đầy đủ các món kho, xào, canh, tráng miệng thịnh soạn, tiết kiệm 25%.',
      mealsPerDay: 6,
      snacksPerDay: 0,
      isFamilyPlan: true,
      targetMembersCount: 6,
      features: ['6 Khẩu phần chính/ngày', 'Tiết kiệm 25% chi phí', 'Tùy biến định lượng theo từng thành viên', 'Ưu tiên giờ giao nóng'],
      isRecommended: false,
      hasPriorityDelivery: true,
      hasDietitianSupport: true,
    },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { code: plan.code },
      update: plan,
      create: plan,
    });
  }
  console.log('✅ Đã tạo các gói Plan ăn chay mẫu.');

  // 3. Tạo Món ăn (MenuItems)
  const sampleMenuItems = [
    {
      name: 'Cơm Tấm Sườn Bì Chả Chay',
      description: 'Đĩa cơm tấm thơm lừng với sườn lát chiên giòn sốt mặn ngọt, bì chay làm từ miến và thính gạo rang, chả hấp đậu hũ bùi béo.',
      price: 45000,
      category: MenuCategory.MAIN,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
      calories: 480,
      protein: 18.5,
      carbs: 65.0,
      fat: 12.0,
      isAvailable: true,
      preparationTime: 15,
      ingredients: ['Gạo tấm', 'Sườn non chay', 'Đậu hũ', 'Miến dong', 'Nước mắm chay'],
      allergens: ['Đậu nành', 'Gluten'],
    },
    {
      name: 'Phở Chay Thập Cẩm Rau Củ',
      description: 'Nước dùng phở ninh từ củ cải trắng, mía, lê và hồi quế thảo quả ngọt thanh tự nhiên. Kèm nấm đùi gà, chả lụa chay và bánh phở tươi mềm.',
      price: 49000,
      category: MenuCategory.MAIN,
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600',
      calories: 420,
      protein: 14.0,
      carbs: 70.0,
      fat: 6.0,
      isAvailable: true,
      preparationTime: 20,
      ingredients: ['Bánh phở', 'Nấm đùi gà', 'Nấm đông cô', 'Tàu hũ ky', 'Hồi quế'],
      allergens: ['Đậu nành'],
    },
    {
      name: 'Gỏi Cuốn Ngũ Sắc Sốt Tương Đậu',
      description: 'Bánh tráng cuốn bún tươi, xà lách hữu cơ, bơ sáp, dưa leo, đậu hũ chiên giòn chấm sốt bơ đậu phộng béo bùi.',
      price: 35000,
      category: MenuCategory.SIDE,
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600',
      calories: 280,
      protein: 10.0,
      carbs: 45.0,
      fat: 8.0,
      isAvailable: true,
      preparationTime: 10,
      ingredients: ['Bánh tráng', 'Bún tươi', 'Bơ sáp', 'Đậu hũ', 'Tương bơ đậu phộng'],
      allergens: ['Đậu phộng', 'Đậu nành'],
    },
    {
      name: 'Trà Hoa Cúc Thảo Mộc Thanh Nhiệt',
      description: 'Trà hoa cúc ướp mật ong hoa nhãn, kỷ tử và táo đỏ giúp thanh nhiệt, an thần và đẹp da.',
      price: 25000,
      category: MenuCategory.BEVERAGE,
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600',
      calories: 90,
      protein: 1.0,
      carbs: 22.0,
      fat: 0.0,
      isAvailable: true,
      preparationTime: 5,
      ingredients: ['Hoa cúc khô', 'Kỷ tử', 'Táo đỏ', 'Mật ong hoa rừng'],
      allergens: [],
    },
  ];

  for (const item of sampleMenuItems) {
    const existing = await prisma.menuItem.findFirst({ where: { name: item.name } });
    if (!existing) {
      await prisma.menuItem.create({ data: item });
    }
  }
  console.log('✅ Đã nạp danh sách MenuItem mẫu.');

  // 4. Tạo Nguyên Vật Liệu Kho (Ingredients)
  const sampleIngredients = [
    { name: 'Đậu Hũ Non Hữu Cơ', code: 'ING_DAU_HU', unit: 'GRAM' as const, currentStock: 15000, minThreshold: 3000, costPerUnit: 40, supplier: 'HTX Nông Trại Xanh', category: 'Đạm thực vật' },
    { name: 'Nấm Đùi Gà Tươi', code: 'ING_NAM_DUI_GA', unit: 'GRAM' as const, currentStock: 8000, minThreshold: 2000, costPerUnit: 90, supplier: 'Nấm Sạch Đà Lạt', category: 'Nấm tươi' },
    { name: 'Gạo Lứt Huyết Rồng ST25', code: 'ING_GAO_LUC', unit: 'GRAM' as const, currentStock: 25000, minThreshold: 5000, costPerUnit: 35, supplier: 'Vựa Gạo Miền Tây', category: 'Ngũ cốc' },
    { name: 'Bơ Sáp 034 Lâm Đồng', code: 'ING_BO_SAP', unit: 'GRAM' as const, currentStock: 6000, minThreshold: 1500, costPerUnit: 80, supplier: 'Nông Trại Bơ Bảo Lộc', category: 'Rau củ quả' },
    { name: 'Hạt Sen Huế Tươi', code: 'ING_HAT_SEN', unit: 'GRAM' as const, currentStock: 4000, minThreshold: 1000, costPerUnit: 160, supplier: 'Đặc Sản Huế An Nhiên', category: 'Hạt dinh dưỡng' },
    { name: 'Nấm Đông Cô Tươi', code: 'ING_NAM_DONG_CO', unit: 'GRAM' as const, currentStock: 5000, minThreshold: 1200, costPerUnit: 110, supplier: 'Nấm Sạch Đà Lạt', category: 'Nấm tươi' },
    { name: 'Khoai Môn Sáp', code: 'ING_KHOAI_MON', unit: 'GRAM' as const, currentStock: 7000, minThreshold: 2000, costPerUnit: 45, supplier: 'Nông Sản Đồng Tháp', category: 'Rau củ quả' },
    { name: 'Hoa Cúc Chi Sấy Lạnh', code: 'ING_HOA_CUC', unit: 'GRAM' as const, currentStock: 2000, minThreshold: 500, costPerUnit: 250, supplier: 'Thảo Mộc Vàng', category: 'Thảo mộc' },
    { name: 'Kỷ Tử Hữu Cơ', code: 'ING_KY_TU', unit: 'GRAM' as const, currentStock: 1500, minThreshold: 300, costPerUnit: 350, supplier: 'Dược Liệu Xanh', category: 'Thảo mộc' },
    { name: 'Táo Đỏ Tân Cương', code: 'ING_TAO_DO', unit: 'GRAM' as const, currentStock: 2500, minThreshold: 500, costPerUnit: 180, supplier: 'Dược Liệu Xanh', category: 'Thảo mộc' },
  ];

  const ingredientMap = new Map<string, string>();

  for (const ing of sampleIngredients) {
    const created = await prisma.ingredient.upsert({
      where: { code: ing.code },
      update: { currentStock: ing.currentStock, costPerUnit: ing.costPerUnit },
      create: ing,
    });
    ingredientMap.set(ing.code, created.id);

    // Tạo log nhập kho ban đầu
    const existingTx = await prisma.stockTransaction.findFirst({ where: { ingredientId: created.id } });
    if (!existingTx) {
      await prisma.stockTransaction.create({
        data: {
          ingredientId: created.id,
          type: 'IMPORT',
          quantity: ing.currentStock,
          previousStock: 0,
          newStock: ing.currentStock,
          unitCost: ing.costPerUnit,
          totalCost: ing.currentStock * ing.costPerUnit,
          notes: 'Nhập kho ban đầu cho hệ thống',
          performedBy: 'Hệ thống Khởi tạo',
        },
      });
    }
  }
  console.log('✅ Đã nạp danh sách Nguyên vật liệu kho và Lịch sử nhập kho mẫu.');

  // 5. Tạo Công thức Nấu Ăn (Recipes & BOM)
  const menuList = await prisma.menuItem.findMany();
  for (const dish of menuList) {
    const existingRecipe = await prisma.recipe.findUnique({ where: { menuItemId: dish.id } });
    if (!existingRecipe) {
      let itemsToCreate: { ingredientId: string; quantity: number; unit: 'GRAM' }[] = [];
      let steps: { stepNumber: number; title: string; description: string; timeInMinutes: number }[] = [];

      if (dish.name.includes('Đậu')) {
        const dauHuId = ingredientMap.get('ING_DAU_HU');
        const namDongCoId = ingredientMap.get('ING_NAM_DONG_CO');
        if (dauHuId && namDongCoId) {
          itemsToCreate = [
            { ingredientId: dauHuId, quantity: 200, unit: 'GRAM' },
            { ingredientId: namDongCoId, quantity: 60, unit: 'GRAM' },
          ];
          steps = [
            { stepNumber: 1, title: 'Sơ chế nguyên liệu', description: 'Đậu hũ non cắt khối vuông 3x3cm. Nấm đông cô ngâm nước muối loãng, rửa sạch và khía hoa.', timeInMinutes: 5 },
            { stepNumber: 2, title: 'Nấu sốt dầu hào chay', description: 'Pha sốt tương đậu, đường mía hữu cơ và tiêu sọ. Phi thơm nấm với lửa vừa.', timeInMinutes: 5 },
            { stepNumber: 3, title: 'Om đậu hũ', description: 'Cho đậu hũ vào om nhẹ cùng sốt nấm trong 5 phút đến khi ngấm đều gia vị, rắc ngò rí.', timeInMinutes: 5 },
          ];
        }
      } else if (dish.name.includes('Cơm')) {
        const gaoLucId = ingredientMap.get('ING_GAO_LUC');
        const hatSenId = ingredientMap.get('ING_HAT_SEN');
        const namDuiGaId = ingredientMap.get('ING_NAM_DUI_GA');
        if (gaoLucId && hatSenId && namDuiGaId) {
          itemsToCreate = [
            { ingredientId: gaoLucId, quantity: 150, unit: 'GRAM' },
            { ingredientId: hatSenId, quantity: 50, unit: 'GRAM' },
            { ingredientId: namDuiGaId, quantity: 80, unit: 'GRAM' },
          ];
          steps = [
            { stepNumber: 1, title: 'Hấp gạo lứt & hạt sen', description: 'Gạo lứt ngâm 4 tiếng, hấp chín dẻo cùng hạt sen tươi nguyên hạt.', timeInMinutes: 10 },
            { stepNumber: 2, title: 'Áp chảo nấm đùi gà', description: 'Nấm đùi gà cắt lát dày 1cm, áp chảo vàng 2 mặt với sốt tiêu đen.', timeInMinutes: 5 },
            { stepNumber: 3, title: 'Hoàn thiện đĩa ăn', description: 'Xới cơm gạo lứt hạt sen vào khuôn, bày nấm đùi gà xung quanh kèm rau bina hấp.', timeInMinutes: 3 },
          ];
        }
      } else if (dish.name.includes('Cuốn') || dish.name.includes('Gỏi')) {
        const boSapId = ingredientMap.get('ING_BO_SAP');
        const dauHuId = ingredientMap.get('ING_DAU_HU');
        if (boSapId && dauHuId) {
          itemsToCreate = [
            { ingredientId: boSapId, quantity: 100, unit: 'GRAM' },
            { ingredientId: dauHuId, quantity: 100, unit: 'GRAM' },
          ];
          steps = [
            { stepNumber: 1, title: 'Cắt lát bơ và đậu hũ', description: 'Bơ sáp 034 thái lát dài, đậu hũ non chiên giòn thái sợi dài.', timeInMinutes: 4 },
            { stepNumber: 2, title: 'Cuốn bánh tráng', description: 'Nhúng bánh tráng gạo mè, cuộn chặt tay kèm bún tươi, rau xà lách và húng quế.', timeInMinutes: 5 },
            { stepNumber: 3, title: 'Pha sốt chấm bơ đậu', description: 'Xay nhuyễn bơ đậu phộng cùng nước cốt dừa và ớt băm.', timeInMinutes: 3 },
          ];
        }
      } else if (dish.name.includes('Trà')) {
        const hoaCucId = ingredientMap.get('ING_HOA_CUC');
        const kyTuId = ingredientMap.get('ING_KY_TU');
        const taoDoId = ingredientMap.get('ING_TAO_DO');
        if (hoaCucId && kyTuId && taoDoId) {
          itemsToCreate = [
            { ingredientId: hoaCucId, quantity: 5, unit: 'GRAM' },
            { ingredientId: kyTuId, quantity: 10, unit: 'GRAM' },
            { ingredientId: taoDoId, quantity: 15, unit: 'GRAM' },
          ];
          steps = [
            { stepNumber: 1, title: 'Tráng trà', description: 'Cho hoa cúc, kỷ tử và táo đỏ cắt lát vào bình, tráng nhanh bằng nước sôi 90 độ.', timeInMinutes: 1 },
            { stepNumber: 2, title: 'Hãm trà thảo mộc', description: 'Rót 400ml nước sôi 95 độ C, hãm trà trong 7 phút để tinh chất thảo mộc hòa quyện.', timeInMinutes: 7 },
            { stepNumber: 3, title: 'Đóng chai giữ nhiệt', description: 'Thêm 1 thìa mật ong hoa rừng, rót vào chai thủy tinh giữ nhiệt sẵn sàng giao.', timeInMinutes: 2 },
          ];
        }
      }

      if (itemsToCreate.length > 0) {
        await prisma.recipe.create({
          data: {
            menuItemId: dish.id,
            name: `Công Thức Chuẩn: ${dish.name}`,
            description: `Quy trình định lượng chuẩn hóa nhà bếp cho món ${dish.name}`,
            prepTimeMinutes: 10,
            cookTimeMinutes: 15,
            servingSize: 1,
            instructions: steps,
            items: {
              create: itemsToCreate,
            },
          },
        });
      }
    }
  }
  console.log('✅ Đã nạp danh sách Recipe & định lượng BOM mẫu cho món ăn.');

  // 6. Tạo Nhóm Gia Đình mẫu (Family Group & Members)
  const existingGroup = await prisma.familyGroup.findFirst({
    where: { ownerId: admin.id },
  });

  if (!existingGroup) {
    const familyGroup = await prisma.familyGroup.create({
      data: {
        ownerId: admin.id,
        name: 'Tổ Ấm An Lành (Gia Đình 3 Thế Hệ)',
        inviteCode: 'CF-FAM-8821',
        members: {
          create: [
            {
              userId: admin.id,
              name: 'Nguyễn Văn Minh (Chủ Hộ)',
              relation: 'SELF',
              age: 34,
              gender: 'male',
              heightCm: 172,
              weightKg: 68,
              activityLevel: 'MODERATELY_ACTIVE',
              dailyCalories: 2150,
              medicalConditions: [],
              dietaryRestrictions: ['Ưa thích nấm đùi gà', 'Giàu Protein'],
              isManaged: false,
            },
            {
              name: 'Lê Thu Trang (Vợ)',
              relation: 'SPOUSE',
              age: 32,
              gender: 'female',
              heightCm: 160,
              weightKg: 52,
              activityLevel: 'LIGHTLY_ACTIVE',
              dailyCalories: 1680,
              medicalConditions: [],
              dietaryRestrictions: ['Thanh nhiệt dưỡng nhan', 'Ít dầu mỡ'],
              isManaged: true,
            },
            {
              name: 'Bác Nguyễn Văn An (Bố)',
              relation: 'PARENT',
              age: 68,
              gender: 'male',
              heightCm: 165,
              weightKg: 62,
              activityLevel: 'SEDENTARY',
              dailyCalories: 1550,
              medicalConditions: ['Tiểu đường type 2', 'Tăng huyết áp'],
              dietaryRestrictions: ['Ăn nhạt (DASH)', 'Carb GI thấp', 'Không đường'],
              isManaged: true,
              notes: 'Thức ăn cần mềm, hạn chế đồ chiên xào',
            },
            {
              name: 'Bé Nguyễn Minh Anh (Con Gái)',
              relation: 'CHILD',
              age: 8,
              gender: 'female',
              heightCm: 125,
              weightKg: 24,
              activityLevel: 'VERY_ACTIVE',
              dailyCalories: 1450,
              medicalConditions: [],
              dietaryRestrictions: ['Dị ứng đậu phộng', 'Không ăn cay'],
              isManaged: true,
              notes: 'Cần bổ sung canxi và chất xơ phát triển',
            },
          ],
        },
      },
    });
    console.log('✅ Đã tạo Nhóm Gia Đình mẫu với 4 thành viên đa thế hệ (Bố mẹ, con nhỏ, ông bà).');
  }

  console.log('🎉 Quá trình Seeding cơ sở dữ liệu hoàn tất!');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi Seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
