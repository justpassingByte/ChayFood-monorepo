import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUrl,
  IsInt,
  IsNumber,
  Min,
  Max,
  MaxLength,
  MinLength,
  IsArray,
  ArrayMaxSize,
} from 'class-validator';

export class UpdateUserProfileDto {
  @ApiProperty({ example: 'Nguyễn Văn A', required: false })
  @IsOptional()
  @IsString({ message: 'Họ tên phải là chuỗi ký tự' })
  @MinLength(2, { message: 'Họ tên phải có tối thiểu 2 ký tự' })
  @MaxLength(100, { message: 'Họ tên tối đa 100 ký tự' })
  name?: string;

  @ApiProperty({ example: '0901234567', required: false })
  @IsOptional()
  @IsString({ message: 'Số điện thoại phải là chuỗi ký tự' })
  @MaxLength(20, { message: 'Số điện thoại tối đa 20 ký tự' })
  phone?: string;

  @ApiProperty({ example: '123 Nguyễn Huệ, Quận 1, TP.HCM', required: false })
  @IsOptional()
  @IsString({ message: 'Địa chỉ phải là chuỗi ký tự' })
  @MaxLength(255, { message: 'Địa chỉ tối đa 255 ký tự' })
  address?: string;

  /**
   * Bắt buộc phải là định dạng URL hợp lệ để ngăn chặn lỗ hổng Stored XSS
   * khi hacker truyền payload độc hại dạng 'javascript:...' vào ảnh đại diện.
   */
  @ApiProperty({ example: 'https://...', required: false })
  @IsOptional()
  @IsUrl({}, { message: 'Đường dẫn ảnh đại diện không hợp lệ' })
  @MaxLength(1000, { message: 'Đường dẫn ảnh tối đa 1000 ký tự' })
  picture?: string;
}

export class AddressDto {
  @ApiProperty({ example: 'Nhà riêng', required: false })
  @IsOptional()
  @IsString({ message: 'Tên gợi nhớ địa chỉ phải là chuỗi' })
  @MaxLength(100, { message: 'Tên gợi nhớ tối đa 100 ký tự' })
  name?: string;

  @ApiProperty({ example: '123 Nguyễn Huệ' })
  @IsString({ message: 'Địa chỉ đường phố không được để trống' })
  @MaxLength(255, { message: 'Địa chỉ đường phố tối đa 255 ký tự' })
  street: string;

  @ApiProperty({ example: 'Hồ Chí Minh' })
  @IsString({ message: 'Thành phố không được để trống' })
  @MaxLength(100, { message: 'Thành phố tối đa 100 ký tự' })
  city: string;

  @ApiProperty({ example: 'Quận 1', required: false })
  @IsOptional()
  @IsString({ message: 'Quận huyện phải là chuỗi' })
  @MaxLength(100, { message: 'Quận huyện tối đa 100 ký tự' })
  state?: string;

  @ApiProperty({ example: '700000', required: false })
  @IsOptional()
  @IsString({ message: 'Mã bưu chính phải là chuỗi' })
  @MaxLength(20, { message: 'Mã bưu chính tối đa 20 ký tự' })
  postalCode?: string;

  @ApiProperty({ example: '0901234567', required: false })
  @IsOptional()
  @IsString({ message: 'Số điện thoại phải là chuỗi' })
  @MaxLength(20, { message: 'Số điện thoại tối đa 20 ký tự' })
  phone?: string;

  @ApiProperty({ example: 'Giao giờ hành chính', required: false })
  @IsOptional()
  @IsString({ message: 'Ghi chú giao hàng phải là chuỗi' })
  @MaxLength(500, { message: 'Ghi chú giao hàng tối đa 500 ký tự' })
  additionalInfo?: string;
}

/**
 * Ràng buộc dữ liệu sở thích dinh dưỡng & mục tiêu Macro:
 * Đặt chặn biên thực tế để ngăn chặn payload âm hoặc số cực lớn làm vỡ thuật toán
 * phân bổ thực đơn cá nhân hóa (Clinical Nutrition Engine ở PR #48).
 */
export class UpdateUserPreferenceDto {
  @ApiProperty({ example: 2000, required: false })
  @IsOptional()
  @IsInt({ message: 'Lượng calo phải là số nguyên' })
  @Min(500, { message: 'Lượng calo tối thiểu từ 500 kcal' })
  @Max(10000, { message: 'Lượng calo tối đa 10000 kcal' })
  maxCalories?: number;

  @ApiProperty({ example: 60, required: false })
  @IsOptional()
  @IsNumber({}, { message: 'Lượng đạm phải là số hợp lệ' })
  @Min(0, { message: 'Lượng đạm không được âm' })
  @Max(500, { message: 'Lượng đạm tối đa 500g' })
  minProtein?: number;

  @ApiProperty({ example: ['Đậu phộng', 'Gluten'], required: false })
  @IsOptional()
  @IsArray({ message: 'Danh sách nguyên liệu kiêng phải là mảng' })
  @IsString({ each: true, message: 'Từng nguyên liệu phải là chuỗi' })
  @ArrayMaxSize(50, { message: 'Danh sách nguyên liệu kiêng tối đa 50 mục' })
  dislikedIngredients?: string[];

  @ApiProperty({ example: ['CANH', 'MON_CHINH'], required: false })
  @IsOptional()
  @IsArray({ message: 'Danh sách danh mục yêu thích phải là mảng' })
  @IsString({ each: true, message: 'Từng danh mục phải là chuỗi' })
  @ArrayMaxSize(20, { message: 'Danh mục yêu thích tối đa 20 mục' })
  favoriteCategories?: string[];

  @ApiProperty({ example: ['VEGAN'], required: false })
  @IsOptional()
  @IsArray({ message: 'Danh sách chế độ ăn kiêng phải là mảng' })
  @IsString({ each: true, message: 'Từng chế độ ăn kiêng phải là chuỗi' })
  @ArrayMaxSize(20, { message: 'Chế độ ăn kiêng tối đa 20 mục' })
  dietaryRestrictions?: string[];
}

export class ChangePasswordDto {
  @ApiProperty({ example: 'oldPassword123' })
  @IsString({ message: 'Mật khẩu hiện tại không được để trống' })
  @MinLength(6, { message: 'Mật khẩu hiện tại tối thiểu 6 ký tự' })
  @MaxLength(100, { message: 'Mật khẩu hiện tại tối đa 100 ký tự' })
  currentPassword: string;

  @ApiProperty({ example: 'newPassword456' })
  @IsString({ message: 'Mật khẩu mới không được để trống' })
  @MinLength(6, { message: 'Mật khẩu mới tối thiểu 6 ký tự' })
  @MaxLength(100, { message: 'Mật khẩu mới tối đa 100 ký tự' })
  newPassword: string;
}

