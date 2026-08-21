import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

export interface SeedUserData {
  email: string;
  name: string;
  phone: string;
  address: string;
  role: Role;
  rawPassword: string;
  preferences?: {
    favoriteCategories: string[];
    dislikedIngredients: string[];
    minProtein: number;
    maxCalories: number;
    dietaryRestrictions: string[];
  };
}

export async function getSeedUsers(): Promise<Array<SeedUserData & { passwordHash: string }>> {
  const adminPasswordHash = await bcrypt.hash('Admin@123456', 10);
  const customerPasswordHash = await bcrypt.hash('Customer@123456', 10);
  const userPasswordHash = await bcrypt.hash('User@123456', 10);

  return [
    {
      email: 'admin@chayfood.vn',
      name: 'Quản Trị Viên ChayFood',
      phone: '0901234567',
      address: 'Số 123 Đường Ẩm Thực Chay, Quận 1, TP. Hồ Chí Minh',
      role: Role.ADMIN,
      rawPassword: 'Admin@123456',
      passwordHash: adminPasswordHash,
    },
    {
      email: 'customer@chayfood.vn',
      name: 'Trần Thị Thanh Tâm',
      phone: '0912345678',
      address: '45 Tôn Thất Đạm, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
      role: Role.USER,
      rawPassword: 'Customer@123456',
      passwordHash: customerPasswordHash,
      preferences: {
        favoriteCategories: ['MAIN', 'SIDE'],
        dislikedIngredients: ['Ớt chuông', 'Cần tây'],
        minProtein: 16,
        maxCalories: 550,
        dietaryRestrictions: ['Thuần thực vật', 'Ít đường tinh luyện'],
      },
    },
    {
      email: 'fitness@chayfood.vn',
      name: 'Nguyễn Quốc Hùng',
      phone: '0987654321',
      address: '128 Điện Biên Phủ, Phường Đa Kao, Quận 1, TP. Hồ Chí Minh',
      role: Role.USER,
      rawPassword: 'User@123456',
      passwordHash: userPasswordHash,
      preferences: {
        favoriteCategories: ['MAIN', 'BEVERAGE'],
        dislikedIngredients: [],
        minProtein: 25,
        maxCalories: 700,
        dietaryRestrictions: ['Giàu đạm thực vật', 'Tăng cơ giảm mỡ'],
      },
    },
  ];
}
