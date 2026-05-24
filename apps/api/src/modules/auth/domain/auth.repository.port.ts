import { AuthUser, LoginResult } from '../domain/auth.types';

export interface AuthRepositoryPort {
  findByEmail(email: string): Promise<AuthUserRecord | null>;
  findById(userId: string): Promise<Omit<AuthUserRecord, 'passwordHash' | 'isActive'> | null>;
  getPermissionsForUser(userId: string): Promise<string[]>;
}

export interface AuthUserRecord {
  id: string;
  email: string;
  fullName: string;
  passwordHash: string;
  isActive: boolean;
}

export interface LoginUseCasePort {
  execute(email: string, password: string): Promise<LoginResult>;
}

export interface GetMeUseCasePort {
  execute(userId: string): Promise<AuthUser>;
}
