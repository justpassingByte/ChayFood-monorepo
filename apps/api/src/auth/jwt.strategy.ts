import { SetMetadata, createParamDecorator, ExecutionContext, Injectable, UnauthorizedException, CanActivate } from '@nestjs/common';
import { PassportStrategy, AuthGuard } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Reflector } from '@nestjs/core';
import { Role } from '@chayfood/db';
import { PrismaService } from '../prisma/prisma.service';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  address: string | null;
  role: Role;
  picture: string | null;
}

export interface AuthenticatedRequest {
  user: AuthenticatedUser;
}

export const CurrentUser = createParamDecorator(
  (_data: string | undefined, ctx: ExecutionContext): AuthenticatedUser => {
    const request = ctx.switchToHttp().getRequest<{ user: AuthenticatedUser }>();
    return request.user;
  },
);

/**
 * Lấy JWT Secret an toàn từ biến môi trường.
 * Áp dụng cơ chế Fail-Fast ở môi trường Production để ngăn chặn việc sử dụng fallback secret không an toàn.
 */
export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('FATAL: Biến môi trường JWT_SECRET chưa được cấu hình trên môi trường Production');
  }
  return secret || 'dev_secret_chayfood_jwt_token_local_only';
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getJwtSecret(),
    });
  }

  async validate(payload: { sub: string; email: string; role: Role }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true, phone: true, address: true, role: true, picture: true },
    });

    if (!user) {
      throw new UnauthorizedException('Tài khoản không tồn tại hoặc phiên đăng nhập đã hết hạn');
    }

    return user;
  }
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) return false;

    return requiredRoles.includes(user.role);
  }
}
