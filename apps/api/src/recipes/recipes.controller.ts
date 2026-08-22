import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard, Roles } from '../auth/jwt.strategy';
import { Role } from '@chayfood/db';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto, QueryRecipeDto, UpdateRecipeDto } from './dto/recipe.dto';

@ApiTags('Recipes')
@Controller('recipes')
@UseGuards(JwtAuthGuard, RolesGuard) // 🛡️ Bảo vệ Class-level: Khóa 100% bí quyết nấu ăn gia truyền & báo cáo lãi/lỗ
@Roles(Role.ADMIN)                  // 🛡️ Bắt buộc quyền Quản trị viên (ADMIN)
@ApiBearerAuth()
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả công thức nấu ăn có phân trang và tìm kiếm (Admin)' })
  findAll(@Query() query: QueryRecipeDto) {
    return this.recipesService.findAll(query);
  }

  @Get('by-menu-item/:menuItemId')
  @ApiOperation({ summary: 'Lấy công thức theo ID món ăn kèm tính toán khẩu phần (Admin)' })
  findByMenuItemId(@Param('menuItemId') menuItemId: string, @Query('servings') servings?: number) {
    return this.recipesService.findByMenuItemId(menuItemId, servings ? Number(servings) : undefined);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết công thức, định lượng và phân tích Food Cost (Admin)' })
  findById(@Param('id') id: string, @Query('servings') servings?: number) {
    return this.recipesService.findById(id, servings ? Number(servings) : undefined);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo công thức mới cho món ăn (Admin)' })
  create(@Body() dto: CreateRecipeDto) {
    return this.recipesService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật công thức nấu ăn (Admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateRecipeDto) {
    return this.recipesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa công thức nấu ăn (Admin)' })
  delete(@Param('id') id: string) {
    return this.recipesService.delete(id);
  }
}
