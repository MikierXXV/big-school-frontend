/**
 * ============================================
 * VALUE OBJECT: UserId
 * ============================================
 *
 * Representa un identificador único de usuario (UUID v4).
 * Inmutable y auto-validado.
 */

export class UserId {
  private readonly _value: string;

  // UUID v4 regex pattern
  private static readonly UUID_PATTERN =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Creates a new UserId instance
   * @param value - UUID v4 string
   * @throws Error if UUID format is invalid
   */
  public static create(value: string): UserId {
    const normalized = value.toLowerCase().trim();

    if (!UserId.isValid(normalized)) {
      throw new Error('Invalid user ID format');
    }

    return new UserId(normalized);
  }

  /**
   * Validates if a string is a valid UUID v4
   */
  private static isValid(value: string): boolean {
    if (!value || value.length === 0) {
      return false;
    }

    return UserId.UUID_PATTERN.test(value);
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
