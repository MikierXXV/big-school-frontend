/**
 * ============================================
 * TEST: DI Container
 * ============================================
 *
 * Tests for dependency injection container.
 */

import { describe, it, expect } from 'vitest';
import { createContainer } from '@infrastructure/di/container.js';

describe('DI Container', () => {
  describe('Container Creation', () => {
    it('should create container without errors', () => {
      expect(() => createContainer()).not.toThrow();
    });

    it('should return an object with use cases', () => {
      const container = createContainer();

      expect(container).toHaveProperty('useCases');
      expect(container.useCases).toBeDefined();
    });
  });

  describe('Use Cases', () => {
    it('should provide LoginUseCase', () => {
      const { useCases } = createContainer();

      expect(useCases.loginUseCase).toBeDefined();
      expect(useCases.loginUseCase.execute).toBeInstanceOf(Function);
    });

    it('should provide RegisterUseCase', () => {
      const { useCases } = createContainer();

      expect(useCases.registerUseCase).toBeDefined();
      expect(useCases.registerUseCase.execute).toBeInstanceOf(Function);
    });

    it('should provide LogoutUseCase', () => {
      const { useCases } = createContainer();

      expect(useCases.logoutUseCase).toBeDefined();
      expect(useCases.logoutUseCase.execute).toBeInstanceOf(Function);
    });

    it('should provide RefreshSessionUseCase', () => {
      const { useCases } = createContainer();

      expect(useCases.refreshSessionUseCase).toBeDefined();
      expect(useCases.refreshSessionUseCase.execute).toBeInstanceOf(Function);
    });

    it('should provide VerifyEmailUseCase', () => {
      const { useCases } = createContainer();

      expect(useCases.verifyEmailUseCase).toBeDefined();
      expect(useCases.verifyEmailUseCase.execute).toBeInstanceOf(Function);
    });

    it('should provide RequestPasswordResetUseCase', () => {
      const { useCases } = createContainer();

      expect(useCases.requestPasswordResetUseCase).toBeDefined();
      expect(useCases.requestPasswordResetUseCase.execute).toBeInstanceOf(Function);
    });

    it('should provide ConfirmPasswordResetUseCase', () => {
      const { useCases } = createContainer();

      expect(useCases.confirmPasswordResetUseCase).toBeDefined();
      expect(useCases.confirmPasswordResetUseCase.execute).toBeInstanceOf(Function);
    });
  });

  describe('Singleton Pattern', () => {
    it('should return the same container instance', () => {
      const container1 = createContainer();
      const container2 = createContainer();

      expect(container1).toBe(container2);
    });

    it('should share the same use case instances', () => {
      const container1 = createContainer();
      const container2 = createContainer();

      expect(container1.useCases.loginUseCase).toBe(container2.useCases.loginUseCase);
    });
  });
});
