import { ApiProperty } from '@nestjs/swagger';
import { CreatePlanInput } from '@chayfood/shared-types';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  ArrayMaxSize,
} from 'class-validator';

/**
 * 🌟 DTO tạo gói ăn định kỳ (Plan Creation DTO):
 * - Implements CreatePlanInput từ Zod SSOT Schema.
 * - Ràng buộc bounds chống tràn số và DoS.
 */
export class CreatePlanDto implements CreatePlanInput {
  @ApiProperty({ example: 'Gói Chay Thanh Tịnh Tuần' })
  @IsString({ message: 'Tên gói ăn phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Tên gói ăn không được để trống' })
  @MaxLength(100, { message: 'Tên gói ăn tối đa 100 ký tự' })
  name: string;

  @ApiProperty({ example: 'WEEKLY_CLEANSE' })
  @IsString({ message: 'Mã gói ăn phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Mã gói ăn không được để trống' })
  @MaxLength(50, { message: 'Mã gói ăn tối đa 50 ký tự' })
  @Matches(/^[A-Z0-9_-]+$/, { message: 'Mã gói ăn chỉ chứa chữ hoa, số, gạch dưới và gạch ngang' })
  code: string;

  @ApiProperty({ example: 350000 })
  @IsInt({ message: 'Giá gói ăn phải là số nguyên' })
  @Min(0, { message: 'Giá gói ăn không được âm' })
  @Max(100_000_000, { message: 'Giá gói ăn tối đa 100 triệu VND' })
  price: number;

  @ApiProperty({ example: 7 })
  @IsInt({ message: 'Thời hạn gói ăn phải là số nguyên ngày' })
  @Min(1, { message: 'Thời hạn gói ăn tối thiểu 1 ngày' })
  @Max(365, { message: 'Thời hạn gói ăn tối đa 365 ngày' })
  duration: number;

  @ApiProperty({ example: 'Gói 7 ngày thanh lọc cơ thể giàu dinh dưỡng thực vật' })
  @IsString({ message: 'Mô tả gói ăn phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Mô tả gói ăn không được để trống' })
  @MaxLength(1000, { message: 'Mô tả gói ăn tối đa 1000 ký tự' })
  description: string;

  @ApiProperty({ example: 1 })
  @IsInt({ message: 'Số bữa ăn mỗi ngày phải là số nguyên' })
  @Min(1, { message: 'Số bữa ăn mỗi ngày tối thiểu 1 bữa' })
  @Max(10, { message: 'Số bữa ăn mỗi ngày tối đa 10 bữa' })
  mealsPerDay: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt({ message: 'Số bữa phụ mỗi ngày phải là số nguyên' })
  @Min(0, { message: 'Số bữa phụ không được âm' })
  @Max(10, { message: 'Số bữa phụ tối đa 10 bữa' })
  snacksPerDay?: number;

  @ApiProperty({ example: ['1 Bữa chính/ngày', 'Miễn phí vận chuyển'], required: false })
  @IsOptional()
  @IsArray({ message: 'Đặc tính gói ăn phải là mảng chuỗi' })
  @ArrayMaxSize(20, { message: 'Tối đa 20 đặc tính cho một gói ăn' })
  @IsString({ each: true, message: 'Mỗi đặc tính phải là chuỗi ký tự' })
  features?: string[];

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean({ message: 'Cờ khuyến nghị phải là kiểu boolean' })
  isRecommended?: boolean;
}

