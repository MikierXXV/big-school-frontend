/**
 * ============================================
 * USE CASE: RemoveMember
 * ============================================
 */

import type { IMembershipRepository } from '@domain/repositories/membership.repository.interface.js';

export interface RemoveMemberDeps {
  membershipRepository: IMembershipRepository;
}

export class RemoveMemberUseCase {
  constructor(private readonly deps: RemoveMemberDeps) {}

  async execute(organizationId: string, userId: string): Promise<void> {
    return this.deps.membershipRepository.remove(organizationId, userId);
  }
}
