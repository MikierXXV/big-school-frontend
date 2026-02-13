/**
 * ============================================
 * USE CASE: RequestPasswordReset
 * ============================================
 *
 * Orquesta el flujo de solicitud de reset de contraseña.
 */

import type { IAuthRepository } from '@domain/repositories/auth.repository.interface.js';
import { Email } from '@domain/value-objects/email.value-object.js';

export interface RequestPasswordResetUseCaseDeps {
  authRepository: IAuthRepository;
}

export interface RequestPasswordResetInputDTO {
  readonly email: string;
}

export class RequestPasswordResetUseCase {
  constructor(private readonly deps: RequestPasswordResetUseCaseDeps) {}

  /**
   * Ejecuta el caso de uso de solicitud de reset de contraseña.
   * Siempre retorna éxito por razones de seguridad (no revelar si email existe).
   * @param input - Email del usuario
   * @throws InvalidEmailError si el email es inválido
   */
  async execute(input: RequestPasswordResetInputDTO): Promise<void> {
    // 1. Validar email creando value object
    const email = Email.create(input.email);

    // 2. Llamar al repositorio para enviar email de reset
    await this.deps.authRepository.requestPasswordReset(email);
  }
}
