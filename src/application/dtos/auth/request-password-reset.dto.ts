/**
 * ============================================
 * DTO: Request Password Reset
 * ============================================
 *
 * DTO para solicitar reset de contraseña.
 * No hay output DTO (retorna void).
 */

export interface RequestPasswordResetInputDTO {
  readonly email: string;
}
