/**
 * ============================================
 * TEST: BaseButton Component
 * ============================================
 *
 * Tests for button component with variants, sizes, loading, and ripple effect.
 */

import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseButton from '@presentation/components/ui/BaseButton.vue';

describe('BaseButton', () => {
  describe('Rendering', () => {
    it('should render slot content', () => {
      const wrapper = mount(BaseButton, {
        slots: { default: 'Click me' },
      });

      expect(wrapper.text()).toContain('Click me');
    });

    it('should render as button element by default', () => {
      const wrapper = mount(BaseButton);
      expect(wrapper.element.tagName).toBe('BUTTON');
    });

    it('should have type="button" by default', () => {
      const wrapper = mount(BaseButton);
      expect(wrapper.attributes('type')).toBe('button');
    });
  });

  describe('Variants', () => {
    it('should apply primary variant classes by default', () => {
      const wrapper = mount(BaseButton);
      const button = wrapper.element as HTMLElement;

      expect(button.className).toContain('bg-primary-600');
      expect(button.className).toContain('hover:bg-primary-700');
    });

    it('should apply secondary variant classes', () => {
      const wrapper = mount(BaseButton, {
        props: { variant: 'secondary' },
      });
      const button = wrapper.element as HTMLElement;

      expect(button.className).toContain('bg-gray-600');
      expect(button.className).toContain('hover:bg-gray-700');
    });

    it('should apply outline variant classes', () => {
      const wrapper = mount(BaseButton, {
        props: { variant: 'outline' },
      });
      const button = wrapper.element as HTMLElement;

      expect(button.className).toContain('border-2');
      expect(button.className).toContain('border-primary-600');
      expect(button.className).toContain('text-primary-600');
    });

    it('should apply ghost variant classes', () => {
      const wrapper = mount(BaseButton, {
        props: { variant: 'ghost' },
      });
      const button = wrapper.element as HTMLElement;

      expect(button.className).toContain('hover:bg-gray-100');
      expect(button.className).toContain('text-gray-700');
    });

    it('should apply danger variant classes', () => {
      const wrapper = mount(BaseButton, {
        props: { variant: 'danger' },
      });
      const button = wrapper.element as HTMLElement;

      expect(button.className).toContain('bg-error-600');
      expect(button.className).toContain('hover:bg-error-700');
    });
  });

  describe('Sizes', () => {
    it('should apply md size classes by default', () => {
      const wrapper = mount(BaseButton);
      const button = wrapper.element as HTMLElement;

      expect(button.className).toContain('px-4');
      expect(button.className).toContain('py-2');
      expect(button.className).toContain('text-sm');
    });

    it('should apply sm size classes', () => {
      const wrapper = mount(BaseButton, {
        props: { size: 'sm' },
      });
      const button = wrapper.element as HTMLElement;

      expect(button.className).toContain('px-3');
      expect(button.className).toContain('py-1.5');
      expect(button.className).toContain('text-xs');
    });

    it('should apply lg size classes', () => {
      const wrapper = mount(BaseButton, {
        props: { size: 'lg' },
      });
      const button = wrapper.element as HTMLElement;

      expect(button.className).toContain('px-6');
      expect(button.className).toContain('py-3');
      expect(button.className).toContain('text-base');
    });
  });

  describe('Disabled State', () => {
    it('should have disabled attribute when disabled prop is true', () => {
      const wrapper = mount(BaseButton, {
        props: { disabled: true },
      });

      expect(wrapper.attributes('disabled')).toBeDefined();
    });

    it('should apply disabled classes', () => {
      const wrapper = mount(BaseButton, {
        props: { disabled: true },
      });
      const button = wrapper.element as HTMLElement;

      expect(button.className).toContain('opacity-50');
      expect(button.className).toContain('cursor-not-allowed');
    });

    it('should not emit click event when disabled', async () => {
      const wrapper = mount(BaseButton, {
        props: { disabled: true },
      });

      await wrapper.trigger('click');
      expect(wrapper.emitted('click')).toBeUndefined();
    });
  });

  describe('Loading State', () => {
    it('should show loading spinner when loading prop is true', () => {
      const wrapper = mount(BaseButton, {
        props: { loading: true },
      });

      const spinner = wrapper.find('[role="status"]');
      expect(spinner.exists()).toBe(true);
    });

    it('should be disabled when loading', () => {
      const wrapper = mount(BaseButton, {
        props: { loading: true },
      });

      expect(wrapper.attributes('disabled')).toBeDefined();
    });

    it('should hide slot content when loading', () => {
      const wrapper = mount(BaseButton, {
        props: { loading: true },
        slots: { default: 'Click me' },
      });

      const content = wrapper.find('.button-content');
      expect(content.classes()).toContain('invisible');
    });

    it('should not emit click event when loading', async () => {
      const wrapper = mount(BaseButton, {
        props: { loading: true },
      });

      await wrapper.trigger('click');
      expect(wrapper.emitted('click')).toBeUndefined();
    });
  });

  describe('Events', () => {
    it('should emit click event when clicked', async () => {
      const wrapper = mount(BaseButton);

      await wrapper.trigger('click');
      expect(wrapper.emitted('click')).toHaveLength(1);
    });

    it('should pass click event to parent', async () => {
      const onClick = vi.fn();
      const wrapper = mount(BaseButton, {
        attrs: { onClick },
      });

      await wrapper.trigger('click');
      expect(onClick).toHaveBeenCalledOnce();
    });
  });

  describe('Accessibility', () => {
    it('should support custom type attribute', () => {
      const wrapper = mount(BaseButton, {
        attrs: { type: 'submit' },
      });

      expect(wrapper.attributes('type')).toBe('submit');
    });

    it('should support aria-label', () => {
      const wrapper = mount(BaseButton, {
        attrs: { 'aria-label': 'Close dialog' },
      });

      expect(wrapper.attributes('aria-label')).toBe('Close dialog');
    });

    it('should have proper focus styles', () => {
      const wrapper = mount(BaseButton);
      const button = wrapper.element as HTMLElement;

      expect(button.className).toContain('focus:outline-none');
      expect(button.className).toContain('focus:ring-2');
    });
  });

  describe('Dark Mode', () => {
    it('should have dark mode classes for ghost variant', () => {
      const wrapper = mount(BaseButton, {
        props: { variant: 'ghost' },
      });
      const button = wrapper.element as HTMLElement;

      expect(button.className).toContain('dark:text-gray-200');
      expect(button.className).toContain('dark:hover:bg-gray-700');
    });

    it('should have dark mode classes for outline variant', () => {
      const wrapper = mount(BaseButton, {
        props: { variant: 'outline' },
      });
      const button = wrapper.element as HTMLElement;

      expect(button.className).toContain('dark:border-primary-400');
      expect(button.className).toContain('dark:text-primary-400');
    });
  });
});
