/**
 * ============================================
 * UTILITY: Error Mapper
 * ============================================
 *
 * Maps HTTP errors (AxiosError) to Domain Errors.
 * Centralizes error handling logic for the entire application.
 */

import { AxiosError } from 'axios';
import { DomainError } from '@domain/errors/domain-error.base.js';
import {
  InvalidCredentialsError,
  RefreshTokenExpiredError,
  RefreshTokenReuseDetectedError,
  UserAlreadyExistsError,
  WeakPasswordError,
  PasswordMismatchError,
  AccountLockedError,
  UserNotActiveError,
  InvalidVerificationTokenError,
  VerificationTokenExpiredError,
  EmailAlreadyVerifiedError,
  InvalidPasswordResetTokenError,
  PasswordResetTokenExpiredError,
  PasswordResetTokenAlreadyUsedError,
  TermsNotAcceptedError,
} from '@domain/errors/auth.errors.js';

/**
 * Network error (no connection, timeout, etc.)
 */
export class NetworkError extends DomainError {
  constructor(originalMessage?: string) {
    super(originalMessage || 'Network error. Please check your connection.', 'NETWORK_ERROR');
  }
}

/**
 * Internal server error (5xx)
 */
export class InternalServerError extends DomainError {
  constructor(message?: string) {
    super(message || 'An unexpected error occurred. Please try again later.', 'INTERNAL_SERVER_ERROR');
  }
}

/**
 * Error structure from backend API
 */
interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
    retryAfter?: number;
  };
}

/**
 * Maps HTTP errors to Domain Errors.
 * Handles Axios errors, network errors, and API errors.
 */
export function mapHttpErrorToDomainError(error: unknown): DomainError {
  // Not an Axios error → wrap as generic error
  if (!isAxiosError(error)) {
    return new InternalServerError(error instanceof Error ? error.message : 'Unknown error');
  }

  const axiosError = error as AxiosError<ApiErrorResponse>;

  // Network errors (no response)
  if (!axiosError.response) {
    if (axiosError.code === 'ERR_NETWORK' || axiosError.code === 'ECONNABORTED') {
      return new NetworkError(axiosError.message);
    }
    return new NetworkError();
  }

  // HTTP errors with response
  const { status, data } = axiosError.response;
  const errorCode = data?.error?.code;
  const errorMessage = data?.error?.message;
  const errorDetails = data?.error?.details;

  // Map by status code + error code
  return mapByStatusAndCode(status, errorCode, errorMessage, errorDetails);
}

/**
 * Maps by HTTP status code and error code from backend.
 */
function mapByStatusAndCode(
  status: number,
  code: string | undefined,
  message: string | undefined,
  details: unknown
): DomainError {
  // 401 Unauthorized
  if (status === 401) {
    switch (code) {
      case 'DOMAIN_INVALID_CREDENTIALS':
        return new InvalidCredentialsError();
      case 'DOMAIN_REFRESH_TOKEN_EXPIRED':
        return new RefreshTokenExpiredError();
      case 'DOMAIN_REFRESH_TOKEN_REUSE_DETECTED':
        return new RefreshTokenReuseDetectedError();
      default:
        return new InvalidCredentialsError();
    }
  }

  // 403 Forbidden
  if (status === 403) {
    if (code === 'DOMAIN_USER_NOT_ACTIVE') {
      const statusValue = (details as any)?.status || 'inactive';
      return new UserNotActiveError(statusValue);
    }
    return new DomainError(message || 'Forbidden', code || 'FORBIDDEN');
  }

  // 409 Conflict
  if (status === 409) {
    if (code === 'DOMAIN_USER_ALREADY_EXISTS') {
      // Extract email from error details or message
      const email = extractEmailFromDetails(details, message);
      return new UserAlreadyExistsError(email);
    }
    if (code === 'DOMAIN_EMAIL_ALREADY_VERIFIED') {
      const email = extractEmailFromDetails(details, message);
      return new EmailAlreadyVerifiedError(email);
    }
  }

  // 423 Locked
  if (status === 423 && code === 'DOMAIN_ACCOUNT_LOCKED') {
    const remainingSeconds = (details as any)?.remainingSeconds || 900;
    return new AccountLockedError(remainingSeconds);
  }

  // 400 Bad Request
  if (status === 400) {
    switch (code) {
      case 'DOMAIN_WEAK_PASSWORD':
        const missingReqs = (details as any)?.missingRequirements || [];
        return new WeakPasswordError(missingReqs);
      case 'DOMAIN_PASSWORD_MISMATCH':
        return new PasswordMismatchError();
      case 'DOMAIN_TERMS_NOT_ACCEPTED':
        return new TermsNotAcceptedError();
      case 'DOMAIN_INVALID_VERIFICATION_TOKEN':
        return new InvalidVerificationTokenError();
      case 'DOMAIN_VERIFICATION_TOKEN_EXPIRED':
        return new VerificationTokenExpiredError();
      case 'DOMAIN_INVALID_PASSWORD_RESET_TOKEN':
        return new InvalidPasswordResetTokenError();
      case 'DOMAIN_PASSWORD_RESET_TOKEN_EXPIRED':
        return new PasswordResetTokenExpiredError();
      case 'DOMAIN_PASSWORD_RESET_TOKEN_ALREADY_USED':
        return new PasswordResetTokenAlreadyUsedError();
      default:
        return new DomainError(message || 'Bad request', code || 'BAD_REQUEST');
    }
  }

  // 500+ Server Errors
  if (status >= 500) {
    return new InternalServerError(message);
  }

  // Fallback
  return new DomainError(message || 'An error occurred', code || 'UNKNOWN_ERROR');
}

/**
 * Type guard for AxiosError
 */
function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError === true;
}

/**
 * Extracts email from error details or message.
 */
function extractEmailFromDetails(details: unknown, message: string | undefined): string {
  if (details && typeof details === 'object' && 'email' in details) {
    return (details as any).email;
  }
  // Try to extract from message: "User with email xxx@example.com already exists"
  const match = message?.match(/email\s+([^\s]+)/i);
  return match?.[1] || 'unknown';
}
