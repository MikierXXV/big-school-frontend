/**
 * ============================================
 * REPOSITORY INTERFACE: Auth
 * ============================================
 *
 * Define el contrato para operaciones de autenticación.
 * La implementación real estará en Infrastructure layer.
 */

import type { User } from '../entities/user.entity.js';
import type { Email } from '../value-objects/email.value-object.js';
import type { RefreshToken } from '../value-objects/refresh-token.value-object.js';

// ============================================
// REQUEST/RESPONSE DTOs
// ============================================

export interface RegisterData {
  readonly email: string;
  readonly password: string;
  readonly passwordConfirmation: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly acceptTerms: boolean;
}

export interface RegisterResult {
  readonly user: User;
  readonly requiresEmailVerification: boolean;
  readonly verificationToken?: string; // Solo en desarrollo
}

export interface LoginCredentials {
  readonly email: string;
  readonly password: string;
  readonly rememberMe?: boolean;
}

export interface LoginResult {
  readonly user: User;
  readonly tokens: AuthTokens;
}

export interface AuthTokens {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly tokenType: 'Bearer';
  readonly expiresIn: number; // Segundos
  readonly expiresAt: string; // ISO date
  readonly refreshExpiresIn: number; // Segundos
}

export interface RefreshResult {
  readonly tokens: AuthTokens;
}

export interface VerifyEmailResult {
  readonly user: User;
}

export interface PasswordResetData {
  readonly token: string;
  readonly newPassword: string;
  readonly passwordConfirmation: string;
}

// ============================================
// REPOSITORY INTERFACE
// ============================================

/**
 * Contrato para el repositorio de autenticación.
 * Define todas las operaciones relacionadas con auth.
 */
export interface IAuthRepository {
  /**
   * Registra un nuevo usuario.
   * @throws UserAlreadyExistsError si el email ya existe
   * @throws WeakPasswordError si la contraseña es débil
   * @throws PasswordMismatchError si las contraseñas no coinciden
   * @throws TermsNotAcceptedError si no acepta términos
   */
  register(data: RegisterData): Promise<RegisterResult>;

  /**
   * Autentica un usuario.
   * @throws InvalidCredentialsError si las credenciales son incorrectas
   * @throws AccountLockedError si la cuenta está bloqueada
   * @throws UserNotActiveError si el usuario no está activo
   */
  login(credentials: LoginCredentials): Promise<LoginResult>;

  /**
   * Renueva el access token usando refresh token.
   * @throws RefreshTokenExpiredError si el refresh token expiró
   * @throws RefreshTokenReuseDetectedError si se detecta reuso de token
   */
  refreshSession(refreshToken: RefreshToken): Promise<RefreshResult>;

  /**
   * Verifica el email del usuario.
   * @throws InvalidVerificationTokenError si el token es inválido
   * @throws VerificationTokenExpiredError si el token expiró
   * @throws EmailAlreadyVerifiedError si el email ya está verificado
   */
  verifyEmail(token: string): Promise<VerifyEmailResult>;

  /**
   * Solicita un reset de contraseña.
   * Siempre retorna éxito (seguridad: no revelar si el email existe).
   */
  requestPasswordReset(email: Email): Promise<void>;

  /**
   * Confirma el reset de contraseña con nuevo password.
   * @throws InvalidPasswordResetTokenError si el token es inválido
   * @throws PasswordResetTokenExpiredError si el token expiró
   * @throws PasswordResetTokenAlreadyUsedError si el token ya fue usado
   * @throws WeakPasswordError si la contraseña es débil
   * @throws PasswordMismatchError si las contraseñas no coinciden
   */
  confirmPasswordReset(data: PasswordResetData): Promise<void>;

  /**
   * Cierra la sesión del usuario (revoca refresh token).
   */
  logout(): Promise<void>;
}
