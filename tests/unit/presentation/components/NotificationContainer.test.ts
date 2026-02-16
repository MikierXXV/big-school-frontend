/**
 * ============================================
 * TEST: NotificationContainer Component
 * ============================================
 *
 * Tests for notification toast container.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import NotificationContainer from '@presentation/components/NotificationContainer.vue';
import { useNotificationStore } from '@presentation/stores/notification.store.js';

describe('NotificationContainer', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('Rendering', () => {
    it('should render without errors', () => {
      const wrapper = mount(NotificationContainer);

      expect(wrapper.exists()).toBe(true);
    });

    it('should not render any toasts when notifications array is empty', () => {
      const wrapper = mount(NotificationContainer);

      const toasts = wrapper.findAll('[role="status"]');
      expect(toasts).toHaveLength(0);
    });

    it('should render toast for each notification', () => {
      const store = useNotificationStore();
      store.addNotification({ message: 'First', variant: 'info' });
      store.addNotification({ message: 'Second', variant: 'success' });

      const wrapper = mount(NotificationContainer);

      const toasts = wrapper.findAll('[role="status"]');
      expect(toasts).toHaveLength(2);
    });
  });

  describe('Toast Content', () => {
    it('should display notification message', () => {
      const store = useNotificationStore();
      store.addNotification({ message: 'Test message', variant: 'info' });

      const wrapper = mount(NotificationContainer);

      expect(wrapper.text()).toContain('Test message');
    });

    it('should pass correct variant to BaseToast', () => {
      const store = useNotificationStore();
      store.addNotification({ message: 'Success', variant: 'success' });

      const wrapper = mount(NotificationContainer);

      const toast = wrapper.find('[role="status"]');
      expect(toast.classes()).toContain('bg-success-50');
    });
  });

  describe('Dismissing Toasts', () => {
    it('should remove notification when close event is emitted', async () => {
      const store = useNotificationStore();
      store.addNotification({ message: 'Test', variant: 'info' });

      const wrapper = mount(NotificationContainer);

      expect(store.notifications).toHaveLength(1);

      // Find and click close button
      const closeButton = wrapper.find('button[aria-label="Close notification"]');
      await closeButton.trigger('click');

      expect(store.notifications).toHaveLength(0);
    });
  });

  describe('Stacking', () => {
    it('should render multiple toasts in a column', () => {
      const store = useNotificationStore();
      store.addNotification({ message: 'First', variant: 'info' });
      store.addNotification({ message: 'Second', variant: 'success' });
      store.addNotification({ message: 'Third', variant: 'error' });

      const wrapper = mount(NotificationContainer);

      const container = wrapper.find('[class*="space-y"]');
      expect(container.exists()).toBe(true);

      const toasts = wrapper.findAll('[role="status"]');
      expect(toasts).toHaveLength(3);
    });
  });

  describe('Positioning', () => {
    it('should be positioned at top-right by default', () => {
      const wrapper = mount(NotificationContainer);

      const container = wrapper.element as HTMLElement;
      expect(container.className).toContain('fixed');
      expect(container.className).toContain('top-');
      expect(container.className).toContain('right-');
    });
  });
});
