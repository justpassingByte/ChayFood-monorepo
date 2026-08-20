import { AuthService } from './auth.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Role } from '@chayfood/db';

describe('AuthService', () => {
  let service: AuthService;
  let mockPrisma: any;
  let mockJwtService: any;

  beforeEach(() => {
    mockPrisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };
    mockJwtService = {
      sign: jest.fn().mockReturnValue('mock-jwt-token'),
    };
    service = new AuthService(mockPrisma, mockJwtService);
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
  });
});
