import type { Role } from './schemas/auth.schema';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string | null;
  avatarUrl?: string | null;
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

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  address?: string;
}
