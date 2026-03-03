/**
 * ============================================
 * USE CASE: DemoteAdmin
 * ============================================
 */

import type { IAdminRepository } from '@domain/repositories/admin.repository.interface.js';
import type { DemoteUserDTO } from '../../dtos/admin/admin.dto.js';

export interface DemoteAdminDeps {
  adminRepository: IAdminRepository;
}

export class DemoteAdminUseCase {
  constructor(private readonly deps: DemoteAdminDeps) {}

  async execute(data: DemoteUserDTO): Promise<void> {
    return this.deps.adminRepository.demote(data);
  }
}
