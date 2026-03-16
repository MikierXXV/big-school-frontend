/**
 * ============================================
 * SERVICE: Sentry User Context
 * ============================================
 *
 * Thin wrapper to set/clear user context in Sentry.
 * Called by the auth store on login, logout, and OAuth session restore.
 */

import * as Sentry from '@sentry/vue';

export function setSentryUser(user: {
  id: string;
  email: string;
  systemRole: string;
}): void {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.systemRole,
  });
}

export function clearSentryUser(): void {
  Sentry.setUser(null);
}

export type SentryEventLevel = 'info' | 'warning' | 'error';

/**
 * Tracks expected domain events (not bugs) as Sentry messages.
 * Uses captureMessage so beforeSend filter does not apply.
 */
export function trackDomainEvent(
  message: string,
  level: SentryEventLevel,
  extras?: Record<string, unknown>
): void {
  Sentry.withScope((scope) => {
    scope.setLevel(level);
    if (extras) {
      Object.entries(extras).forEach(([key, value]) => scope.setExtra(key, value));
    }
    Sentry.captureMessage(message, level);
  });
}
