/**
 * ============================================
 * USE CASE: RevokePermission
 * ============================================
 */

import type { IAdminRepository } from '@domain/repositories/admin.repository.interface.js';
import type { RevokePermissionDTO, AdminPermissionsDTO } from '../../dtos/admin/admin.dto.js';

export interface RevokePermissionDeps {
  adminRepository: IAdminRepository;
}

export class RevokePermissionUseCase {
  constructor(private readonly deps: RevokePermissionDeps) {}

  async execute(data: RevokePermissionDTO): Promise<AdminPermissionsDTO> {
    return this.deps.adminRepository.revokePermission(data);
  }
}
