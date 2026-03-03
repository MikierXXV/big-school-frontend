/**
 * ============================================
 * USE CASE: ListOrganizations
 * ============================================
 */

import type { IOrganizationRepository } from '@domain/repositories/organization.repository.interface.js';
import type { ListOrganizationsQueryDTO, PaginatedOrganizationsDTO } from '../../dtos/organization/organization.dto.js';

export interface ListOrganizationsDeps {
  organizationRepository: IOrganizationRepository;
}

export class ListOrganizationsUseCase {
  constructor(private readonly deps: ListOrganizationsDeps) {}

  async execute(query: ListOrganizationsQueryDTO = {}): Promise<PaginatedOrganizationsDTO> {
    return this.deps.organizationRepository.list(query);
  }
}
