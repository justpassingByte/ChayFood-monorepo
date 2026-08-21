import { AuthService } from './auth.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Role } from '@chayfood/db';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let mockPrisma: {
    user: {
      findUnique: jest.Mock;
      create: jest.Mock;
    };
  };
  let mockJwtService: {
    sign: jest.Mock;
    verify: jest.Mock;
  };

  beforeEach(() => {
    mockPrisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };
    mockJwtService = {
      sign: jest.fn().mockReturnValue('mock-jwt-token'),
      verify: jest.fn().mockReturnValue({ sub: 'u-1', email: 'test@chayfood.vn', role: Role.USER }),
    };
    service = new AuthService(
      mockPrisma as unknown as PrismaService,
      mockJwtService as unknown as JwtService,
    );
  });

  describe('register', () => {
    it('đăng ký thành công tài khoản mới và trả về JWT token', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        id: 'u-1',
        email: 'test@chayfood.vn',
        name: 'Test User',
        role: Role.USER,
      });

      const result = await service.register({
        email: 'test@chayfood.vn',
        password: 'Password@123',
        name: 'Test User',
      });

      expect(result.token).toBe('mock-jwt-token');
      expect(result.user.email).toBe('test@chayfood.vn');
      expect(mockJwtService.sign).toHaveBeenCalled();
    });

    it('ném lỗi ConflictException khi email đã tồn tại', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'existing-id', email: 'duplicate@chayfood.vn' });

      await expect(
        service.register({
          email: 'duplicate@chayfood.vn',
          password: 'Password@123',
          name: 'Duplicate',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('đăng nhập thành công khi mật khẩu khớp', async () => {
      const hashed = await bcrypt.hash('CorrectPass@123', 10);
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'u-1',
        email: 'user@chayfood.vn',
        passwordHash: hashed,
        name: 'User One',
        role: Role.USER,
      });

      const result = await service.login({
        email: 'user@chayfood.vn',
        password: 'CorrectPass@123',
      });

      expect(result.token).toBe('mock-jwt-token');
      expect(result.user.email).toBe('user@chayfood.vn');
    });

    it('ném UnauthorizedException khi sai mật khẩu', async () => {
      const hashed = await bcrypt.hash('CorrectPass@123', 10);
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'u-1',
        email: 'user@chayfood.vn',
        passwordHash: hashed,
      });

      await expect(
        service.login({
          email: 'user@chayfood.vn',
          password: 'WrongPassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('ném UnauthorizedException an toàn khi email không tồn tại (Timing Safe)', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({
          email: 'nonexistent@chayfood.vn',
          password: 'AnyPassword@123',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('checkStatus', () => {
    it('trả về isAuthenticated false khi không có auth header', async () => {
      const result = await service.checkStatus(undefined);
      expect(result.isAuthenticated).toBe(false);
      expect(result.user).toBeNull();
    });

    it('trả về isAuthenticated true khi token hợp lệ', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'u-1',
        email: 'test@chayfood.vn',
        name: 'Test User',
        role: Role.USER,
      });

      const result = await service.checkStatus('Bearer valid-jwt-token');
      expect(result.isAuthenticated).toBe(true);
      expect(result.user?.email).toBe('test@chayfood.vn');
    });
  });
});
