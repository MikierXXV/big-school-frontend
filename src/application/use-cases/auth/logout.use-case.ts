/**
 * ============================================
 * USE CASE: Logout
 * ============================================
 *
 * Orquesta el flujo de cierre de sesion.
 */

import type { IAuthRepository } from '@domain/repositories/auth.repository.interface.js';
import type { IStorageService } from '../../ports/storage.port.js';

export interface LogoutUseCaseDeps {
  authRepository: IAuthRepository;
  storageService: IStorageService;
}

export class LogoutUseCase {
  constructor(private readonly deps: LogoutUseCaseDeps) {}

  /**
   * Ejecuta el caso de uso de logout.
   * Revoca el refresh token en el backend y limpia tokens del storage local.
   */
  async execute(): Promise<void> {
    // 1. Revocar refresh token en backend
    await this.deps.authRepository.logout();

    // 2. Limpiar tokens del storage local
    this.deps.storageService.removeItem('accessToken');
    this.deps.storageService.removeItem('refreshToken');
  }
}
