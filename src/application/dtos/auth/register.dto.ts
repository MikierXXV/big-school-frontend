/**
 * ============================================
 * DTO: Register
 * ============================================
 *
 * Datos para el caso de uso de registro.
 */

export interface RegisterDTO {
  readonly email: string;
  readonly password: string;
  readonly firstName: string;
  readonly lastName: string;
}
