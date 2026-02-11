/**
 * ============================================
 * USE CASE: Login
 * ============================================
 *
 * Orquesta el flujo de login del usuario.
 *
 * FLUJO:
 * 1. Validar credenciales
 * 2. Llamar al repositorio de auth
 * 3. Almacenar tokens
 * 4. Retornar usuario autenticado
 *
 * TODO: Implementar use case
 */

import type { IAuthRepository } from '@domain/repositories/auth.repository.interface.js';
import type { LoginDTO } from '../../dtos/auth/login.dto.js';

export interface LoginUseCaseDeps {
  authRepository: IAuthRepository;
}

export class LoginUseCase {
  constructor(private readonly deps: LoginUseCaseDeps) {}

  // TODO: Implementar execute method
  // async execute(dto: LoginDTO): Promise<LoginResult>
}
