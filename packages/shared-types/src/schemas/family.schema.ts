import { z } from 'zod';
import { ActivityLevel, FamilyRelation } from '../family';

export const FamilyRelationEnum = z.nativeEnum(FamilyRelation, {
  errorMap: () => ({ message: 'Mối quan hệ gia đình không hợp lệ' }),
});

export const ActivityLevelEnum = z.nativeEnum(ActivityLevel, {
  errorMap: () => ({ message: 'Mức độ vận động không hợp lệ' }),
});

export const CreateFamilyMemberSchema = z.object({
  name: z.string().min(1, 'Tên thành viên không được để trống').max(100, 'Tên thành viên tối đa 100 ký tự'),
  relation: FamilyRelationEnum,
  age: z
    .number()
    .int('Tuổi phải là số nguyên')
    .min(1, 'Tuổi tối thiểu là 1')
    .max(120, 'Tuổi tối đa là 120')
    .optional(),
  gender: z
    .enum(['male', 'female', 'other'], {
      errorMap: () => ({ message: 'Giới tính không hợp lệ' }),
    })
    .optional(),
  heightCm: z
    .number()
    .min(30, 'Chiều cao tối thiểu là 30 cm')
    .max(250, 'Chiều cao tối đa là 250 cm')
    .optional(),
  weightKg: z
    .number()
    .min(2, 'Cân nặng tối thiểu là 2 kg')
    .max(300, 'Cân nặng tối đa là 300 kg')
    .optional(),
  activityLevel: ActivityLevelEnum.default(ActivityLevel.SEDENTARY).optional(),
  medicalConditions: z
    .array(z.string().max(100, 'Tên bệnh lý tối đa 100 ký tự'))
    .max(20, 'Tối đa 20 tình trạng bệnh lý')
    .default([])
    .optional(),
  dietaryRestrictions: z
    .array(z.string().max(100, 'Tên chất dị ứng tối đa 100 ký tự'))
    .max(20, 'Tối đa 20 chất dị ứng hoặc kiêng khem')
    .default([])
    .optional(),
  isManaged: z.boolean().default(true).optional(),
  notes: z.string().max(500, 'Ghi chú tối đa 500 ký tự').optional(),
});

export const UpdateFamilyMemberSchema = CreateFamilyMemberSchema.partial();

export const JoinFamilyGroupSchema = z.object({
  inviteCode: z
    .string()
    .min(1, 'Mã mời không được để trống')
    .max(20, 'Mã mời tối đa 20 ký tự')
    .trim(),
  relation: FamilyRelationEnum.default(FamilyRelation.OTHER).optional(),
});

export const GenerateHarmonizedFamilyPlanSchema = z.object({
  memberIds: z.array(z.string()).max(20, 'Tối đa 20 thành viên tham gia mâm cơm').optional(),
});

export type CreateFamilyMemberInput = z.infer<typeof CreateFamilyMemberSchema>;
export type UpdateFamilyMemberInput = z.infer<typeof UpdateFamilyMemberSchema>;
export type JoinFamilyGroupInput = z.infer<typeof JoinFamilyGroupSchema>;
export type GenerateHarmonizedFamilyPlanInput = z.infer<typeof GenerateHarmonizedFamilyPlanSchema>;
