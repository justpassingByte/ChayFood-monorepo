import { Body, Controller, Get, Post, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/subscription.dto';
import { JwtAuthGuard, RolesGuard, Roles, CurrentUser, AuthenticatedUser } from '../auth/jwt.strategy';
import { Role } from '@chayfood/db';

@ApiTags('Subscriptions')
@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  @Post()
  @ApiOperation({ summary: 'Đăng ký gói ăn định kỳ (Tuần / Tháng)' })
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateSubscriptionDto) {
    return this.subscriptionsService.create(user.id, dto);
  }

  @Get('my-subscriptions')
  @ApiOperation({ summary: 'Lấy danh sách gói ăn đã đăng ký của khách hàng' })
  getMySubscriptions(@CurrentUser() user: AuthenticatedUser) {
    return this.subscriptionsService.findUserSubscriptions(user.id);
  }

  @Patch(':id/toggle')
  @ApiOperation({ summary: 'Tạm dừng hoặc kích hoạt lại gói ăn định kỳ' })
  toggle(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.subscriptionsService.toggleSubscription(id, user.id, user.role === Role.ADMIN);
  }


  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Lấy toàn bộ danh sách đăng ký gói ăn (Admin)' })
  findAll() {
    return this.subscriptionsService.findAll();
  }
}
