import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'customer@chayfood.vn', description: 'Địa chỉ Email' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @ApiProperty({ example: 'Pass@123456', description: 'Mật khẩu tối thiểu 6 ký tự' })
  @IsString()
  @MinLength(6, { message: 'Mật khẩu phải từ 6 ký tự trở lên' })
  password: string;

  @ApiProperty({ example: 'Nguyễn Văn An', description: 'Họ và tên khách hàng' })
  @IsString()
  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  name: string;

  @ApiProperty({ example: '0901234567', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: '123 Đường Ẩm Thực Chay, Q.1, TP.HCM', required: false })
  @IsOptional()
  @IsString()
  address?: string;
}

export class LoginDto {
  @ApiProperty({ example: 'customer@chayfood.vn' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @ApiProperty({ example: 'Pass@123456' })
  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;
}
