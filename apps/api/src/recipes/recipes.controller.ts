import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard, Roles } from '../auth/jwt.strategy';
import { Role } from '@chayfood/db';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto, UpdateRecipeDto } from './dto/recipe.dto';

@ApiTags('Recipes')
@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả công thức nấu ăn' })
  findAll(@Query('query') query?: string) {
    return this.recipesService.findAll(query);
  }

  @Get('by-menu-item/:menuItemId')
  @ApiOperation({ summary: 'Lấy công thức theo ID món ăn' })
  findByMenuItemId(@Param('menuItemId') menuItemId: string) {
    return this.recipesService.findByMenuItemId(menuItemId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết công thức và phân tích Food Cost' })
  findById(@Param('id') id: string) {
    return this.recipesService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo công thức mới cho món ăn (Admin)' })
  create(@Body() dto: CreateRecipeDto) {
    return this.recipesService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật công thức nấu ăn (Admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateRecipeDto) {
    return this.recipesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa công thức nấu ăn (Admin)' })
  delete(@Param('id') id: string) {
    return this.recipesService.delete(id);
  }
}
