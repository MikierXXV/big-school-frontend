/**
 * ============================================
 * VALUE OBJECT: UserStatus
 * ============================================
 *
 * Estado del usuario en el sistema.
 *
 * ESTADOS:
 * - PENDING_VERIFICATION: Usuario pendiente de verificación de email
 * - ACTIVE: Usuario activo y verificado
 * - SUSPENDED: Usuario suspendido temporalmente
 * - DEACTIVATED: Usuario desactivado permanentemente
 */

export enum UserStatus {
  /** Usuario pendiente de verificación de email */
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  /** Usuario activo y verificado */
  ACTIVE = 'ACTIVE',
  /** Usuario suspendido temporalmente */
  SUSPENDED = 'SUSPENDED',
  /** Usuario desactivado permanentemente */
  DEACTIVATED = 'DEACTIVATED',
}
