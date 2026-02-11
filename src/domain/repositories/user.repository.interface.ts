/**
 * ============================================
 * REPOSITORY INTERFACE: User
 * ============================================
 *
 * Define el contrato para operaciones de usuario.
 *
 * TODO: Implementar interface completa
 */

import type { User } from '../entities/user.entity.js';
import type { UserId } from '../value-objects/user-id.value-object.js';

export interface IUserRepository {
  findById(id: UserId): Promise<User | null>;
  getCurrentUser(): Promise<User | null>;
}
