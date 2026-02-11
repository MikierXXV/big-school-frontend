/**
 * ============================================
 * REPOSITORY INTERFACE: Auth
 * ============================================
 *
 * Define el contrato para operaciones de autenticacion.
 * La implementacion real estara en Infrastructure.
 *
 * TODO: Implementar interface completa
 */

import type { User } from '../entities/user.entity.js';

export interface LoginCredentials {
  readonly email: string;
  readonly password: string;
}

export interface RegisterData {
  readonly email: string;
  readonly password: string;
  readonly firstName: string;
  readonly lastName: string;
}

export interface AuthTokens {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresIn: number;
}

export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }>;
  register(data: RegisterData): Promise<void>;
  logout(): Promise<void>;
  refreshToken(refreshToken: string): Promise<AuthTokens>;
}
