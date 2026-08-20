import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { JwtAuthGuard, CurrentUser } from './jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Đăng ký tài khoản mới' })
  @ApiResponse({ status: 201, description: 'Đăng ký thành công' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đăng nhập hệ thống' })
  @ApiResponse({ status: 200, description: 'Đăng nhập thành công, trả về JWT Token' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy thông tin tài khoản hiện tại (Profile)' })
  getProfile(@CurrentUser() user: { id: string; email: string; name: string; role: string }) {
    return { user };
  }

  @Get('status')
  @ApiOperation({ summary: 'Kiểm tra trạng thái đăng nhập' })
  async getStatus(@Req() req: Request) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { isAuthenticated: false, user: null };
    }

    const token = authHeader.split(' ')[1];
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'super_secret_chayfood_jwt_token_2026',
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
}
