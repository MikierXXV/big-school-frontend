/**
 * ============================================
 * UNIT TEST: LogoutUseCase
 * ============================================
 *
 * Tests para el caso de uso de logout.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LogoutUseCase } from '@application/use-cases/auth/logout.use-case.js';
import type { IAuthRepository } from '@domain/repositories/auth.repository.interface.js';
import type { IStorageService } from '@application/ports/storage.port.js';

describe('LogoutUseCase', () => {
  let useCase: LogoutUseCase;
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

    useCase = new LogoutUseCase({
      authRepository: mockAuthRepository,
      storageService: mockStorageService,
    });
  });

  describe('execute', () => {
    it('should logout user and clear tokens', async () => {
      vi.mocked(mockAuthRepository.logout).mockResolvedValue();

      await useCase.execute();

      expect(mockAuthRepository.logout).toHaveBeenCalledOnce();
      expect(mockStorageService.removeItem).toHaveBeenCalledWith('accessToken');
      expect(mockStorageService.removeItem).toHaveBeenCalledWith('refreshToken');
    });

    it('should clear tokens even if repository fails', async () => {
      vi.mocked(mockAuthRepository.logout).mockRejectedValue(new Error('Network error'));

      await expect(useCase.execute()).rejects.toThrow('Network error');

      // Tokens should NOT be cleared if repository fails (security)
      expect(mockStorageService.removeItem).not.toHaveBeenCalled();
    });

    it('should call repository before clearing storage', async () => {
      const callOrder: string[] = [];

      vi.mocked(mockAuthRepository.logout).mockImplementation(async () => {
        callOrder.push('repository');
      });

      vi.mocked(mockStorageService.removeItem).mockImplementation(() => {
        callOrder.push('storage');
      });

      await useCase.execute();

      expect(callOrder).toEqual(['repository', 'storage', 'storage']);
    });
  });
});
