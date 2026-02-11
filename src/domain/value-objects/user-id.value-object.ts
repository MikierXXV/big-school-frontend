/**
 * ============================================
 * VALUE OBJECT: UserId
 * ============================================
 *
 * Identificador unico de usuario (UUID).
 *
 * TODO: Implementar validacion de UUID
 */

export class UserId {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(value: string): UserId {
    // TODO: Validar formato UUID
    return new UserId(value);
  }

  public get value(): string {
    return this._value;
  }

  public equals(other: UserId): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }
}
