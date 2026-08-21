import { ApiProperty, PartialType } from '@nestjs/swagger';
import { MenuCategory } from '@chayfood/db';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  ArrayMaxSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMenuItemDto {
  @ApiProperty({ example: 'Cơm Tấm Sườn Bì Chả Chay' })
  @IsString({ message: 'Tên món ăn phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Tên món ăn không được để trống' })
  @MaxLength(150, { message: 'Tên món ăn tối đa 150 ký tự' })
  name: string;

  @ApiProperty({ example: 'Đĩa cơm tấm thơm ngon với sườn non chay...' })
  @IsString({ message: 'Mô tả món ăn phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Mô tả món ăn không được để trống' })
  @MaxLength(1000, { message: 'Mô tả món ăn tối đa 1000 ký tự' })
  description: string;

  @ApiProperty({ example: 45000 })
  @IsNumber({}, { message: 'Giá món ăn phải là số' })
  @Min(1000, { message: 'Giá món ăn tối thiểu 1000đ' })
  @Max(100000000, { message: 'Giá món ăn tối đa 100 triệu đồng' })
  price: number;

  @ApiProperty({ enum: MenuCategory, default: MenuCategory.MAIN })
  @IsEnum(MenuCategory, { message: 'Danh mục món ăn không hợp lệ' })
  category: MenuCategory;

  @ApiProperty({ example: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600' })
  @IsUrl({}, { message: 'Đường dẫn hình ảnh phải là URL hợp lệ' })
  @MaxLength(1000, { message: 'Đường dẫn hình ảnh tối đa 1000 ký tự' })
  image: string;

  @ApiProperty({ example: 480, required: false, default: 400 })
  @IsOptional()
  @IsNumber({}, { message: 'Lượng calo phải là số' })
  @Min(0, { message: 'Lượng calo không được âm' })
  @Max(10000, { message: 'Lượng calo tối đa 10000 kcal' })
  calories?: number;

  @ApiProperty({ example: 18.5, required: false, default: 15 })
  @IsOptional()
  @IsNumber({}, { message: 'Lượng đạm phải là số' })
  @Min(0, { message: 'Lượng đạm không được âm' })
  @Max(1000, { message: 'Lượng đạm tối đa 1000g' })
  protein?: number;

  @ApiProperty({ example: 65, required: false, default: 55 })
  @IsOptional()
  @IsNumber({}, { message: 'Lượng carbs phải là số' })
  @Min(0, { message: 'Lượng carbs không được âm' })
  @Max(1000, { message: 'Lượng carbs tối đa 1000g' })
  carbs?: number;

  @ApiProperty({ example: 12, required: false, default: 10 })
  @IsOptional()
  @IsNumber({}, { message: 'Lượng chất béo phải là số' })
  @Min(0, { message: 'Lượng chất béo không được âm' })
  @Max(1000, { message: 'Lượng chất béo tối đa 1000g' })
  fat?: number;

  @ApiProperty({ example: true, required: false, default: true })
  @IsOptional()
  @IsBoolean({ message: 'Trạng thái phục vụ phải là boolean' })
  isAvailable?: boolean;

  @ApiProperty({ example: 15, required: false, default: 15 })
  @IsOptional()
  @IsInt({ message: 'Thời gian chuẩn bị phải là số nguyên' })
  @Min(1, { message: 'Thời gian chuẩn bị tối thiểu 1 phút' })
  @Max(1440, { message: 'Thời gian chuẩn bị tối đa 1440 phút' })
  preparationTime?: number;

  @ApiProperty({ example: ['Gạo tấm', 'Sườn chay', 'Đậu hũ'], required: false })
  @IsOptional()
  @IsArray({ message: 'Danh sách nguyên liệu phải là mảng' })
  @ArrayMaxSize(50, { message: 'Danh sách nguyên liệu tối đa 50 mục' })
  @MaxLength(100, { each: true, message: 'Tên mỗi nguyên liệu tối đa 100 ký tự' })
  ingredients?: string[];

  @ApiProperty({ example: ['Đậu nành'], required: false })
  @IsOptional()
  @IsArray({ message: 'Danh sách dị ứng phải là mảng' })
  @ArrayMaxSize(50, { message: 'Danh sách dị ứng tối đa 50 mục' })
  @MaxLength(100, { each: true, message: 'Tên mỗi chất dị ứng tối đa 100 ký tự' })
  allergens?: string[];
}

export class UpdateMenuItemDto extends PartialType(CreateMenuItemDto) {}

export class QueryMenuDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'Danh mục món ăn phải là chuỗi ký tự' })
  @MaxLength(50, { message: 'Tên danh mục tối đa 50 ký tự' })
  category?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'Từ khóa tìm kiếm phải là chuỗi ký tự' })
  @MaxLength(100, { message: 'Từ khóa tìm kiếm tối đa 100 ký tự' })
  query?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Lượng calo tối thiểu phải là số' })
  @Min(0, { message: 'Lượng calo tối thiểu không được âm' })
  @Max(10000, { message: 'Lượng calo tối thiểu tối đa 10000 kcal' })
  minCalories?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Lượng calo tối đa phải là số' })
  @Min(0, { message: 'Lượng calo tối đa không được âm' })
  @Max(10000, { message: 'Lượng calo tối đa 10000 kcal' })
  maxCalories?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Lượng đạm tối thiểu phải là số' })
  @Min(0, { message: 'Lượng đạm tối thiểu không được âm' })
  @Max(1000, { message: 'Lượng đạm tối thiểu tối đa 1000g' })
  minProtein?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Lượng đạm tối đa phải là số' })
  @Min(0, { message: 'Lượng đạm tối đa không được âm' })
  @Max(1000, { message: 'Lượng đạm tối đa 1000g' })
  maxProtein?: number;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Số trang phải là số nguyên' })
  @Min(1, { message: 'Số trang tối thiểu là 1' })
  page?: number = 1;

  @ApiProperty({ required: false, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Số lượng mỗi trang phải là số nguyên' })
  @Min(1, { message: 'Số lượng mỗi trang tối thiểu là 1' })
  @Max(100, { message: 'Số lượng mỗi trang tối đa là 100 món' })
  limit?: number = 20;
}
