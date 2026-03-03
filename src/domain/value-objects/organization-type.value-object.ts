/**
 * ============================================
 * VALUE OBJECT: OrganizationType
 * ============================================
 *
 * Tipo de organización sanitaria.
 *
 * TIPOS:
 * - hospital: Hospital
 * - clinic: Clínica
 * - health_center: Centro de salud
 * - laboratory: Laboratorio
 * - pharmacy: Farmacia
 * - other: Otro tipo
 */

export enum OrganizationType {
  HOSPITAL = 'hospital',
  CLINIC = 'clinic',
  HEALTH_CENTER = 'health_center',
  LABORATORY = 'laboratory',
  PHARMACY = 'pharmacy',
  OTHER = 'other',
}

/**
 * Verifica si un string es un OrganizationType válido.
 */
export function isValidOrganizationType(value: string): value is OrganizationType {
  return Object.values(OrganizationType).includes(value as OrganizationType);
}
