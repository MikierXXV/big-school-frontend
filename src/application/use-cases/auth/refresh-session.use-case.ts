/**
 * ============================================
 * USE CASE: RefreshSession
 * ============================================
 *
 * Orquesta el flujo de renovación de tokens.
 */

import type { IAuthRepository } from '@domain/repositories/auth.repository.interface.js';
import type { IStorageService } from '../../ports/storage.port.js';
import { RefreshToken } from '@domain/value-objects/refresh-token.value-object.js';

export interface RefreshSessionUseCaseDeps {
  authRepository: IAuthRepository;
  storageService: IStorageService;
}

export interface RefreshTokenInputDTO {
  readonly refreshToken: string;
}

export interface RefreshTokenOutputDTO {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresIn: number;
  readonly expiresAt: string;
}

export class RefreshSessionUseCase {
  constructor(private readonly deps: RefreshSessionUseCaseDeps) {}

  /**
   * Ejecuta el caso de uso de refresh de tokens.
   * @param input - Refresh token a renovar
   * @returns Nuevos tokens (access y refresh)
   * @throws RefreshTokenExpiredError si el token expiró
   * @throws RefreshTokenReuseDetectedError si se detecta reuso del token
   */
  async execute(input: RefreshTokenInputDTO): Promise<RefreshTokenOutputDTO> {
    // 1. Crear value object de RefreshToken
    const refreshToken = RefreshToken.create(input.refreshToken);

    // 2. Llamar al repositorio para renovar la sesión
    const result = await this.deps.authRepository.refreshSession(refreshToken);

    // 3. Almacenar nuevos tokens en storage (rotación de tokens)
    this.deps.storageService.setItem('accessToken', result.tokens.accessToken);
    this.deps.storageService.setItem('refreshToken', result.tokens.refreshToken);

    // 4. Retornar tokens renovados
    return {
      accessToken: result.tokens.accessToken,
      refreshToken: result.tokens.refreshToken,
      expiresIn: result.tokens.expiresIn,
      expiresAt: result.tokens.expiresAt,
    };
  }
}
