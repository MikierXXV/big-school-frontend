/**
 * ============================================
 * USE CASE: Register
 * ============================================
 *
 * Orquesta el flujo de registro de usuario.
 */

import type { IAuthRepository } from '@domain/repositories/auth.repository.interface.js';
import { UserMapper } from '../../mappers/user.mapper.js';
import type { UserDTO } from '../../dtos/user.dto.js';

export interface RegisterUseCaseDeps {
  authRepository: IAuthRepository;
}

export interface RegisterInputDTO {
  readonly email: string;
  readonly password: string;
  readonly passwordConfirmation: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly acceptTerms: boolean;
}

export interface RegisterOutputDTO {
  readonly user: UserDTO;
  readonly requiresEmailVerification: boolean;
  readonly verificationToken?: string;
}

export class RegisterUseCase {
  constructor(private readonly deps: RegisterUseCaseDeps) {}

  /**
   * Ejecuta el caso de uso de registro.
   * @param input - Datos de registro del usuario
   * @returns Usuario registrado y estado de verificación
   * @throws UserAlreadyExistsError si el email ya existe
   * @throws WeakPasswordError si la contraseña es débil
   * @throws PasswordMismatchError si las contraseñas no coinciden
   * @throws TermsNotAcceptedError si no acepta términos
   */
  async execute(input: RegisterInputDTO): Promise<RegisterOutputDTO> {
    // 1. Llamar al repositorio para registrar usuario
    const result = await this.deps.authRepository.register({
      email: input.email,
      password: input.password,
      passwordConfirmation: input.passwordConfirmation,
      firstName: input.firstName,
      lastName: input.lastName,
      acceptTerms: input.acceptTerms,
    });

    // 2. Mapear usuario a DTO y retornar (NO almacenar tokens)
    return {
      user: UserMapper.toApi(result.user),
      requiresEmailVerification: result.requiresEmailVerification,
      verificationToken: result.verificationToken,
    };
  }
}
