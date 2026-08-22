import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PlansService } from './plans.service';
import { CreatePlanDto } from './dto/plan.dto';
import { JwtAuthGuard, RolesGuard, Roles } from '../auth/jwt.strategy';
import { Role } from '@chayfood/db';

@ApiTags('Meal Plans')
@Controller('plans')
export class PlansController {
  constructor(private plansService: PlansService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách các gói ăn chay (Weekly / Monthly Plans)' })
  findAll() {
    return this.plansService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết gói ăn theo ID' })
  findById(@Param('id') id: string) {
    return this.plansService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo gói ăn mới (Admin)' })
  create(@Body() dto: CreatePlanDto) {
    return this.plansService.create(dto);
  }
}
