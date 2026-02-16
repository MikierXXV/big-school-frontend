/**
 * ============================================
 * TEST: VerifyEmailView Component
 * ============================================
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createMemoryHistory } from 'vue-router';
import VerifyEmailView from '@presentation/views/auth/VerifyEmailView.vue';
import { useAuthStore } from '@presentation/stores/auth.store.js';

const createMockRouter = (query: Record<string, string> = {}) => {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: '/verify-email',
        name: 'verify-email',
        component: VerifyEmailView,
      },
      {
        path: '/login',
        name: 'login',
        component: { template: '<div>Login</div>' },
      },
    ],
  });
};

describe('VerifyEmailView', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render verify email view', async () => {
      const router = createMockRouter({ token: 'valid-token' });
      await router.push('/verify-email?token=valid-token');

      const authStore = useAuthStore();
      vi.spyOn(authStore, 'verifyEmail').mockResolvedValue();

      const wrapper = mount(VerifyEmailView, {
        global: {
          plugins: [router],
        },
      });

      expect(wrapper.find('.verify-email-view').exists()).toBe(true);
    });

    it('should show loading state initially', async () => {
      const router = createMockRouter({ token: 'valid-token' });
      await router.push('/verify-email?token=valid-token');

      const authStore = useAuthStore();
      const verifyEmailSpy = vi.spyOn(authStore, 'verifyEmail').mockImplementation(
        () => new Promise(() => {}) // Never resolves (loading forever)
      );

      const wrapper = mount(VerifyEmailView, {
        global: {
          plugins: [router],
        },
      });

      await flushPromises();

      expect(wrapper.text()).toContain('Verifying your email...');

      verifyEmailSpy.mockRestore();
    });
  });

  describe('Email Verification', () => {
    it('should call verifyEmail with token from query params', async () => {
      const router = createMockRouter({ token: 'valid-token-123' });
      await router.push('/verify-email?token=valid-token-123');

      const authStore = useAuthStore();
      const verifyEmailSpy = vi.spyOn(authStore, 'verifyEmail').mockResolvedValue();

      mount(VerifyEmailView, {
        global: {
          plugins: [router],
        },
      });

      await flushPromises();

      expect(verifyEmailSpy).toHaveBeenCalledWith('valid-token-123');
    });

    it('should show success message when verification succeeds', async () => {
      const router = createMockRouter({ token: 'valid-token' });
      await router.push('/verify-email?token=valid-token');

      const authStore = useAuthStore();
      vi.spyOn(authStore, 'verifyEmail').mockResolvedValue();

      const wrapper = mount(VerifyEmailView, {
        global: {
          plugins: [router],
        },
      });

      await flushPromises();

      expect(wrapper.text()).toContain('Email Verified!');
      expect(wrapper.text()).toContain('successfully verified');
    });

    it('should show error message when verification fails', async () => {
      const router = createMockRouter({ token: 'invalid-token' });
      await router.push('/verify-email?token=invalid-token');

      const authStore = useAuthStore();
      authStore.error = 'Invalid verification token';
      vi.spyOn(authStore, 'verifyEmail').mockRejectedValue(new Error('Verification failed'));

      const wrapper = mount(VerifyEmailView, {
        global: {
          plugins: [router],
        },
      });

      await flushPromises();

      expect(wrapper.text()).toContain('Verification Failed');
      // Error message comes from either authStore.error or local error state
      expect(wrapper.text()).toContain('failed');
    });

    it('should show error when token is missing', async () => {
      const router = createMockRouter();
      await router.push('/verify-email');

      const authStore = useAuthStore();
      const verifyEmailSpy = vi.spyOn(authStore, 'verifyEmail');

      const wrapper = mount(VerifyEmailView, {
        global: {
          plugins: [router],
        },
      });

      await flushPromises();

      expect(verifyEmailSpy).not.toHaveBeenCalled();
      expect(wrapper.text()).toContain('Verification Failed');
      expect(wrapper.text()).toContain('Verification token is missing');
    });
  });
});
