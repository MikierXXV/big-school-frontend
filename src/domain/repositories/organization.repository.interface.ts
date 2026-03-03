/**
 * ============================================
 * REPOSITORY INTERFACE: Organization
 * ============================================
 */

import type {
  OrganizationDTO,
  CreateOrganizationDTO,
  UpdateOrganizationDTO,
  PaginatedOrganizationsDTO,
  ListOrganizationsQueryDTO,
} from '@application/dtos/organization/organization.dto.js';

export interface IOrganizationRepository {
  create(data: CreateOrganizationDTO): Promise<OrganizationDTO>;
  list(query: ListOrganizationsQueryDTO): Promise<PaginatedOrganizationsDTO>;
  getById(id: string): Promise<OrganizationDTO>;
  update(id: string, data: UpdateOrganizationDTO): Promise<OrganizationDTO>;
  deactivate(id: string): Promise<void>;
}
