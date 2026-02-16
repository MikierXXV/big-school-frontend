/**
 * ============================================
 * TEST: ForgotPasswordForm Component
 * ============================================
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import ForgotPasswordForm from '@presentation/components/auth/ForgotPasswordForm.vue';
import { useAuthStore } from '@presentation/stores/auth.store.js';

// Mock router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('ForgotPasswordForm', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('Rendering', () => {
    it('should render email input', () => {
      const wrapper = mount(ForgotPasswordForm);

      const emailInput = wrapper.find('input[type="email"]');
      expect(emailInput.exists()).toBe(true);
    });

    it('should render submit button', () => {
      const wrapper = mount(ForgotPasswordForm);

      const button = wrapper.find('button[type="submit"]');
      expect(button.exists()).toBe(true);
    });

    it('should render back to login link', () => {
      const wrapper = mount(ForgotPasswordForm);

      const link = wrapper.find('a[href="/login"]');
      expect(link.exists()).toBe(true);
    });
  });

  describe('Validation', () => {
    it('should show error for empty email', async () => {
      const wrapper = mount(ForgotPasswordForm);

      const form = wrapper.find('form');
      await form.trigger('submit');

      expect(wrapper.text()).toContain('required');
    });

    it('should show error for invalid email format', async () => {
      const wrapper = mount(ForgotPasswordForm);

      const emailInput = wrapper.find('input[type="email"]');
      await emailInput.setValue('invalid-email');

      const form = wrapper.find('form');
      await form.trigger('submit');

      expect(wrapper.text()).toContain('email');
    });
  });

  describe('Form Submission', () => {
    it('should call requestPasswordReset on valid submission', async () => {
      const authStore = useAuthStore();
      const resetSpy = vi.spyOn(authStore, 'requestPasswordReset').mockResolvedValue();

      const wrapper = mount(ForgotPasswordForm);

      const emailInput = wrapper.find('input[type="email"]');
      await emailInput.setValue('user@example.com');

      const form = wrapper.find('form');
      await form.trigger('submit');
      await wrapper.vm.$nextTick();

      expect(resetSpy).toHaveBeenCalledWith('user@example.com');
    });
  });
});
