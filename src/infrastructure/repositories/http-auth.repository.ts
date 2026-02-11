/**
 * ============================================
 * REPOSITORY: HTTP Auth
 * ============================================
 *
 * Implementacion del repositorio de autenticacion usando HTTP.
 *
 * TODO: Implementar repository completo
 */

import type { IAuthRepository } from '@domain/repositories/auth.repository.interface.js';
import type { IHttpClient } from '@application/ports/http-client.port.js';

export class HttpAuthRepository implements IAuthRepository {
  constructor(private readonly httpClient: IHttpClient) {}

  // TODO: Implementar metodos
  // async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }>
  // async register(data: RegisterData): Promise<void>
  // async logout(): Promise<void>
  // async refreshToken(refreshToken: string): Promise<AuthTokens>
}
