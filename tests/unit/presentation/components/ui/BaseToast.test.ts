/**
 * ============================================
 * TEST: BaseToast Component
 * ============================================
 *
 * Tests for toast notification with slide-in animation, auto-dismiss, and progress bar.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseToast from '@presentation/components/ui/BaseToast.vue';

describe('BaseToast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render toast with slot content', () => {
      const wrapper = mount(BaseToast, {
        slots: { default: 'Toast message' },
      });

      expect(wrapper.text()).toContain('Toast message');
    });

    it('should render as div element', () => {
      const wrapper = mount(BaseToast);
      expect(wrapper.element.tagName).toBe('DIV');
    });
  });

  describe('Variants', () => {
    it('should render success variant by default', () => {
      const wrapper = mount(BaseToast);
      const toast = wrapper.element as HTMLElement;

      expect(toast.className).toContain('bg-success-50');
      expect(toast.className).toContain('border-success-200');
    });

    it('should render info variant', () => {
      const wrapper = mount(BaseToast, {
        props: { variant: 'info' },
      });
      const toast = wrapper.element as HTMLElement;

      expect(toast.className).toContain('bg-info-50');
      expect(toast.className).toContain('border-info-200');
    });

    it('should render warning variant', () => {
      const wrapper = mount(BaseToast, {
        props: { variant: 'warning' },
      });
      const toast = wrapper.element as HTMLElement;

      expect(toast.className).toContain('bg-warning-50');
      expect(toast.className).toContain('border-warning-200');
    });

    it('should render error variant', () => {
      const wrapper = mount(BaseToast, {
        props: { variant: 'error' },
      });
      const toast = wrapper.element as HTMLElement;

      expect(toast.className).toContain('bg-error-50');
      expect(toast.className).toContain('border-error-200');
    });
  });

  describe('Icon', () => {
    it('should show icon by default', () => {
      const wrapper = mount(BaseToast);
      // Look for the icon container div, not just any svg (close button has svg too)
      const iconContainer = wrapper.findAll('div')[1]; // First div after root
      const icon = iconContainer?.find('svg');

      expect(icon?.exists()).toBe(true);
    });

    it('should hide icon when showIcon is false', () => {
      const wrapper = mount(BaseToast, {
        props: { showIcon: false },
      });
      // When showIcon is false, there should only be 2 svgs total (close button)
      // vs 3 svgs when showIcon is true (icon + close button)
      const svgs = wrapper.findAll('svg');

      expect(svgs).toHaveLength(1); // Only close button svg
    });
  });

  describe('Close Button', () => {
    it('should show close button by default', () => {
      const wrapper = mount(BaseToast);
      const closeButton = wrapper.find('button');

      expect(closeButton.exists()).toBe(true);
      expect(closeButton.attributes('aria-label')).toBe('Close notification');
    });

    it('should emit close event when close button clicked', async () => {
      const wrapper = mount(BaseToast);
      const closeButton = wrapper.find('button');

      await closeButton.trigger('click');

      expect(wrapper.emitted('close')).toBeTruthy();
      expect(wrapper.emitted('close')).toHaveLength(1);
    });
  });

  describe('Auto-dismiss', () => {
    it('should not auto-dismiss by default', () => {
      const wrapper = mount(BaseToast);

      vi.advanceTimersByTime(6000);

      expect(wrapper.emitted('close')).toBeFalsy();
    });

    it('should auto-dismiss after duration when autoDismiss is true', () => {
      const wrapper = mount(BaseToast, {
        props: {
          autoDismiss: true,
          duration: 3000,
        },
      });

      vi.advanceTimersByTime(2999);
      expect(wrapper.emitted('close')).toBeFalsy();

      vi.advanceTimersByTime(1);
      expect(wrapper.emitted('close')).toBeTruthy();
      expect(wrapper.emitted('close')).toHaveLength(1);
    });

    it('should use default duration of 5000ms when not specified', () => {
      const wrapper = mount(BaseToast, {
        props: { autoDismiss: true },
      });

      vi.advanceTimersByTime(4999);
      expect(wrapper.emitted('close')).toBeFalsy();

      vi.advanceTimersByTime(1);
      expect(wrapper.emitted('close')).toBeTruthy();
    });
  });

  describe('Progress Bar', () => {
    it('should show progress bar when autoDismiss is true', () => {
      const wrapper = mount(BaseToast, {
        props: { autoDismiss: true },
      });
      const progressBar = wrapper.find('[role="progressbar"]');

      expect(progressBar.exists()).toBe(true);
    });

    it('should not show progress bar when autoDismiss is false', () => {
      const wrapper = mount(BaseToast, {
        props: { autoDismiss: false },
      });
      const progressBar = wrapper.find('[role="progressbar"]');

      expect(progressBar.exists()).toBe(false);
    });

    it('should have correct aria-label on progress bar', () => {
      const wrapper = mount(BaseToast, {
        props: { autoDismiss: true },
      });
      const progressBar = wrapper.find('[role="progressbar"]');

      expect(progressBar.attributes('aria-label')).toBe('Time remaining');
    });
  });

  describe('Accessibility', () => {
    it('should have role="status"', () => {
      const wrapper = mount(BaseToast);
      const toast = wrapper.find('[role="status"]');

      expect(toast.exists()).toBe(true);
    });

    it('should have aria-live="polite"', () => {
      const wrapper = mount(BaseToast);
      const toast = wrapper.find('[aria-live="polite"]');

      expect(toast.exists()).toBe(true);
    });
  });

  describe('Dark Mode', () => {
    it('should have dark mode classes for success variant', () => {
      const wrapper = mount(BaseToast, {
        props: { variant: 'success' },
      });
      const toast = wrapper.element as HTMLElement;

      expect(toast.className).toContain('dark:bg-success-900');
      expect(toast.className).toContain('dark:border-success-700');
    });

    it('should have dark mode classes for error variant', () => {
      const wrapper = mount(BaseToast, {
        props: { variant: 'error' },
      });
      const toast = wrapper.element as HTMLElement;

      expect(toast.className).toContain('dark:bg-error-900');
      expect(toast.className).toContain('dark:border-error-700');
    });
  });
});
