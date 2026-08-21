import { PrismaClient, OrderStatus, PaymentStatus, PaymentMethod } from '@prisma/client';
import { getSeedUsers } from './seed-data/users';
import { seedPlans } from './seed-data/plans';
import { seedIngredients } from './seed-data/ingredients';
import { seedMenuItems } from './seed-data/menuItems';
import { seedRecipes } from './seed-data/recipes';
import { seedFamilyMembers } from './seed-data/family';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Bắt đầu nạp dữ liệu mẫu (Seeding) toàn diện cho ChayFood PostgreSQL...');

  // 1. Nạp Tài khoản Người dùng (Admin & Customers)
  const usersToSeed = await getSeedUsers();
  const userMap = new Map<string, string>();

  for (const u of usersToSeed) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        name: u.name,
        phone: u.phone,
        address: u.address,
        role: u.role,
        passwordHash: u.passwordHash,
      },
      create: {
        email: u.email,
        name: u.name,
        passwordHash: u.passwordHash,
        phone: u.phone,
        address: u.address,
        role: u.role,
      },
    });

    userMap.set(u.email, user.id);
    console.log(`✅ Đã nạp tài khoản: ${user.email} (Role: ${user.role} | Password: ${u.rawPassword})`);

    // Tạo sở thích ăn uống nếu có
    if (u.preferences) {
      await prisma.userPreference.upsert({
        where: { userId: user.id },
        update: {
          favoriteCategories: u.preferences.favoriteCategories,
          dislikedIngredients: u.preferences.dislikedIngredients,
          minProtein: u.preferences.minProtein,
          maxCalories: u.preferences.maxCalories,
          dietaryRestrictions: u.preferences.dietaryRestrictions,
        },
        create: {
          userId: user.id,
          favoriteCategories: u.preferences.favoriteCategories,
          dislikedIngredients: u.preferences.dislikedIngredients,
          minProtein: u.preferences.minProtein,
          maxCalories: u.preferences.maxCalories,
          dietaryRestrictions: u.preferences.dietaryRestrictions,
        },
      });
    }
  }

  // 2. Nạp Các Gói Ăn Chay (Plans)
  for (const plan of seedPlans) {
    await prisma.plan.upsert({
      where: { code: plan.code },
      update: plan,
      create: plan,
    });
  }
  console.log(`✅ Đã nạp ${seedPlans.length} gói ăn chay mẫu.`);

  // 3. Nạp Nguyên Vật Liệu Kho (Ingredients & Initial Stock Transactions)
  const ingredientMap = new Map<string, string>();

  for (const ing of seedIngredients) {
    const created = await prisma.ingredient.upsert({
      where: { code: ing.code },
      update: {
        name: ing.name,
        unit: ing.unit,
        currentStock: ing.currentStock,
        minThreshold: ing.minThreshold,
        costPerUnit: ing.costPerUnit,
        supplier: ing.supplier,
        category: ing.category,
      },
      create: ing,
    });
    ingredientMap.set(ing.code, created.id);

    // Tạo lịch sử nhập kho ban đầu
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
          notes: 'Nhập kho ban đầu cho hệ thống ChayFood',
          performedBy: 'Hệ thống Khởi tạo',
        },
      });
    }
  }
  console.log(`✅ Đã nạp ${seedIngredients.length} nguyên vật liệu kho và nhật ký nhập kho.`);

  // 4. Nạp Danh Sách Món Ăn (MenuItems & Tags)
  const menuItemMap = new Map<string, string>();

  for (const item of seedMenuItems) {
    const existing = await prisma.menuItem.findFirst({ where: { name: item.name } });
    let savedDishId = '';

    if (existing) {
      const updated = await prisma.menuItem.update({
        where: { id: existing.id },
        data: {
          description: item.description,
          price: item.price,
          category: item.category,
          image: item.image,
          calories: item.calories,
          protein: item.protein,
          carbs: item.carbs,
          fat: item.fat,
          isAvailable: item.isAvailable,
          preparationTime: item.preparationTime,
          ingredients: item.ingredients,
          allergens: item.allergens,
        },
      });
      savedDishId = updated.id;
    } else {
      const created = await prisma.menuItem.create({
        data: {
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category,
          image: item.image,
          calories: item.calories,
          protein: item.protein,
          carbs: item.carbs,
          fat: item.fat,
          isAvailable: item.isAvailable,
          preparationTime: item.preparationTime,
          ingredients: item.ingredients,
          allergens: item.allergens,
        },
      });
      savedDishId = created.id;
    }

    menuItemMap.set(item.name, savedDishId);

    // Cập nhật Tags cho món ăn
    await prisma.menuItemTag.upsert({
      where: { menuItemId: savedDishId },
      update: { tags: item.tags },
      create: {
        menuItemId: savedDishId,
        tags: item.tags,
        occasionTags: ['Ăn trưa', 'Ăn tối', 'Dinh dưỡng hàng ngày'],
      },
    });
  }
  console.log(`✅ Đã nạp ${seedMenuItems.length} món ăn thuần thực vật trải đều 4 nhóm danh mục.`);

  // 5. Nạp 100% Công Thức & Quy Trình Nấu Ăn (Recipes & BOM)
  let createdRecipeCount = 0;

  for (const r of seedRecipes) {
    const dishId = menuItemMap.get(r.dishName);
    if (!dishId) continue;

    // Xóa recipe cũ nếu có để làm mới hoàn toàn
    await prisma.recipe.deleteMany({
      where: { menuItemId: dishId },
    });

    // Chuyển đổi mã nguyên liệu sang ID thực tế trong DB
    const itemsToCreate = r.items
      .map((it) => {
        const ingId = ingredientMap.get(it.ingredientCode);
        if (!ingId) return null;
        return {
          ingredientId: ingId,
          quantity: it.quantity,
          unit: it.unit,
          notes: it.notes || null,
        };
      })
      .filter((it): it is NonNullable<typeof it> => it !== null);

    await prisma.recipe.create({
      data: {
        menuItemId: dishId,
        name: r.name,
        description: r.description,
        prepTimeMinutes: r.prepTimeMinutes,
        cookTimeMinutes: r.cookTimeMinutes,
        servingSize: r.servingSize,
        instructions: JSON.parse(JSON.stringify(r.instructions)),
        notes: r.notes,
        items: {
          create: itemsToCreate,
        },
      },
    });
    createdRecipeCount++;
  }
  console.log(`✅ Đã nạp ${createdRecipeCount} công thức chuẩn và quy trình nấu ăn chi tiết.`);

  // 6. Nạp Nhóm Gia Đình & Thành Viên Đa Thế Hệ (Family Group & Members)
  const adminId = userMap.get('admin@chayfood.vn');
  if (adminId) {
    const existingGroup = await prisma.familyGroup.findFirst({
      where: { ownerId: adminId },
    });

    if (!existingGroup) {
      await prisma.familyGroup.create({
        data: {
          ownerId: adminId,
          name: 'Tổ Ấm An Lành (Gia Đình 3 Thế Hệ)',
          inviteCode: 'CF-FAM-8821',
          members: {
            create: seedFamilyMembers.map((m) => ({
              userId: m.relation === 'SELF' ? adminId : null,
              name: m.name,
              relation: m.relation,
              age: m.age,
              gender: m.gender,
              heightCm: m.heightCm,
              weightKg: m.weightKg,
              activityLevel: m.activityLevel,
              dailyCalories: m.dailyCalories,
              medicalConditions: m.medicalConditions,
              dietaryRestrictions: m.dietaryRestrictions,
              isManaged: m.isManaged,
              notes: m.notes || null,
            })),
          },
        },
      });
      console.log('✅ Đã nạp Nhóm Gia Đình mẫu với 4 thành viên đa thế hệ.');
    }
  }

  // 7. Nạp Đơn Hàng Mẫu Cho Khách Hàng (Customer Sample Orders)
  const customerId = userMap.get('customer@chayfood.vn');
  const comTamId = menuItemMap.get('Cơm Tấm Sườn Bì Chả Chay');
  const traCucId = menuItemMap.get('Trà Hoa Cúc Thảo Mộc Thanh Nhiệt');

  if (customerId && comTamId && traCucId) {
    const existingOrder = await prisma.order.findFirst({ where: { userId: customerId } });
    if (!existingOrder) {
      await prisma.order.create({
        data: {
          orderNumber: 'CF-ORD-2026-001',
          userId: customerId,
          totalAmount: 84000,
          status: OrderStatus.CONFIRMED,
          paymentStatus: PaymentStatus.PAID,
          paymentMethod: PaymentMethod.BANKING,
          deliveryAddress: {
            street: '45 Tôn Thất Đạm',
            ward: 'Phường Bến Nghé',
            district: 'Quận 1',
            city: 'TP. Hồ Chí Minh',
            phone: '0912345678',
          },
          specialInstructions: 'Giao giờ trưa khoảng 11h45, nước sốt để riêng',
          items: {
            create: [
              {
                menuItemId: comTamId,
                quantity: 1,
                price: 55000,
                specialInstructions: 'Thêm đồ chua giòn',
              },
              {
                menuItemId: traCucId,
                quantity: 1,
                price: 29000,
                specialInstructions: 'Uống ấm không đá',
              },
            ],
          },
        },
      });
      console.log('✅ Đã nạp đơn hàng mẫu cho tài khoản Customer.');
    }
  }

  console.log('🎉 Hoàn tất quá trình nạp dữ liệu mẫu (Seeding) thành công mỹ mãn!');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi khi chạy seed script:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
