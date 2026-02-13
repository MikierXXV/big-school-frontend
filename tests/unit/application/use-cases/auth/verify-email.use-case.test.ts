/**
 * ============================================
 * UNIT TEST: VerifyEmailUseCase
 * ============================================
 *
 * Tests para el caso de uso de verificación de email.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { VerifyEmailUseCase } from '@application/use-cases/auth/verify-email.use-case.js';
import type { IAuthRepository } from '@domain/repositories/auth.repository.interface.js';
import { User } from '@domain/entities/user.entity.js';
import { UserId } from '@domain/value-objects/user-id.value-object.js';
import { Email } from '@domain/value-objects/email.value-object.js';
import {
  InvalidVerificationTokenError,
  VerificationTokenExpiredError,
  EmailAlreadyVerifiedError,
} from '@domain/errors/auth.errors.js';

describe('VerifyEmailUseCase', () => {
  let useCase: VerifyEmailUseCase;
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

    useCase = new VerifyEmailUseCase({
      authRepository: mockAuthRepository,
    });
  });

  describe('execute', () => {
    it('should verify email successfully', async () => {
      const input = {
        token: 'valid_verification_token_123',
      };

      const mockUser = User.create({
        id: UserId.create('f47ac10b-58cc-4372-a567-0e02b2c3d479'),
        email: Email.create('user@example.com'),
        firstName: 'John',
        lastName: 'Doe',
      });

      vi.mocked(mockAuthRepository.verifyEmail).mockResolvedValue({
        user: mockUser,
      });

      const result = await useCase.execute(input);

      expect(mockAuthRepository.verifyEmail).toHaveBeenCalledWith(input.token);
      expect(result.user.email).toBe('user@example.com');
      expect(result.message).toBe('Email verified successfully');
    });

    it('should throw InvalidVerificationTokenError when token is invalid', async () => {
      const input = {
        token: 'invalid_token',
      };

      vi.mocked(mockAuthRepository.verifyEmail).mockRejectedValue(
        new InvalidVerificationTokenError()
      );

      await expect(useCase.execute(input)).rejects.toThrow(InvalidVerificationTokenError);
    });

    it('should throw VerificationTokenExpiredError when token has expired', async () => {
      const input = {
        token: 'expired_token',
      };

      vi.mocked(mockAuthRepository.verifyEmail).mockRejectedValue(
        new VerificationTokenExpiredError()
      );

      await expect(useCase.execute(input)).rejects.toThrow(VerificationTokenExpiredError);
    });

    it('should throw EmailAlreadyVerifiedError when email is already verified', async () => {
      const input = {
        token: 'token_for_verified_email',
      };

      vi.mocked(mockAuthRepository.verifyEmail).mockRejectedValue(
        new EmailAlreadyVerifiedError('user@example.com')
      );

      await expect(useCase.execute(input)).rejects.toThrow(EmailAlreadyVerifiedError);
    });
  });
});
