import { MenuService } from './menu.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { MenuCategory } from '@chayfood/db';
import { Decimal } from '@prisma/client/runtime/library';

describe('MenuService', () => {
  let service: MenuService;
  let mockPrisma: {
    menuItem: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      count: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  const sampleMenuItem = {
    id: 'item-1',
    name: 'Cơm Tấm Sườn Chay',
    description: 'Cơm tấm sườn non thực vật',
    price: new Decimal(45000),
    category: MenuCategory.MAIN,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    calories: 450,
    protein: new Decimal(18.5),
    carbs: new Decimal(60.0),
    fat: new Decimal(12.0),
    isAvailable: true,
    preparationTime: 15,
    ingredients: ['Gạo tấm', 'Sườn chay'],
    allergens: ['Đậu nành'],
    createdAt: new Date(),
    updatedAt: new Date(),
    tag: {
      id: 'tag-1',
      menuItemId: 'item-1',
      tags: ['Giàu đạm', 'Thuần thực vật'],
      occasionTags: ['Ăn trưa'],
    },
  };

  beforeEach(() => {
    mockPrisma = {
      menuItem: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    service = new MenuService(mockPrisma as unknown as PrismaService);
  });

  describe('findAll', () => {
    it('trả về danh sách món ăn đã parse số liệu dinh dưỡng và phân trang chính xác', async () => {
      mockPrisma.menuItem.findMany.mockResolvedValue([sampleMenuItem]);
      mockPrisma.menuItem.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 20 });

      expect(result.items.length).toBe(1);
      expect(result.items[0].price).toBe(45000);
      expect(result.items[0].protein).toBe(18.5);
      expect(result.items[0].carbs).toBe(60.0);
      expect(result.items[0].fat).toBe(12.0);
      expect(result.pagination.total).toBe(1);
      expect(result.pagination.totalPages).toBe(1);
      expect(mockPrisma.menuItem.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          include: { tag: true },
          take: 20,
          skip: 0,
        }),
      );
    });

    it('áp dụng bộ lọc danh mục và macro một cách an toàn', async () => {
      mockPrisma.menuItem.findMany.mockResolvedValue([]);
      mockPrisma.menuItem.count.mockResolvedValue(0);

      await service.findAll({
        category: 'MAIN',
        minCalories: 300,
        maxCalories: 600,
        minProtein: 10,
        maxProtein: 30,
        query: 'Cơm',
      });

      expect(mockPrisma.menuItem.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            isAvailable: true,
            category: MenuCategory.MAIN,
            calories: { gte: 300, lte: 600 },
            protein: { gte: 10, lte: 30 },
            OR: [
              { name: { contains: 'Cơm', mode: 'insensitive' } },
              { description: { contains: 'Cơm', mode: 'insensitive' } },
            ],
          }),
        }),
      );
    });

    it('bỏ qua danh mục không hợp lệ một cách an toàn (chống Prototype Pollution)', async () => {
      mockPrisma.menuItem.findMany.mockResolvedValue([]);
      mockPrisma.menuItem.count.mockResolvedValue(0);

      await service.findAll({ category: 'toString' });

      expect(mockPrisma.menuItem.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { isAvailable: true },
        }),
      );
    });
  });

  describe('findById', () => {
    it('trả về chi tiết món ăn khi ID hợp lệ', async () => {
      mockPrisma.menuItem.findUnique.mockResolvedValue(sampleMenuItem);

      const result = await service.findById('item-1');

      expect(result.id).toBe('item-1');
      expect(result.price).toBe(45000);
      expect(result.protein).toBe(18.5);
    });

    it('ném NotFoundException không có dấu chấm cuối câu khi không tìm thấy món', async () => {
      mockPrisma.menuItem.findUnique.mockResolvedValue(null);

      await expect(service.findById('non-existent-id')).rejects.toThrow(
        new NotFoundException('Không tìm thấy món ăn này'),
      );
    });
  });

  describe('create', () => {
    it('tạo món ăn mới và trả về object với price/protein/carbs/fat dạng number', async () => {
      mockPrisma.menuItem.create.mockResolvedValue(sampleMenuItem);

      const result = await service.create({
        name: 'Cơm Tấm Sườn Chay',
        description: 'Cơm tấm sườn non thực vật',
        price: 45000,
        category: MenuCategory.MAIN,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
        calories: 450,
        protein: 18.5,
        carbs: 60,
        fat: 12,
      });

      expect(result.name).toBe('Cơm Tấm Sườn Chay');
      expect(result.price).toBe(45000);
      expect(result.protein).toBe(18.5);
      expect(result.carbs).toBe(60);
      expect(result.fat).toBe(12);
    });
  });

  describe('update', () => {
    it('cập nhật món ăn thành công', async () => {
      mockPrisma.menuItem.findUnique.mockResolvedValue(sampleMenuItem);
      mockPrisma.menuItem.update.mockResolvedValue({
        ...sampleMenuItem,
        price: new Decimal(50000),
      });

      const result = await service.update('item-1', { price: 50000 });

      expect(result.price).toBe(50000);
      expect(mockPrisma.menuItem.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'item-1' },
          data: { price: 50000 },
        }),
      );
    });
  });

  describe('remove (Soft Deactivation)', () => {
    it('thực hiện soft delete (isAvailable = false) để bảo toàn khóa ngoại đơn hàng cũ', async () => {
      mockPrisma.menuItem.findUnique.mockResolvedValue(sampleMenuItem);
      mockPrisma.menuItem.update.mockResolvedValue({
        ...sampleMenuItem,
        isAvailable: false,
      });

      const result = await service.remove('item-1');

      expect(result.message).toBe('Đã ngừng phục vụ món ăn thành công');
      expect(mockPrisma.menuItem.update).toHaveBeenCalledWith({
        where: { id: 'item-1' },
        data: { isAvailable: false },
      });
      expect(mockPrisma.menuItem.delete).not.toHaveBeenCalled();
    });
  });
});
