import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { IngredientUnit } from '@chayfood/shared-types';

export class RecipeStepDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  stepNumber: number;

  @ApiProperty({ example: 'Sơ chế đậu hũ' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Cắt đậu hũ non thành khối vuông 3x3cm' })
  @IsString()
  description: string;

  @ApiPropertyOptional({ example: 5 })
  @IsNumber()
  @IsOptional()
  timeInMinutes?: number;
}

export class CreateRecipeItemDto {
  @ApiProperty({ example: 'ing-uuid-123' })
  @IsString()
  ingredientId: string;

  @ApiProperty({ example: 200, description: 'Định lượng theo đơn vị tính' })
  @IsNumber()
  @Min(0.01)
  quantity: number;

  @ApiProperty({ enum: IngredientUnit, default: IngredientUnit.GRAM })
  @IsEnum(IngredientUnit)
  unit: IngredientUnit;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  isOptional?: boolean;

  @ApiPropertyOptional({ example: 'Ưu tiên đậu non mềm' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreateRecipeDto {
  @ApiProperty({ example: 'menu-item-uuid-123' })
  @IsString()
  menuItemId: string;

  @ApiProperty({ example: 'Công Thức Chuẩn: Đậu Sốt Nấm Đông Cô' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Quy trình chuẩn hóa nhà bếp' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 10 })
  @IsNumber()
  @IsOptional()
  prepTimeMinutes?: number;

  @ApiPropertyOptional({ example: 15 })
  @IsNumber()
  @IsOptional()
  cookTimeMinutes?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @IsOptional()
  servingSize?: number;

  @ApiPropertyOptional({ type: [RecipeStepDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipeStepDto)
  @IsOptional()
  instructions?: RecipeStepDto[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ type: [CreateRecipeItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRecipeItemDto)
  @IsOptional()
  items?: CreateRecipeItemDto[];
}

export class UpdateRecipeDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  prepTimeMinutes?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  cookTimeMinutes?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  servingSize?: number;

  @ApiPropertyOptional({ type: [RecipeStepDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipeStepDto)
  @IsOptional()
  instructions?: RecipeStepDto[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ type: [CreateRecipeItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRecipeItemDto)
  @IsOptional()
  items?: CreateRecipeItemDto[];
}
