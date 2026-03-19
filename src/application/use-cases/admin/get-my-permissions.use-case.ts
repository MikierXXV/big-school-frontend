/**
 * ============================================
 * USE CASE: GetMyPermissions
 * ============================================
 *
 * Fetches the current authenticated admin user's own permissions.
 * Uses the /admin/my-permissions endpoint which only requires authentication,
 * enabling bootstrap of the admin panel sidebar on first load.
 */

import type { IAdminRepository } from '@domain/repositories/admin.repository.interface.js';
import type { AdminPermissionsDTO } from '../../dtos/admin/admin.dto.js';

export interface GetMyPermissionsDeps {
  adminRepository: IAdminRepository;
}

export class GetMyPermissionsUseCase {
  constructor(private readonly deps: GetMyPermissionsDeps) {}

  async execute(): Promise<AdminPermissionsDTO> {
    return this.deps.adminRepository.getMyPermissions();
  }
}
