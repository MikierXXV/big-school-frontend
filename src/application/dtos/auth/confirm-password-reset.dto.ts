/**
 * ============================================
 * DTO: Confirm Password Reset
 * ============================================
 *
 * DTO para confirmar reset de contraseña con nuevo password.
 * No hay output DTO (retorna void).
 */

export interface ConfirmPasswordResetInputDTO {
  readonly token: string;
  readonly newPassword: string;
  readonly passwordConfirmation: string;
}
