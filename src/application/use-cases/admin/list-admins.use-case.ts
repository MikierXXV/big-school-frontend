/**
 * ============================================
 * USE CASE: ListAdmins
 * ============================================
 */

import type { IAdminRepository } from '@domain/repositories/admin.repository.interface.js';
import type { AdminListDTO } from '../../dtos/admin/admin.dto.js';

export interface ListAdminsDeps {
  adminRepository: IAdminRepository;
}

export class ListAdminsUseCase {
  constructor(private readonly deps: ListAdminsDeps) {}

  async execute(): Promise<AdminListDTO> {
    return this.deps.adminRepository.listAdmins();
  }
}
