/**
 * ============================================
 * UNIT TEST: RefreshSessionUseCase
 * ============================================
 *
 * Tests para el caso de uso de refresh de tokens.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RefreshSessionUseCase } from '@application/use-cases/auth/refresh-session.use-case.js';
import type { IAuthRepository } from '@domain/repositories/auth.repository.interface.js';
import type { IStorageService } from '@application/ports/storage.port.js';
import { RefreshToken } from '@domain/value-objects/refresh-token.value-object.js';
import {
  RefreshTokenExpiredError,
  RefreshTokenReuseDetectedError,
} from '@domain/errors/auth.errors.js';

describe('RefreshSessionUseCase', () => {
  let useCase: RefreshSessionUseCase;
  let mockAuthRepository: IAuthRepository;
  let mockStorageService: IStorageService;

  beforeEach(() => {
    mockAuthRepository = {
      register: vi.fn(),
      login: vi.fn(),
      refreshSession: vi.fn(),
      verifyEmail: vi.fn(),
      requestPasswordReset: vi.fn(),
      confirmPasswordReset: vi.fn(),
      logout: vi.fn(),
    };

    mockStorageService = {
      setItem: vi.fn(),
      getItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };

    useCase = new RefreshSessionUseCase({
      authRepository: mockAuthRepository,
      storageService: mockStorageService,
    });
  });

  describe('execute', () => {
    it('should refresh tokens successfully', async () => {
      const input = {
        refreshToken: 'old_refresh_token_123',
      };

      const mockTokens = {
        accessToken: 'new_access_token_456',
        refreshToken: 'new_refresh_token_789',
        tokenType: 'Bearer' as const,
        expiresIn: 18000,
        expiresAt: '2024-01-01T10:00:00Z',
        refreshExpiresIn: 259200,
      };

      vi.mocked(mockAuthRepository.refreshSession).mockResolvedValue({
        tokens: mockTokens,
      });

      const result = await useCase.execute(input);

      expect(mockAuthRepository.refreshSession).toHaveBeenCalledWith(expect.any(RefreshToken));
      expect(mockStorageService.setItem).toHaveBeenCalledWith('accessToken', mockTokens.accessToken);
      expect(mockStorageService.setItem).toHaveBeenCalledWith('refreshToken', mockTokens.refreshToken);

      expect(result.accessToken).toBe('new_access_token_456');
      expect(result.refreshToken).toBe('new_refresh_token_789');
      expect(result.expiresIn).toBe(18000);
    });

    it('should throw RefreshTokenExpiredError when token is expired', async () => {
      const input = {
        refreshToken: 'expired_token',
      };

      vi.mocked(mockAuthRepository.refreshSession).mockRejectedValue(new RefreshTokenExpiredError());

      await expect(useCase.execute(input)).rejects.toThrow(RefreshTokenExpiredError);

      expect(mockStorageService.setItem).not.toHaveBeenCalled();
    });

    it('should throw RefreshTokenReuseDetectedError when token reuse is detected', async () => {
      const input = {
        refreshToken: 'reused_token',
      };

      vi.mocked(mockAuthRepository.refreshSession).mockRejectedValue(
        new RefreshTokenReuseDetectedError()
      );

      await expect(useCase.execute(input)).rejects.toThrow(RefreshTokenReuseDetectedError);

      expect(mockStorageService.setItem).not.toHaveBeenCalled();
    });

    it('should verify token rotation (new refresh token is different)', async () => {
      const input = {
        refreshToken: 'old_refresh_token',
      };

      const mockTokens = {
        accessToken: 'new_access_token',
        refreshToken: 'rotated_refresh_token',
        tokenType: 'Bearer' as const,
        expiresIn: 18000,
        expiresAt: '2024-01-01T10:00:00Z',
        refreshExpiresIn: 259200,
      };

      vi.mocked(mockAuthRepository.refreshSession).mockResolvedValue({
        tokens: mockTokens,
      });

      const result = await useCase.execute(input);

      expect(result.refreshToken).not.toBe(input.refreshToken);
      expect(result.refreshToken).toBe('rotated_refresh_token');
    });
  });
});
