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
