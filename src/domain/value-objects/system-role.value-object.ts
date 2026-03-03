/**
 * ============================================
 * VALUE OBJECT: SystemRole
 * ============================================
 *
 * Rol de sistema del usuario en la plataforma.
 *
 * ROLES:
 * - super_admin: Control total de la plataforma
 * - admin: Administrador con permisos delegados
 * - user: Usuario estándar (por defecto)
 */

export enum SystemRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  USER = 'user',
}

/**
 * Verifica si un string es un SystemRole válido.
 */
export function isValidSystemRole(value: string): value is SystemRole {
  return Object.values(SystemRole).includes(value as SystemRole);
}
