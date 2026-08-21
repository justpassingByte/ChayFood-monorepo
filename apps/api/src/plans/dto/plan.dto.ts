import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreatePlanDto {
  @ApiProperty({ example: 'Gói Chay Thanh Tịnh Tuần' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'WEEKLY_CLEANSE' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 350000 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 7 })
  @IsNumber()
  @Min(1)
  duration: number;

  @ApiProperty({ example: 'Gói 7 ngày thanh lọc cơ thể...' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(0)
  mealsPerDay: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  snacksPerDay?: number;

  @ApiProperty({ example: ['1 Bữa chính/ngày', 'Miễn phí ship'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isRecommended?: boolean;
}
