/**
 * ============================================
 * USE CASE: UpdateOrganization
 * ============================================
 */

import type { IOrganizationRepository } from '@domain/repositories/organization.repository.interface.js';
import type { UpdateOrganizationDTO, OrganizationDTO } from '../../dtos/organization/organization.dto.js';

export interface UpdateOrganizationDeps {
  organizationRepository: IOrganizationRepository;
}

export class UpdateOrganizationUseCase {
  constructor(private readonly deps: UpdateOrganizationDeps) {}

  async execute(id: string, data: UpdateOrganizationDTO): Promise<OrganizationDTO> {
    return this.deps.organizationRepository.update(id, data);
  }
}
