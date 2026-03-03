/**
 * ============================================
 * USE CASE: ChangeMemberRole
 * ============================================
 */

import type { IMembershipRepository } from '@domain/repositories/membership.repository.interface.js';
import type { ChangeMemberRoleDTO, MembershipDTO } from '../../dtos/organization/membership.dto.js';

export interface ChangeMemberRoleDeps {
  membershipRepository: IMembershipRepository;
}

export class ChangeMemberRoleUseCase {
  constructor(private readonly deps: ChangeMemberRoleDeps) {}

  async execute(organizationId: string, userId: string, data: ChangeMemberRoleDTO): Promise<MembershipDTO> {
    return this.deps.membershipRepository.changeRole(organizationId, userId, data);
  }
}
