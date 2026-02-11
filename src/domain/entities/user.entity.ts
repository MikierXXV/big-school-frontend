/**
 * ============================================
 * ENTITY: User
 * ============================================
 *
 * Representa un usuario autenticado en el frontend.
 *
 * RESPONSABILIDADES:
 * - Mantener la identidad del usuario logueado
 * - Encapsular datos basicos del usuario
 *
 * TODO: Implementar entity completa
 */

import type { UserId } from '../value-objects/user-id.value-object.js';
import type { Email } from '../value-objects/email.value-object.js';

export interface UserProps {
  readonly id: UserId;
  readonly email: Email;
  readonly firstName: string;
  readonly lastName: string;
  readonly emailVerified: boolean;
}

export class User {
  private readonly _props: UserProps;

  private constructor(props: UserProps) {
    this._props = props;
  }

  // TODO: Implementar factory methods y getters
  // public static create(props: UserProps): User
  // public static fromApi(data: unknown): User

  public get id(): UserId {
    return this._props.id;
  }

  public get email(): Email {
    return this._props.email;
  }

  public get fullName(): string {
    return `${this._props.firstName} ${this._props.lastName}`;
  }
}
