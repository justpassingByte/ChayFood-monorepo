import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RecommendationsService } from './recommendations.service';
import { UpdatePreferenceDto } from './dto/preference.dto';
import { JwtAuthGuard, CurrentUser, AuthenticatedUser } from '../auth/jwt.strategy';

@ApiTags('Recommendations & Preferences')
@Controller('recommendations')
export class RecommendationsController {
  constructor(private recommendationsService: RecommendationsService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách món ăn gợi ý theo sở thích cá nhân' })
  getRecommendations() {
    return this.recommendationsService.getRecommendations();
  }

  @Put('preferences')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật sở thích dinh dưỡng của người dùng' })
  updatePreference(@CurrentUser() user: AuthenticatedUser, @Body() dto: UpdatePreferenceDto) {
    return this.recommendationsService.updatePreference(user.id, dto);
  }
}
