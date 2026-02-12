/**
 * ============================================
 * DOMAIN ERRORS: Authentication
 * ============================================
 *
 * Errores específicos del dominio de autenticación.
 * Estos errores representan violaciones de reglas de negocio.
 */

import { DomainError } from './domain-error.base.js';

// ============================================
// AUTHENTICATION ERRORS
// ============================================

export class InvalidCredentialsError extends DomainError {
  constructor() {
    super('Invalid email or password', 'INVALID_CREDENTIALS');
  }
}

export class AccountLockedError extends DomainError {
  constructor(public readonly remainingSeconds: number) {
    super(`Account locked. Try again in ${remainingSeconds} seconds`, 'ACCOUNT_LOCKED');
  }
}

export class UserNotActiveError extends DomainError {
  constructor(public readonly status: string) {
    super(`User account is ${status.toLowerCase()}`, 'USER_NOT_ACTIVE');
  }
}

export class UserAlreadyExistsError extends DomainError {
  constructor(public readonly email: string) {
    super(`User with email ${email} already exists`, 'USER_ALREADY_EXISTS');
  }
}

// ============================================
// PASSWORD ERRORS
// ============================================

export class WeakPasswordError extends DomainError {
  constructor(public readonly missingRequirements: string[]) {
    const requirements = missingRequirements.join(', ');
    super(`Weak password. Missing requirements: ${requirements}`, 'WEAK_PASSWORD');
  }
}

export class PasswordMismatchError extends DomainError {
  constructor() {
    super('Passwords do not match', 'PASSWORD_MISMATCH');
  }
}

export class InvalidPasswordResetTokenError extends DomainError {
  constructor() {
    super('Invalid password reset token', 'INVALID_PASSWORD_RESET_TOKEN');
  }
}

export class PasswordResetTokenExpiredError extends DomainError {
  constructor() {
    super('Password reset token has expired', 'PASSWORD_RESET_TOKEN_EXPIRED');
  }
}

export class PasswordResetTokenAlreadyUsedError extends DomainError {
  constructor() {
    super('Password reset token has already been used', 'PASSWORD_RESET_TOKEN_ALREADY_USED');
  }
}

// ============================================
// EMAIL VERIFICATION ERRORS
// ============================================

export class EmailAlreadyVerifiedError extends DomainError {
  constructor() {
    super('Email is already verified', 'EMAIL_ALREADY_VERIFIED');
  }
}

export class InvalidVerificationTokenError extends DomainError {
  constructor() {
    super('Invalid verification token', 'INVALID_VERIFICATION_TOKEN');
  }
}

export class VerificationTokenExpiredError extends DomainError {
  constructor() {
    super('Verification token has expired', 'VERIFICATION_TOKEN_EXPIRED');
  }
}

// ============================================
// TOKEN ERRORS
// ============================================

export class RefreshTokenExpiredError extends DomainError {
  constructor() {
    super('Refresh token has expired. Please log in again', 'REFRESH_TOKEN_EXPIRED');
  }
}

export class RefreshTokenReuseDetectedError extends DomainError {
  constructor() {
    super(
      'Refresh token reuse detected. All sessions have been revoked for security',
      'REFRESH_TOKEN_REUSE_DETECTED'
    );
  }
}

// ============================================
// REGISTRATION ERRORS
// ============================================

export class TermsNotAcceptedError extends DomainError {
  constructor() {
    super('You must accept the terms and conditions', 'TERMS_NOT_ACCEPTED');
  }
}
