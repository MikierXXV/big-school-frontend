/**
 * ============================================
 * USE CASE: GetAdminPermissions
 * ============================================
 */

import type { IAdminRepository } from '@domain/repositories/admin.repository.interface.js';
import type { AdminPermissionsDTO } from '../../dtos/admin/admin.dto.js';

export interface GetAdminPermissionsDeps {
  adminRepository: IAdminRepository;
}

export class GetAdminPermissionsUseCase {
  constructor(private readonly deps: GetAdminPermissionsDeps) {}

  async execute(userId: string): Promise<AdminPermissionsDTO> {
    return this.deps.adminRepository.getPermissions(userId);
  }
}
