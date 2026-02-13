/**
 * ============================================
 * UNIT TEST: Auth Interceptor
 * ============================================
 *
 * Tests para el interceptor que agrega el Bearer token a requests autenticados.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createAuthInterceptor } from '@infrastructure/http/interceptors/auth.interceptor.js';
import type { IStorageService } from '@application/ports/storage.port.js';
import type { InternalAxiosRequestConfig } from 'axios';

describe('Auth Interceptor', () => {
  let mockStorageService: IStorageService;
  let mockConfig: InternalAxiosRequestConfig;

  beforeEach(() => {
    // Create mock storage service
    mockStorageService = {
      setItem: vi.fn(),
      getItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };

    // Create mock axios config
    mockConfig = {
      url: '/api/users/me',
      method: 'GET',
      headers: {} as any,
    } as InternalAxiosRequestConfig;
  });

  it('should add Authorization header when accessToken exists', () => {
    vi.mocked(mockStorageService.getItem).mockReturnValue('access_token_123');

    const interceptor = createAuthInterceptor(mockStorageService);
    const result = interceptor(mockConfig);

    expect(mockStorageService.getItem).toHaveBeenCalledWith('accessToken');
    expect(result.headers.Authorization).toBe('Bearer access_token_123');
  });

  it('should NOT add Authorization header when accessToken does not exist', () => {
    vi.mocked(mockStorageService.getItem).mockReturnValue(null);

    const interceptor = createAuthInterceptor(mockStorageService);
    const result = interceptor(mockConfig);

    expect(result.headers.Authorization).toBeUndefined();
  });

  it('should NOT add header for public endpoint: /api/auth/login', () => {
    vi.mocked(mockStorageService.getItem).mockReturnValue('access_token_123');
    mockConfig.url = '/api/auth/login';

    const interceptor = createAuthInterceptor(mockStorageService);
    const result = interceptor(mockConfig);

    expect(result.headers.Authorization).toBeUndefined();
  });

  it('should NOT add header for public endpoint: /api/auth/register', () => {
    vi.mocked(mockStorageService.getItem).mockReturnValue('access_token_123');
    mockConfig.url = '/api/auth/register';

    const interceptor = createAuthInterceptor(mockStorageService);
    const result = interceptor(mockConfig);

    expect(result.headers.Authorization).toBeUndefined();
  });

  it('should NOT add header for public endpoint: /api/auth/password-reset', () => {
    vi.mocked(mockStorageService.getItem).mockReturnValue('access_token_123');
    mockConfig.url = '/api/auth/password-reset';

    const interceptor = createAuthInterceptor(mockStorageService);
    const result = interceptor(mockConfig);

    expect(result.headers.Authorization).toBeUndefined();
  });

  it('should NOT add header for public endpoint: /api/auth/password-reset/confirm', () => {
    vi.mocked(mockStorageService.getItem).mockReturnValue('access_token_123');
    mockConfig.url = '/api/auth/password-reset/confirm';

    const interceptor = createAuthInterceptor(mockStorageService);
    const result = interceptor(mockConfig);

    expect(result.headers.Authorization).toBeUndefined();
  });

  it('should ADD header for protected endpoint: /api/auth/refresh', () => {
    vi.mocked(mockStorageService.getItem).mockReturnValue('access_token_123');
    mockConfig.url = '/api/auth/refresh';

    const interceptor = createAuthInterceptor(mockStorageService);
    const result = interceptor(mockConfig);

    expect(result.headers.Authorization).toBe('Bearer access_token_123');
  });

  it('should ADD header for protected endpoint: /api/users/me', () => {
    vi.mocked(mockStorageService.getItem).mockReturnValue('access_token_123');
    mockConfig.url = '/api/users/me';

    const interceptor = createAuthInterceptor(mockStorageService);
    const result = interceptor(mockConfig);

    expect(result.headers.Authorization).toBe('Bearer access_token_123');
  });

  it('should preserve existing headers in the request', () => {
    vi.mocked(mockStorageService.getItem).mockReturnValue('access_token_123');
    mockConfig.headers = {
      'X-Custom-Header': 'custom-value',
      'Content-Type': 'application/json',
    } as any;

    const interceptor = createAuthInterceptor(mockStorageService);
    const result = interceptor(mockConfig);

    expect(result.headers.Authorization).toBe('Bearer access_token_123');
    expect(result.headers['X-Custom-Header']).toBe('custom-value');
    expect(result.headers['Content-Type']).toBe('application/json');
  });

  it('should handle undefined URL gracefully', () => {
    vi.mocked(mockStorageService.getItem).mockReturnValue('access_token_123');
    mockConfig.url = undefined;

    const interceptor = createAuthInterceptor(mockStorageService);
    const result = interceptor(mockConfig);

    // Should add token when URL is undefined (safe fallback)
    expect(result.headers.Authorization).toBe('Bearer access_token_123');
  });

  it('should NOT call storage.getItem for public endpoints', () => {
    mockConfig.url = '/api/auth/login';

    const interceptor = createAuthInterceptor(mockStorageService);
    interceptor(mockConfig);

    expect(mockStorageService.getItem).not.toHaveBeenCalled();
  });
});
