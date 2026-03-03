/**
 * ============================================
 * USE CASE: GetOrganization
 * ============================================
 */

import type { IOrganizationRepository } from '@domain/repositories/organization.repository.interface.js';
import type { OrganizationDTO } from '../../dtos/organization/organization.dto.js';

export interface GetOrganizationDeps {
  organizationRepository: IOrganizationRepository;
}

export class GetOrganizationUseCase {
  constructor(private readonly deps: GetOrganizationDeps) {}

  async execute(id: string): Promise<OrganizationDTO> {
    return this.deps.organizationRepository.getById(id);
  }
}
