/**
 * ============================================
 * REPOSITORY: HTTP Organization
 * ============================================
 *
 * Implementacion del repositorio de organizaciones usando HTTP.
 */

import type { IOrganizationRepository } from '@domain/repositories/organization.repository.interface.js';
import type { IHttpClient } from '@application/ports/http-client.port.js';
import type {
  OrganizationDTO,
  CreateOrganizationDTO,
  UpdateOrganizationDTO,
  PaginatedOrganizationsDTO,
  ListOrganizationsQueryDTO,
} from '@application/dtos/organization/organization.dto.js';

export class HttpOrganizationRepository implements IOrganizationRepository {
  constructor(private readonly httpClient: IHttpClient) {}

  async create(data: CreateOrganizationDTO): Promise<OrganizationDTO> {
    const response = await this.httpClient.post<any>('/api/organizations', data);
    return response.data.data;
  }

  async list(query: ListOrganizationsQueryDTO): Promise<PaginatedOrganizationsDTO> {
    const params: Record<string, unknown> = {};
    if (query.page !== undefined) params.page = query.page;
    if (query.limit !== undefined) params.limit = query.limit;
    if (query.type !== undefined) params.type = query.type;
    if (query.active !== undefined) params.active = query.active;
    if (query.search !== undefined) params.search = query.search;

    const response = await this.httpClient.get<any>('/api/organizations', { params });
    const data = response.data.data;
    const totalPages = data.totalPages ?? Math.ceil(data.total / data.limit);
    return {
      ...data,
      totalPages,
      hasNext: data.hasNext ?? (data.page < totalPages),
      hasPrevious: data.hasPrevious ?? (data.page > 1),
    };
  }

  async getById(id: string): Promise<OrganizationDTO> {
    const response = await this.httpClient.get<any>(`/api/organizations/${id}`);
    return response.data.data;
  }

  async update(id: string, data: UpdateOrganizationDTO): Promise<OrganizationDTO> {
    const response = await this.httpClient.put<any>(`/api/organizations/${id}`, data);
    return response.data.data;
  }

  async deactivate(id: string): Promise<void> {
    await this.httpClient.delete(`/api/organizations/${id}`);
  }
}
