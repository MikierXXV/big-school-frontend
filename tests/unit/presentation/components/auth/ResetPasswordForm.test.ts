/**
 * ============================================
 * TEST: ResetPasswordForm Component
 * ============================================
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import ResetPasswordForm from '@presentation/components/auth/ResetPasswordForm.vue';
import { useAuthStore } from '@presentation/stores/auth.store.js';

// Mock router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('ResetPasswordForm', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('Rendering', () => {
    it('should render password inputs', () => {
      const wrapper = mount(ResetPasswordForm, {
        props: { token: 'test-token' },
      });

      const passwordInputs = wrapper.findAll('input[type="password"]');
      expect(passwordInputs.length).toBe(2);
    });

    it('should render submit button', () => {
      const wrapper = mount(ResetPasswordForm, {
        props: { token: 'test-token' },
      });

      const button = wrapper.find('button[type="submit"]');
      expect(button.exists()).toBe(true);
    });

    it('should render password strength meter', () => {
      const wrapper = mount(ResetPasswordForm, {
        props: { token: 'test-token' },
      });

      const strengthMeter = wrapper.findComponent({ name: 'PasswordStrengthMeter' });
      expect(strengthMeter.exists()).toBe(true);
    });
  });

  describe('Validation', () => {
    it('should show error for weak password', async () => {
      const wrapper = mount(ResetPasswordForm, {
        props: { token: 'test-token' },
      });

      const passwordInputs = wrapper.findAll('input[type="password"]');
      await passwordInputs[0].setValue('weak');

      const form = wrapper.find('form');
      await form.trigger('submit');

      expect(wrapper.text()).toContain('Password');
    });

    it('should show error when passwords do not match', async () => {
      const wrapper = mount(ResetPasswordForm, {
        props: { token: 'test-token' },
      });

      const passwordInputs = wrapper.findAll('input[type="password"]');
      await passwordInputs[0].setValue('Password123!');
      await passwordInputs[1].setValue('DifferentPassword123!');

      const form = wrapper.find('form');
      await form.trigger('submit');

      expect(wrapper.text()).toContain('match');
    });
  });

  describe('Form Submission', () => {
    it('should call confirmPasswordReset with token and passwords', async () => {
      const authStore = useAuthStore();
      const resetSpy = vi.spyOn(authStore, 'confirmPasswordReset').mockResolvedValue();

      const wrapper = mount(ResetPasswordForm, {
        props: { token: 'test-reset-token' },
      });

      const passwordInputs = wrapper.findAll('input[type="password"]');
      await passwordInputs[0].setValue('NewPassword123!');
      await passwordInputs[1].setValue('NewPassword123!');

      const form = wrapper.find('form');
      await form.trigger('submit');
      await wrapper.vm.$nextTick();

      expect(resetSpy).toHaveBeenCalledWith({
        token: 'test-reset-token',
        newPassword: 'NewPassword123!',
        passwordConfirmation: 'NewPassword123!',
      });
    });
  });

  describe('Password Strength Integration', () => {
    it('should update password strength meter when password changes', async () => {
      const wrapper = mount(ResetPasswordForm, {
        props: { token: 'test-token' },
      });

      const passwordInput = wrapper.findAll('input[type="password"]')[0];
      await passwordInput.setValue('NewPassword123!');

      await wrapper.vm.$nextTick();

      const strengthMeter = wrapper.findComponent({ name: 'PasswordStrengthMeter' });
      expect(strengthMeter.props('password')).toBe('NewPassword123!');
    });
  });
});
