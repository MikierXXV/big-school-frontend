/**
 * ============================================
 * USE CASE: Logout
 * ============================================
 *
 * Orquesta el flujo de cierre de sesion.
 *
 * TODO: Implementar use case
 */

import type { IAuthRepository } from '@domain/repositories/auth.repository.interface.js';

export interface LogoutUseCaseDeps {
  authRepository: IAuthRepository;
}

export class LogoutUseCase {
  constructor(private readonly deps: LogoutUseCaseDeps) {}

  // TODO: Implementar execute method
  // async execute(): Promise<void>
}
