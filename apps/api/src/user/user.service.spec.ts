import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('UserService (Profile & Addresses)', () => {
  let service: UserService;
  let mockPrisma: {
    user: { findUnique: jest.Mock; update: jest.Mock };
  };

  beforeEach(() => {
    mockPrisma = {
      user: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    service = new UserService(mockPrisma as unknown as PrismaService);
  });

  describe('getFullProfile', () => {
    it('phải trả về đầy đủ thông tin hồ sơ người dùng và địa chỉ mặc định', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        name: 'Nguyễn Văn A',
        email: 'vana@chayfood.com',
        phone: '0901234567',
        address: '123 Nguyễn Huệ, Quận 1',
        role: 'USER',
        picture: null,
        preference: null,
        ownedFamilyGroups: [],
      });

      const res = await service.getFullProfile('user-1');

      expect(res.status).toBe('success');
      expect(res.data.name).toBe('Nguyễn Văn A');
      expect(res.data.addresses.length).toBe(1);
      expect(res.data.addresses[0].street).toBe('123 Nguyễn Huệ, Quận 1');
    });

    it('phải ném NotFoundException nếu không tìm thấy người dùng', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      await expect(service.getFullProfile('user-nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateProfile', () => {
    it('phải cập nhật thông tin người dùng thành công', async () => {
      mockPrisma.user.update.mockResolvedValue({
        id: 'user-1',
        name: 'Nguyễn Văn B',
        email: 'vana@chayfood.com',
        phone: '0909999999',
        address: '456 Lê Lợi',
        picture: 'https://avatar.png',
        role: 'USER',
      });

      const res = await service.updateProfile('user-1', {
        name: 'Nguyễn Văn B',
        phone: '0909999999',
      });

      expect(mockPrisma.user.update).toHaveBeenCalled();
      expect(res.data.name).toBe('Nguyễn Văn B');
    });
  });
});
