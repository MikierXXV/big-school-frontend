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
 */

import type { IAuthRepository } from '@domain/repositories/auth.repository.interface.js';
import type { IStorageService } from '../../ports/storage.port.js';
import { UserMapper } from '../../mappers/user.mapper.js';
import type { UserDTO } from '../../dtos/user.dto.js';

export interface LoginUseCaseDeps {
  authRepository: IAuthRepository;
  storageService: IStorageService;
}

export interface LoginInputDTO {
  readonly email: string;
  readonly password: string;
  readonly rememberMe?: boolean;
}

export interface LoginOutputDTO {
  readonly user: UserDTO;
  readonly tokens: {
    readonly accessToken: string;
    readonly refreshToken: string;
    readonly expiresIn: number;
    readonly expiresAt: string;
  };
}

export class LoginUseCase {
  constructor(private readonly deps: LoginUseCaseDeps) {}

  /**
   * Ejecuta el caso de uso de login.
   * @param input - Credenciales de login
   * @returns Usuario autenticado y tokens
   * @throws InvalidCredentialsError si las credenciales son incorrectas
   * @throws AccountLockedError si la cuenta está bloqueada
   * @throws UserNotActiveError si el usuario no está activo
   */
  async execute(input: LoginInputDTO): Promise<LoginOutputDTO> {
    // 1. Llamar al repositorio para autenticar
    const result = await this.deps.authRepository.login({
      email: input.email,
      password: input.password,
      rememberMe: input.rememberMe,
    });

    // 2. Almacenar tokens en storage
    this.deps.storageService.setItem('accessToken', result.tokens.accessToken);
    this.deps.storageService.setItem('refreshToken', result.tokens.refreshToken);

    // 3. Mapear usuario a DTO y retornar
    return {
      user: UserMapper.toApi(result.user),
      tokens: {
        accessToken: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken,
        expiresIn: result.tokens.expiresIn,
        expiresAt: result.tokens.expiresAt,
      },
    };
  }
}
