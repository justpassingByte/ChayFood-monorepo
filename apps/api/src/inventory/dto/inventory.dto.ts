import { ApiProperty, ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IngredientUnit, StockTransactionType } from '@chayfood/db';

export class CreateIngredientDto {
  @ApiProperty({ example: 'Đậu Hũ Non Hữu Cơ' })
  @IsString({ message: 'Tên nguyên liệu phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Tên nguyên liệu không được để trống' })
  @MaxLength(150, { message: 'Tên nguyên liệu tối đa 150 ký tự' })
  name: string;

  @ApiProperty({ example: 'ING_DAU_HU' })
  @IsString({ message: 'Mã nguyên liệu phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Mã nguyên liệu không được để trống' })
  @MaxLength(50, { message: 'Mã nguyên liệu tối đa 50 ký tự' })
  code: string;

  @ApiProperty({ enum: IngredientUnit, default: IngredientUnit.GRAM })
  @IsEnum(IngredientUnit, { message: 'Đơn vị tính nguyên liệu không hợp lệ' })
  unit: IngredientUnit;

  @ApiPropertyOptional({ example: 10000, default: 0 })
  @IsNumber({}, { message: 'Số lượng tồn ban đầu phải là số' })
  @IsOptional()
  @Min(0, { message: 'Số lượng tồn ban đầu không được âm' })
  @Max(10000000, { message: 'Số lượng tồn ban đầu tối đa 10 triệu đơn vị' })
  currentStock?: number;

  @ApiPropertyOptional({ example: 2000, default: 0 })
  @IsNumber({}, { message: 'Định mức tồn tối thiểu phải là số' })
  @IsOptional()
  @Min(0, { message: 'Định mức tồn tối thiểu không được âm' })
  @Max(10000000, { message: 'Định mức tồn tối thiểu tối đa 10 triệu đơn vị' })
  minThreshold?: number;

  @ApiProperty({ example: 40, description: 'Giá nhập trên 1 đơn vị tính (VND)' })
  @IsNumber({}, { message: 'Giá vốn phải là số' })
  @Min(0, { message: 'Giá vốn không được âm' })
  @Max(100000000, { message: 'Giá vốn tối đa 100 triệu đồng trên 1 đơn vị' })
  costPerUnit: number;

  @ApiPropertyOptional({ example: 'HTX Nông Trại Xanh' })
  @IsString({ message: 'Nhà cung cấp phải là chuỗi ký tự' })
  @IsOptional()
  @MaxLength(200, { message: 'Tên nhà cung cấp tối đa 200 ký tự' })
  supplier?: string;

  @ApiPropertyOptional({ example: 'Đạm thực vật' })
  @IsString({ message: 'Danh mục phải là chuỗi ký tự' })
  @IsOptional()
  @MaxLength(100, { message: 'Tên danh mục tối đa 100 ký tự' })
  category?: string;

  @ApiPropertyOptional({ default: true })
  @IsBoolean({ message: 'Trạng thái phục vụ phải là boolean' })
  @IsOptional()
  isAvailable?: boolean;
}

/**
 * UpdateIngredientDto: Kế thừa CreateIngredientDto nhưng loại bỏ hoàn toàn trường currentStock
 * Bắt buộc 100% mọi biến động tồn kho phải đi qua createTransaction (Bảo toàn Audit Trail kế toán)
 */
export class UpdateIngredientDto extends PartialType(
  OmitType(CreateIngredientDto, ['currentStock'] as const),
) {}

