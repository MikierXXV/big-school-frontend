/**
 * ============================================
 * REPOSITORY INTERFACE: Admin
 * ============================================
 */

import type {
  AdminListDTO,
  AdminPermissionsDTO,
  GrantPermissionsDTO,
  RevokePermissionDTO,
  PromoteUserDTO,
  DemoteUserDTO,
  PaginatedUsersDTO,
} from '@application/dtos/admin/admin.dto.js';

export interface IAdminRepository {
  promote(data: PromoteUserDTO): Promise<void>;
  demote(data: DemoteUserDTO): Promise<void>;
  listAdmins(): Promise<AdminListDTO>;
  getPermissions(userId: string): Promise<AdminPermissionsDTO>;
  grantPermissions(data: GrantPermissionsDTO): Promise<AdminPermissionsDTO>;
  revokePermission(data: RevokePermissionDTO): Promise<AdminPermissionsDTO>;
  listUsers(query: { page?: number; limit?: number; search?: string }): Promise<PaginatedUsersDTO>;
}
