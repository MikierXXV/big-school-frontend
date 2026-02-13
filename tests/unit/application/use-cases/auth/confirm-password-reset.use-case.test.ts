/**
 * ============================================
 * UNIT TEST: ConfirmPasswordResetUseCase
 * ============================================
 *
 * Tests para el caso de uso de confirmación de reset de contraseña.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ConfirmPasswordResetUseCase } from '@application/use-cases/auth/confirm-password-reset.use-case.js';
import type { IAuthRepository } from '@domain/repositories/auth.repository.interface.js';
import {
  InvalidPasswordResetTokenError,
  PasswordResetTokenExpiredError,
  PasswordResetTokenAlreadyUsedError,
  WeakPasswordError,
  PasswordMismatchError,
} from '@domain/errors/auth.errors.js';

describe('ConfirmPasswordResetUseCase', () => {
  let useCase: ConfirmPasswordResetUseCase;
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

    useCase = new ConfirmPasswordResetUseCase({
      authRepository: mockAuthRepository,
    });
  });

  describe('execute', () => {
    it('should confirm password reset successfully', async () => {
      const input = {
        token: 'valid_reset_token_123',
        newPassword: 'NewPassword123!',
        passwordConfirmation: 'NewPassword123!',
      };

      vi.mocked(mockAuthRepository.confirmPasswordReset).mockResolvedValue();

      await useCase.execute(input);

      expect(mockAuthRepository.confirmPasswordReset).toHaveBeenCalledWith({
        token: input.token,
        newPassword: input.newPassword,
        passwordConfirmation: input.passwordConfirmation,
      });
    });

    it('should throw InvalidPasswordResetTokenError when token is invalid', async () => {
      const input = {
        token: 'invalid_token',
        newPassword: 'NewPassword123!',
        passwordConfirmation: 'NewPassword123!',
      };

      vi.mocked(mockAuthRepository.confirmPasswordReset).mockRejectedValue(
        new InvalidPasswordResetTokenError()
      );

      await expect(useCase.execute(input)).rejects.toThrow(InvalidPasswordResetTokenError);
    });

    it('should throw PasswordResetTokenExpiredError when token has expired', async () => {
      const input = {
        token: 'expired_token',
        newPassword: 'NewPassword123!',
        passwordConfirmation: 'NewPassword123!',
      };

      vi.mocked(mockAuthRepository.confirmPasswordReset).mockRejectedValue(
        new PasswordResetTokenExpiredError()
      );

      await expect(useCase.execute(input)).rejects.toThrow(PasswordResetTokenExpiredError);
    });

    it('should throw PasswordResetTokenAlreadyUsedError when token was already used', async () => {
      const input = {
        token: 'already_used_token',
        newPassword: 'NewPassword123!',
        passwordConfirmation: 'NewPassword123!',
      };

      vi.mocked(mockAuthRepository.confirmPasswordReset).mockRejectedValue(
        new PasswordResetTokenAlreadyUsedError()
      );

      await expect(useCase.execute(input)).rejects.toThrow(PasswordResetTokenAlreadyUsedError);
    });

    it('should throw WeakPasswordError when new password is weak', async () => {
      const input = {
        token: 'valid_token',
        newPassword: 'weak',
        passwordConfirmation: 'weak',
      };

      vi.mocked(mockAuthRepository.confirmPasswordReset).mockRejectedValue(
        new WeakPasswordError(['Minimum 8 characters', 'At least one uppercase letter'])
      );

      await expect(useCase.execute(input)).rejects.toThrow(WeakPasswordError);
    });

    it('should throw PasswordMismatchError when passwords do not match', async () => {
      const input = {
        token: 'valid_token',
        newPassword: 'NewPassword123!',
        passwordConfirmation: 'DifferentPassword123!',
      };

      vi.mocked(mockAuthRepository.confirmPasswordReset).mockRejectedValue(
        new PasswordMismatchError()
      );

      await expect(useCase.execute(input)).rejects.toThrow(PasswordMismatchError);
    });

    it('should call repository with exact data provided', async () => {
      const input = {
        token: 'test_token_abc',
        newPassword: 'TestPassword123!',
        passwordConfirmation: 'TestPassword123!',
      };

      vi.mocked(mockAuthRepository.confirmPasswordReset).mockResolvedValue();

      await useCase.execute(input);

      expect(mockAuthRepository.confirmPasswordReset).toHaveBeenCalledWith({
        token: 'test_token_abc',
        newPassword: 'TestPassword123!',
        passwordConfirmation: 'TestPassword123!',
      });
    });
  });
});
