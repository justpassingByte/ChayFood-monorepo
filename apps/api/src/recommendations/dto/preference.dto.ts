import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePreferenceDto {
  @ApiProperty({ example: ['main', 'side'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  favoriteCategories?: string[];

  @ApiProperty({ example: ['hành tây', 'ớt'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dislikedIngredients?: string[];

  @ApiProperty({ example: 15.0, required: false })
  @IsOptional()
  @IsNumber()
  minProtein?: number;

  @ApiProperty({ example: 500, required: false })
  @IsOptional()
  @IsNumber()
  maxCalories?: number;

  @ApiProperty({ example: ['không dầu mỡ', 'thuần chay'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dietaryRestrictions?: string[];
}
