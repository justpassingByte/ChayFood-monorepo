import { ApiProperty } from '@nestjs/swagger';
import { MenuCategory } from '@chayfood/db';
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMenuItemDto {
  @ApiProperty({ example: 'Cơm Tấm Sườn Bì Chả Chay' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Đĩa cơm tấm thơm ngon với sườn non chay...' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 45000 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ enum: MenuCategory, default: MenuCategory.MAIN })
  @IsEnum(MenuCategory)
  category: MenuCategory;

  @ApiProperty({ example: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600' })
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty({ example: 480, required: false })
  @IsOptional()
  @IsNumber()
  calories?: number;

  @ApiProperty({ example: 18.5, required: false })
  @IsOptional()
  @IsNumber()
  protein?: number;

  @ApiProperty({ example: 65, required: false })
  @IsOptional()
  @IsNumber()
  carbs?: number;

  @ApiProperty({ example: 12, required: false })
  @IsOptional()
  @IsNumber()
  fat?: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @ApiProperty({ example: 15, required: false })
  @IsOptional()
  @IsNumber()
  preparationTime?: number;

  @ApiProperty({ example: ['Gạo tấm', 'Sườn chay', 'Đậu hũ'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ingredients?: string[];

  @ApiProperty({ example: ['Đậu nành'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allergens?: string[];
}

export class UpdateMenuItemDto extends CreateMenuItemDto {}

export class QueryMenuDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  query?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minCalories?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxCalories?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minProtein?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxProtein?: number;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @ApiProperty({ required: false, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 20;
}
