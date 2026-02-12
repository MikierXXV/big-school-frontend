/**
 * ============================================
 * VALUE OBJECT: AccessToken
 * ============================================
 *
 * Representa un token de acceso JWT.
 * Duración: 5 horas (según backend).
 * Inmutable y auto-validado.
 */

export class AccessToken {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Creates a new AccessToken instance
   * @param value - JWT token string
   * @throws Error if token is empty
   */
  public static create(value: string): AccessToken {
    const normalized = value.trim();

    if (!normalized || normalized.length === 0) {
      throw new Error('Access token cannot be empty');
    }

    return new AccessToken(normalized);
  }

  /**
   * Returns the token value
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Compares two AccessTokens for equality
   */
  public equals(other: AccessToken): boolean {
    return this._value === other._value;
  }

  /**
   * Returns string representation
   */
  public toString(): string {
    return this._value;
  }
}
