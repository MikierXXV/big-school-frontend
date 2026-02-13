/**
 * ============================================
 * UNIT TEST: Error Interceptor
 * ============================================
 *
 * Tests para el interceptor que maneja errores HTTP y auto-refresh de tokens.
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { AxiosError } from 'axios';
import { createErrorInterceptor } from '@infrastructure/http/interceptors/error.interceptor.js';
import type { IStorageService } from '@application/ports/storage.port.js';
import type { IHttpClient } from '@application/ports/http-client.port.js';
import {
  InvalidCredentialsError,
  RefreshTokenExpiredError,
  RefreshTokenReuseDetectedError,
} from '@domain/errors/auth.errors.js';
import { NetworkError } from '@infrastructure/http/utils/error-mapper.util.js';

describe('Error Interceptor', () => {
  let mockStorageService: IStorageService;
  let mockHttpClient: IHttpClient;

  beforeEach(() => {
    // Reset module state between tests
    vi.resetModules();

    mockStorageService = {
      setItem: vi.fn(),
      getItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };

    mockHttpClient = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Error Mapping', () => {
    it('should map HTTP errors to Domain Errors', async () => {
      const interceptor = createErrorInterceptor(mockStorageService, mockHttpClient);

      const axiosError = new AxiosError('Unauthorized');
      axiosError.response = {
        status: 401,
        data: {
          success: false,
          error: {
            code: 'DOMAIN_INVALID_CREDENTIALS',
            message: 'Invalid email or password',
          },
        },
        statusText: 'Unauthorized',
        headers: {},
        config: { url: '/api/auth/login' } as any,
      };
      axiosError.config = { url: '/api/auth/login' } as any;

      await expect(interceptor(axiosError)).rejects.toThrow(InvalidCredentialsError);
    });

    it('should map network errors correctly', async () => {
      const interceptor = createErrorInterceptor(mockStorageService, mockHttpClient);

      const axiosError = new AxiosError('Network Error');
      axiosError.code = 'ERR_NETWORK';

      await expect(interceptor(axiosError)).rejects.toThrow(NetworkError);
    });
  });

  describe('Refresh Trigger Logic', () => {
    it('should NOT trigger refresh for non-401 errors', async () => {
      const interceptor = createErrorInterceptor(mockStorageService, mockHttpClient);

      const axiosError = new AxiosError('Bad Request');
      axiosError.response = {
        status: 400,
        data: { success: false, error: { code: 'BAD_REQUEST', message: 'Bad request' } },
        statusText: 'Bad Request',
        headers: {},
        config: {} as any,
      };

      await expect(interceptor(axiosError)).rejects.toThrow();
      expect(mockHttpClient.post).not.toHaveBeenCalled();
    });

    it('should NOT trigger refresh for 401 on /api/auth/refresh endpoint (prevent loop)', async () => {
      const interceptor = createErrorInterceptor(mockStorageService, mockHttpClient);

      const axiosError = new AxiosError('Unauthorized');
      axiosError.response = {
        status: 401,
        data: {
          success: false,
          error: { code: 'DOMAIN_REFRESH_TOKEN_EXPIRED', message: 'Refresh token expired' },
        },
        statusText: 'Unauthorized',
        headers: {},
        config: { url: '/api/auth/refresh' } as any,
      };
      axiosError.config = { url: '/api/auth/refresh' } as any;

      await expect(interceptor(axiosError)).rejects.toThrow(RefreshTokenExpiredError);
      expect(mockHttpClient.post).not.toHaveBeenCalled();
    });

    it('should NOT trigger refresh for 401 on public endpoints', async () => {
      const interceptor = createErrorInterceptor(mockStorageService, mockHttpClient);

      const axiosError = new AxiosError('Unauthorized');
      axiosError.response = {
        status: 401,
        data: { success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
        statusText: 'Unauthorized',
        headers: {},
        config: { url: '/api/auth/login' } as any,
      };
      axiosError.config = { url: '/api/auth/login' } as any;

      await expect(interceptor(axiosError)).rejects.toThrow();
      expect(mockHttpClient.post).not.toHaveBeenCalled();
    });
  });

  describe('Token Refresh Flow', () => {
    it('should trigger refresh on 401 for protected endpoints', async () => {
      const interceptor = createErrorInterceptor(mockStorageService, mockHttpClient);

      // Mock refresh token in storage
      vi.mocked(mockStorageService.getItem).mockReturnValue('refresh_token_123');

      // Mock successful refresh response
      vi.mocked(mockHttpClient.post).mockResolvedValue({
        data: {
          success: true,
          tokens: {
            accessToken: 'new_access_token',
            refreshToken: 'new_refresh_token',
            expiresIn: 18000,
            expiresAt: '2024-01-01T05:00:00Z',
          },
        },
        status: 200,
        headers: {},
      });

      const axiosError = new AxiosError('Unauthorized');
      axiosError.response = {
        status: 401,
        data: { success: false, error: { code: 'TOKEN_EXPIRED', message: 'Token expired' } },
        statusText: 'Unauthorized',
        headers: {},
        config: { url: '/api/users/me' } as any,
      };
      axiosError.config = { url: '/api/users/me' } as any;

      await expect(interceptor(axiosError)).rejects.toThrow();

      // Verify refresh was called
      expect(mockHttpClient.post).toHaveBeenCalledWith('/api/auth/refresh', {
        refreshToken: 'refresh_token_123',
      });
    });

    it('should store new tokens after successful refresh', async () => {
      const interceptor = createErrorInterceptor(mockStorageService, mockHttpClient);

      vi.mocked(mockStorageService.getItem).mockReturnValue('refresh_token_123');

      vi.mocked(mockHttpClient.post).mockResolvedValue({
        data: {
          success: true,
          tokens: {
            accessToken: 'new_access_token',
            refreshToken: 'new_refresh_token',
          },
        },
        status: 200,
        headers: {},
      });

      const axiosError = new AxiosError('Unauthorized');
      axiosError.response = {
        status: 401,
        data: { success: false, error: { code: 'TOKEN_EXPIRED', message: 'Token expired' } },
        statusText: 'Unauthorized',
        headers: {},
        config: { url: '/api/users/me' } as any,
      };
      axiosError.config = { url: '/api/users/me' } as any;

      await expect(interceptor(axiosError)).rejects.toThrow();

      // Verify tokens were stored
      expect(mockStorageService.setItem).toHaveBeenCalledWith('accessToken', 'new_access_token');
      expect(mockStorageService.setItem).toHaveBeenCalledWith('refreshToken', 'new_refresh_token');
    });

    it('should clear tokens if refresh fails', async () => {
      const interceptor = createErrorInterceptor(mockStorageService, mockHttpClient);

      vi.mocked(mockStorageService.getItem).mockReturnValue('refresh_token_123');

      // Mock failed refresh
      vi.mocked(mockHttpClient.post).mockRejectedValue(
        new Error('Refresh token expired')
      );

      const axiosError = new AxiosError('Unauthorized');
      axiosError.response = {
        status: 401,
        data: { success: false, error: { code: 'TOKEN_EXPIRED', message: 'Token expired' } },
        statusText: 'Unauthorized',
        headers: {},
        config: { url: '/api/users/me' } as any,
      };
      axiosError.config = { url: '/api/users/me' } as any;

      await expect(interceptor(axiosError)).rejects.toThrow();

      // Verify tokens were cleared
      expect(mockStorageService.clear).toHaveBeenCalled();
    });

    it('should NOT trigger refresh when no refresh token exists', async () => {
      const interceptor = createErrorInterceptor(mockStorageService, mockHttpClient);

      // No refresh token in storage
      vi.mocked(mockStorageService.getItem).mockReturnValue(null);

      const axiosError = new AxiosError('Unauthorized');
      axiosError.response = {
        status: 401,
        data: { success: false, error: { code: 'TOKEN_EXPIRED', message: 'Token expired' } },
        statusText: 'Unauthorized',
        headers: {},
        config: { url: '/api/users/me' } as any,
      };
      axiosError.config = { url: '/api/users/me' } as any;

      await expect(interceptor(axiosError)).rejects.toThrow();

      // Refresh should not be called
      expect(mockHttpClient.post).not.toHaveBeenCalled();
      expect(mockStorageService.clear).toHaveBeenCalled();
    });
  });

  describe('Refresh Token Reuse Detection', () => {
    it('should clear all tokens on refresh token reuse detection', async () => {
      const interceptor = createErrorInterceptor(mockStorageService, mockHttpClient);

      const axiosError = new AxiosError('Unauthorized');
      axiosError.response = {
        status: 401,
        data: {
          success: false,
          error: {
            code: 'DOMAIN_REFRESH_TOKEN_REUSE_DETECTED',
            message: 'Refresh token reuse detected',
          },
        },
        statusText: 'Unauthorized',
        headers: {},
        config: { url: '/api/users/me' } as any,
      };

      await expect(interceptor(axiosError)).rejects.toThrow(RefreshTokenReuseDetectedError);

      // Verify all tokens were cleared
      expect(mockStorageService.clear).toHaveBeenCalled();
    });
  });

  describe('Error Propagation', () => {
    it('should propagate Domain Errors after mapping', async () => {
      const interceptor = createErrorInterceptor(mockStorageService, mockHttpClient);

      const axiosError = new AxiosError('Unauthorized');
      axiosError.response = {
        status: 401,
        data: {
          success: false,
          error: {
            code: 'DOMAIN_INVALID_CREDENTIALS',
            message: 'Invalid email or password',
          },
        },
        statusText: 'Unauthorized',
        headers: {},
        config: { url: '/api/auth/login' } as any,
      };
      axiosError.config = { url: '/api/auth/login' } as any;

      await expect(interceptor(axiosError)).rejects.toThrow(InvalidCredentialsError);
      await expect(interceptor(axiosError)).rejects.toThrow('Invalid email or password');
    });
  });
});
