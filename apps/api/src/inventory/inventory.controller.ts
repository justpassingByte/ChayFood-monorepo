import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard, Roles } from '../auth/jwt.strategy';
import { Role } from '@chayfood/db';
import { InventoryService } from './inventory.service';
import { CreateIngredientDto, CreateStockTransactionDto, QueryIngredientDto, UpdateIngredientDto } from './dto/inventory.dto';

@ApiTags('Inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách nguyên vật liệu kho' })
  findAll(@Query() query: QueryIngredientDto) {
    return this.inventoryService.findAll(query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Thống kê tổng quan kho' })
  getStats() {
    return this.inventoryService.getOverviewStats();
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Xem lịch sử biến động kho' })
  getTransactions(@Query('ingredientId') ingredientId?: string, @Query('limit') limit?: number) {
    return this.inventoryService.getTransactions(ingredientId, limit ? Number(limit) : 50);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết nguyên liệu và lịch sử' })
  findById(@Param('id') id: string) {
    return this.inventoryService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo mới nguyên vật liệu (Admin)' })
  create(@Body() dto: CreateIngredientDto) {
    return this.inventoryService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật thông tin nguyên liệu (Admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateIngredientDto) {
    return this.inventoryService.update(id, dto);
  }

  @Post('transactions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo phiếu Nhập / Xuất / Kiểm kê kho (Admin)' })
  createTransaction(@Body() dto: CreateStockTransactionDto) {
    return this.inventoryService.createTransaction(dto);
  }
}
