import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '@chayfood/db';
import { CreateSubscriptionInput } from '@chayfood/shared-types';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DeliveryAddressDto } from '../../orders/dto/order.dto';

/**
 * 🌟 DTO đăng ký gói ăn định kỳ (Subscription Checkout DTO):
 * - Implements CreateSubscriptionInput từ Zod SSOT Schema.
 * - Ràng buộc địa chỉ giao hàng và phương thức thanh toán chặt chẽ.
 */
export class CreateSubscriptionDto implements CreateSubscriptionInput {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  @IsString({ message: 'Mã gói ăn phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Mã gói ăn không được để trống' })
  @IsUUID('4', { message: 'Mã gói ăn phải là định dạng UUID hợp lệ' })
  planId: string;

  @ApiProperty({ example: '2026-08-25T00:00:00.000Z' })
  @IsDateString({}, { message: 'Ngày bắt đầu phải là chuỗi ngày ISO 8601 hợp lệ' })
  startDate: string;

  @ApiProperty({ type: DeliveryAddressDto })
  @IsObject({ message: 'Địa chỉ giao hàng phải là đối tượng hợp lệ' })
  @ValidateNested()
  @Type(() => DeliveryAddressDto)
  deliveryAddress: DeliveryAddressDto;

  @ApiProperty({ enum: PaymentMethod, default: PaymentMethod.CARD })
  @IsEnum(PaymentMethod, { message: 'Phương thức thanh toán không hợp lệ' })
  paymentMethod: PaymentMethod;

  @ApiProperty({ example: ['3fa85f64-5717-4562-b3fc-2c963f66afa6'], required: false })
  @IsOptional()
  selectedMenuItems?: string[] | Record<string, string[]>;

  @ApiProperty({ example: 'Giao buổi sáng trước 8h', required: false })
  @IsOptional()
  @IsString({ message: 'Ghi chú giao hàng phải là chuỗi ký tự' })
  @MaxLength(500, { message: 'Ghi chú giao hàng tối đa 500 ký tự' })
  specialInstructions?: string;
}

