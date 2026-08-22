import { ApiProperty } from '@nestjs/swagger';
import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  type CreateOrderItemInput,
  type DeliveryAddressInput,
  type CreateOrderInput,
  type UpdateOrderStatusInput,
} from '@chayfood/shared-types';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * 🛡️ DTO từng món trong đơn:
 * - Tuyệt đối không nhận trường `price` từ client (Server-Authoritative Pricing).
 * - Giới hạn `quantity` số nguyên từ 1 đến 99 để bảo toàn tính toán BOM trừ kho.
 */
export class OrderItemDto implements CreateOrderItemInput {
  @ApiProperty({ example: 'uuid-menu-item' })
  @IsString()
  @IsNotEmpty()
  menuItemId: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  @Max(99)
  quantity: number;

  @ApiProperty({ example: 'Không hành tây', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  specialInstructions?: string;
}

/**
 * 🛡️ DTO địa chỉ giao nhận:
 * Giới hạn độ dài chuỗi để ngăn chặn rác dữ liệu và khai thác tràn bộ đệm.
 */
export class DeliveryAddressDto implements DeliveryAddressInput {
  @ApiProperty({ example: '123 Nguyễn Huệ' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  street: string;

  @ApiProperty({ example: 'Quận 1' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  city: string;

  @ApiProperty({ example: 'Hồ Chí Minh', required: false, default: 'Việt Nam' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  state?: string;

  @ApiProperty({ example: '700000', required: false, default: '70000' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  postalCode?: string;

  @ApiProperty({ example: 'Giao giờ hành chính', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  additionalInfo?: string;
}

/**
 * 🛡️ DTO tạo đơn hàng:
 * - Giới hạn `items` tối đa 50 phần tử chống tấn công cạn kiệt RAM NodeJS (Array DoS).
 * - Hỗ trợ `idempotencyKey` UUIDv4 để triệt tiêu nguy cơ double-order khi mạng chập chờn.
 */
export class CreateOrderDto implements CreateOrderInput {
  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
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
  @MaxLength(500)
  specialInstructions?: string;

  @ApiProperty({ example: 'c6b65345-dbe6-4bc4-9d10-388277259178', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  idempotencyKey?: string;
}

/**
 * 🛡️ DTO cập nhật trạng thái đơn hàng (Dành cho Admin State Machine)
 */
export class UpdateOrderStatusDto implements UpdateOrderStatusInput {
  @ApiProperty({ enum: OrderStatus })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiProperty({ enum: PaymentStatus, required: false })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;
}
