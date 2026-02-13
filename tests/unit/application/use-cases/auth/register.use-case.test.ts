/**
 * ============================================
 * UNIT TEST: RegisterUseCase
 * ============================================
 *
 * Tests para el caso de uso de registro.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RegisterUseCase } from '@application/use-cases/auth/register.use-case.js';
import type { IAuthRepository } from '@domain/repositories/auth.repository.interface.js';
import { User } from '@domain/entities/user.entity.js';
import { UserId } from '@domain/value-objects/user-id.value-object.js';
import { Email } from '@domain/value-objects/email.value-object.js';
import {
  UserAlreadyExistsError,
  WeakPasswordError,
  PasswordMismatchError,
  TermsNotAcceptedError,
} from '@domain/errors/auth.errors.js';

describe('RegisterUseCase', () => {
  let useCase: RegisterUseCase;
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

    useCase = new RegisterUseCase({
      authRepository: mockAuthRepository,
    });
  });

  describe('execute', () => {
    it('should register user successfully', async () => {
      const input = {
        email: 'newuser@example.com',
        password: 'Password123!',
        passwordConfirmation: 'Password123!',
        firstName: 'Jane',
        lastName: 'Smith',
        acceptTerms: true,
      };

      const mockUser = User.create({
        id: UserId.create('f47ac10b-58cc-4372-a567-0e02b2c3d479'),
        email: Email.create('newuser@example.com'),
        firstName: 'Jane',
        lastName: 'Smith',
      });

      vi.mocked(mockAuthRepository.register).mockResolvedValue({
        user: mockUser,
        requiresEmailVerification: true,
        verificationToken: 'verification_token_dev',
      });

      const result = await useCase.execute(input);

      expect(mockAuthRepository.register).toHaveBeenCalledWith({
        email: input.email,
        password: input.password,
        passwordConfirmation: input.passwordConfirmation,
        firstName: input.firstName,
        lastName: input.lastName,
        acceptTerms: input.acceptTerms,
      });

      expect(result.user.email).toBe('newuser@example.com');
      expect(result.user.firstName).toBe('Jane');
      expect(result.requiresEmailVerification).toBe(true);
      expect(result.verificationToken).toBe('verification_token_dev');
    });

    it('should throw UserAlreadyExistsError when email already exists', async () => {
      const input = {
        email: 'existing@example.com',
        password: 'Password123!',
        passwordConfirmation: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
        acceptTerms: true,
      };

      vi.mocked(mockAuthRepository.register).mockRejectedValue(
        new UserAlreadyExistsError('existing@example.com')
      );

      await expect(useCase.execute(input)).rejects.toThrow(UserAlreadyExistsError);
    });

    it('should throw WeakPasswordError when password is weak', async () => {
      const input = {
        email: 'user@example.com',
        password: 'weak',
        passwordConfirmation: 'weak',
        firstName: 'John',
        lastName: 'Doe',
        acceptTerms: true,
      };

      vi.mocked(mockAuthRepository.register).mockRejectedValue(
        new WeakPasswordError(['Minimum 8 characters', 'At least one uppercase letter'])
      );

      await expect(useCase.execute(input)).rejects.toThrow(WeakPasswordError);
    });

    it('should throw PasswordMismatchError when passwords do not match', async () => {
      const input = {
        email: 'user@example.com',
        password: 'Password123!',
        passwordConfirmation: 'DifferentPass123!',
        firstName: 'John',
        lastName: 'Doe',
        acceptTerms: true,
      };

      vi.mocked(mockAuthRepository.register).mockRejectedValue(new PasswordMismatchError());

      await expect(useCase.execute(input)).rejects.toThrow(PasswordMismatchError);
    });

    it('should throw TermsNotAcceptedError when terms are not accepted', async () => {
      const input = {
        email: 'user@example.com',
        password: 'Password123!',
        passwordConfirmation: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
        acceptTerms: false,
      };

      vi.mocked(mockAuthRepository.register).mockRejectedValue(new TermsNotAcceptedError());

      await expect(useCase.execute(input)).rejects.toThrow(TermsNotAcceptedError);
    });

    it('should call repository with exact data provided', async () => {
      const input = {
        email: 'test@example.com',
        password: 'TestPass123!',
        passwordConfirmation: 'TestPass123!',
        firstName: 'Test',
        lastName: 'User',
        acceptTerms: true,
      };

      const mockUser = User.create({
        id: UserId.create('f47ac10b-58cc-4372-a567-0e02b2c3d479'),
        email: Email.create(input.email),
        firstName: input.firstName,
        lastName: input.lastName,
      });

      vi.mocked(mockAuthRepository.register).mockResolvedValue({
        user: mockUser,
        requiresEmailVerification: true,
      });

      await useCase.execute(input);

      expect(mockAuthRepository.register).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'TestPass123!',
        passwordConfirmation: 'TestPass123!',
        firstName: 'Test',
        lastName: 'User',
        acceptTerms: true,
      });
    });
  });
});
