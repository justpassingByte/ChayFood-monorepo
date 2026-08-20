import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, Min, IsBoolean } from 'class-validator';
import { IngredientUnit, StockTransactionType } from '@chayfood/db';

export class CreateIngredientDto {
  @ApiProperty({ example: 'Đậu Hũ Non Hữu Cơ' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'ING_DAU_HU' })
  @IsString()
  code: string;

  @ApiProperty({ enum: IngredientUnit, default: IngredientUnit.GRAM })
  @IsEnum(IngredientUnit)
  unit: IngredientUnit;

  @ApiPropertyOptional({ example: 10000 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  currentStock?: number;

  @ApiPropertyOptional({ example: 2000 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  minThreshold?: number;

  @ApiProperty({ example: 40, description: 'Giá nhập trên 1 đơn vị tính (VND)' })
  @IsNumber()
  @Min(0)
  costPerUnit: number;

  @ApiPropertyOptional({ example: 'HTX Nông Trại Xanh' })
  @IsString()
  @IsOptional()
  supplier?: string;

  @ApiPropertyOptional({ example: 'Đạm thực vật' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}

export class UpdateIngredientDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  code?: string;

  @ApiPropertyOptional({ enum: IngredientUnit })
  @IsEnum(IngredientUnit)
  @IsOptional()
  unit?: IngredientUnit;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Min(0)
  currentStock?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Min(0)
  minThreshold?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Min(0)
  costPerUnit?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  supplier?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}

export class CreateStockTransactionDto {
  @ApiProperty({ example: 'ing-uuid-123' })
  @IsString()
  ingredientId: string;

  @ApiProperty({ enum: StockTransactionType, example: StockTransactionType.IMPORT })
  @IsEnum(StockTransactionType)
  type: StockTransactionType;

  @ApiProperty({ example: 5000, description: 'Số lượng nhập/xuất' })
  @IsNumber()
  @Min(0.01)
  quantity: number;

  @ApiPropertyOptional({ example: 45, description: 'Đơn giá nhập thực tế' })
  @IsNumber()
  @IsOptional()
  unitCost?: number;

  @ApiPropertyOptional({ example: 'INV-2026-001' })
  @IsString()
  @IsOptional()
  referenceId?: string;

  @ApiPropertyOptional({ example: 'Nhập hàng từ NCC' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ example: 'Admin' })
  @IsString()
  @IsOptional()
  performedBy?: string;
}

export class QueryIngredientDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  query?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  isLowStockOnly?: boolean;
}
