/**
 * ============================================
 * UTILS: Validation
 * ============================================
 *
 * Utilidades de validacion.
 */

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPassword(password: string): boolean {
  // Minimo 8 caracteres
  return password.length >= 8;
}

export function isEmpty(value: string): boolean {
  return value.trim().length === 0;
}
