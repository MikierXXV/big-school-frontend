/**
 * ============================================
 * REPOSITORY: HTTP Admin
 * ============================================
 *
 * Implementacion del repositorio de administración usando HTTP.
 */

import type { IAdminRepository } from '@domain/repositories/admin.repository.interface.js';
import type { IHttpClient } from '@application/ports/http-client.port.js';
import type {
  AdminListDTO,
  AdminPermissionsDTO,
  GrantPermissionsDTO,
  RevokePermissionDTO,
  PromoteUserDTO,
  DemoteUserDTO,
  PaginatedUsersDTO,
} from '@application/dtos/admin/admin.dto.js';

export class HttpAdminRepository implements IAdminRepository {
  constructor(private readonly httpClient: IHttpClient) {}

  async promote(data: PromoteUserDTO): Promise<void> {
    await this.httpClient.post('/api/admin/promote', data);
  }

  async demote(data: DemoteUserDTO): Promise<void> {
    await this.httpClient.post('/api/admin/demote', data);
  }

  async listAdmins(): Promise<AdminListDTO> {
    const response = await this.httpClient.get<any>('/api/admin/list');
    return response.data.data;
  }

  async getPermissions(userId: string): Promise<AdminPermissionsDTO> {
    const response = await this.httpClient.get<any>(`/api/admin/${userId}/permissions`);
    return response.data.data;
  }

  async grantPermissions(data: GrantPermissionsDTO): Promise<AdminPermissionsDTO> {
    const response = await this.httpClient.post<any>('/api/admin/permissions/grant', data);
    return response.data.data;
  }

  async revokePermission(data: RevokePermissionDTO): Promise<AdminPermissionsDTO> {
    const response = await this.httpClient.post<any>('/api/admin/permissions/revoke', data);
    return response.data.data;
  }

  async listUsers(query: { page?: number; limit?: number; search?: string }): Promise<PaginatedUsersDTO> {
    const params: Record<string, unknown> = {};
    if (query.page !== undefined) params.page = query.page;
    if (query.limit !== undefined) params.limit = query.limit;
    if (query.search !== undefined) params.search = query.search;

    const response = await this.httpClient.get<any>('/api/users', { params });
    return response.data.data;
  }
}
