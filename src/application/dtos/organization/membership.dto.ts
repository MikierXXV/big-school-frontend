/**
 * ============================================
 * DTO: Membership
 * ============================================
 */

export interface MembershipDTO {
  readonly id: string;
  readonly userId: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly organizationId: string;
  readonly role: string;
  readonly joinedAt: string;
  readonly isActive: boolean;
}

export interface AssignMemberDTO {
  readonly userId: string;
  readonly role: string;
}

export interface ChangeMemberRoleDTO {
  readonly role: string;
}

export interface ListMembersQueryDTO {
  readonly page?: number;
  readonly limit?: number;
}

export interface PaginatedMembersDTO {
  readonly members: MembershipDTO[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly totalPages: number;
}

export interface UserOrganizationDTO {
  readonly organizationId: string;
  readonly organizationName: string;
  readonly organizationType: string;
  readonly role: string;
  readonly joinedAt: string;
  readonly isActive: boolean;
}
