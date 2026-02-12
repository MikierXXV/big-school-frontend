/**
 * ============================================
 * UNIT TEST: Auth Errors
 * ============================================
 *
 * Tests para errores de dominio de autenticación.
 */

import { describe, it, expect } from 'vitest';
import {
  InvalidCredentialsError,
  AccountLockedError,
  UserNotActiveError,
  UserAlreadyExistsError,
  WeakPasswordError,
  PasswordMismatchError,
  TermsNotAcceptedError,
  EmailAlreadyVerifiedError,
  InvalidVerificationTokenError,
  VerificationTokenExpiredError,
  RefreshTokenExpiredError,
  RefreshTokenReuseDetectedError,
  InvalidPasswordResetTokenError,
  PasswordResetTokenExpiredError,
  PasswordResetTokenAlreadyUsedError,
} from '@domain/errors/auth.errors.js';

describe('Auth Errors', () => {
  it('should create InvalidCredentialsError', () => {
    const error = new InvalidCredentialsError();
    expect(error.message).toBe('Invalid email or password');
    expect(error.code).toBe('INVALID_CREDENTIALS');
  });

  it('should create AccountLockedError with remaining seconds', () => {
    const error = new AccountLockedError(900);
    expect(error.message).toContain('900 seconds');
    expect(error.remainingSeconds).toBe(900);
    expect(error.code).toBe('ACCOUNT_LOCKED');
  });

  it('should create UserNotActiveError with status', () => {
    const error = new UserNotActiveError('SUSPENDED');
    expect(error.message).toContain('suspended');
    expect(error.status).toBe('SUSPENDED');
  });

  it('should create UserAlreadyExistsError with email', () => {
    const error = new UserAlreadyExistsError('test@example.com');
    expect(error.message).toContain('test@example.com');
    expect(error.email).toBe('test@example.com');
  });

  it('should create WeakPasswordError with missing requirements', () => {
    const error = new WeakPasswordError(['Minimum 8 characters', 'At least one uppercase letter']);
    expect(error.message).toContain('Minimum 8 characters');
    expect(error.missingRequirements).toHaveLength(2);
  });

  it('should create PasswordMismatchError', () => {
    const error = new PasswordMismatchError();
    expect(error.message).toBe('Passwords do not match');
  });

  it('should create TermsNotAcceptedError', () => {
    const error = new TermsNotAcceptedError();
    expect(error.message).toContain('terms and conditions');
  });

  it('should create EmailAlreadyVerifiedError', () => {
    const error = new EmailAlreadyVerifiedError();
    expect(error.code).toBe('EMAIL_ALREADY_VERIFIED');
  });

  it('should create InvalidVerificationTokenError', () => {
    const error = new InvalidVerificationTokenError();
    expect(error.code).toBe('INVALID_VERIFICATION_TOKEN');
  });

  it('should create VerificationTokenExpiredError', () => {
    const error = new VerificationTokenExpiredError();
    expect(error.code).toBe('VERIFICATION_TOKEN_EXPIRED');
  });

  it('should create RefreshTokenExpiredError', () => {
    const error = new RefreshTokenExpiredError();
    expect(error.message).toContain('log in again');
  });

  it('should create RefreshTokenReuseDetectedError', () => {
    const error = new RefreshTokenReuseDetectedError();
    expect(error.message).toContain('reuse detected');
    expect(error.message).toContain('revoked');
  });

  it('should create InvalidPasswordResetTokenError', () => {
    const error = new InvalidPasswordResetTokenError();
    expect(error.code).toBe('INVALID_PASSWORD_RESET_TOKEN');
  });

  it('should create PasswordResetTokenExpiredError', () => {
    const error = new PasswordResetTokenExpiredError();
    expect(error.code).toBe('PASSWORD_RESET_TOKEN_EXPIRED');
  });

  it('should create PasswordResetTokenAlreadyUsedError', () => {
    const error = new PasswordResetTokenAlreadyUsedError();
    expect(error.code).toBe('PASSWORD_RESET_TOKEN_ALREADY_USED');
  });
});
