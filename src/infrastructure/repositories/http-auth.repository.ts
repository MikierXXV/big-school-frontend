/**
 * ============================================
 * REPOSITORY: HTTP Auth
 * ============================================
 *
 * Implementacion del repositorio de autenticacion usando HTTP.
 */

import type {
  IAuthRepository,
  RegisterData,
  RegisterResult,
  LoginCredentials,
  LoginResult,
  RefreshResult,
  VerifyEmailResult,
  PasswordResetData,
} from '@domain/repositories/auth.repository.interface.js';
import type { IHttpClient } from '@application/ports/http-client.port.js';
import type { Email } from '@domain/value-objects/email.value-object.js';
import type { RefreshToken } from '@domain/value-objects/refresh-token.value-object.js';
import { UserMapper } from '@application/mappers/user.mapper.js';

export class HttpAuthRepository implements IAuthRepository {
  constructor(private readonly httpClient: IHttpClient) {}

  async register(data: RegisterData): Promise<RegisterResult> {
    const response = await this.httpClient.post<any>('/api/auth/register', {
      email: data.email,
      password: data.password,
      passwordConfirmation: data.passwordConfirmation,
      firstName: data.firstName,
      lastName: data.lastName,
      acceptTerms: data.acceptTerms,
    });

    // Extract from nested data structure (server returns { success, data: { user } })
    const { user: userData } = response.data.data;

    // Extract requiresEmailVerification and verificationToken from user object
    const { requiresEmailVerification, verificationToken, ...userFields } = userData;

    return {
      user: UserMapper.fromApi(userFields),
      requiresEmailVerification,
      verificationToken,
    };
  }

  async login(credentials: LoginCredentials): Promise<LoginResult> {
    const response = await this.httpClient.post<any>('/api/auth/login', {
      email: credentials.email,
      password: credentials.password,
      ...(credentials.rememberMe !== undefined && { rememberMe: credentials.rememberMe }),
    });

    // Extract from nested data structure (server returns { success, data: { user, tokens } })
    const { user: userData, tokens } = response.data.data;

    return {
      user: UserMapper.fromApi(userData),
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        tokenType: tokens.tokenType,
        expiresIn: tokens.expiresIn,
        expiresAt: tokens.expiresAt,
        refreshExpiresIn: tokens.refreshExpiresIn,
      },
    };
  }

  async refreshSession(refreshToken: RefreshToken): Promise<RefreshResult> {
    const response = await this.httpClient.post<any>('/api/auth/refresh', {
      refreshToken: refreshToken.value,
    });

    // Extract from nested data structure (server returns { success, data: { tokens } })
    const { tokens } = response.data.data;

    return {
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        tokenType: tokens.tokenType,
        expiresIn: tokens.expiresIn,
        expiresAt: tokens.expiresAt,
        refreshExpiresIn: tokens.refreshExpiresIn,
      },
    };
  }

  async verifyEmail(token: string): Promise<VerifyEmailResult> {
    const response = await this.httpClient.post<any>('/api/auth/verify-email', {
      token,
    });

    // Extract from nested data structure (server returns { success, data: { user } })
    const { user: userData } = response.data.data;

    return {
      user: UserMapper.fromApi(userData),
    };
  }

  async requestPasswordReset(email: Email): Promise<void> {
    await this.httpClient.post('/api/auth/password-reset', {
      email: email.value,
    });
  }

  async confirmPasswordReset(data: PasswordResetData): Promise<void> {
    await this.httpClient.post('/api/auth/password-reset/confirm', {
      token: data.token,
      newPassword: data.newPassword,
      passwordConfirmation: data.passwordConfirmation,
    });
  }

  async logout(): Promise<void> {
    await this.httpClient.post('/api/auth/logout');
  }
}
