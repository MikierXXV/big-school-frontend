/**
 * ============================================
 * DI CONTAINER
 * ============================================
 *
 * Dependency injection container for wiring application.
 * Creates and configures all dependencies.
 */

import { AxiosHttpClient } from '@infrastructure/http/axios-http-client.js';
import { LocalStorageService } from '@infrastructure/storage/local-storage.service.js';
import { HttpAuthRepository } from '@infrastructure/repositories/http-auth.repository.js';

import { LoginUseCase } from '@application/use-cases/auth/login.use-case.js';
import { RegisterUseCase } from '@application/use-cases/auth/register.use-case.js';
import { LogoutUseCase } from '@application/use-cases/auth/logout.use-case.js';
import { RefreshSessionUseCase } from '@application/use-cases/auth/refresh-session.use-case.js';
import { VerifyEmailUseCase } from '@application/use-cases/auth/verify-email.use-case.js';
import { RequestPasswordResetUseCase } from '@application/use-cases/auth/request-password-reset.use-case.js';
import { ConfirmPasswordResetUseCase } from '@application/use-cases/auth/confirm-password-reset.use-case.js';

/**
 * Container interface
 */
export interface Container {
  useCases: {
    loginUseCase: LoginUseCase;
    registerUseCase: RegisterUseCase;
    logoutUseCase: LogoutUseCase;
    refreshSessionUseCase: RefreshSessionUseCase;
    verifyEmailUseCase: VerifyEmailUseCase;
    requestPasswordResetUseCase: RequestPasswordResetUseCase;
    confirmPasswordResetUseCase: ConfirmPasswordResetUseCase;
  };
}

// Singleton instance
let containerInstance: Container | null = null;

/**
 * Create and configure the DI container
 */
export function createContainer(): Container {
  // Return existing instance if already created (singleton)
  if (containerInstance) {
    return containerInstance;
  }

  // Get API base URL from environment or use default
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';

  // Infrastructure Layer - Create adapters
  const httpClient = new AxiosHttpClient(apiBaseUrl);
  const storageService = new LocalStorageService();

  // Infrastructure Layer - Create repositories
  const authRepository = new HttpAuthRepository(httpClient);

  // Application Layer - Create use cases with dependencies
  const loginUseCase = new LoginUseCase({
    authRepository,
    storageService,
  });

  const registerUseCase = new RegisterUseCase({
    authRepository,
  });

  const logoutUseCase = new LogoutUseCase({
    authRepository,
    storageService,
  });

  const refreshSessionUseCase = new RefreshSessionUseCase({
    authRepository,
    storageService,
  });

  const verifyEmailUseCase = new VerifyEmailUseCase({
    authRepository,
  });

  const requestPasswordResetUseCase = new RequestPasswordResetUseCase({
    authRepository,
  });

  const confirmPasswordResetUseCase = new ConfirmPasswordResetUseCase({
    authRepository,
  });

  // Create container
  containerInstance = {
    useCases: {
      loginUseCase,
      registerUseCase,
      logoutUseCase,
      refreshSessionUseCase,
      verifyEmailUseCase,
      requestPasswordResetUseCase,
      confirmPasswordResetUseCase,
    },
  };

  return containerInstance;
}

/**
 * Reset container (useful for testing)
 */
export function resetContainer(): void {
  containerInstance = null;
}
