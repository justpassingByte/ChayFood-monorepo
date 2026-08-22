import {
  Body,
  Controller,
  Get,
  Put,
  Post,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import {
  UpdateUserProfileDto,
  AddressDto,
  UpdateUserPreferenceDto,
  ChangePasswordDto,
} from './dto/user.dto';
import { JwtAuthGuard, CurrentUser, AuthenticatedUser } from '../auth/jwt.strategy';

@ApiTags('User')
@Controller('user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile/full')
  @ApiOperation({ summary: 'Lấy hồ sơ đầy đủ của người dùng (bao gồm địa chỉ, gia đình, sở thích)' })
  getFullProfile(@CurrentUser() user: AuthenticatedUser) {
    return this.userService.getFullProfile(user.id);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Lấy hồ sơ người dùng' })
  getProfile(@CurrentUser() user: AuthenticatedUser) {
    return this.userService.getFullProfile(user.id);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Cập nhật hồ sơ người dùng' })
  updateProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateUserProfileDto,
  ) {
    return this.userService.updateProfile(user.id, dto);
  }

  @Get('addresses')
  @ApiOperation({ summary: 'Lấy danh sách địa chỉ đã lưu của người dùng' })
  getAddresses(@CurrentUser() user: AuthenticatedUser) {
    return this.userService.getAddresses(user.id);
  }

  @Post('addresses')
  @ApiOperation({ summary: 'Thêm hoặc cập nhật địa chỉ giao hàng' })
  addAddress(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: AddressDto,
  ) {
    return this.userService.addAddress(user.id, dto);
  }

  @Put('addresses/:id')
  @ApiOperation({ summary: 'Cập nhật địa chỉ giao hàng' })
  updateAddress(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: AddressDto,
  ) {
    return this.userService.addAddress(user.id, dto);
  }

  @Delete('addresses/:id')
  @ApiOperation({ summary: 'Xóa địa chỉ giao hàng' })
  deleteAddress(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') addressId: string,
  ) {
    return this.userService.deleteAddress(user.id, addressId);
  }

  @Put('preference')
  @ApiOperation({ summary: 'Cập nhật sở thích dinh dưỡng & mục tiêu Macro' })
  updatePreference(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateUserPreferenceDto,
  ) {
    return this.userService.updatePreference(user.id, dto);
  }

  @Put('password')
  @ApiOperation({ summary: 'Đổi mật khẩu tài khoản' })
  changePassword(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.userService.changePassword(user.id, dto);
  }
}
