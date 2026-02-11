/**
 * ============================================
 * USE CASE: Register
 * ============================================
 *
 * Orquesta el flujo de registro de usuario.
 *
 * TODO: Implementar use case
 */

import type { IAuthRepository } from '@domain/repositories/auth.repository.interface.js';
import type { RegisterDTO } from '../../dtos/auth/register.dto.js';

export interface RegisterUseCaseDeps {
  authRepository: IAuthRepository;
}

export class RegisterUseCase {
  constructor(private readonly deps: RegisterUseCaseDeps) {}

  // TODO: Implementar execute method
  // async execute(dto: RegisterDTO): Promise<void>
}
