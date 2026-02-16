/**
 * ============================================
 * TEST: ResetPasswordView Component
 * ============================================
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createMemoryHistory } from 'vue-router';
import ResetPasswordView from '@presentation/views/auth/ResetPasswordView.vue';

const createMockRouter = (query: Record<string, string> = {}) => {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: '/reset-password',
        name: 'reset-password',
        component: ResetPasswordView,
      },
    ],
  });
};

describe('ResetPasswordView', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('Rendering', () => {
    it('should render reset password view', async () => {
      const router = createMockRouter({ token: 'valid-token' });
      await router.push('/reset-password?token=valid-token');

      const wrapper = mount(ResetPasswordView, {
        global: {
          plugins: [router],
        },
      });

      expect(wrapper.find('.reset-password-view').exists()).toBe(true);
      expect(wrapper.findComponent({ name: 'BaseCard' }).exists()).toBe(true);
    });

    it('should show ResetPasswordForm when token is present', async () => {
      const router = createMockRouter({ token: 'valid-token-123' });
      await router.push('/reset-password?token=valid-token-123');

      const wrapper = mount(ResetPasswordView, {
        global: {
          plugins: [router],
        },
      });

      expect(wrapper.findComponent({ name: 'ResetPasswordForm' }).exists()).toBe(true);
      expect(wrapper.findComponent({ name: 'ResetPasswordForm' }).props('token')).toBe('valid-token-123');
    });

    it('should show error message when token is missing', async () => {
      const router = createMockRouter();
      await router.push('/reset-password');

      const wrapper = mount(ResetPasswordView, {
        global: {
          plugins: [router],
        },
      });

      expect(wrapper.findComponent({ name: 'ResetPasswordForm' }).exists()).toBe(false);
      expect(wrapper.text()).toContain('Invalid Reset Link');
      expect(wrapper.text()).toContain('invalid or has expired');
    });

    it('should show link to request new reset when token is missing', async () => {
      const router = createMockRouter();
      await router.push('/reset-password');

      const wrapper = mount(ResetPasswordView, {
        global: {
          plugins: [router],
        },
      });

      const link = wrapper.find('a[href="/forgot-password"]');
      expect(link.exists()).toBe(true);
      expect(link.text()).toContain('Request New Reset Link');
    });
  });
});
