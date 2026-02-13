/**
 * ============================================
 * UNIT TEST: Error Mapper Utility
 * ============================================
 *
 * Tests para el mapeo de errores HTTP a Domain Errors.
 */

import { describe, it, expect } from 'vitest';
import { mapHttpErrorToDomainError, NetworkError, InternalServerError } from '@infrastructure/http/utils/error-mapper.util.js';
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
import { AxiosError } from 'axios';

describe('mapHttpErrorToDomainError', () => {
  it('should map 401 with INVALID_CREDENTIALS to InvalidCredentialsError', () => {
    const axiosError = createAxiosError(401, 'DOMAIN_INVALID_CREDENTIALS', 'Invalid email or password');

    const result = mapHttpErrorToDomainError(axiosError);

    expect(result).toBeInstanceOf(InvalidCredentialsError);
    expect(result.message).toBe('Invalid email or password');
  });

  it('should map 401 with REFRESH_TOKEN_EXPIRED to RefreshTokenExpiredError', () => {
    const axiosError = createAxiosError(401, 'DOMAIN_REFRESH_TOKEN_EXPIRED', 'Refresh token has expired');

    const result = mapHttpErrorToDomainError(axiosError);

    expect(result).toBeInstanceOf(RefreshTokenExpiredError);
  });

  it('should map 401 with REFRESH_TOKEN_REUSE_DETECTED to RefreshTokenReuseDetectedError', () => {
    const axiosError = createAxiosError(
      401,
      'DOMAIN_REFRESH_TOKEN_REUSE_DETECTED',
      'Refresh token reuse detected'
    );

    const result = mapHttpErrorToDomainError(axiosError);

    expect(result).toBeInstanceOf(RefreshTokenReuseDetectedError);
  });

  it('should map 409 with USER_ALREADY_EXISTS to UserAlreadyExistsError', () => {
    const axiosError = createAxiosError(
      409,
      'DOMAIN_USER_ALREADY_EXISTS',
      'User with email test@example.com already exists',
      { email: 'test@example.com' }
    );

    const result = mapHttpErrorToDomainError(axiosError);

    expect(result).toBeInstanceOf(UserAlreadyExistsError);
    expect((result as UserAlreadyExistsError).email).toBe('test@example.com');
  });

  it('should map 423 with ACCOUNT_LOCKED to AccountLockedError with remainingSeconds', () => {
    const axiosError = createAxiosError(
      423,
      'DOMAIN_ACCOUNT_LOCKED',
      'Account locked',
      { remainingSeconds: 900 }
    );

    const result = mapHttpErrorToDomainError(axiosError);

    expect(result).toBeInstanceOf(AccountLockedError);
    expect((result as AccountLockedError).remainingSeconds).toBe(900);
  });

  it('should map network error to NetworkError', () => {
    const axiosError = new AxiosError('Network Error');
    axiosError.code = 'ERR_NETWORK';

    const result = mapHttpErrorToDomainError(axiosError);

    expect(result).toBeInstanceOf(NetworkError);
  });

  it('should map timeout error to NetworkError', () => {
    const axiosError = new AxiosError('Timeout');
    axiosError.code = 'ECONNABORTED';

    const result = mapHttpErrorToDomainError(axiosError);

    expect(result).toBeInstanceOf(NetworkError);
  });

  it('should map 500 to InternalServerError', () => {
    const axiosError = createAxiosError(500, 'INTERNAL_SERVER_ERROR', 'Something went wrong');

    const result = mapHttpErrorToDomainError(axiosError);

    expect(result).toBeInstanceOf(InternalServerError);
  });

  it('should map 400 with WEAK_PASSWORD to WeakPasswordError', () => {
    const axiosError = createAxiosError(
      400,
      'DOMAIN_WEAK_PASSWORD',
      'Weak password',
      { missingRequirements: ['Minimum 8 characters', 'At least one uppercase letter'] }
    );

    const result = mapHttpErrorToDomainError(axiosError);

    expect(result).toBeInstanceOf(WeakPasswordError);
    expect((result as WeakPasswordError).missingRequirements).toEqual([
      'Minimum 8 characters',
      'At least one uppercase letter',
    ]);
  });

  it('should map 400 with PASSWORD_MISMATCH to PasswordMismatchError', () => {
    const axiosError = createAxiosError(400, 'DOMAIN_PASSWORD_MISMATCH', 'Passwords do not match');

    const result = mapHttpErrorToDomainError(axiosError);

    expect(result).toBeInstanceOf(PasswordMismatchError);
  });

  it('should map 403 with USER_NOT_ACTIVE to UserNotActiveError', () => {
    const axiosError = createAxiosError(
      403,
      'DOMAIN_USER_NOT_ACTIVE',
      'User is not active',
      { status: 'SUSPENDED' }
    );

    const result = mapHttpErrorToDomainError(axiosError);

    expect(result).toBeInstanceOf(UserNotActiveError);
    expect((result as UserNotActiveError).status).toBe('SUSPENDED');
  });

  it('should map 409 with EMAIL_ALREADY_VERIFIED to EmailAlreadyVerifiedError', () => {
    const axiosError = createAxiosError(
      409,
      'DOMAIN_EMAIL_ALREADY_VERIFIED',
      'Email already verified',
      { email: 'user@example.com' }
    );

    const result = mapHttpErrorToDomainError(axiosError);

    expect(result).toBeInstanceOf(EmailAlreadyVerifiedError);
  });

  it('should map 400 with TERMS_NOT_ACCEPTED to TermsNotAcceptedError', () => {
    const axiosError = createAxiosError(400, 'DOMAIN_TERMS_NOT_ACCEPTED', 'Terms not accepted');

    const result = mapHttpErrorToDomainError(axiosError);

    expect(result).toBeInstanceOf(TermsNotAcceptedError);
  });

  it('should map 400 with INVALID_VERIFICATION_TOKEN to InvalidVerificationTokenError', () => {
    const axiosError = createAxiosError(400, 'DOMAIN_INVALID_VERIFICATION_TOKEN', 'Invalid token');

    const result = mapHttpErrorToDomainError(axiosError);

    expect(result).toBeInstanceOf(InvalidVerificationTokenError);
  });

  it('should map 400 with VERIFICATION_TOKEN_EXPIRED to VerificationTokenExpiredError', () => {
    const axiosError = createAxiosError(400, 'DOMAIN_VERIFICATION_TOKEN_EXPIRED', 'Token expired');

    const result = mapHttpErrorToDomainError(axiosError);

    expect(result).toBeInstanceOf(VerificationTokenExpiredError);
  });

  it('should map 400 with INVALID_PASSWORD_RESET_TOKEN to InvalidPasswordResetTokenError', () => {
    const axiosError = createAxiosError(400, 'DOMAIN_INVALID_PASSWORD_RESET_TOKEN', 'Invalid reset token');

    const result = mapHttpErrorToDomainError(axiosError);

    expect(result).toBeInstanceOf(InvalidPasswordResetTokenError);
  });

  it('should map 400 with PASSWORD_RESET_TOKEN_EXPIRED to PasswordResetTokenExpiredError', () => {
    const axiosError = createAxiosError(400, 'DOMAIN_PASSWORD_RESET_TOKEN_EXPIRED', 'Reset token expired');

    const result = mapHttpErrorToDomainError(axiosError);

    expect(result).toBeInstanceOf(PasswordResetTokenExpiredError);
  });

  it('should map 400 with PASSWORD_RESET_TOKEN_ALREADY_USED to PasswordResetTokenAlreadyUsedError', () => {
    const axiosError = createAxiosError(
      400,
      'DOMAIN_PASSWORD_RESET_TOKEN_ALREADY_USED',
      'Reset token already used'
    );

    const result = mapHttpErrorToDomainError(axiosError);

    expect(result).toBeInstanceOf(PasswordResetTokenAlreadyUsedError);
  });

  it('should handle missing error code gracefully', () => {
    const axiosError = new AxiosError('Error');
    axiosError.response = {
      status: 400,
      data: { success: false, error: { message: 'Bad request' } },
      statusText: '',
      headers: {},
      config: {} as any,
    };

    const result = mapHttpErrorToDomainError(axiosError);

    expect(result.code).toBe('BAD_REQUEST');
  });

  it('should handle malformed response gracefully', () => {
    const axiosError = new AxiosError('Error');
    axiosError.response = {
      status: 500,
      data: null,
      statusText: '',
      headers: {},
      config: {} as any,
    };

    const result = mapHttpErrorToDomainError(axiosError);

    expect(result).toBeInstanceOf(InternalServerError);
  });

  it('should extract email from message when not in details', () => {
    const axiosError = createAxiosError(
      409,
      'DOMAIN_USER_ALREADY_EXISTS',
      'User with email extracted@example.com already exists'
    );

    const result = mapHttpErrorToDomainError(axiosError);

    expect(result).toBeInstanceOf(UserAlreadyExistsError);
    expect((result as UserAlreadyExistsError).email).toBe('extracted@example.com');
  });

  it('should handle non-Axios errors', () => {
    const regularError = new Error('Regular error');

    const result = mapHttpErrorToDomainError(regularError);

    expect(result).toBeInstanceOf(InternalServerError);
    expect(result.message).toBe('Regular error');
  });
});

// Helper to create AxiosError with response
function createAxiosError(
  status: number,
  code: string,
  message: string,
  details?: unknown
): AxiosError {
  const error = new AxiosError(message);
  error.response = {
    status,
    data: {
      success: false,
      error: {
        code,
        message,
        ...(details && { details }),
      },
    },
    statusText: '',
    headers: {},
    config: {} as any,
  };
  error.isAxiosError = true;
  return error;
}
