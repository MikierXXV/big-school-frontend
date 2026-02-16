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
  firstName?: string;
  lastName?: string;
  fullName?: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  emailVerifiedAt?: string | null;
  lastLoginAt?: string | null;
}

export class UserMapper {
  /**
   * Normalizes date string to valid ISO 8601 format.
   * Handles backend dates that may be missing 'Z' or have incorrect milliseconds.
   */
  private static normalizeDate(dateString: string | undefined | null): Date | null {
    // Handle null or undefined
    if (!dateString) {
      return null;
    }

    // If the date string doesn't end with 'Z' and doesn't have timezone info, add 'Z'
    let normalized = dateString.trim();

    // Check if it has timezone info (Z, +, or -)
    if (!/[Z+-]/.test(normalized.slice(-6))) {
      // Ensure milliseconds are 3 digits max
      const match = normalized.match(/^(.+)\.(\d+)$/);
      if (match) {
        const [, datePart, milliseconds] = match;
        const normalizedMs = milliseconds.slice(0, 3).padEnd(3, '0');
        normalized = `${datePart}.${normalizedMs}Z`;
      } else {
        normalized = `${normalized}Z`;
      }
    }

    const date = new Date(normalized);

    // Validate the date
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date format: ${dateString}`);
    }

    return date;
  }

  /**
   * Transforma datos de API a User entity del dominio.
   * @param data - Datos del usuario desde la API
   * @returns User entity
   * @throws Error si los datos son inválidos
   */
  static fromApi(data: ApiUserData): User {
    // Parse firstName and lastName from fullName if individual fields are missing
    let firstName = data.firstName;
    let lastName = data.lastName;

    if (!firstName || !lastName) {
      if (data.fullName) {
        const nameParts = data.fullName.trim().split(' ');
        firstName = firstName || nameParts[0] || '';
        lastName = lastName || nameParts.slice(1).join(' ') || '';
      } else {
        firstName = firstName || '';
        lastName = lastName || '';
      }
    }

    // Use createdAt as fallback for updatedAt if missing
    const createdAt = this.normalizeDate(data.createdAt) || new Date();
    const updatedAt = this.normalizeDate(data.updatedAt) || createdAt;

    return User.fromPersistence({
      id: UserId.create(data.id),
      email: Email.create(data.email),
      firstName,
      lastName,
      status: UserStatus[data.status as keyof typeof UserStatus],
      createdAt,
      updatedAt,
      emailVerifiedAt: this.normalizeDate(data.emailVerifiedAt),
      lastLoginAt: this.normalizeDate(data.lastLoginAt),
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
