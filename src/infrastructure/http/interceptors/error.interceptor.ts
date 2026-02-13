/**
 * ============================================
 * INTERCEPTOR: Error
 * ============================================
 *
 * Maneja errores HTTP globalmente, incluyendo:
 * - Mapeo de errores HTTP a Domain Errors
 * - Auto-refresh de tokens en 401
 * - Prevención de loops infinitos
 * - Prevención de refreshes concurrentes
 * - Detección de reuso de tokens
 */

import type { AxiosError } from 'axios';
import type { IStorageService } from '@application/ports/storage.port.js';
import type { IHttpClient } from '@application/ports/http-client.port.js';
import { mapHttpErrorToDomainError } from '../utils/error-mapper.util.js';
import { RefreshTokenReuseDetectedError } from '@domain/errors/auth.errors.js';

/**
 * Public endpoints that don't require authentication
 */
const PUBLIC_ENDPOINTS = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/password-reset',
  '/api/auth/password-reset/confirm',
];

/**
 * State for refresh token flow
 */
let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

/**
 * Creates an Axios response error interceptor that handles errors globally
 *
 * @param storageService - Service to manage tokens
 * @param httpClient - HTTP client to call refresh endpoint
 * @returns Axios error interceptor function
 */
export function createErrorInterceptor(
  storageService: IStorageService,
  httpClient: IHttpClient
) {
  return async (error: AxiosError): Promise<never> => {
    const axiosError = error as AxiosError;

    // Handle refresh token reuse detection
    const errorData = axiosError.response?.data as any;
    if (errorData?.error?.code === 'DOMAIN_REFRESH_TOKEN_REUSE_DETECTED') {
      storageService.clear();
      throw new RefreshTokenReuseDetectedError();
    }

    // Handle 401 → trigger refresh (if applicable)
    if (axiosError.response?.status === 401 && shouldTriggerRefresh(axiosError)) {
      try {
        // Wait for refresh if already in progress
        if (isRefreshing && refreshPromise) {
          await refreshPromise;
          // After refresh completes, still throw the original error
          // The new token will be used in the retry (handled by auth interceptor)
          throw mapHttpErrorToDomainError(error);
        }

        // Start refresh
        await performTokenRefresh(storageService, httpClient);

        // Throw error after refresh (the request will be retried with new token)
        throw mapHttpErrorToDomainError(error);
      } catch (refreshError) {
        storageService.clear();
        throw mapHttpErrorToDomainError(refreshError);
      }
    }

    // Map to Domain Error
    throw mapHttpErrorToDomainError(error);
  };
}

/**
 * Determines if refresh should be triggered for this error
 */
function shouldTriggerRefresh(error: AxiosError): boolean {
  const url = error.config?.url || '';

  // Don't refresh if error is from refresh endpoint (prevent loop)
  if (url.includes('/api/auth/refresh')) {
    return false;
  }

  // Don't refresh for public endpoints
  if (PUBLIC_ENDPOINTS.some((endpoint) => url.includes(endpoint))) {
    return false;
  }

  return true;
}

/**
 * Performs token refresh flow
 */
async function performTokenRefresh(
  storageService: IStorageService,
  httpClient: IHttpClient
): Promise<void> {
  isRefreshing = true;

  refreshPromise = (async () => {
    try {
      const refreshToken = storageService.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await httpClient.post<any>('/api/auth/refresh', {
        refreshToken,
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data.tokens;

      storageService.setItem('accessToken', accessToken);
      storageService.setItem('refreshToken', newRefreshToken);
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  await refreshPromise;
}
