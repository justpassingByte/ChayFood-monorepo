import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Prisma } from '@chayfood/db';
import { PrismaService } from '../prisma/prisma.service';
import {
  UpdateUserProfileDto,
  AddressDto,
  UpdateUserPreferenceDto,
  ChangePasswordDto,
} from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getFullProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        preference: true,
        ownedFamilyGroups: {
          include: { members: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy thông tin người dùng');
    }

    const defaultAddressObj = user.address
      ? [
          {
            _id: `addr_${user.id}`,
            id: `addr_${user.id}`,
            name: user.name,
            street: user.address,
            city: 'Hồ Chí Minh',
            state: 'Việt Nam',
            postalCode: '70000',
            phone: user.phone || '',
            isDefault: true,
          },
        ]
      : [];

    return {
      status: 'success',
      data: {
        id: user.id,
        _id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        picture: user.picture,
        role: user.role,
        preference: user.preference,
        familyGroups: user.ownedFamilyGroups,
        addresses: defaultAddressObj,
      },
    };
  }

  async updateProfile(userId: string, dto: UpdateUserProfileDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.phone && { phone: dto.phone }),
        ...(dto.address && { address: dto.address }),
        ...(dto.picture && { picture: dto.picture }),
      },
    });

    return {
      status: 'success',
      data: {
        id: user.id,
        _id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        picture: user.picture,
        role: user.role,
      },
    };
  }

  async getAddresses(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, phone: true, address: true },
    });

    if (!user || !user.address) {
      return { status: 'success', data: [] };
    }

    return {
      status: 'success',
      data: [
        {
          _id: `addr_${user.id}`,
          id: `addr_${user.id}`,
          name: user.name,
          street: user.address,
          city: 'Hồ Chí Minh',
          state: 'Việt Nam',
          postalCode: '70000',
          phone: user.phone || '',
          isDefault: true,
        },
      ],
    };
  }

  async addAddress(userId: string, dto: AddressDto) {
    const fullStreet = dto.street;
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        address: fullStreet,
        ...(dto.phone && { phone: dto.phone }),
      },
    });

    return {
      status: 'success',
      data: {
        _id: `addr_${userId}`,
        id: `addr_${userId}`,
        name: dto.name || 'Địa chỉ giao hàng',
        street: dto.street,
        city: dto.city,
        state: dto.state || 'Việt Nam',
        postalCode: dto.postalCode || '70000',
        phone: dto.phone || '',
        additionalInfo: dto.additionalInfo,
        isDefault: true,
      },
    };
  }

  async deleteAddress(userId: string, _addressId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, address: true },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy thông tin người dùng');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { address: null },
    });

    return { status: 'success', message: 'Đã xóa địa chỉ thành công' };
  }

  async updatePreference(userId: string, dto: UpdateUserPreferenceDto) {
    const preference = await this.prisma.userPreference.upsert({
      where: { userId },
      create: {
        userId,
        maxCalories: dto.maxCalories,
        minProtein: dto.minProtein,
        dislikedIngredients: dto.dislikedIngredients || [],
        favoriteCategories: dto.favoriteCategories || [],
        dietaryRestrictions: dto.dietaryRestrictions || [],
      },
      update: {
        ...(dto.maxCalories !== undefined && { maxCalories: dto.maxCalories }),
        ...(dto.minProtein !== undefined && { minProtein: dto.minProtein }),
        ...(dto.dislikedIngredients && { dislikedIngredients: dto.dislikedIngredients }),
        ...(dto.favoriteCategories && { favoriteCategories: dto.favoriteCategories }),
        ...(dto.dietaryRestrictions && { dietaryRestrictions: dto.dietaryRestrictions }),
      },
    });

    return { status: 'success', data: preference };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    if (dto.currentPassword === dto.newPassword) {
      throw new BadRequestException('Mật khẩu mới phải khác mật khẩu hiện tại');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.passwordHash) {
      throw new NotFoundException('Tài khoản chưa thiết lập mật khẩu truyền thống');
    }

    const isValid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Mật khẩu hiện tại không chính xác');
    }

    const newHash = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });

    return { status: 'success', message: 'Đổi mật khẩu thành công' };
  }

  async getCustomers(page = 1, limit = 10, search = '') {
    const skip = (page - 1) * limit;
    const where: Prisma.UserWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { phone: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [totalCount, users] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          orders: {
            select: {
              id: true,
              totalAmount: true,
              status: true,
            },
          },
        },
      }),
    ]);

    const formattedCustomers = users.map((u) => {
      const totalOrders = u.orders.length;
      const totalSpent = u.orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
      return {
        _id: u.id,
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone || '',
        role: u.role,
        joinDate: u.createdAt.toISOString(),
        createdAt: u.createdAt.toISOString(),
        totalOrders,
        totalSpent,
      };
    });

    return {
      status: 'success',
      data: {
        customers: formattedCustomers,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit) || 1,
          totalCount,
        },
      },
    };
  }

  async getCustomerById(customerId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: customerId },
      include: {
        preference: true,
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy khách hàng');
    }

    const totalOrders = user.orders.length;
    const totalSpent = user.orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

    return {
      status: 'success',
      data: {
        customer: {
          _id: user.id,
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          role: user.role,
          joinDate: user.createdAt.toISOString(),
          createdAt: user.createdAt.toISOString(),
          totalOrders,
          totalSpent,
          address: user.address ? { street: user.address, city: 'Hồ Chí Minh' } : undefined,
          orders: user.orders,
        },
      },
    };
  }

  async deleteCustomer(customerId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: customerId },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy khách hàng để xóa');
    }

    await this.prisma.user.delete({
      where: { id: customerId },
    });

    return {
      status: 'success',
      message: 'Đã xóa khách hàng thành công',
    };
  }
}
