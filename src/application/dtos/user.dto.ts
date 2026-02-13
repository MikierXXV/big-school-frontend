/**
 * ============================================
 * DTO: User
 * ============================================
 *
 * Data Transfer Object para User entity.
 * Representa la forma serializable del User para transferencia.
 */

export interface UserDTO {
  readonly id: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly status: string;
  readonly emailVerified: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}
