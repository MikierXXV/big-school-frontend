/**
 * ============================================
 * DOMAIN ERRORS: Authentication
 * ============================================
 *
 * Errores relacionados con autenticacion.
 */

import { DomainError } from './domain-error.base.js';

export class InvalidCredentialsError extends DomainError {
  constructor() {
    super('Invalid email or password', 'INVALID_CREDENTIALS');
  }
}

export class EmailAlreadyExistsError extends DomainError {
  constructor(email: string) {
    super(`Email ${email} already exists`, 'EMAIL_ALREADY_EXISTS');
  }
}

export class TokenExpiredError extends DomainError {
  constructor() {
    super('Token has expired', 'TOKEN_EXPIRED');
  }
}

export class UnauthorizedError extends DomainError {
  constructor() {
    super('Unauthorized access', 'UNAUTHORIZED');
  }
}
