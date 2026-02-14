/**
 * ============================================
 * STORE: Notification Store
 * ============================================
 *
 * Pinia store for managing notification queue.
 */

import { defineStore } from 'pinia';
import { ref } from 'vue';

export type NotificationVariant = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  message: string;
  variant: NotificationVariant;
  duration: number;
  autoDismiss: boolean;
}

export interface NotificationOptions {
  message: string;
  variant: NotificationVariant;
  duration?: number;
  autoDismiss?: boolean;
}

let idCounter = 0;

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([]);
  const timers = new Map<string, ReturnType<typeof setTimeout>>();

  /**
   * Generate unique ID for notification
   */
  function generateId(): string {
    return `notification-${Date.now()}-${idCounter++}`;
  }

  /**
   * Add a notification to the queue
   */
  function addNotification(options: NotificationOptions): void {
    const notification: Notification = {
      id: generateId(),
      message: options.message,
      variant: options.variant,
      duration: options.duration ?? 5000,
      autoDismiss: options.autoDismiss ?? true,
    };

    notifications.value.push(notification);

    // Setup auto-dismiss timer
    if (notification.autoDismiss) {
      const timer = setTimeout(() => {
        removeNotification(notification.id);
      }, notification.duration);

      timers.set(notification.id, timer);
    }
  }

  /**
   * Remove a notification by ID
   */
  function removeNotification(id: string): void {
    const index = notifications.value.findIndex((n) => n.id === id);
    if (index !== -1) {
      notifications.value.splice(index, 1);
    }

    // Clear timer if exists
    const timer = timers.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.delete(id);
    }
  }

  /**
   * Clear all notifications
   */
  function clearAll(): void {
    // Clear all timers
    for (const timer of timers.values()) {
      clearTimeout(timer);
    }
    timers.clear();

    // Clear notifications
    notifications.value = [];
  }

  /**
   * Shortcut: Add success notification
   */
  function success(message: string, duration?: number): void {
    addNotification({ message, variant: 'success', duration });
  }

  /**
   * Shortcut: Add error notification
   */
  function error(message: string, duration?: number): void {
    addNotification({ message, variant: 'error', duration });
  }

  /**
   * Shortcut: Add warning notification
   */
  function warning(message: string, duration?: number): void {
    addNotification({ message, variant: 'warning', duration });
  }

  /**
   * Shortcut: Add info notification
   */
  function info(message: string, duration?: number): void {
    addNotification({ message, variant: 'info', duration });
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info,
  };
});
