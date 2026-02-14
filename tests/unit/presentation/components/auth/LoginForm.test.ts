/**
 * ============================================
 * TEST: LoginForm Component
 * ============================================
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import LoginForm from '@presentation/components/auth/LoginForm.vue';
import { useAuthStore } from '@presentation/stores/auth.store.js';

// Mock router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('LoginForm', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('Rendering', () => {
    it('should render email and password inputs', () => {
      const wrapper = mount(LoginForm);

      const inputs = wrapper.findAll('input');
      expect(inputs.length).toBeGreaterThanOrEqual(2);
    });

    it('should render submit button', () => {
      const wrapper = mount(LoginForm);

      const button = wrapper.find('button[type="submit"]');
      expect(button.exists()).toBe(true);
    });

    it('should render "Remember me" checkbox', () => {
      const wrapper = mount(LoginForm);

      const checkbox = wrapper.find('input[type="checkbox"]');
      expect(checkbox.exists()).toBe(true);
    });
  });

  describe('Validation', () => {
    it('should show error for empty email', async () => {
      const wrapper = mount(LoginForm);

      const form = wrapper.find('form');
      await form.trigger('submit');

      expect(wrapper.text()).toContain('required');
    });

    it('should show error for invalid email format', async () => {
      const wrapper = mount(LoginForm);

      const emailInput = wrapper.find('input[type="email"]');
      await emailInput.setValue('invalid-email');

      const form = wrapper.find('form');
      await form.trigger('submit');

      expect(wrapper.text()).toContain('email');
    });

    it('should show error for empty password', async () => {
      const wrapper = mount(LoginForm);

      const emailInput = wrapper.find('input[type="email"]');
      await emailInput.setValue('user@example.com');

      const form = wrapper.find('form');
      await form.trigger('submit');

      expect(wrapper.text()).toContain('required');
    });
  });

  describe('Form Submission', () => {
    it('should call auth store login on valid submission', async () => {
      // Create spy BEFORE mounting component
      const authStore = useAuthStore();
      const loginSpy = vi.spyOn(authStore, 'login').mockResolvedValue();

      const wrapper = mount(LoginForm);

      const emailInput = wrapper.find('input[type="email"]');
      const passwordInput = wrapper.find('input[type="password"]');

      await emailInput.setValue('user@example.com');
      await passwordInput.setValue('Password123!');

      const form = wrapper.find('form');
      await form.trigger('submit');

      // Wait for async operations
      await wrapper.vm.$nextTick();

      expect(loginSpy).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'Password123!',
        rememberMe: false,
      });
    });

    it('should include rememberMe when checkbox is checked', async () => {
      // Create spy BEFORE mounting component
      const authStore = useAuthStore();
      const loginSpy = vi.spyOn(authStore, 'login').mockResolvedValue();

      const wrapper = mount(LoginForm);

      const emailInput = wrapper.find('input[type="email"]');
      const passwordInput = wrapper.find('input[type="password"]');
      const checkbox = wrapper.find('input[type="checkbox"]');

      await emailInput.setValue('user@example.com');
      await passwordInput.setValue('Password123!');
      await checkbox.setValue(true);

      const form = wrapper.find('form');
      await form.trigger('submit');
      await wrapper.vm.$nextTick();

      expect(loginSpy).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'Password123!',
        rememberMe: true,
      });
    });
  });
});
