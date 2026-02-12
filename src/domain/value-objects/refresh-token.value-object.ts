/**
 * ============================================
 * VALUE OBJECT: RefreshToken
 * ============================================
 *
 * Representa un token de refresco JWT.
 * Duración: 3 días (según backend).
 * Usa rotación de tokens para seguridad (cada refresh genera un nuevo token).
 * Inmutable y auto-validado.
 */

export class RefreshToken {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Creates a new RefreshToken instance
   * @param value - JWT refresh token string
   * @throws Error if token is empty
   */
  public static create(value: string): RefreshToken {
    const normalized = value.trim();

    if (!normalized || normalized.length === 0) {
      throw new Error('Refresh token cannot be empty');
    }

    return new RefreshToken(normalized);
  }

  /**
   * Returns the token value
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Compares two RefreshTokens for equality
   */
  public equals(other: RefreshToken): boolean {
    return this._value === other._value;
  }

  /**
   * Returns string representation
   */
  public toString(): string {
    return this._value;
  }
}
