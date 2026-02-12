/**
 * ============================================
 * VALUE OBJECT: Password
 * ============================================
 *
 * Validador de fortaleza de contraseña.
 * NO almacena la contraseña (por seguridad).
 *
 * RESPONSABILIDADES:
 * - Validar fortaleza de contraseña
 * - Calcular score de seguridad (0-100)
 * - Determinar nivel de fortaleza
 * - Listar requisitos faltantes
 *
 * REQUISITOS (según backend):
 * - Mínimo 8 caracteres
 * - Al menos una mayúscula
 * - Al menos una minúscula
 * - Al menos un número
 * - Al menos un carácter especial (!@#$%^&*(),.?":{}|<>)
 */

export type PasswordStrength = 'VERY_WEAK' | 'WEAK' | 'MEDIUM' | 'STRONG' | 'VERY_STRONG';

export interface PasswordValidationResult {
  isValid: boolean;
  missingRequirements: string[];
}

export class Password {
  private static readonly MIN_LENGTH = 8;
  private static readonly SPECIAL_CHARS_REGEX = /[!@#$%^&*(),.?":{}|<>]/;

  private constructor() {
    // Private constructor - this is a utility class, no instances needed
  }

  /**
   * Valida una contraseña contra todos los requisitos.
   * @param password - La contraseña a validar
   * @returns Objeto con isValid y missingRequirements
   */
  public static validate(password: string): PasswordValidationResult {
    const missingRequirements: string[] = [];

    if (password.length < Password.MIN_LENGTH) {
      missingRequirements.push('Minimum 8 characters');
    }

    if (!/[A-Z]/.test(password)) {
      missingRequirements.push('At least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      missingRequirements.push('At least one lowercase letter');
    }

    if (!/\d/.test(password)) {
      missingRequirements.push('At least one number');
    }

    if (!Password.SPECIAL_CHARS_REGEX.test(password)) {
      missingRequirements.push('At least one special character');
    }

    return {
      isValid: missingRequirements.length === 0,
      missingRequirements,
    };
  }

  /**
   * Calcula el nivel de fortaleza de la contraseña.
   * @param password - La contraseña a evaluar
   * @returns Nivel de fortaleza
   */
  public static getStrength(password: string): PasswordStrength {
    const validation = Password.validate(password);
    const metRequirements = 5 - validation.missingRequirements.length;

    if (metRequirements === 0) return 'VERY_WEAK';
    if (metRequirements === 1) return 'VERY_WEAK'; // Also very weak with only 1 requirement
    if (metRequirements === 2) return 'WEAK';
    if (metRequirements === 3) return 'MEDIUM';
    if (metRequirements === 4) return 'STRONG';
    return 'VERY_STRONG';
  }

  /**
   * Calcula un score numérico de 0 a 100 para la contraseña.
   * @param password - La contraseña a evaluar
   * @returns Score de 0 a 100
   */
  public static calculateScore(password: string): number {
    if (!password || password.length === 0) return 0;

    const validation = Password.validate(password);
    const metRequirements = 5 - validation.missingRequirements.length;

    // Base score: 20 points per requirement met (max 100)
    let score = metRequirements * 20;

    // Bonus for extra length (beyond 8 chars)
    if (password.length > 8) {
      const lengthBonus = Math.min((password.length - 8) * 2, 20);
      score += lengthBonus;
    }

    // Cap at 100
    return Math.min(score, 100);
  }

  /**
   * Retorna la lista de todos los requisitos de contraseña.
   * @returns Array con descripción de requisitos
   */
  public static getRequirements(): string[] {
    return [
      'Minimum 8 characters',
      'At least one uppercase letter',
      'At least one lowercase letter',
      'At least one number',
      'At least one special character',
    ];
  }
}
