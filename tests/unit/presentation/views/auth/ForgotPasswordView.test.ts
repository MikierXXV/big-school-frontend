/**
 * ============================================
 * TEST: ForgotPasswordView Component
 * ============================================
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createMemoryHistory } from 'vue-router';
import ForgotPasswordView from '@presentation/views/auth/ForgotPasswordView.vue';

const createMockRouter = () => {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: '/forgot-password',
        name: 'forgot-password',
        component: ForgotPasswordView,
      },
    ],
  });
};

describe('ForgotPasswordView', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('Rendering', () => {
    it('should render forgot password view', async () => {
      const router = createMockRouter();
      await router.push('/forgot-password');

      const wrapper = mount(ForgotPasswordView, {
        global: {
          plugins: [router],
        },
      });

      expect(wrapper.find('.forgot-password-view').exists()).toBe(true);
    });

    it('should render BaseCard component', async () => {
      const router = createMockRouter();
      await router.push('/forgot-password');

      const wrapper = mount(ForgotPasswordView, {
        global: {
          plugins: [router],
        },
      });

      const card = wrapper.findComponent({ name: 'BaseCard' });
      expect(card.exists()).toBe(true);
    });

    it('should render descriptive text', async () => {
      const router = createMockRouter();
      await router.push('/forgot-password');

      const wrapper = mount(ForgotPasswordView, {
        global: {
          plugins: [router],
        },
      });

      expect(wrapper.text()).toContain('Enter your email address');
      expect(wrapper.text()).toContain("we'll send you a link");
    });

    it('should render ForgotPasswordForm', async () => {
      const router = createMockRouter();
      await router.push('/forgot-password');

      const wrapper = mount(ForgotPasswordView, {
        global: {
          plugins: [router],
        },
      });

      const form = wrapper.findComponent({ name: 'ForgotPasswordForm' });
      expect(form.exists()).toBe(true);
    });
  });
});
