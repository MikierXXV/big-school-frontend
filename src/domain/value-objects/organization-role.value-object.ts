/**
 * ============================================
 * VALUE OBJECT: OrganizationRole
 * ============================================
 *
 * Rol del usuario dentro de una organización.
 *
 * ROLES:
 * - org_admin: Administrador de la organización
 * - doctor: Médico
 * - nurse: Enfermero/a
 * - specialist: Especialista
 * - staff: Personal administrativo
 * - guest: Invitado con acceso limitado
 */

export enum OrganizationRole {
  ORG_ADMIN = 'org_admin',
  DOCTOR = 'doctor',
  NURSE = 'nurse',
  SPECIALIST = 'specialist',
  STAFF = 'staff',
  GUEST = 'guest',
}

/**
 * Verifica si un string es un OrganizationRole válido.
 */
export function isValidOrganizationRole(value: string): value is OrganizationRole {
  return Object.values(OrganizationRole).includes(value as OrganizationRole);
}
