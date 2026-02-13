/**
 * ============================================
 * UNIT TEST: RequestPasswordResetUseCase
 * ============================================
 *
 * Tests para el caso de uso de solicitud de reset de contraseña.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RequestPasswordResetUseCase } from '@application/use-cases/auth/request-password-reset.use-case.js';
import type { IAuthRepository } from '@domain/repositories/auth.repository.interface.js';
import { Email } from '@domain/value-objects/email.value-object.js';
import { InvalidEmailError } from '@domain/errors/auth.errors.js';

describe('RequestPasswordResetUseCase', () => {
  let useCase: RequestPasswordResetUseCase;
  let mockAuthRepository: IAuthRepository;

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

    useCase = new RequestPasswordResetUseCase({
      authRepository: mockAuthRepository,
    });
  });

  describe('execute', () => {
    it('should request password reset successfully', async () => {
      const input = {
        email: 'user@example.com',
      };

      vi.mocked(mockAuthRepository.requestPasswordReset).mockResolvedValue();

      await useCase.execute(input);

      expect(mockAuthRepository.requestPasswordReset).toHaveBeenCalledWith(
        expect.any(Email)
      );
    });

    it('should throw InvalidEmailError when email is invalid', async () => {
      const input = {
        email: 'invalid-email',
      };

      await expect(useCase.execute(input)).rejects.toThrow(InvalidEmailError);

      expect(mockAuthRepository.requestPasswordReset).not.toHaveBeenCalled();
    });

    it('should not throw error even if email does not exist (security)', async () => {
      const input = {
        email: 'nonexistent@example.com',
      };

      vi.mocked(mockAuthRepository.requestPasswordReset).mockResolvedValue();

      await expect(useCase.execute(input)).resolves.toBeUndefined();

      expect(mockAuthRepository.requestPasswordReset).toHaveBeenCalledOnce();
    });
  });
});
