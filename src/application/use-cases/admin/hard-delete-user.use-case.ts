/**
 * ============================================
 * USE CASE: HardDeleteUser
 * ============================================
 */

import type { IAdminRepository } from '@domain/repositories/admin.repository.interface.js';

export interface HardDeleteUserDeps {
  adminRepository: IAdminRepository;
}

export class HardDeleteUserUseCase {
  constructor(private readonly deps: HardDeleteUserDeps) {}

  async execute(userId: string): Promise<void> {
    return this.deps.adminRepository.hardDeleteUser(userId);
  }
}
