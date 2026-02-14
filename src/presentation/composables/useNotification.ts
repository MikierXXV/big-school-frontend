/**
 * ============================================
 * COMPOSABLE: useNotification
 * ============================================
 *
 * Composable wrapper for notification store.
 */

import { useNotificationStore } from '@presentation/stores/notification.store.js';

export function useNotification() {
  const store = useNotificationStore();

  function success(message: string, duration?: number): void {
    store.success(message, duration);
  }

  function error(message: string, duration?: number): void {
    store.error(message, duration);
  }

  function warning(message: string, duration?: number): void {
    store.warning(message, duration);
  }

  function info(message: string, duration?: number): void {
    store.info(message, duration);
  }

  return {
    success,
    error,
    warning,
    info,
  };
}
