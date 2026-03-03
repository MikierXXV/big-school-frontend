/**
 * ============================================
 * USE CASE: PromoteAdmin
 * ============================================
 */

import type { IAdminRepository } from '@domain/repositories/admin.repository.interface.js';
import type { PromoteUserDTO } from '../../dtos/admin/admin.dto.js';

export interface PromoteAdminDeps {
  adminRepository: IAdminRepository;
}

export class PromoteAdminUseCase {
  constructor(private readonly deps: PromoteAdminDeps) {}

  async execute(data: PromoteUserDTO): Promise<void> {
    return this.deps.adminRepository.promote(data);
  }
}
