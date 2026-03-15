/**
 * ============================================
 * DTO: Organization
 * ============================================
 */

export interface OrganizationDTO {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly description: string;
  readonly address: string;
  readonly contactEmail: string;
  readonly contactPhone: string;
  readonly active: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface CreateOrganizationDTO {
  readonly name: string;
  readonly type: string;
  readonly description: string;
  readonly address: string;
  readonly contactEmail: string;
  readonly contactPhone: string;
}

export interface UpdateOrganizationDTO {
  readonly name?: string;
  readonly type?: string;
  readonly description?: string;
  readonly address?: string;
  readonly contactEmail?: string;
  readonly contactPhone?: string;
}

export interface ListOrganizationsQueryDTO {
  readonly page?: number;
  readonly limit?: number;
  readonly type?: string;
  readonly active?: boolean;
  readonly search?: string;
}

export interface PaginatedOrganizationsDTO {
  readonly organizations: OrganizationDTO[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly totalPages: number;
  readonly hasNext: boolean;
  readonly hasPrevious: boolean;
}
