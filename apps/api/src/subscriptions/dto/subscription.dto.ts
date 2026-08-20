import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '@chayfood/db';
import { IsDateString, IsEnum, IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DeliveryAddressDto } from '../../orders/dto/order.dto';

export class CreateSubscriptionDto {
  @ApiProperty({ example: 'uuid-plan' })
  @IsString()
  @IsNotEmpty()
  planId: string;

  @ApiProperty({ example: '2026-08-25T00:00:00.000Z' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ type: DeliveryAddressDto })
  @IsObject()
  @ValidateNested()
  @Type(() => DeliveryAddressDto)
  deliveryAddress: DeliveryAddressDto;

  @ApiProperty({ enum: PaymentMethod, default: PaymentMethod.CARD })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty({ example: ['uuid-menu-1', 'uuid-menu-2'], required: false })
  @IsOptional()
  selectedMenuItems?: string[] | Record<string, string[]>;

  @ApiProperty({ example: 'Giao buổi sáng trước 8h', required: false })
  @IsOptional()
  @IsString()
  specialInstructions?: string;
}
