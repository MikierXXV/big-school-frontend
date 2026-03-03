/**
 * ============================================
 * DOMAIN ERRORS: Organization
 * ============================================
 *
 * Errores relacionados con organizaciones y membresías.
 */

import { DomainError } from './domain-error.base.js';

export class OrganizationNotFoundError extends DomainError {
  constructor(public readonly organizationId: string) {
    super(`Organization not found: ${organizationId}`, 'ORGANIZATION_NOT_FOUND');
  }
}

export class OrganizationAlreadyExistsError extends DomainError {
  constructor(public readonly name: string) {
    super(`Organization already exists: ${name}`, 'ORGANIZATION_ALREADY_EXISTS');
  }
}

export class MemberAlreadyExistsError extends DomainError {
  constructor(public readonly userId: string, public readonly organizationId: string) {
    super(
      `User ${userId} is already a member of organization ${organizationId}`,
      'MEMBER_ALREADY_EXISTS'
    );
  }
}

export class MemberNotFoundError extends DomainError {
  constructor(public readonly userId: string, public readonly organizationId: string) {
    super(
      `User ${userId} is not a member of organization ${organizationId}`,
      'MEMBER_NOT_FOUND'
    );
  }
}
