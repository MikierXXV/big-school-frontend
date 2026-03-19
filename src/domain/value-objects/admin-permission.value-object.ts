/**
 * ============================================
 * VALUE OBJECT: AdminPermission
 * ============================================
 *
 * Permisos granulares para administradores.
 *
 * PERMISOS:
 * - manage_organizations: Gestionar organizaciones y asignar miembros
 * - view_all_data: Ver todos los datos del sistema
 */

export const AdminPermission = {
  MANAGE_ORGANIZATIONS: 'manage_organizations',
  VIEW_ALL_DATA: 'view_all_data',
} as const;

export type AdminPermission = (typeof AdminPermission)[keyof typeof AdminPermission];

/**
 * Verifica si un string es un AdminPermission válido.
 */
export function isValidAdminPermission(value: string): value is AdminPermission {
  return Object.values(AdminPermission).includes(value as AdminPermission);
}
