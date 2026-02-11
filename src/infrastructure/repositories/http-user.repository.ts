/**
 * ============================================
 * REPOSITORY: HTTP User
 * ============================================
 *
 * Implementacion del repositorio de usuario usando HTTP.
 *
 * TODO: Implementar repository completo
 */

import type { IUserRepository } from '@domain/repositories/user.repository.interface.js';
import type { IHttpClient } from '@application/ports/http-client.port.js';

export class HttpUserRepository implements IUserRepository {
  constructor(private readonly httpClient: IHttpClient) {}

  // TODO: Implementar metodos
  // async findById(id: UserId): Promise<User | null>
  // async getCurrentUser(): Promise<User | null>
}
