import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserProfileDto {
  @ApiProperty({ example: 'Nguyễn Văn A', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: '0901234567', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: '123 Nguyễn Huệ, Quận 1, TP.HCM', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'https://...', required: false })
  @IsOptional()
  @IsString()
  picture?: string;
}

export class AddressDto {
  @ApiProperty({ example: 'Nhà riêng', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: '123 Nguyễn Huệ' })
  @IsString()
  street: string;

  @ApiProperty({ example: 'Hồ Chí Minh' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'Quận 1', required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ example: '700000', required: false })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiProperty({ example: '0901234567', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'Giao giờ hành chính', required: false })
  @IsOptional()
  @IsString()
  additionalInfo?: string;
}

export class UpdateUserPreferenceDto {
  @ApiProperty({ example: 2000, required: false })
  @IsOptional()
  maxCalories?: number;

  @ApiProperty({ example: 60, required: false })
  @IsOptional()
  minProtein?: number;

  @ApiProperty({ example: ['Đậu phộng', 'Gluten'], required: false })
  @IsOptional()
  dislikedIngredients?: string[];

  @ApiProperty({ example: ['CANH', 'MON_CHINH'], required: false })
  @IsOptional()
  favoriteCategories?: string[];

  @ApiProperty({ example: ['VEGAN'], required: false })
  @IsOptional()
  dietaryRestrictions?: string[];
}

export class ChangePasswordDto {
  @ApiProperty({ example: 'oldPassword123' })
  @IsString()
  currentPassword: string;

  @ApiProperty({ example: 'newPassword456' })
  @IsString()
  newPassword: string;
}

