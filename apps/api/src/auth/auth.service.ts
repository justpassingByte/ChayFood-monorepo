import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { Role } from '@chayfood/db';
import { getJwtSecret } from './jwt.strategy';

/**
 * Dummy Hash chuẩn Bcrypt cost 10 để chống tấn công phân tích độ trễ (Timing Attack / Email Enumeration).
 * Đảm bảo thời gian phản hồi bằng nhau (~80-100ms) bất kể email có tồn tại trong hệ thống hay không.
 */
const TIMING_SAFE_DUMMY_HASH =
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });

    if (existing) {
      throw new ConflictException('Email này đã được sử dụng');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase().trim(),
        passwordHash,
        name: dto.name,
        phone: dto.phone,
        address: dto.address,
        role: Role.USER,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        role: true,
        createdAt: true,
      },
    });

    const token = this.generateToken(user.id, user.email, user.role);

    return {
      message: 'Đăng ký thành công',
      user,
      token,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });

    // Phòng thủ Timing Attack: Luôn thực hiện bcrypt.compare ngay cả khi user không tồn tại trong DB
    const passwordHash = user?.passwordHash || TIMING_SAFE_DUMMY_HASH;
    const isMatch = await bcrypt.compare(dto.password, passwordHash);

    if (!user || !user.passwordHash || !isMatch) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    const token = this.generateToken(user.id, user.email, user.role);

    return {
      message: 'Đăng nhập thành công',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        address: user.address,
        role: user.role,
        picture: user.picture,
      },
      token,
    };
  }

  async checkStatus(authHeader?: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { isAuthenticated: false, user: null };
    }

    const token = authHeader.split(' ')[1];
    try {
      const payload = this.jwtService.verify<{ sub: string; email: string; role: Role }>(token, {
        secret: getJwtSecret(),
      });
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, email: true, name: true, phone: true, address: true, role: true, picture: true },
      });

      if (!user) {
        return { isAuthenticated: false, user: null };
      }

      return { isAuthenticated: true, user };
    } catch {
      return { isAuthenticated: false, user: null };
    }
  }

  private generateToken(userId: string, email: string, role: Role): string {
    return this.jwtService.sign(
      { sub: userId, email, role },
      {
        secret: getJwtSecret(),
        expiresIn: '7d',
      },
    );
  }
}
