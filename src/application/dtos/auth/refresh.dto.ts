/**
 * ============================================
 * DTO: Refresh Token
 * ============================================
 *
 * DTOs para operación de refresh de tokens.
 */

export interface RefreshTokenInputDTO {
  readonly refreshToken: string;
}

export interface RefreshTokenOutputDTO {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresIn: number;
  readonly expiresAt: string;
}
