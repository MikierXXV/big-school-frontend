/**
 * ============================================
 * DI CONTAINER
 * ============================================
 *
 * Dependency injection container for wiring application.
 * Creates and configures all dependencies.
 */

import { AxiosHttpClient } from '@infrastructure/http/axios-http-client.js';
import { LocalStorageService } from '@infrastructure/storage/local-storage.service.js';
import { HttpAuthRepository } from '@infrastructure/repositories/http-auth.repository.js';
import { HttpOrganizationRepository } from '@infrastructure/repositories/http-organization.repository.js';
import { HttpMembershipRepository } from '@infrastructure/repositories/http-membership.repository.js';
import { HttpAdminRepository } from '@infrastructure/repositories/http-admin.repository.js';

import { LoginUseCase } from '@application/use-cases/auth/login.use-case.js';
import { RegisterUseCase } from '@application/use-cases/auth/register.use-case.js';
import { LogoutUseCase } from '@application/use-cases/auth/logout.use-case.js';
import { RefreshSessionUseCase } from '@application/use-cases/auth/refresh-session.use-case.js';
import { VerifyEmailUseCase } from '@application/use-cases/auth/verify-email.use-case.js';
import { RequestPasswordResetUseCase } from '@application/use-cases/auth/request-password-reset.use-case.js';
import { ConfirmPasswordResetUseCase } from '@application/use-cases/auth/confirm-password-reset.use-case.js';

import { CreateOrganizationUseCase } from '@application/use-cases/organization/create-organization.use-case.js';
import { ListOrganizationsUseCase } from '@application/use-cases/organization/list-organizations.use-case.js';
import { GetOrganizationUseCase } from '@application/use-cases/organization/get-organization.use-case.js';
import { UpdateOrganizationUseCase } from '@application/use-cases/organization/update-organization.use-case.js';
import { DeleteOrganizationUseCase } from '@application/use-cases/organization/delete-organization.use-case.js';

import { AssignMemberUseCase } from '@application/use-cases/membership/assign-member.use-case.js';
import { ListMembersUseCase } from '@application/use-cases/membership/list-members.use-case.js';
import { ChangeMemberRoleUseCase } from '@application/use-cases/membership/change-member-role.use-case.js';
import { RemoveMemberUseCase } from '@application/use-cases/membership/remove-member.use-case.js';
import { GetUserOrganizationsUseCase } from '@application/use-cases/membership/get-user-organizations.use-case.js';

import { PromoteAdminUseCase } from '@application/use-cases/admin/promote-admin.use-case.js';
import { DemoteAdminUseCase } from '@application/use-cases/admin/demote-admin.use-case.js';
import { ListAdminsUseCase } from '@application/use-cases/admin/list-admins.use-case.js';
import { GetAdminPermissionsUseCase } from '@application/use-cases/admin/get-admin-permissions.use-case.js';
import { GrantPermissionsUseCase } from '@application/use-cases/admin/grant-permissions.use-case.js';
import { RevokePermissionUseCase } from '@application/use-cases/admin/revoke-permission.use-case.js';
import { ListUsersUseCase } from '@application/use-cases/admin/list-users.use-case.js';

/**
 * Container interface
 */
export interface Container {
  useCases: {
    // Auth
    loginUseCase: LoginUseCase;
    registerUseCase: RegisterUseCase;
    logoutUseCase: LogoutUseCase;
    refreshSessionUseCase: RefreshSessionUseCase;
    verifyEmailUseCase: VerifyEmailUseCase;
    requestPasswordResetUseCase: RequestPasswordResetUseCase;
    confirmPasswordResetUseCase: ConfirmPasswordResetUseCase;
    // Organization
    createOrganizationUseCase: CreateOrganizationUseCase;
    listOrganizationsUseCase: ListOrganizationsUseCase;
    getOrganizationUseCase: GetOrganizationUseCase;
    updateOrganizationUseCase: UpdateOrganizationUseCase;
    deleteOrganizationUseCase: DeleteOrganizationUseCase;
    // Membership
    assignMemberUseCase: AssignMemberUseCase;
    listMembersUseCase: ListMembersUseCase;
    changeMemberRoleUseCase: ChangeMemberRoleUseCase;
    removeMemberUseCase: RemoveMemberUseCase;
    getUserOrganizationsUseCase: GetUserOrganizationsUseCase;
    // Admin
    promoteAdminUseCase: PromoteAdminUseCase;
    demoteAdminUseCase: DemoteAdminUseCase;
    listAdminsUseCase: ListAdminsUseCase;
    getAdminPermissionsUseCase: GetAdminPermissionsUseCase;
    grantPermissionsUseCase: GrantPermissionsUseCase;
    revokePermissionUseCase: RevokePermissionUseCase;
    listUsersUseCase: ListUsersUseCase;
  };
}

