/**
 * ============================================
 * DTO: Verify Email
 * ============================================
 *
 * DTOs para operación de verificación de email.
 */

import type { UserDTO } from '../user.dto.js';

export interface VerifyEmailInputDTO {
  readonly token: string;
}

export interface VerifyEmailOutputDTO {
  readonly user: UserDTO;
  readonly message: string;
}
