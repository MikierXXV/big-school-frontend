/**
 * ============================================
 * TEST: RegisterForm Component
 * ============================================
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import RegisterForm from '@presentation/components/auth/RegisterForm.vue';
import { useAuthStore } from '@presentation/stores/auth.store.js';

// Mock router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('RegisterForm', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('Rendering', () => {
    it('should render all required input fields', () => {
      const wrapper = mount(RegisterForm);

      const inputs = wrapper.findAll('input');
      // email, password, passwordConfirmation, firstName, lastName, acceptTerms checkbox
      expect(inputs.length).toBeGreaterThanOrEqual(6);
    });

    it('should render email input', () => {
      const wrapper = mount(RegisterForm);

      const emailInput = wrapper.find('input[type="email"]');
      expect(emailInput.exists()).toBe(true);
    });

    it('should render password inputs', () => {
      const wrapper = mount(RegisterForm);

      const passwordInputs = wrapper.findAll('input[type="password"]');
      expect(passwordInputs.length).toBeGreaterThanOrEqual(2);
    });

    it('should render terms checkbox', () => {
      const wrapper = mount(RegisterForm);

      const checkbox = wrapper.find('input[type="checkbox"]');
      expect(checkbox.exists()).toBe(true);
    });

    it('should render submit button', () => {
      const wrapper = mount(RegisterForm);

      const button = wrapper.find('button[type="submit"]');
      expect(button.exists()).toBe(true);
    });

    it('should render password strength meter', () => {
      const wrapper = mount(RegisterForm);

      // PasswordStrengthMeter component should be present
      const strengthMeter = wrapper.findComponent({ name: 'PasswordStrengthMeter' });
      expect(strengthMeter.exists()).toBe(true);
    });
  });

  describe('Validation', () => {
    it('should show error for empty email', async () => {
      const wrapper = mount(RegisterForm);

      const form = wrapper.find('form');
      await form.trigger('submit');

      expect(wrapper.text()).toContain('required');
    });

    it('should show error for invalid email format', async () => {
      const wrapper = mount(RegisterForm);

      const emailInput = wrapper.find('input[type="email"]');
      await emailInput.setValue('invalid-email');

      const form = wrapper.find('form');
      await form.trigger('submit');

      expect(wrapper.text()).toContain('email');
    });

    it('should show error for weak password', async () => {
      const wrapper = mount(RegisterForm);

      const emailInput = wrapper.find('input[type="email"]');
      const passwordInputs = wrapper.findAll('input[type="password"]');

      await emailInput.setValue('user@example.com');
      await passwordInputs[0].setValue('weak'); // Weak password

      const form = wrapper.find('form');
      await form.trigger('submit');

      expect(wrapper.text()).toContain('Password');
    });

    it('should show error when passwords do not match', async () => {
      const wrapper = mount(RegisterForm);

      const emailInput = wrapper.find('input[type="email"]');
      const passwordInputs = wrapper.findAll('input[type="password"]');

      await emailInput.setValue('user@example.com');
      await passwordInputs[0].setValue('Password123!');
      await passwordInputs[1].setValue('DifferentPassword123!');

      const form = wrapper.find('form');
      await form.trigger('submit');

      expect(wrapper.text()).toContain('match');
    });

    it('should show error when terms not accepted', async () => {
      const wrapper = mount(RegisterForm);

      const emailInput = wrapper.find('input[type="email"]');
      const passwordInputs = wrapper.findAll('input[type="password"]');
      const firstNameInput = wrapper.find('input[id="firstName"]');
      const lastNameInput = wrapper.find('input[id="lastName"]');

      await emailInput.setValue('user@example.com');
      await passwordInputs[0].setValue('Password123!');
      await passwordInputs[1].setValue('Password123!');
      await firstNameInput.setValue('John');
      await lastNameInput.setValue('Doe');
      // Don't check acceptTerms checkbox

      const form = wrapper.find('form');
      await form.trigger('submit');

      expect(wrapper.text()).toContain('terms');
    });
  });

  describe('Form Submission', () => {
    it('should call auth store register on valid submission', async () => {
      const authStore = useAuthStore();
      const registerSpy = vi.spyOn(authStore, 'register').mockResolvedValue();

      const wrapper = mount(RegisterForm);

      const emailInput = wrapper.find('input[type="email"]');
      const passwordInputs = wrapper.findAll('input[type="password"]');
      const firstNameInput = wrapper.find('input[id="firstName"]');
      const lastNameInput = wrapper.find('input[id="lastName"]');
      const checkbox = wrapper.find('input[type="checkbox"]');

      await emailInput.setValue('user@example.com');
      await passwordInputs[0].setValue('Password123!');
      await passwordInputs[1].setValue('Password123!');
      await firstNameInput.setValue('John');
      await lastNameInput.setValue('Doe');
      await checkbox.setValue(true);

      const form = wrapper.find('form');
      await form.trigger('submit');
      await wrapper.vm.$nextTick();

      expect(registerSpy).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'Password123!',
        passwordConfirmation: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
        acceptTerms: true,
      });
    });
  });

  describe('Password Strength Integration', () => {
    it('should update password strength meter when password changes', async () => {
      const wrapper = mount(RegisterForm);

      const passwordInput = wrapper.findAll('input[type="password"]')[0];
      await passwordInput.setValue('Password123!');

      await wrapper.vm.$nextTick();

      const strengthMeter = wrapper.findComponent({ name: 'PasswordStrengthMeter' });
      expect(strengthMeter.props('password')).toBe('Password123!');
    });
  });
});
