import type {
  Role,
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
} from './schemas/auth.schema';
import type {
  AddressInput,
  UserPreferenceInput,
  ChangePasswordInput,
} from './schemas/user.schema';

export type {
  Role,
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
  AddressInput,
  UserPreferenceInput,
  ChangePasswordInput,
};

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  name?: string;
  phone?: string | null;
  avatarUrl?: string | null;
  picture?: string | null;
  address?: string | null;
  role: Role;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface AuthResponse {
  user: UserProfile;
  token: string;
  refreshToken?: string;
}

export type LoginDto = LoginInput;
export type RegisterDto = RegisterInput;
export type UpdateProfileDto = UpdateProfileInput;
export type AddressDto = AddressInput;
export type UserPreferenceDto = UserPreferenceInput;
export type ChangePasswordDto = ChangePasswordInput;

