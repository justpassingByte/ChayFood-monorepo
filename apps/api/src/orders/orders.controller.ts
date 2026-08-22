import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { UpdateOrderStatusDto } from './dto/order.dto';
import {
  JwtAuthGuard,
  RolesGuard,
  Roles,
  CurrentUser,
  AuthenticatedUser,
} from '../auth/jwt.strategy';
import { Role, OrderStatus, PaymentStatus, PaymentMethod } from '@chayfood/db';
import { CreateOrderSchema, type CreateOrderInput } from '@chayfood/shared-types';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo đơn hàng mới (Dành cho khách hàng đã đăng nhập)' })
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(CreateOrderSchema)) dto: CreateOrderInput,
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
  @ApiOperation({ summary: 'Lấy toàn bộ đơn hàng hệ thống kèm bộ lọc đa chiều (Admin)' })
  @ApiQuery({ name: 'status', enum: OrderStatus, required: false })
  @ApiQuery({ name: 'paymentStatus', enum: PaymentStatus, required: false })
  @ApiQuery({ name: 'paymentMethod', enum: PaymentMethod, required: false })
  @ApiQuery({ name: 'search', type: String, required: false })
  @ApiQuery({ name: 'startDate', type: String, required: false })
  @ApiQuery({ name: 'endDate', type: String, required: false })
  @ApiQuery({ name: 'sortBy', enum: ['createdAt', 'totalAmount'], required: false })
  @ApiQuery({ name: 'sortOrder', enum: ['asc', 'desc'], required: false })
  findAll(
    @Query('status') status?: OrderStatus,
    @Query('paymentStatus') paymentStatus?: PaymentStatus,
    @Query('paymentMethod') paymentMethod?: PaymentMethod,
    @Query('search') search?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('sortBy') sortBy?: 'createdAt' | 'totalAmount',
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    return this.ordersService.findAll({
      status,
      paymentStatus,
      paymentMethod,
      search,
      startDate,
      endDate,
      sortBy,
      sortOrder,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết đơn hàng theo ID (Chủ đơn hàng hoặc Admin)' })
  findById(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const isAdmin = user.role === Role.ADMIN;
    return this.ordersService.findById(id, user.id, isAdmin);
  }


  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Cập nhật trạng thái đơn hàng theo State Machine (Admin)' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Hủy đơn hàng (Khách hàng khi PENDING hoặc Admin)' })
  cancelOrder(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const isAdmin = user.role === Role.ADMIN;
    return this.ordersService.cancelOrder(id, user.id, isAdmin);
  }

  @Patch(':id/received')
  @ApiOperation({ summary: 'Khách hàng xác nhận đã nhận món thành công (khi DELIVERING)' })
  markAsReceived(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.ordersService.markAsReceived(id, user.id);
  }
}
