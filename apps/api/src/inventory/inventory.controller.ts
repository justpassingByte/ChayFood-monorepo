import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard, Roles, CurrentUser, AuthenticatedUser } from '../auth/jwt.strategy';
import { Role } from '@chayfood/db';
import { InventoryService } from './inventory.service';
import {
  CreateIngredientDto,
  CreateStockTransactionDto,
  QueryIngredientDto,
  QueryStockTransactionDto,
  UpdateIngredientDto,
} from './dto/inventory.dto';

@ApiTags('Inventory')
@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard) // 🛡️ Bảo vệ Class-level: Khóa 100% routes, chống lộ bí mật kinh doanh & giá vốn
@Roles(Role.ADMIN)                  // 🛡️ Bắt buộc quyền Quản trị viên (ADMIN)
@ApiBearerAuth()
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách nguyên vật liệu kho (Admin)' })
  findAll(@Query() query: QueryIngredientDto) {
    return this.inventoryService.findAll(query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Thống kê tổng quan giá trị và số lượng tồn kho (Admin)' })
  getStats() {
    return this.inventoryService.getOverviewStats();
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Xem lịch sử biến động kho có phân trang và bộ lọc (Admin)' })
  getTransactions(@Query() query: QueryStockTransactionDto) {
    return this.inventoryService.getTransactions(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết nguyên liệu và lịch sử giao dịch (Admin)' })
  findById(@Param('id') id: string) {
    return this.inventoryService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo mới nguyên vật liệu (Admin)' })
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateIngredientDto) {
    const performer = user?.name ? `${user.name} (${user.email})` : user?.email || 'Admin';
    return this.inventoryService.create(dto, performer);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin nguyên liệu (Admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateIngredientDto) {
    return this.inventoryService.update(id, dto);
  }

  @Post('transactions')
  @ApiOperation({ summary: 'Tạo phiếu Nhập / Xuất / Kiểm kê kho ACID (Admin)' })
  createTransaction(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateStockTransactionDto) {
    const performer = user?.name ? `${user.name} (${user.email})` : user?.email || 'Admin';
    return this.inventoryService.createTransaction(dto, performer);
  }
}
