/**
 * ============================================
 * VALUE OBJECT: Email
 * ============================================
 *
 * Representa una direccion de correo electronico valida.
 * Reutiliza la logica de validacion del backend.
 *
 * TODO: Implementar validacion completa
 */

export class Email {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(value: string): Email {
    // TODO: Implementar validacion
    const normalized = value.toLowerCase().trim();
    return new Email(normalized);
  }

  public get value(): string {
    return this._value;
  }

  public equals(other: Email): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }
}
