/**
 * ============================================
 * INTERCEPTOR: Auth
 * ============================================
 *
 * Agrega el token de autenticacion a todas las peticiones protegidas.
 */

import type { InternalAxiosRequestConfig } from 'axios';
import type { IStorageService } from '@application/ports/storage.port.js';

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
 * Creates an Axios request interceptor that adds Authorization header
 * to protected requests.
 *
 * @param storageService - Service to retrieve the access token
 * @returns Axios request interceptor function
 */
export function createAuthInterceptor(storageService: IStorageService) {
  return (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Skip public endpoints
    if (isPublicEndpoint(config.url)) {
      return config;
    }

    // Get access token from storage
    const accessToken = storageService.getItem('accessToken');

    // Add Authorization header if token exists
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  };
}

/**
 * Checks if the given URL is a public endpoint
 */
function isPublicEndpoint(url: string | undefined): boolean {
  if (!url) {
    return false;
  }

  return PUBLIC_ENDPOINTS.some((endpoint) => url.includes(endpoint));
}
