/**
 * ============================================
 * UTILITY: Password Strength Calculator
 * ============================================
 *
 * Calculates password strength score (0-5) and provides feedback.
 */

export interface PasswordStrengthResult {
  score: number; // 0-5 (0 = very weak, 5 = very strong)
  feedback: string[];
}

/**
 * Calculates password strength based on various criteria
 *
 * Scoring:
 * - 0: Empty password
 * - 1: Very weak (< 8 characters)
 * - 2: Weak (only lowercase or only one type)
 * - 3: Medium (lowercase + uppercase)
 * - 4: Strong (lowercase + uppercase + numbers)
 * - 5: Very strong (lowercase + uppercase + numbers + special chars)
 */
export function calculatePasswordStrength(password: string): PasswordStrengthResult {
  if (!password || password.length === 0) {
    return {
      score: 0,
      feedback: ['Enter a password'],
    };
  }

  let score = 0;
  const feedback: string[] = [];

  // Check length
  if (password.length < 8) {
    score = 1;
    feedback.push('Too short (minimum 8 characters)');
    return { score, feedback };
  }

  // Base score for having minimum length
  score = 1;

  // Check for lowercase
  const hasLowercase = /[a-z]/.test(password);
  if (hasLowercase) {
    score++;
  } else {
    feedback.push('Add lowercase letters');
  }

  // Check for uppercase
  const hasUppercase = /[A-Z]/.test(password);
  if (hasUppercase) {
    score++;
  } else {
    feedback.push('Add uppercase letters');
  }

  // Check for numbers
  const hasNumbers = /[0-9]/.test(password);
  if (hasNumbers) {
    score++;
  } else {
    feedback.push('Add numbers');
  }

  // Check for special characters
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  if (hasSpecial) {
    score++;
  } else {
    feedback.push('Add special characters (!@#$%^&*...)');
  }

  // Add strength description
  if (score === 5) {
    feedback.unshift('Very strong password!');
  } else if (score === 4) {
    feedback.unshift('Strong password');
  } else if (score === 3) {
    feedback.unshift('Medium strength');
  } else if (score === 2) {
    feedback.unshift('Weak password');
  }

  return { score, feedback };
}
