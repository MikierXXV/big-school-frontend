/**
 * ============================================
 * USE CASE: ConfirmPasswordReset
 * ============================================
 *
 * Orquesta el flujo de confirmación de reset de contraseña.
 */

import type { IAuthRepository } from '@domain/repositories/auth.repository.interface.js';

export interface ConfirmPasswordResetUseCaseDeps {
  authRepository: IAuthRepository;
}

export interface ConfirmPasswordResetInputDTO {
  readonly token: string;
  readonly newPassword: string;
  readonly passwordConfirmation: string;
}

export class ConfirmPasswordResetUseCase {
  constructor(private readonly deps: ConfirmPasswordResetUseCaseDeps) {}

  /**
   * Ejecuta el caso de uso de confirmación de reset de contraseña.
   * @param input - Token, nueva contraseña y confirmación
   * @throws InvalidPasswordResetTokenError si el token es inválido
   * @throws PasswordResetTokenExpiredError si el token expiró
   * @throws PasswordResetTokenAlreadyUsedError si el token ya fue usado
   * @throws WeakPasswordError si la nueva contraseña es débil
   * @throws PasswordMismatchError si las contraseñas no coinciden
   */
  async execute(input: ConfirmPasswordResetInputDTO): Promise<void> {
    // 1. Llamar al repositorio para confirmar reset de contraseña
    await this.deps.authRepository.confirmPasswordReset({
      token: input.token,
      newPassword: input.newPassword,
      passwordConfirmation: input.passwordConfirmation,
    });
  }
}
