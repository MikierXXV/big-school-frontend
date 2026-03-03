/**
 * ============================================
 * USE CASE: ListUsers
 * ============================================
 */

import type { IAdminRepository } from '@domain/repositories/admin.repository.interface.js';
import type { PaginatedUsersDTO } from '../../dtos/admin/admin.dto.js';

export interface ListUsersDeps {
  adminRepository: IAdminRepository;
}

export class ListUsersUseCase {
  constructor(private readonly deps: ListUsersDeps) {}

  async execute(query: { page?: number; limit?: number; search?: string } = {}): Promise<PaginatedUsersDTO> {
    return this.deps.adminRepository.listUsers(query);
  }
}
