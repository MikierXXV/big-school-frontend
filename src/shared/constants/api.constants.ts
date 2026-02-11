/**
 * ============================================
 * CONSTANTS: API
 * ============================================
 *
 * Constantes relacionadas con la API del backend.
 */

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY_EMAIL: '/auth/verify-email',
  },
  USER: {
    PROFILE: '/users/me',
  },
} as const;

export const TOKEN_CONFIG = {
  ACCESS_TOKEN_EXPIRY: 18000, // 5 hours in seconds
  REFRESH_TOKEN_EXPIRY: 259200, // 3 days in seconds
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'big_school_access_token',
  REFRESH_TOKEN: 'big_school_refresh_token',
  USER: 'big_school_user',
} as const;
