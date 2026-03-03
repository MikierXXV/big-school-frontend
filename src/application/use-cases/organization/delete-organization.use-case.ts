/**
 * ============================================
 * USE CASE: DeleteOrganization
 * ============================================
 */

import type { IOrganizationRepository } from '@domain/repositories/organization.repository.interface.js';

export interface DeleteOrganizationDeps {
  organizationRepository: IOrganizationRepository;
}

export class DeleteOrganizationUseCase {
  constructor(private readonly deps: DeleteOrganizationDeps) {}

  async execute(id: string): Promise<void> {
    return this.deps.organizationRepository.deactivate(id);
  }
}
