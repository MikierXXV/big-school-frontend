/**
 * ============================================
 * DTO: Admin
 * ============================================
 */

export interface AdminDTO {
  readonly userId: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly systemRole: string;
  readonly permissions: string[];
}

export interface AdminListDTO {
  readonly admins: AdminDTO[];
}

export interface AdminPermissionsDTO {
  readonly userId: string;
  readonly permissions: PermissionGrantDTO[];
}

export interface PermissionGrantDTO {
  readonly permission: string;
  readonly grantedBy: string;
  readonly grantedAt: string;
}

export interface GrantPermissionsDTO {
  readonly userId: string;
  readonly permissions: string[];
}

export interface RevokePermissionDTO {
  readonly userId: string;
  readonly permission: string;
}

export interface PromoteUserDTO {
  readonly userId: string;
}

export interface DemoteUserDTO {
  readonly userId: string;
}

export interface UserListItemDTO {
  readonly id: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly fullName: string;
  readonly systemRole: string;
  readonly status: string;
  readonly emailVerified: boolean;
  readonly createdAt: string;
  readonly authProvider: 'local' | 'google' | 'microsoft';
}

export interface PaginatedUsersDTO {
  readonly users: UserListItemDTO[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly totalPages: number;
  readonly hasNext: boolean;
  readonly hasPrevious: boolean;
}
