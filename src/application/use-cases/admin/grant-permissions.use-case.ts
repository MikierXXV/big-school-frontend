/**
 * ============================================
 * USE CASE: GrantPermissions
 * ============================================
 */

import type { IAdminRepository } from '@domain/repositories/admin.repository.interface.js';
import type { GrantPermissionsDTO, AdminPermissionsDTO } from '../../dtos/admin/admin.dto.js';

export interface GrantPermissionsDeps {
  adminRepository: IAdminRepository;
}

export class GrantPermissionsUseCase {
  constructor(private readonly deps: GrantPermissionsDeps) {}

  async execute(data: GrantPermissionsDTO): Promise<AdminPermissionsDTO> {
    return this.deps.adminRepository.grantPermissions(data);
  }
}
