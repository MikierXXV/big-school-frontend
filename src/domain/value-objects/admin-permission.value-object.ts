/**
 * ============================================
 * VALUE OBJECT: AdminPermission
 * ============================================
 *
 * Permisos granulares para administradores.
 *
 * PERMISOS:
 * - manage_users: Gestionar usuarios del sistema
 * - manage_organizations: Gestionar organizaciones
 * - assign_members: Asignar miembros a organizaciones
 * - view_all_data: Ver todos los datos del sistema
 */

export enum AdminPermission {
  MANAGE_USERS = 'manage_users',
  MANAGE_ORGANIZATIONS = 'manage_organizations',
  ASSIGN_MEMBERS = 'assign_members',
  VIEW_ALL_DATA = 'view_all_data',
}

/**
 * Verifica si un string es un AdminPermission válido.
 */
export function isValidAdminPermission(value: string): value is AdminPermission {
  return Object.values(AdminPermission).includes(value as AdminPermission);
}
