/**
 * ============================================
 * USE CASE: OAuthLogin
 * ============================================
 *
 * Handles the OAuth callback flow: exchanges the code for tokens,
 * stores them, and returns user + token data.
 */

import type {
  IAuthRepository,
  OAuthInitiateData,
  OAuthInitiateResult,
} from '@domain/repositories/auth.repository.interface.js';
import type { IStorageService } from '../../ports/storage.port.js';
import { UserMapper } from '../../mappers/user.mapper.js';
import type { UserDTO } from '../../dtos/user.dto.js';

export interface OAuthLoginUseCaseDeps {
  authRepository: IAuthRepository;
  storageService: IStorageService;
}

export interface OAuthLoginInputDTO {
  readonly provider: string;
  readonly code: string;
  readonly redirectUri: string;
}

export interface OAuthLoginOutputDTO {
  readonly user: UserDTO;
  readonly tokens: {
    readonly accessToken: string;
    readonly refreshToken: string;
    readonly expiresIn: number;
    readonly expiresAt: string;
  };
}

export class OAuthLoginUseCase {
  constructor(private readonly deps: OAuthLoginUseCaseDeps) {}

  async initiateOAuth(data: OAuthInitiateData): Promise<OAuthInitiateResult> {
    return this.deps.authRepository.initiateOAuth(data);
  }

  async execute(input: OAuthLoginInputDTO): Promise<OAuthLoginOutputDTO> {
    // 1. Exchange OAuth code for tokens via repository
    const result = await this.deps.authRepository.handleOAuthCallback({
      provider: input.provider,
      code: input.code,
      redirectUri: input.redirectUri,
    });

    // 2. Store tokens
    this.deps.storageService.setItem('accessToken', result.tokens.accessToken);
    this.deps.storageService.setItem('refreshToken', result.tokens.refreshToken);

    // 3. Return user DTO and tokens
    return {
      user: UserMapper.toApi(result.user),
      tokens: {
        accessToken: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken,
        expiresIn: result.tokens.expiresIn,
        expiresAt: result.tokens.expiresAt,
      },
    };
  }
}
