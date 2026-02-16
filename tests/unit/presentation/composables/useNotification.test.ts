/**
 * ============================================
 * TEST: useNotification Composable
 * ============================================
 *
 * Tests for notification composable wrapper.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useNotification } from '@presentation/composables/useNotification.js';
import { useNotificationStore } from '@presentation/stores/notification.store.js';

describe('useNotification', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('Success', () => {
    it('should add success notification', () => {
      const { success } = useNotification();
      const store = useNotificationStore();

      success('Success message');

      expect(store.notifications).toHaveLength(1);
      expect(store.notifications[0].message).toBe('Success message');
      expect(store.notifications[0].variant).toBe('success');
    });

    it('should allow custom duration', () => {
      const { success } = useNotification();
      const store = useNotificationStore();

      success('Success message', 3000);

      expect(store.notifications[0].duration).toBe(3000);
    });
  });

  describe('Error', () => {
    it('should add error notification', () => {
      const { error } = useNotification();
      const store = useNotificationStore();

      error('Error message');

      expect(store.notifications).toHaveLength(1);
      expect(store.notifications[0].message).toBe('Error message');
      expect(store.notifications[0].variant).toBe('error');
    });
  });

  describe('Warning', () => {
    it('should add warning notification', () => {
      const { warning } = useNotification();
      const store = useNotificationStore();

      warning('Warning message');

      expect(store.notifications).toHaveLength(1);
      expect(store.notifications[0].message).toBe('Warning message');
      expect(store.notifications[0].variant).toBe('warning');
    });
  });

  describe('Info', () => {
    it('should add info notification', () => {
      const { info } = useNotification();
      const store = useNotificationStore();

      info('Info message');

      expect(store.notifications).toHaveLength(1);
      expect(store.notifications[0].message).toBe('Info message');
      expect(store.notifications[0].variant).toBe('info');
    });
  });
});
