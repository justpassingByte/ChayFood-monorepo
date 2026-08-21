import type {
  Role,
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
} from './schemas/auth.schema';

export type { Role, LoginInput, RegisterInput, UpdateProfileInput };

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
