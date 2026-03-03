/**
 * ============================================
 * USE CASE: GetUserOrganizations
 * ============================================
 */

import type { IMembershipRepository } from '@domain/repositories/membership.repository.interface.js';
import type { UserOrganizationDTO } from '../../dtos/organization/membership.dto.js';

export interface GetUserOrganizationsDeps {
  membershipRepository: IMembershipRepository;
}

export class GetUserOrganizationsUseCase {
  constructor(private readonly deps: GetUserOrganizationsDeps) {}

  async execute(userId: string): Promise<UserOrganizationDTO[]> {
    return this.deps.membershipRepository.getUserOrganizations(userId);
  }
}
