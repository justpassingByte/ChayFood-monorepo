import { ApiProperty } from '@nestjs/swagger';
import { UpdatePreferenceInput } from '@chayfood/shared-types';
import {
  ArrayMaxSize,
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

/**
 * 🌟 DTO cập nhật sở thích dinh dưỡng (Recommendation Preferences DTO):
 * - Implements UpdatePreferenceInput từ Zod SSOT Schema.
 * - Giới hạn calo, protein và độ dài mảng chống DoS.
 */
export class UpdatePreferenceDto implements UpdatePreferenceInput {
  @ApiProperty({ example: ['main', 'side'], required: false })
  @IsOptional()
  @IsArray({ message: 'Danh mục yêu thích phải là mảng chuỗi' })
  @ArrayMaxSize(20, { message: 'Tối đa 20 danh mục yêu thích' })
  @IsString({ each: true, message: 'Mỗi danh mục phải là chuỗi ký tự' })
  @MaxLength(50, { each: true, message: 'Tên danh mục tối đa 50 ký tự' })
  favoriteCategories?: string[];

  @ApiProperty({ example: ['hành tây', 'ớt'], required: false })
  @IsOptional()
  @IsArray({ message: 'Nguyên liệu kiêng kị phải là mảng chuỗi' })
  @ArrayMaxSize(30, { message: 'Tối đa 30 nguyên liệu kiêng kị' })
  @IsString({ each: true, message: 'Mỗi nguyên liệu phải là chuỗi ký tự' })
  @MaxLength(100, { each: true, message: 'Tên nguyên liệu tối đa 100 ký tự' })
  dislikedIngredients?: string[];

  @ApiProperty({ example: 15.0, required: false })
  @IsOptional()
  @IsNumber({}, { message: 'Lượng đạm tối thiểu phải là số' })
  @Min(0, { message: 'Lượng đạm tối thiểu không được âm' })
  @Max(300, { message: 'Lượng đạm tối thiểu tối đa 300g' })
  minProtein?: number;

  @ApiProperty({ example: 500, required: false })
  @IsOptional()
  @IsInt({ message: 'Lượng calo phải là số nguyên' })
  @Min(0, { message: 'Lượng calo tối đa không được âm' })
  @Max(5000, { message: 'Lượng calo tối đa 5000 kcal' })
  maxCalories?: number;

  @ApiProperty({ example: ['không dầu mỡ', 'thuần chay'], required: false })
  @IsOptional()
  @IsArray({ message: 'Ràng buộc ăn kiêng phải là mảng chuỗi' })
  @ArrayMaxSize(20, { message: 'Tối đa 20 ràng buộc ăn kiêng' })
  @IsString({ each: true, message: 'Mỗi ràng buộc phải là chuỗi ký tự' })
  @MaxLength(100, { each: true, message: 'Tên ràng buộc tối đa 100 ký tự' })
  dietaryRestrictions?: string[];
}

