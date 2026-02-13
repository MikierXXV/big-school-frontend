/**
 * ============================================
 * UNIT TEST: LoginUseCase
 * ============================================
 *
 * Tests para el caso de uso de login.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LoginUseCase } from '@application/use-cases/auth/login.use-case.js';
import type { IAuthRepository } from '@domain/repositories/auth.repository.interface.js';
import type { IStorageService } from '@application/ports/storage.port.js';
import { User } from '@domain/entities/user.entity.js';
import { UserId } from '@domain/value-objects/user-id.value-object.js';
import { Email } from '@domain/value-objects/email.value-object.js';
import {
  InvalidCredentialsError,
  AccountLockedError,
  UserNotActiveError,
} from '@domain/errors/auth.errors.js';

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
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

    useCase = new LoginUseCase({
      authRepository: mockAuthRepository,
      storageService: mockStorageService,
    });
  });

  describe('execute', () => {
    it('should login user successfully and store tokens', async () => {
      const input = {
        email: 'user@example.com',
        password: 'Password123!',
      };

      const mockUser = User.create({
        id: UserId.create('f47ac10b-58cc-4372-a567-0e02b2c3d479'),
        email: Email.create('user@example.com'),
        firstName: 'John',
        lastName: 'Doe',
      });

      const mockTokens = {
        accessToken: 'access_token_123',
        refreshToken: 'refresh_token_456',
        tokenType: 'Bearer' as const,
        expiresIn: 18000,
        expiresAt: '2024-01-01T05:00:00Z',
        refreshExpiresIn: 259200,
      };

      vi.mocked(mockAuthRepository.login).mockResolvedValue({
        user: mockUser,
        tokens: mockTokens,
      });

      const result = await useCase.execute(input);

      expect(mockAuthRepository.login).toHaveBeenCalledWith({
        email: input.email,
        password: input.password,
      });

      expect(mockStorageService.setItem).toHaveBeenCalledWith('accessToken', mockTokens.accessToken);
      expect(mockStorageService.setItem).toHaveBeenCalledWith('refreshToken', mockTokens.refreshToken);

      expect(result.user.email).toBe('user@example.com');
      expect(result.user.firstName).toBe('John');
      expect(result.tokens.accessToken).toBe('access_token_123');
      expect(result.tokens.refreshToken).toBe('refresh_token_456');
      expect(result.tokens.expiresIn).toBe(18000);
    });

    it('should throw InvalidCredentialsError when credentials are wrong', async () => {
      vi.mocked(mockAuthRepository.login).mockRejectedValue(new InvalidCredentialsError());

      await expect(
        useCase.execute({ email: 'wrong@example.com', password: 'wrong' })
      ).rejects.toThrow(InvalidCredentialsError);

      expect(mockStorageService.setItem).not.toHaveBeenCalled();
    });

    it('should throw AccountLockedError with remaining seconds', async () => {
      const error = new AccountLockedError(900);
      vi.mocked(mockAuthRepository.login).mockRejectedValue(error);

      await expect(
        useCase.execute({ email: 'locked@example.com', password: 'Password123!' })
      ).rejects.toThrow(AccountLockedError);

      expect(mockStorageService.setItem).not.toHaveBeenCalled();
    });

    it('should throw UserNotActiveError when user is not active', async () => {
      const error = new UserNotActiveError('SUSPENDED');
      vi.mocked(mockAuthRepository.login).mockRejectedValue(error);

      await expect(
        useCase.execute({ email: 'suspended@example.com', password: 'Password123!' })
      ).rejects.toThrow(UserNotActiveError);

      expect(mockStorageService.setItem).not.toHaveBeenCalled();
    });

    it('should call repository with exact credentials provided', async () => {
      const input = {
        email: 'test@example.com',
        password: 'TestPass123!',
      };

      const mockUser = User.create({
        id: UserId.create('f47ac10b-58cc-4372-a567-0e02b2c3d479'),
        email: Email.create(input.email),
        firstName: 'Test',
        lastName: 'User',
      });

      vi.mocked(mockAuthRepository.login).mockResolvedValue({
        user: mockUser,
        tokens: {
          accessToken: 'token',
          refreshToken: 'refresh',
          tokenType: 'Bearer',
          expiresIn: 18000,
          expiresAt: '2024-01-01T05:00:00Z',
          refreshExpiresIn: 259200,
        },
      });

      await useCase.execute(input);

      expect(mockAuthRepository.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'TestPass123!',
      });
    });
  });
});