// Singleton instance
let containerInstance: Container | null = null;

/**
 * Create and configure the DI container
 */
export function createContainer(): Container {
  // Return existing instance if already created (singleton)
  if (containerInstance) {
    return containerInstance;
  }

  // Get API base URL from environment or use default
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';

  // Infrastructure Layer - Create adapters
  const httpClient = new AxiosHttpClient(apiBaseUrl);
  const storageService = new LocalStorageService();

  // Infrastructure Layer - Create repositories
  const authRepository = new HttpAuthRepository(httpClient);
  const organizationRepository = new HttpOrganizationRepository(httpClient);
  const membershipRepository = new HttpMembershipRepository(httpClient);
  const adminRepository = new HttpAdminRepository(httpClient);

  // Application Layer - Auth use cases
  const loginUseCase = new LoginUseCase({
    authRepository,
    storageService,
  });

  const registerUseCase = new RegisterUseCase({
    authRepository,
  });

  const logoutUseCase = new LogoutUseCase({
    authRepository,
    storageService,
  });

  const refreshSessionUseCase = new RefreshSessionUseCase({
    authRepository,
    storageService,
  });

  const verifyEmailUseCase = new VerifyEmailUseCase({
    authRepository,
  });

  const requestPasswordResetUseCase = new RequestPasswordResetUseCase({
    authRepository,
  });

  const confirmPasswordResetUseCase = new ConfirmPasswordResetUseCase({
    authRepository,
  });

  // Application Layer - Organization use cases
  const createOrganizationUseCase = new CreateOrganizationUseCase({ organizationRepository });
  const listOrganizationsUseCase = new ListOrganizationsUseCase({ organizationRepository });
  const getOrganizationUseCase = new GetOrganizationUseCase({ organizationRepository });
  const updateOrganizationUseCase = new UpdateOrganizationUseCase({ organizationRepository });
  const deleteOrganizationUseCase = new DeleteOrganizationUseCase({ organizationRepository });

  // Application Layer - Membership use cases
  const assignMemberUseCase = new AssignMemberUseCase({ membershipRepository });
  const listMembersUseCase = new ListMembersUseCase({ membershipRepository });
  const changeMemberRoleUseCase = new ChangeMemberRoleUseCase({ membershipRepository });
  const removeMemberUseCase = new RemoveMemberUseCase({ membershipRepository });
  const getUserOrganizationsUseCase = new GetUserOrganizationsUseCase({ membershipRepository });

  // Application Layer - Admin use cases
  const promoteAdminUseCase = new PromoteAdminUseCase({ adminRepository });
  const demoteAdminUseCase = new DemoteAdminUseCase({ adminRepository });
  const listAdminsUseCase = new ListAdminsUseCase({ adminRepository });
  const getAdminPermissionsUseCase = new GetAdminPermissionsUseCase({ adminRepository });
  const grantPermissionsUseCase = new GrantPermissionsUseCase({ adminRepository });
  const revokePermissionUseCase = new RevokePermissionUseCase({ adminRepository });
  const listUsersUseCase = new ListUsersUseCase({ adminRepository });

  // Create container
  containerInstance = {
    useCases: {
      loginUseCase,
      registerUseCase,
      logoutUseCase,
      refreshSessionUseCase,
      verifyEmailUseCase,
      requestPasswordResetUseCase,
      confirmPasswordResetUseCase,
      createOrganizationUseCase,
      listOrganizationsUseCase,
      getOrganizationUseCase,
      updateOrganizationUseCase,
      deleteOrganizationUseCase,
      assignMemberUseCase,
      listMembersUseCase,
      changeMemberRoleUseCase,
      removeMemberUseCase,
      getUserOrganizationsUseCase,
      promoteAdminUseCase,
      demoteAdminUseCase,
      listAdminsUseCase,
      getAdminPermissionsUseCase,
      grantPermissionsUseCase,
      revokePermissionUseCase,
      listUsersUseCase,
    },
  };

  return containerInstance;
}

/**
 * Reset container (useful for testing)
 */
export function resetContainer(): void {
  containerInstance = null;
}
