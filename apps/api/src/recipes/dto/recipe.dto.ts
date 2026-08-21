import { ApiProperty, ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import {
  CreateRecipeInput,
  CreateRecipeItemInput,
  IngredientUnit,
  QueryRecipeInput,
  RecipeStepInput,
} from '@chayfood/shared-types';

export class RecipeStepDto implements RecipeStepInput {
  @ApiProperty({ example: 1, description: 'Số thứ tự bước thực hiện' })
  @IsInt()
  @Min(1)
  @Max(100)
  stepNumber: number;

  @ApiProperty({ example: 'Sơ chế đậu hũ', description: 'Tiêu đề bước nấu' })
  @IsString()
  @IsNotEmpty({ message: 'Tiêu đề bước không được để trống' })
  @MaxLength(150, { message: 'Tiêu đề bước tối đa 150 ký tự' })
  title: string;

  @ApiProperty({ example: 'Cắt đậu hũ non thành khối vuông 3x3cm', description: 'Mô tả chi tiết kỹ thuật' })
  @IsString()
  @IsNotEmpty({ message: 'Mô tả bước không được để trống' })
  @MaxLength(1000, { message: 'Mô tả bước tối đa 1000 ký tự' })
  description: string;

  @ApiPropertyOptional({ example: 5, description: 'Thời gian thực hiện (phút)' })
  @IsNumber()
  @Min(0)
  @Max(1440, { message: 'Thời gian tối đa 1440 phút (24 giờ)' })
  @IsOptional()
  timeInMinutes?: number;
}

export class CreateRecipeItemDto implements CreateRecipeItemInput {
  @ApiProperty({ example: 'ing-uuid-123', description: 'Mã định danh nguyên liệu kho' })
  @IsString()
  @IsNotEmpty({ message: 'Mã nguyên liệu không được để trống' })
  ingredientId: string;

  @ApiProperty({ example: 200, description: 'Định lượng theo đơn vị tính' })
  @IsNumber()
  @Min(0.001, { message: 'Định lượng nguyên liệu tối thiểu là 0.001' })
  @Max(1000000, { message: 'Định lượng nguyên liệu tối đa là 1.000.000' })
  quantity: number;

  @ApiProperty({ enum: IngredientUnit, default: IngredientUnit.GRAM, description: 'Đơn vị tính công thức' })
  @IsEnum(IngredientUnit, { message: 'Đơn vị tính không hợp lệ' })
  unit: IngredientUnit;

  @ApiPropertyOptional({ default: false, description: 'Nguyên liệu tùy chọn (không bắt buộc)' })
  @IsBoolean()
  @IsOptional()
  isOptional?: boolean;

  @ApiPropertyOptional({ example: 'Ưu tiên đậu non mềm', description: 'Ghi chú sơ chế riêng' })
  @IsString()
  @MaxLength(200, { message: 'Ghi chú nguyên liệu tối đa 200 ký tự' })
  @IsOptional()
  notes?: string;
}

export class CreateRecipeDto implements CreateRecipeInput {
  @ApiProperty({ example: 'menu-item-uuid-123', description: 'Mã món ăn liên kết (Quan hệ 1-1)' })
  @IsString()
  @IsNotEmpty({ message: 'Mã món ăn không được để trống' })
  menuItemId: string;

  @ApiProperty({ example: 'Công Thức Chuẩn: Đậu Sốt Nấm Đông Cô', description: 'Tên công thức định lượng' })
  @IsString()
  @IsNotEmpty({ message: 'Tên công thức không được để trống' })
  @MaxLength(150, { message: 'Tên công thức tối đa 150 ký tự' })
  name: string;

  @ApiPropertyOptional({ example: 'Quy trình chuẩn hóa nhà bếp ChayFood', description: 'Mô tả tổng quan' })
  @IsString()
  @MaxLength(1000, { message: 'Mô tả công thức tối đa 1000 ký tự' })
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 10, default: 15, description: 'Thời gian sơ chế (phút)' })
  @IsNumber()
  @Min(0)
  @Max(1440, { message: 'Thời gian sơ chế tối đa 1440 phút (24 giờ)' })
  @IsOptional()
  prepTimeMinutes?: number;

  @ApiPropertyOptional({ example: 15, default: 15, description: 'Thời gian nấu chính (phút)' })
  @IsNumber()
  @Min(0)
  @Max(1440, { message: 'Thời gian nấu tối đa 1440 phút (24 giờ)' })
  @IsOptional()
  cookTimeMinutes?: number;

  @ApiPropertyOptional({ example: 1, default: 1, description: 'Số khẩu phần ăn chuẩn' })
  @IsNumber()
  @Min(1, { message: 'Khẩu phần ăn tối thiểu cho 1 người' })
  @Max(100, { message: 'Khẩu phần ăn tối đa cho 100 người' })
  @IsOptional()
  servingSize?: number;

  @ApiPropertyOptional({ type: [RecipeStepDto], description: 'Quy trình các bước nấu ăn' })
  @IsArray()
  @ArrayMaxSize(50, { message: 'Tối đa 50 bước thực hiện quy trình' })
  @ValidateNested({ each: true })
  @Type(() => RecipeStepDto)
  @IsOptional()
  instructions?: RecipeStepDto[];

  @ApiPropertyOptional({ example: 'Bảo quản nước sốt dưới 5 độ C', description: 'Ghi chú quan trọng' })
  @IsString()
  @MaxLength(500, { message: 'Ghi chú công thức tối đa 500 ký tự' })
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ type: [CreateRecipeItemDto], description: 'Danh sách định lượng nguyên liệu' })
  @IsArray()
  @ArrayMaxSize(50, { message: 'Công thức tối đa 50 nguyên liệu' })
  @ValidateNested({ each: true })
  @Type(() => CreateRecipeItemDto)
  @IsOptional()
  items?: CreateRecipeItemDto[];
}

export class UpdateRecipeDto extends PartialType(OmitType(CreateRecipeDto, ['menuItemId'] as const)) {}

export class QueryRecipeDto implements QueryRecipeInput {
  @ApiPropertyOptional({ example: 'Súp nấm', description: 'Từ khóa tìm kiếm theo tên công thức hoặc món ăn' })
  @IsString()
  @MaxLength(100, { message: 'Từ khóa tìm kiếm tối đa 100 ký tự' })
  @IsOptional()
  query?: string;

  @ApiPropertyOptional({ example: 1, default: 1, description: 'Số thứ tự trang' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ example: 20, default: 20, description: 'Số lượng công thức trên mỗi trang' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100, { message: 'Số lượng mỗi trang tối đa 100 bản ghi' })
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ example: 10, description: 'Tính toán định lượng theo số lượng khẩu phần (Batch Scaling)' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1000, { message: 'Số khẩu phần tính toán tối đa 1000 suất' })
  @IsOptional()
  servings?: number;
}
