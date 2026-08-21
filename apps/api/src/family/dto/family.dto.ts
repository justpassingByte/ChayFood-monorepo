import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ActivityLevel, FamilyRelation } from '@chayfood/shared-types';

export class CreateFamilyMemberDto {
  @ApiProperty({ example: 'Bác Nguyễn Văn An' })
  @IsString()
  name: string;

  @ApiProperty({ enum: FamilyRelation, example: FamilyRelation.PARENT })
  @IsEnum(FamilyRelation)
  relation: FamilyRelation;

  @ApiPropertyOptional({ example: 68 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  age?: number;

  @ApiPropertyOptional({ example: 'male' })
  @IsString()
  @IsOptional()
  gender?: 'male' | 'female' | 'other';

  @ApiPropertyOptional({ example: 165 })
  @IsNumber()
  @IsOptional()
  heightCm?: number;

  @ApiPropertyOptional({ example: 62 })
  @IsNumber()
  @IsOptional()
  weightKg?: number;

  @ApiPropertyOptional({ enum: ActivityLevel, default: ActivityLevel.SEDENTARY })
  @IsEnum(ActivityLevel)
  @IsOptional()
  activityLevel?: ActivityLevel;

  @ApiPropertyOptional({ example: ['Tiểu đường type 2', 'Tăng huyết áp'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  medicalConditions?: string[];

  @ApiPropertyOptional({ example: ['Dị ứng đậu phộng', 'Ăn ít muối'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  dietaryRestrictions?: string[];

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  isManaged?: boolean;

  @ApiPropertyOptional({ example: 'Cần ăn mềm, hạn chế đường' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateFamilyMemberDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ enum: FamilyRelation })
  @IsEnum(FamilyRelation)
  @IsOptional()
  relation?: FamilyRelation;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  age?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  gender?: 'male' | 'female' | 'other';

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  heightCm?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  weightKg?: number;

  @ApiPropertyOptional({ enum: ActivityLevel })
  @IsEnum(ActivityLevel)
  @IsOptional()
  activityLevel?: ActivityLevel;

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  medicalConditions?: string[];

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  dietaryRestrictions?: string[];

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isManaged?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
}

export class JoinFamilyGroupDto {
  @ApiProperty({ example: 'CHAY-FAM-8821' })
  @IsString()
  inviteCode: string;

  @ApiProperty({ enum: FamilyRelation, example: FamilyRelation.SPOUSE })
  @IsEnum(FamilyRelation)
  relation: FamilyRelation;
}

export class GenerateHarmonizedFamilyPlanDto {
  @ApiPropertyOptional({ example: ['member-uuid-1', 'member-uuid-2'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  memberIds?: string[];
}
