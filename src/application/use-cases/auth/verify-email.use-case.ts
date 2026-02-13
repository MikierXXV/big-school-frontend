/**
 * ============================================
 * USE CASE: VerifyEmail
 * ============================================
 *
 * Orquesta el flujo de verificación de email.
 */

import type { IAuthRepository } from '@domain/repositories/auth.repository.interface.js';
import { UserMapper } from '../../mappers/user.mapper.js';
import type { UserDTO } from '../../dtos/user.dto.js';

export interface VerifyEmailUseCaseDeps {
  authRepository: IAuthRepository;
}

export interface VerifyEmailInputDTO {
  readonly token: string;
}

export interface VerifyEmailOutputDTO {
  readonly user: UserDTO;
  readonly message: string;
}

export class VerifyEmailUseCase {
  constructor(private readonly deps: VerifyEmailUseCaseDeps) {}

  /**
   * Ejecuta el caso de uso de verificación de email.
   * @param input - Token de verificación
   * @returns Usuario con email verificado
   * @throws InvalidVerificationTokenError si el token es inválido
   * @throws VerificationTokenExpiredError si el token expiró
   * @throws EmailAlreadyVerifiedError si el email ya fue verificado
   */
  async execute(input: VerifyEmailInputDTO): Promise<VerifyEmailOutputDTO> {
    // 1. Llamar al repositorio para verificar email
    const result = await this.deps.authRepository.verifyEmail(input.token);

    // 2. Mapear usuario a DTO y retornar
    return {
      user: UserMapper.toApi(result.user),
      message: 'Email verified successfully',
    };
  }
}
