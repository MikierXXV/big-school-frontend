/**
 * ============================================
 * USE CASE: ListMembers
 * ============================================
 */

import type { IMembershipRepository } from '@domain/repositories/membership.repository.interface.js';
import type { MembershipDTO } from '../../dtos/organization/membership.dto.js';

export interface ListMembersDeps {
  membershipRepository: IMembershipRepository;
}

export class ListMembersUseCase {
  constructor(private readonly deps: ListMembersDeps) {}

  async execute(organizationId: string): Promise<MembershipDTO[]> {
    return this.deps.membershipRepository.getMembers(organizationId);
  }
}
