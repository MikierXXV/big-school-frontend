/**
 * ============================================
 * UTILITY: Form Validation Rules
 * ============================================
 *
 * Validation functions for form fields.
 * Each validator returns an empty string if valid, or an error message if invalid.
 */

/**
 * Validates that a value is not empty
 */
export function required(
  value: string | null | undefined,
  message = 'This field is required'
): string {
  if (value === null || value === undefined || value === '') {
    return message;
  }
  return '';
}

/**
 * Validates that a value is a valid email address
 */
export function email(value: string, message = 'Please enter a valid email address'): string {
  if (!value) return '';

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return message;
  }
  return '';
}

/**
 * Returns a validator that checks minimum length
 */
export function minLength(min: number, message?: string) {
  return (value: string): string => {
    if (!value) return '';

    if (value.length < min) {
      return message || `Must be at least ${min} characters`;
    }
    return '';
  };
}

/**
 * Returns a validator that checks maximum length
 */
export function maxLength(max: number, message?: string) {
  return (value: string): string => {
    if (!value) return '';

    if (value.length > max) {
      return message || `Must be at most ${max} characters`;
    }
    return '';
  };
}

/**
 * Returns a validator that checks if password matches a reference password
 * Supports reactive validation by accepting a getter function
 */
export function passwordMatch(
  getPassword: string | (() => string),
  message = 'Passwords do not match'
) {
  return (value: string): string => {
    const passwordValue = typeof getPassword === 'function' ? getPassword() : getPassword;
    if (value !== passwordValue) {
      return message;
    }
    return '';
  };
}

/**
 * Validates password strength
 * Requirements:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export function passwordStrength(value: string, message?: string): string {
  if (!value) return '';

  const requirements: string[] = [];

  if (value.length < 8) {
    requirements.push('at least 8 characters');
  }
  if (!/[A-Z]/.test(value)) {
    requirements.push('one uppercase letter');
  }
  if (!/[a-z]/.test(value)) {
    requirements.push('one lowercase letter');
  }
  if (!/[0-9]/.test(value)) {
    requirements.push('one number');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
    requirements.push('one special character');
  }

  if (requirements.length > 0) {
    return message || `Password must contain ${requirements.join(', ')}`;
  }

  return '';
}
