/**
 * ============================================
 * TEST: BaseInput Component
 * ============================================
 *
 * Tests for input component with password toggle, error/success states, and icons.
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseInput from '@presentation/components/ui/BaseInput.vue';

describe('BaseInput', () => {
  describe('Rendering', () => {
    it('should render input element', () => {
      const wrapper = mount(BaseInput);
      const input = wrapper.find('input');

      expect(input.exists()).toBe(true);
    });

    it('should have type="text" by default', () => {
      const wrapper = mount(BaseInput);
      const input = wrapper.find('input');

      expect(input.attributes('type')).toBe('text');
    });

    it('should render label when provided', () => {
      const wrapper = mount(BaseInput, {
        props: { label: 'Email' },
      });

      expect(wrapper.find('label').text()).toBe('Email');
    });

    it('should not render label when not provided', () => {
      const wrapper = mount(BaseInput);
      expect(wrapper.find('label').exists()).toBe(false);
    });
  });

  describe('V-Model', () => {
    it('should emit update:modelValue on input', async () => {
      const wrapper = mount(BaseInput, {
        props: { modelValue: '' },
      });
      const input = wrapper.find('input');

      await input.setValue('test value');
      expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['test value']);
    });

    it('should update input value when modelValue prop changes', async () => {
      const wrapper = mount(BaseInput, {
        props: { modelValue: 'initial' },
      });

      await wrapper.setProps({ modelValue: 'updated' });
      const input = wrapper.find('input');

      expect((input.element as HTMLInputElement).value).toBe('updated');
    });
  });

  describe('Password Toggle', () => {
    it('should show toggle button for password type', () => {
      const wrapper = mount(BaseInput, {
        props: { type: 'password' },
      });

      const toggleButton = wrapper.find('[aria-label="Toggle password visibility"]');
      expect(toggleButton.exists()).toBe(true);
    });

    it('should not show toggle button for other types', () => {
      const wrapper = mount(BaseInput, {
        props: { type: 'email' },
      });

      const toggleButton = wrapper.find('[aria-label="Toggle password visibility"]');
      expect(toggleButton.exists()).toBe(false);
    });

    it('should toggle between password and text type when clicked', async () => {
      const wrapper = mount(BaseInput, {
        props: { type: 'password' },
      });
      const toggleButton = wrapper.find('[aria-label="Toggle password visibility"]');
      const input = wrapper.find('input');

      expect(input.attributes('type')).toBe('password');

      await toggleButton.trigger('click');
      expect(input.attributes('type')).toBe('text');

      await toggleButton.trigger('click');
      expect(input.attributes('type')).toBe('password');
    });
  });

  describe('Error State', () => {
    it('should apply error classes when error prop is truthy', () => {
      const wrapper = mount(BaseInput, {
        props: { error: 'This field is required' },
      });
      const input = wrapper.find('input');

      expect(input.classes()).toContain('border-error-500');
      expect(input.classes()).toContain('focus:ring-error-500');
    });

    it('should display error message', () => {
      const wrapper = mount(BaseInput, {
        props: { error: 'This field is required' },
      });

      const errorMessage = wrapper.find('.text-error-600');
      expect(errorMessage.exists()).toBe(true);
      expect(errorMessage.text()).toBe('This field is required');
    });

    it('should not display error message when error is empty string', () => {
      const wrapper = mount(BaseInput, {
        props: { error: '' },
      });

      const errorMessage = wrapper.find('.text-error-600');
      expect(errorMessage.exists()).toBe(false);
    });
  });

  describe('Success State', () => {
    it('should apply success classes when success prop is true', () => {
      const wrapper = mount(BaseInput, {
        props: { success: true },
      });
      const input = wrapper.find('input');

      expect(input.classes()).toContain('border-success-500');
      expect(input.classes()).toContain('focus:ring-success-500');
    });
  });

  describe('Disabled State', () => {
    it('should have disabled attribute when disabled prop is true', () => {
      const wrapper = mount(BaseInput, {
        props: { disabled: true },
      });
      const input = wrapper.find('input');

      expect(input.attributes('disabled')).toBeDefined();
    });

    it('should apply disabled classes', () => {
      const wrapper = mount(BaseInput, {
        props: { disabled: true },
      });
      const input = wrapper.find('input');

      expect(input.classes()).toContain('opacity-50');
      expect(input.classes()).toContain('cursor-not-allowed');
    });
  });

  describe('Placeholder', () => {
    it('should set placeholder attribute', () => {
      const wrapper = mount(BaseInput, {
        props: { placeholder: 'Enter your email' },
      });
      const input = wrapper.find('input');

      expect(input.attributes('placeholder')).toBe('Enter your email');
    });
  });

  describe('Accessibility', () => {
    it('should associate label with input using id', () => {
      const wrapper = mount(BaseInput, {
        props: {
          label: 'Email',
          id: 'email-input',
        },
      });
      const label = wrapper.find('label');
      const input = wrapper.find('input');

      expect(label.attributes('for')).toBe('email-input');
      expect(input.attributes('id')).toBe('email-input');
    });

    it('should generate id if not provided', () => {
      const wrapper = mount(BaseInput, {
        props: { label: 'Email' },
      });
      const input = wrapper.find('input');

      expect(input.attributes('id')).toBeTruthy();
    });

    it('should have aria-invalid when error is present', () => {
      const wrapper = mount(BaseInput, {
        props: { error: 'Error message' },
      });
      const input = wrapper.find('input');

      expect(input.attributes('aria-invalid')).toBe('true');
    });

    it('should not have aria-invalid when no error', () => {
      const wrapper = mount(BaseInput);
      const input = wrapper.find('input');

      expect(input.attributes('aria-invalid')).toBeUndefined();
    });
  });

  describe('Dark Mode', () => {
    it('should have dark mode classes', () => {
      const wrapper = mount(BaseInput);
      const input = wrapper.find('input');

      expect(input.classes()).toContain('dark:bg-gray-800');
      expect(input.classes()).toContain('dark:border-gray-600');
      expect(input.classes()).toContain('dark:text-gray-100');
    });
  });
});
