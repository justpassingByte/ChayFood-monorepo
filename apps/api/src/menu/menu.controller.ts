import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { CreateMenuItemDto, QueryMenuDto, UpdateMenuItemDto } from './dto/menu.dto';
import { JwtAuthGuard, RolesGuard, Roles } from '../auth/jwt.strategy';
import { Role } from '@chayfood/db';

@ApiTags('Menu Items')
@Controller('menu')
export class MenuController {
  constructor(private menuService: MenuService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách món ăn chay (hỗ trợ phân trang, lọc calo, protein, danh mục)' })
  findAll(@Query() query: QueryMenuDto) {
    return this.menuService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết một món ăn theo ID' })
  findById(@Param('id') id: string) {
    return this.menuService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Thêm món ăn mới (Yêu cầu quyền Admin)' })
  create(@Body() dto: CreateMenuItemDto) {
    return this.menuService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật món ăn (Yêu cầu quyền Admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateMenuItemDto) {
    return this.menuService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa món ăn (Yêu cầu quyền Admin)' })
  remove(@Param('id') id: string) {
    return this.menuService.remove(id);
  }
}
