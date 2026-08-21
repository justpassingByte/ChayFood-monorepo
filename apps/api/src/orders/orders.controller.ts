import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { UpdateOrderStatusDto } from './dto/order.dto';
import { JwtAuthGuard, RolesGuard, Roles, CurrentUser, AuthenticatedUser } from '../auth/jwt.strategy';
import { Role } from '@chayfood/db';
import { CreateOrderSchema, type CreateOrderInput } from '@chayfood/shared-types';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo đơn hàng mới (Dành cho khách hàng đã đăng nhập)' })
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(CreateOrderSchema)) dto: CreateOrderInput
  ) {
    return this.ordersService.create(user.id, dto);
  }

  @Get('my-orders')
  @ApiOperation({ summary: 'Lấy lịch sử đơn hàng của khách hàng đang đăng nhập' })
  getMyOrders(@CurrentUser() user: AuthenticatedUser) {
    return this.ordersService.findUserOrders(user.id);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Lấy toàn bộ đơn hàng hệ thống (Admin)' })
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết đơn hàng theo ID' })
  findById(@Param('id') id: string) {
    return this.ordersService.findById(id);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Cập nhật trạng thái đơn hàng (Admin)' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto);
  }
}
