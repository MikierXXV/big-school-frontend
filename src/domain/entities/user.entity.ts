/**
 * ============================================
 * ENTITY: User
 * ============================================
 *
 * Representa un usuario en el sistema (Aggregate Root).
 * Versión simplificada para frontend.
 *
 * RESPONSABILIDADES:
 * - Mantener la identidad del usuario
 * - Encapsular datos del usuario
 * - Implementar reglas de negocio relacionadas con el usuario
 */

import { UserId } from '../value-objects/user-id.value-object.js';
import { Email } from '../value-objects/email.value-object.js';
import { UserStatus } from '../value-objects/user-status.value-object.js';

/**
 * Propiedades completas de un usuario
 */
export interface UserProps {
  readonly id: UserId;
  readonly email: Email;
  readonly firstName: string;
  readonly lastName: string;
  readonly status: UserStatus;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly lastLoginAt: Date | null;
  readonly emailVerifiedAt: Date | null;
}

/**
 * Datos para crear un nuevo usuario
 */
export interface CreateUserData {
  readonly id: UserId;
  readonly email: Email;
  readonly firstName: string;
  readonly lastName: string;
}

/**
 * Entity User - Aggregate Root
 */
export class User {
  private readonly _props: UserProps;

  private constructor(props: UserProps) {
    this._props = props;
  }

  // ============================================
  // FACTORY METHODS
  // ============================================

  /**
   * Crea un nuevo usuario (registro).
   * El usuario se crea en estado PENDING_VERIFICATION.
   */
  public static create(data: CreateUserData): User {
    const now = new Date();

    const props: UserProps = {
      id: data.id,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      status: UserStatus.PENDING_VERIFICATION,
      createdAt: now,
      updatedAt: now,
      lastLoginAt: null,
      emailVerifiedAt: null,
    };

    return new User(props);
  }

  /**
   * Reconstruye un usuario desde persistencia/API.
   */
  public static fromPersistence(props: UserProps): User {
    return new User(props);
  }

  // ============================================
  // GETTERS
  // ============================================

  public get id(): UserId {
    return this._props.id;
  }

  public get email(): Email {
    return this._props.email;
  }

  public get firstName(): string {
    return this._props.firstName;
  }

  public get lastName(): string {
    return this._props.lastName;
  }

  public get fullName(): string {
    return `${this._props.firstName} ${this._props.lastName}`;
  }

  public get status(): UserStatus {
    return this._props.status;
  }

  public get createdAt(): Date {
    return new Date(this._props.createdAt);
  }

  public get updatedAt(): Date {
    return new Date(this._props.updatedAt);
  }

  public get lastLoginAt(): Date | null {
    return this._props.lastLoginAt ? new Date(this._props.lastLoginAt) : null;
  }

  public get emailVerifiedAt(): Date | null {
    return this._props.emailVerifiedAt ? new Date(this._props.emailVerifiedAt) : null;
  }

  // ============================================
  // BUSINESS LOGIC METHODS
  // ============================================

  /**
   * Verifica si el email está verificado.
   */
  public isEmailVerified(): boolean {
    return this._props.emailVerifiedAt !== null;
  }

  /**
   * Verifica si el usuario está activo.
   */
  public isActive(): boolean {
    return this._props.status === UserStatus.ACTIVE;
  }

  /**
   * Verifica si el usuario puede hacer login.
   *
   * REGLAS:
   * - Debe estar en estado ACTIVE
   * - El email debe estar verificado
   */
  public canLogin(): boolean {
    return this.isActive() && this.isEmailVerified();
  }
}
