import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus, PaymentMethod, PaymentStatus } from '@chayfood/db';
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @ApiProperty({ example: 'uuid-menu-item' })
  @IsString()
  @IsNotEmpty()
  menuItemId: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 'Không hành tây', required: false })
  @IsOptional()
  @IsString()
  specialInstructions?: string;
}

export class DeliveryAddressDto {
  @ApiProperty({ example: '123 Nguyễn Huệ' })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({ example: 'Quận 1' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'Hồ Chí Minh' })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ example: '700000' })
  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @ApiProperty({ example: 'Giao giờ hành chính', required: false })
  @IsOptional()
  @IsString()
  additionalInfo?: string;
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ type: DeliveryAddressDto })
  @IsObject()
  @ValidateNested()
  @Type(() => DeliveryAddressDto)
  deliveryAddress: DeliveryAddressDto;

  @ApiProperty({ enum: PaymentMethod, default: PaymentMethod.COD })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty({ example: 'Giao nhanh trước 12h', required: false })
  @IsOptional()
  @IsString()
  specialInstructions?: string;
}

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: OrderStatus })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiProperty({ enum: PaymentStatus, required: false })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;
}
