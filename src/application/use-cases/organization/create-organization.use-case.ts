/**
 * ============================================
 * USE CASE: CreateOrganization
 * ============================================
 */

import type { IOrganizationRepository } from '@domain/repositories/organization.repository.interface.js';
import type { CreateOrganizationDTO, OrganizationDTO } from '../../dtos/organization/organization.dto.js';

export interface CreateOrganizationDeps {
  organizationRepository: IOrganizationRepository;
}

export class CreateOrganizationUseCase {
  constructor(private readonly deps: CreateOrganizationDeps) {}

  async execute(input: CreateOrganizationDTO): Promise<OrganizationDTO> {
    return this.deps.organizationRepository.create(input);
  }
}
