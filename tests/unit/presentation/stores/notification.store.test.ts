/**
 * ============================================
 * TEST: Notification Store
 * ============================================
 *
 * Tests for notification queue management.
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useNotificationStore } from '@presentation/stores/notification.store.js';

describe('Notification Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('State', () => {
    it('should initialize with empty notifications array', () => {
      const store = useNotificationStore();

      expect(store.notifications).toEqual([]);
    });
  });

  describe('Adding Notifications', () => {
    it('should add a notification', () => {
      const store = useNotificationStore();

      store.addNotification({
        message: 'Test message',
        variant: 'success',
      });

      expect(store.notifications).toHaveLength(1);
      expect(store.notifications[0].message).toBe('Test message');
      expect(store.notifications[0].variant).toBe('success');
    });

    it('should generate unique ID for each notification', () => {
      const store = useNotificationStore();

      store.addNotification({ message: 'First', variant: 'info' });
      store.addNotification({ message: 'Second', variant: 'info' });

      expect(store.notifications[0].id).not.toBe(store.notifications[1].id);
    });

    it('should set default duration to 5000ms', () => {
      const store = useNotificationStore();

      store.addNotification({ message: 'Test', variant: 'info' });

      expect(store.notifications[0].duration).toBe(5000);
    });

    it('should allow custom duration', () => {
      const store = useNotificationStore();

      store.addNotification({ message: 'Test', variant: 'info', duration: 3000 });

      expect(store.notifications[0].duration).toBe(3000);
    });

    it('should set autoDismiss to true by default', () => {
      const store = useNotificationStore();

      store.addNotification({ message: 'Test', variant: 'info' });

      expect(store.notifications[0].autoDismiss).toBe(true);
    });

    it('should allow disabling autoDismiss', () => {
      const store = useNotificationStore();

      store.addNotification({ message: 'Test', variant: 'info', autoDismiss: false });

      expect(store.notifications[0].autoDismiss).toBe(false);
    });
  });

  describe('Removing Notifications', () => {
    it('should remove notification by ID', () => {
      const store = useNotificationStore();

      store.addNotification({ message: 'First', variant: 'info' });
      store.addNotification({ message: 'Second', variant: 'info' });

      const idToRemove = store.notifications[0].id;
      store.removeNotification(idToRemove);

      expect(store.notifications).toHaveLength(1);
      expect(store.notifications[0].message).toBe('Second');
    });

    it('should do nothing if notification ID does not exist', () => {
      const store = useNotificationStore();

      store.addNotification({ message: 'Test', variant: 'info' });

      expect(() => {
        store.removeNotification('non-existent-id');
      }).not.toThrow();

      expect(store.notifications).toHaveLength(1);
    });
  });

  describe('Auto-dismiss', () => {
    it('should auto-dismiss notification after duration', () => {
      const store = useNotificationStore();

      store.addNotification({ message: 'Test', variant: 'info', duration: 3000 });

      expect(store.notifications).toHaveLength(1);

      vi.advanceTimersByTime(2999);
      expect(store.notifications).toHaveLength(1);

      vi.advanceTimersByTime(1);
      expect(store.notifications).toHaveLength(0);
    });

    it('should not auto-dismiss when autoDismiss is false', () => {
      const store = useNotificationStore();

      store.addNotification({
        message: 'Test',
        variant: 'info',
        duration: 3000,
        autoDismiss: false,
      });

      vi.advanceTimersByTime(5000);

      expect(store.notifications).toHaveLength(1);
    });
  });

  describe('Clear All', () => {
    it('should clear all notifications', () => {
      const store = useNotificationStore();

      store.addNotification({ message: 'First', variant: 'info' });
      store.addNotification({ message: 'Second', variant: 'success' });
      store.addNotification({ message: 'Third', variant: 'error' });

      store.clearAll();

      expect(store.notifications).toEqual([]);
    });
  });

  describe('Shortcut Methods', () => {
    it('should add success notification', () => {
      const store = useNotificationStore();

      store.success('Success message');

      expect(store.notifications).toHaveLength(1);
      expect(store.notifications[0].message).toBe('Success message');
      expect(store.notifications[0].variant).toBe('success');
    });

    it('should add error notification', () => {
      const store = useNotificationStore();

      store.error('Error message');

      expect(store.notifications).toHaveLength(1);
      expect(store.notifications[0].message).toBe('Error message');
      expect(store.notifications[0].variant).toBe('error');
    });

    it('should add warning notification', () => {
      const store = useNotificationStore();

      store.warning('Warning message');

      expect(store.notifications).toHaveLength(1);
      expect(store.notifications[0].message).toBe('Warning message');
      expect(store.notifications[0].variant).toBe('warning');
    });

    it('should add info notification', () => {
      const store = useNotificationStore();

      store.info('Info message');

      expect(store.notifications).toHaveLength(1);
      expect(store.notifications[0].message).toBe('Info message');
      expect(store.notifications[0].variant).toBe('info');
    });
  });
});
