/**
 * ============================================
 * TEST: BaseAlert Component
 * ============================================
 *
 * Tests for alert component with variants, dismissible option, and icons.
 */

import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseAlert from '@presentation/components/ui/BaseAlert.vue';

describe('BaseAlert', () => {
  describe('Rendering', () => {
    it('should render alert with slot content', () => {
      const wrapper = mount(BaseAlert, {
        slots: { default: 'Alert message' },
      });

      expect(wrapper.text()).toContain('Alert message');
    });

    it('should render as div element', () => {
      const wrapper = mount(BaseAlert);
      expect(wrapper.element.tagName).toBe('DIV');
    });
  });

  describe('Variants', () => {
    it('should render info variant by default', () => {
      const wrapper = mount(BaseAlert);
      const alert = wrapper.element as HTMLElement;

      expect(alert.className).toContain('bg-info-50');
      expect(alert.className).toContain('border-info-200');
    });

    it('should render success variant', () => {
      const wrapper = mount(BaseAlert, {
        props: { variant: 'success' },
      });
      const alert = wrapper.element as HTMLElement;

      expect(alert.className).toContain('bg-success-50');
      expect(alert.className).toContain('border-success-200');
    });

    it('should render warning variant', () => {
      const wrapper = mount(BaseAlert, {
        props: { variant: 'warning' },
      });
      const alert = wrapper.element as HTMLElement;

      expect(alert.className).toContain('bg-warning-50');
      expect(alert.className).toContain('border-warning-200');
    });

    it('should render error variant', () => {
      const wrapper = mount(BaseAlert, {
        props: { variant: 'error' },
      });
      const alert = wrapper.element as HTMLElement;

      expect(alert.className).toContain('bg-error-50');
      expect(alert.className).toContain('border-error-200');
    });
  });

  describe('Icon', () => {
    it('should show icon by default', () => {
      const wrapper = mount(BaseAlert);
      const icon = wrapper.find('svg');

      expect(icon.exists()).toBe(true);
    });

    it('should hide icon when showIcon is false', () => {
      const wrapper = mount(BaseAlert, {
        props: { showIcon: false },
      });
      const icon = wrapper.find('svg');

      expect(icon.exists()).toBe(false);
    });
  });

  describe('Dismissible', () => {
    it('should not show close button by default', () => {
      const wrapper = mount(BaseAlert);
      const closeButton = wrapper.find('button');

      expect(closeButton.exists()).toBe(false);
    });

    it('should show close button when dismissible is true', () => {
      const wrapper = mount(BaseAlert, {
        props: { dismissible: true },
      });
      const closeButton = wrapper.find('button');

      expect(closeButton.exists()).toBe(true);
      expect(closeButton.attributes('aria-label')).toBe('Close alert');
    });

    it('should emit close event when close button clicked', async () => {
      const wrapper = mount(BaseAlert, {
        props: { dismissible: true },
      });
      const closeButton = wrapper.find('button');

      await closeButton.trigger('click');

      expect(wrapper.emitted('close')).toBeTruthy();
      expect(wrapper.emitted('close')).toHaveLength(1);
    });

    it('should not render after close button clicked', async () => {
      const wrapper = mount(BaseAlert, {
        props: { dismissible: true },
      });
      const closeButton = wrapper.find('button');

      await closeButton.trigger('click');

      expect(wrapper.find('[role="alert"]').exists()).toBe(false);
    });
  });

  describe('Accessibility', () => {
    it('should have role="alert"', () => {
      const wrapper = mount(BaseAlert);
      const alert = wrapper.find('[role="alert"]');

      expect(alert.exists()).toBe(true);
    });
  });

  describe('Dark Mode', () => {
    it('should have dark mode classes for info variant', () => {
      const wrapper = mount(BaseAlert, {
        props: { variant: 'info' },
      });
      const alert = wrapper.element as HTMLElement;

      expect(alert.className).toContain('dark:bg-info-900');
      expect(alert.className).toContain('dark:border-info-700');
    });

    it('should have dark mode classes for success variant', () => {
      const wrapper = mount(BaseAlert, {
        props: { variant: 'success' },
      });
      const alert = wrapper.element as HTMLElement;

      expect(alert.className).toContain('dark:bg-success-900');
      expect(alert.className).toContain('dark:border-success-700');
    });
  });
});
