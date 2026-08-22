import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RecommendationsService } from './recommendations.service';
import { UpdatePreferenceDto } from './dto/preference.dto';
import {
  JwtAuthGuard,
  OptionalJwtAuthGuard,
  CurrentUser,
  AuthenticatedUser,
} from '../auth/jwt.strategy';

@ApiTags('Recommendations & Preferences')
@Controller('recommendations')
export class RecommendationsController {
  constructor(private recommendationsService: RecommendationsService) {}

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Lấy danh sách món ăn gợi ý theo sở thích cá nhân' })
  getRecommendations(@CurrentUser() user?: AuthenticatedUser) {
    return this.recommendationsService.getRecommendations(user?.id);
  }

  @Put('preferences')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật sở thích dinh dưỡng của người dùng' })
  updatePreference(@CurrentUser() user: AuthenticatedUser, @Body() dto: UpdatePreferenceDto) {
    return this.recommendationsService.updatePreference(user.id, dto);
  }
}

