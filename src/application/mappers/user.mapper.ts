/**
 * ============================================
 * MAPPER: User
 * ============================================
 *
 * Transforma datos de API a entidad User del dominio.
 */

import { User } from '@domain/entities/user.entity.js';
import { UserId } from '@domain/value-objects/user-id.value-object.js';
import { Email } from '@domain/value-objects/email.value-object.js';
import { UserStatus } from '@domain/value-objects/user-status.value-object.js';
import type { UserDTO } from '../dtos/user.dto.js';

/**
 * Estructura de datos de usuario desde la API
 */
interface ApiUserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  emailVerifiedAt: string | null;
  lastLoginAt: string | null;
}

export class UserMapper {
  /**
   * Transforma datos de API a User entity del dominio.
   * @param data - Datos del usuario desde la API
   * @returns User entity
   * @throws Error si los datos son inválidos
   */
  static fromApi(data: ApiUserData): User {
    return User.fromPersistence({
      id: UserId.create(data.id),
      email: Email.create(data.email),
      firstName: data.firstName,
      lastName: data.lastName,
      status: UserStatus[data.status as keyof typeof UserStatus],
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      emailVerifiedAt: data.emailVerifiedAt ? new Date(data.emailVerifiedAt) : null,
      lastLoginAt: data.lastLoginAt ? new Date(data.lastLoginAt) : null,
    });
  }

  /**
   * Transforma User entity a DTO para transferencia.
   * @param user - User entity del dominio
   * @returns UserDTO
   */
  static toApi(user: User): UserDTO {
    return {
      id: user.id.value,
      email: user.email.value,
      firstName: user.firstName,
      lastName: user.lastName,
      status: user.status.toString(),
      emailVerified: user.isEmailVerified(),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
