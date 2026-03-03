/**
 * ============================================
 * USE CASE: AssignMember
 * ============================================
 */

import type { IMembershipRepository } from '@domain/repositories/membership.repository.interface.js';
import type { AssignMemberDTO, MembershipDTO } from '../../dtos/organization/membership.dto.js';

export interface AssignMemberDeps {
  membershipRepository: IMembershipRepository;
}

export class AssignMemberUseCase {
  constructor(private readonly deps: AssignMemberDeps) {}

  async execute(organizationId: string, data: AssignMemberDTO): Promise<MembershipDTO> {
    return this.deps.membershipRepository.assign(organizationId, data);
  }
}
