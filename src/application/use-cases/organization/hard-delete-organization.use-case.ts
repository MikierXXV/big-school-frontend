/**
 * ============================================
 * USE CASE: HardDeleteOrganization
 * ============================================
 */

import type { IOrganizationRepository } from '@domain/repositories/organization.repository.interface.js';

export interface HardDeleteOrganizationDeps {
  organizationRepository: IOrganizationRepository;
}

export class HardDeleteOrganizationUseCase {
  constructor(private readonly deps: HardDeleteOrganizationDeps) {}

  async execute(id: string): Promise<void> {
    return this.deps.organizationRepository.hardDelete(id);
  }
}
