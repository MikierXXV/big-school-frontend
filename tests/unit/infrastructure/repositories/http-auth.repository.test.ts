/**
 * ============================================
 * UNIT TEST: HTTP Auth Repository
 * ============================================
 *
 * Tests para la implementación del repositorio de autenticación usando HTTP.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HttpAuthRepository } from '@infrastructure/repositories/http-auth.repository.js';
import type { IHttpClient } from '@application/ports/http-client.port.js';
import { User, UserId, Email, UserStatus } from '@domain/index.js';
import { RefreshToken } from '@domain/value-objects/refresh-token.value-object.js';

describe('HttpAuthRepository', () => {
  let repository: HttpAuthRepository;
  let mockHttpClient: IHttpClient;

  beforeEach(() => {
    mockHttpClient = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    };

    repository = new HttpAuthRepository(mockHttpClient);
  });

  describe('register', () => {
    it('should call POST /api/auth/register with correct data', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            user: {
              id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
              email: 'newuser@example.com',
              firstName: 'Jane',
              lastName: 'Doe',
              status: 'PENDING_VERIFICATION',
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z',
              emailVerifiedAt: null,
              lastLoginAt: null,
              requiresEmailVerification: true,
              verificationToken: 'verification_token_dev',
            },
          },
        },
        status: 201,
        headers: {},
      };

      vi.mocked(mockHttpClient.post).mockResolvedValue(mockResponse);

      const result = await repository.register({
        email: 'newuser@example.com',
        password: 'Password123!',
        passwordConfirmation: 'Password123!',
        firstName: 'Jane',
        lastName: 'Doe',
        acceptTerms: true,
      });

      expect(mockHttpClient.post).toHaveBeenCalledWith('/api/auth/register', {
        email: 'newuser@example.com',
        password: 'Password123!',
        passwordConfirmation: 'Password123!',
        firstName: 'Jane',
        lastName: 'Doe',
        acceptTerms: true,
      });

      expect(result.user).toBeInstanceOf(User);
      expect(result.user.email.value).toBe('newuser@example.com');
      expect(result.requiresEmailVerification).toBe(true);
      expect(result.verificationToken).toBe('verification_token_dev');
    });
  });

  describe('login', () => {
    it('should call POST /api/auth/login with credentials', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            user: {
              id: 'a47ac10b-58cc-4372-a567-0e02b2c3d479',
              email: 'user@example.com',
              firstName: 'John',
              lastName: 'Doe',
              status: 'ACTIVE',
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z',
              emailVerifiedAt: '2024-01-01T00:00:00Z',
              lastLoginAt: '2024-01-02T00:00:00Z',
            },
            tokens: {
              accessToken: 'access_token_123',
              refreshToken: 'refresh_token_456',
              tokenType: 'Bearer',
              expiresIn: 18000,
              expiresAt: '2024-01-01T05:00:00Z',
              refreshExpiresIn: 259200,
            },
          },
        },
        status: 200,
        headers: {},
      };

      vi.mocked(mockHttpClient.post).mockResolvedValue(mockResponse);

      const result = await repository.login({
        email: 'user@example.com',
        password: 'Password123!',
      });

      expect(mockHttpClient.post).toHaveBeenCalledWith('/api/auth/login', {
        email: 'user@example.com',
        password: 'Password123!',
      });

      expect(result.user).toBeInstanceOf(User);
      expect(result.user.email.value).toBe('user@example.com');
      expect(result.tokens.accessToken).toBe('access_token_123');
      expect(result.tokens.refreshToken).toBe('refresh_token_456');
      expect(result.tokens.tokenType).toBe('Bearer');
    });

    it('should include rememberMe in request if provided', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            user: {
              id: 'a47ac10b-58cc-4372-a567-0e02b2c3d479',
              email: 'user@example.com',
              firstName: 'John',
              lastName: 'Doe',
              status: 'ACTIVE',
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z',
              emailVerifiedAt: '2024-01-01T00:00:00Z',
              lastLoginAt: null,
            },
            tokens: {
              accessToken: 'access_token',
              refreshToken: 'refresh_token',
              tokenType: 'Bearer',
              expiresIn: 18000,
              expiresAt: '2024-01-01T05:00:00Z',
              refreshExpiresIn: 259200,
            },
          },
        },
        status: 200,
        headers: {},
      };

      vi.mocked(mockHttpClient.post).mockResolvedValue(mockResponse);

      await repository.login({
        email: 'user@example.com',
        password: 'Password123!',
        rememberMe: true,
      });

      expect(mockHttpClient.post).toHaveBeenCalledWith('/api/auth/login', {
        email: 'user@example.com',
        password: 'Password123!',
        rememberMe: true,
      });
    });
  });

  describe('refreshSession', () => {
    it('should call POST /api/auth/refresh with refresh token', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            tokens: {
              accessToken: 'new_access_token',
              refreshToken: 'new_refresh_token',
              tokenType: 'Bearer',
              expiresIn: 18000,
              expiresAt: '2024-01-01T05:00:00Z',
              refreshExpiresIn: 259200,
            },
          },
        },
        status: 200,
        headers: {},
      };

      vi.mocked(mockHttpClient.post).mockResolvedValue(mockResponse);

      const refreshToken = RefreshToken.create('refresh_token_123');
      const result = await repository.refreshSession(refreshToken);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/api/auth/refresh', {
        refreshToken: 'refresh_token_123',
      });

      expect(result.tokens.accessToken).toBe('new_access_token');
      expect(result.tokens.refreshToken).toBe('new_refresh_token');
    });
  });

  describe('verifyEmail', () => {
    it('should call POST /api/auth/verify-email with token', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            user: {
              id: 'a47ac10b-58cc-4372-a567-0e02b2c3d479',
              email: 'user@example.com',
              firstName: 'John',
              lastName: 'Doe',
              status: 'ACTIVE',
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z',
              emailVerifiedAt: '2024-01-01T00:00:00Z',
              lastLoginAt: null,
            },
          },
        },
        status: 200,
        headers: {},
      };

      vi.mocked(mockHttpClient.post).mockResolvedValue(mockResponse);

      const result = await repository.verifyEmail('verification_token_123');

      expect(mockHttpClient.post).toHaveBeenCalledWith('/api/auth/verify-email', {
        token: 'verification_token_123',
      });

      expect(result.user).toBeInstanceOf(User);
      expect(result.user.isEmailVerified()).toBe(true);
    });
  });

  describe('requestPasswordReset', () => {
    it('should call POST /api/auth/password-reset with email', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'If the email exists, a reset link has been sent',
        },
        status: 200,
        headers: {},
      };

      vi.mocked(mockHttpClient.post).mockResolvedValue(mockResponse);

      const email = Email.create('user@example.com');
      await repository.requestPasswordReset(email);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/api/auth/password-reset', {
        email: 'user@example.com',
      });
    });
  });

  describe('confirmPasswordReset', () => {
    it('should call POST /api/auth/password-reset/confirm with data', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Password reset successful',
        },
        status: 200,
        headers: {},
      };

      vi.mocked(mockHttpClient.post).mockResolvedValue(mockResponse);

      await repository.confirmPasswordReset({
        token: 'reset_token_123',
        newPassword: 'NewPassword123!',
        passwordConfirmation: 'NewPassword123!',
      });

      expect(mockHttpClient.post).toHaveBeenCalledWith('/api/auth/password-reset/confirm', {
        token: 'reset_token_123',
        newPassword: 'NewPassword123!',
        passwordConfirmation: 'NewPassword123!',
      });
    });
  });

  describe('logout', () => {
    it('should call POST /api/auth/logout', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Logged out successfully',
        },
        status: 200,
        headers: {},
      };

      vi.mocked(mockHttpClient.post).mockResolvedValue(mockResponse);

      await repository.logout();

      expect(mockHttpClient.post).toHaveBeenCalledWith('/api/auth/logout');
    });
  });
});
