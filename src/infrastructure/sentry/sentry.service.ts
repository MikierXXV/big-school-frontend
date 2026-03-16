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
 * Custom error class for domain events.
 * Appears in Sentry Issues as "DomainEvent: <message>" — separate from real bugs.
 * Uses captureException so it's visible on the free plan.
 */
class DomainEventCapture extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainEvent';
  }
}

/**
 * Tracks expected domain events (not bugs) as grouped Issues in Sentry.
 * Each unique message forms its own Issue (via fingerprint), tagged with category=domain_event.
 */
export function trackDomainEvent(
  message: string,
  level: SentryEventLevel,
  extras?: Record<string, unknown>
): void {
  Sentry.withScope((scope) => {
    scope.setLevel(level);
    scope.setFingerprint(['domain-event', message]);
    scope.setTag('category', 'domain_event');
    if (extras) {
      Object.entries(extras).forEach(([key, value]) => scope.setExtra(key, value));
    }
    Sentry.captureException(new DomainEventCapture(message));
  });
}
