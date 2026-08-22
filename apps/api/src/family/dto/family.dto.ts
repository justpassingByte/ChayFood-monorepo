import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import {
  ActivityLevel,
  CreateFamilyMemberInput,
  FamilyRelation,
  GenerateHarmonizedFamilyPlanInput,
  JoinFamilyGroupInput,
} from '@chayfood/shared-types';

export class CreateFamilyMemberDto implements CreateFamilyMemberInput {
  @ApiProperty({ example: 'Nguyễn Văn Minh (Bố)', description: 'Tên hoặc danh xưng thành viên' })
  @IsString()
  @IsNotEmpty({ message: 'Tên thành viên không được để trống' })
  @MaxLength(100, { message: 'Tên thành viên tối đa 100 ký tự' })
  name: string;

  @ApiProperty({ enum: FamilyRelation, example: FamilyRelation.PARENT, description: 'Mối quan hệ trong gia đình' })
  @IsEnum(FamilyRelation, { message: 'Mối quan hệ không hợp lệ' })
  relation: FamilyRelation;

  @ApiPropertyOptional({ example: 58, description: 'Độ tuổi' })
  @Type(() => Number)
  @IsInt({ message: 'Tuổi phải là số nguyên' })
  @Min(1, { message: 'Tuổi tối thiểu là 1' })
  @Max(120, { message: 'Tuổi tối đa là 120' })
  @IsOptional()
  age?: number;

  @ApiPropertyOptional({ enum: ['male', 'female', 'other'], example: 'male', description: 'Giới tính sinh học' })
  @IsString()
  @IsIn(['male', 'female', 'other'], { message: 'Giới tính không hợp lệ' })
  @IsOptional()
  gender?: 'male' | 'female' | 'other';

  @ApiPropertyOptional({ example: 168, description: 'Chiều cao (cm)' })
  @Type(() => Number)
  @IsNumber()
  @Min(30, { message: 'Chiều cao tối thiểu là 30 cm' })
  @Max(250, { message: 'Chiều cao tối đa là 250 cm' })
  @IsOptional()
  heightCm?: number;

  @ApiPropertyOptional({ example: 65, description: 'Cân nặng (kg)' })
  @Type(() => Number)
  @IsNumber()
  @Min(2, { message: 'Cân nặng tối thiểu là 2 kg' })
  @Max(300, { message: 'Cân nặng tối đa là 300 kg' })
  @IsOptional()
  weightKg?: number;

  @ApiPropertyOptional({ enum: ActivityLevel, default: ActivityLevel.SEDENTARY, description: 'Mức độ vận động thể chất' })
  @IsEnum(ActivityLevel, { message: 'Mức độ vận động không hợp lệ' })
  @IsOptional()
  activityLevel?: ActivityLevel;

  @ApiPropertyOptional({ example: ['Tiểu đường tuýp 2', 'Huyết áp cao'], description: 'Tình trạng bệnh lý' })
  @IsArray()
  @ArrayMaxSize(20, { message: 'Tối đa 20 tình trạng bệnh lý' })
  @IsString({ each: true })
  @MaxLength(100, { each: true, message: 'Tên bệnh lý tối đa 100 ký tự' })
  @IsOptional()
  medicalConditions?: string[];

  @ApiPropertyOptional({ example: ['Đậu phộng', 'Hạt điều'], description: 'Dị ứng và kiêng khem' })
  @IsArray()
  @ArrayMaxSize(20, { message: 'Tối đa 20 chất dị ứng hoặc kiêng khem' })
  @IsString({ each: true })
  @MaxLength(100, { each: true, message: 'Tên chất dị ứng tối đa 100 ký tự' })
  @IsOptional()
  dietaryRestrictions?: string[];

  @ApiPropertyOptional({ default: true, description: 'Tài khoản do chủ hộ quản lý trực tiếp' })
  @IsBoolean()
  @IsOptional()
  isManaged?: boolean;

  @ApiPropertyOptional({ example: 'Ưu tiên đồ ăn mềm, ít muối', description: 'Ghi chú thêm' })
  @IsString()
  @MaxLength(500, { message: 'Ghi chú tối đa 500 ký tự' })
  @IsOptional()
  notes?: string;
}

export class UpdateFamilyMemberDto extends PartialType(CreateFamilyMemberDto) {}

export class JoinFamilyGroupDto implements JoinFamilyGroupInput {
  @ApiProperty({ example: 'FAM-A1B2C3D4', description: 'Mã mời 8 ký tự của gia đình' })
  @IsString()
  @IsNotEmpty({ message: 'Mã mời không được để trống' })
  @MaxLength(20, { message: 'Mã mời tối đa 20 ký tự' })
  inviteCode: string;

  @ApiPropertyOptional({ enum: FamilyRelation, default: FamilyRelation.OTHER, description: 'Mối quan hệ khi gia nhập' })
  @IsEnum(FamilyRelation, { message: 'Mối quan hệ không hợp lệ' })
  @IsOptional()
  relation?: FamilyRelation;
}

export class GenerateHarmonizedFamilyPlanDto implements GenerateHarmonizedFamilyPlanInput {
  @ApiPropertyOptional({
    example: ['member-uuid-1', 'member-uuid-2'],
    description: 'Danh sách ID thành viên cùng dùng bữa (mặc định lấy tất cả thành viên trong nhà)',
  })
  @IsArray()
  @ArrayMaxSize(20, { message: 'Tối đa 20 thành viên tham gia mâm cơm' })
  @IsString({ each: true })
  @IsOptional()
  memberIds?: string[];
}