export class CreateStockTransactionDto {
  @ApiProperty({ example: 'ing-uuid-123' })
  @IsString({ message: 'ID nguyên liệu phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'ID nguyên liệu không được để trống' })
  @MaxLength(100, { message: 'ID nguyên liệu tối đa 100 ký tự' })
  ingredientId: string;

  @ApiProperty({ enum: StockTransactionType, example: StockTransactionType.IMPORT })
  @IsEnum(StockTransactionType, { message: 'Loại giao dịch kho không hợp lệ' })
  type: StockTransactionType;

  @ApiProperty({ example: 5000, description: 'Số lượng nhập/xuất' })
  @IsNumber({}, { message: 'Số lượng giao dịch phải là số' })
  @Min(0, { message: 'Số lượng giao dịch không được âm' })
  @Max(10000000, { message: 'Số lượng giao dịch tối đa 10 triệu đơn vị' })
  quantity: number;

  @ApiPropertyOptional({ example: 45, description: 'Đơn giá nhập thực tế' })
  @IsNumber({}, { message: 'Đơn giá phải là số' })
  @IsOptional()
  @Min(0, { message: 'Đơn giá không được âm' })
  @Max(100000000, { message: 'Đơn giá tối đa 100 triệu đồng' })
  unitCost?: number;

  @ApiPropertyOptional({ example: 'INV-2026-001', description: 'Mã hóa đơn / Phiếu giao hàng NCC' })
  @IsString({ message: 'Mã tham chiếu phải là chuỗi ký tự' })
  @IsOptional()
  @MaxLength(100, { message: 'Mã tham chiếu tối đa 100 ký tự' })
  referenceId?: string;

  @ApiPropertyOptional({ example: 'Nhập hàng từ NCC' })
  @IsString({ message: 'Ghi chú phải là chuỗi ký tự' })
  @IsOptional()
  @MaxLength(500, { message: 'Ghi chú tối đa 500 ký tự' })
  notes?: string;

  @ApiPropertyOptional({ example: 'Admin' })
  @IsString({ message: 'Người thực hiện phải là chuỗi ký tự' })
  @IsOptional()
  @MaxLength(100, { message: 'Người thực hiện tối đa 100 ký tự' })
  performedBy?: string;
}

export class QueryIngredientDto {
  @ApiPropertyOptional()
  @IsString({ message: 'Từ khóa tìm kiếm phải là chuỗi ký tự' })
  @IsOptional()
  @MaxLength(100, { message: 'Từ khóa tìm kiếm tối đa 100 ký tự' })
  query?: string;

  @ApiPropertyOptional()
  @IsString({ message: 'Danh mục phải là chuỗi ký tự' })
  @IsOptional()
  @MaxLength(100, { message: 'Tên danh mục tối đa 100 ký tự' })
  category?: string;

  @ApiPropertyOptional({ example: false })
  @IsBoolean({ message: 'Lọc hàng sắp hết phải là boolean' })
  @IsOptional()
  @Type(() => Boolean)
  isLowStockOnly?: boolean;

  @ApiPropertyOptional({ required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Số trang phải là số nguyên' })
  @Min(1, { message: 'Số trang tối thiểu là 1' })
  page?: number = 1;

  @ApiPropertyOptional({ required: false, default: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Số lượng mỗi trang phải là số nguyên' })
  @Min(1, { message: 'Số lượng mỗi trang tối thiểu là 1' })
  @Max(100, { message: 'Số lượng mỗi trang tối đa là 100' })
  limit?: number = 50;
}

export class QueryStockTransactionDto {
  @ApiPropertyOptional({ example: 'ing-uuid-123' })
  @IsString({ message: 'ID nguyên liệu phải là chuỗi ký tự' })
  @IsOptional()
  @MaxLength(100, { message: 'ID nguyên liệu tối đa 100 ký tự' })
  ingredientId?: string;

  @ApiPropertyOptional({ enum: StockTransactionType })
  @IsEnum(StockTransactionType, { message: 'Loại giao dịch không hợp lệ' })
  @IsOptional()
  type?: StockTransactionType;

  @ApiPropertyOptional({ example: '2026-08-01T00:00:00Z' })
  @IsISO8601({}, { message: 'Ngày bắt đầu phải đúng định dạng ISO 8601' })
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-08-31T23:59:59Z' })
  @IsISO8601({}, { message: 'Ngày kết thúc phải đúng định dạng ISO 8601' })
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({ required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Số trang phải là số nguyên' })
  @Min(1, { message: 'Số trang tối thiểu là 1' })
  page?: number = 1;

  @ApiPropertyOptional({ required: false, default: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Số lượng mỗi trang phải là số nguyên' })
  @Min(1, { message: 'Số lượng mỗi trang tối thiểu là 1' })
  @Max(100, { message: 'Số lượng mỗi trang tối đa là 100' })
  limit?: number = 50;
}
