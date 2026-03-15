/**
 * ============================================
 * REPOSITORY: HTTP Membership
 * ============================================
 *
 * Implementacion del repositorio de membresías usando HTTP.
 */

import type { IMembershipRepository } from '@domain/repositories/membership.repository.interface.js';
import type { IHttpClient } from '@application/ports/http-client.port.js';
import type {
  MembershipDTO,
  AssignMemberDTO,
  ChangeMemberRoleDTO,
  UserOrganizationDTO,
} from '@application/dtos/organization/membership.dto.js';

export class HttpMembershipRepository implements IMembershipRepository {
  constructor(private readonly httpClient: IHttpClient) {}

  async assign(organizationId: string, data: AssignMemberDTO): Promise<MembershipDTO> {
    const response = await this.httpClient.post<any>(
      `/api/organizations/${organizationId}/members`,
      data,
    );
    return response.data.data;
  }

  async remove(organizationId: string, userId: string): Promise<void> {
    await this.httpClient.delete(`/api/organizations/${organizationId}/members/${userId}`);
  }

  async changeRole(
    organizationId: string,
    userId: string,
    data: ChangeMemberRoleDTO,
  ): Promise<MembershipDTO> {
    const response = await this.httpClient.patch<any>(
      `/api/organizations/${organizationId}/members/${userId}/role`,
      { newRole: data.role },
    );
    return response.data.data;
  }

  async getMembers(organizationId: string): Promise<MembershipDTO[]> {
    const response = await this.httpClient.get<any>(
      `/api/organizations/${organizationId}/members`,
    );
    return response.data.data.members ?? response.data.data;
  }

  async getUserOrganizations(userId: string): Promise<UserOrganizationDTO[]> {
    const response = await this.httpClient.get<any>(`/api/users/${userId}/organizations`);
    return response.data.data.organizations ?? response.data.data;
  }
}
