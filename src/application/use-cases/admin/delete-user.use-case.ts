/**
 * ============================================
 * USE CASE: DeleteUser
 * ============================================
 */

import type { IAdminRepository } from '@domain/repositories/admin.repository.interface.js';

export interface DeleteUserDeps {
  adminRepository: IAdminRepository;
}

export class DeleteUserUseCase {
  constructor(private readonly deps: DeleteUserDeps) {}

  async execute(userId: string): Promise<void> {
    return this.deps.adminRepository.deleteUser(userId);
  }
}
