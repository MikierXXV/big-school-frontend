/**
 * ============================================
 * REPOSITORY INTERFACE: Membership
 * ============================================
 */

import type {
  MembershipDTO,
  AssignMemberDTO,
  ChangeMemberRoleDTO,
  UserOrganizationDTO,
} from '@application/dtos/organization/membership.dto.js';

export interface IMembershipRepository {
  assign(organizationId: string, data: AssignMemberDTO): Promise<MembershipDTO>;
  remove(organizationId: string, userId: string): Promise<void>;
  changeRole(organizationId: string, userId: string, data: ChangeMemberRoleDTO): Promise<MembershipDTO>;
  getMembers(organizationId: string): Promise<MembershipDTO[]>;
  getUserOrganizations(userId: string): Promise<UserOrganizationDTO[]>;
}
