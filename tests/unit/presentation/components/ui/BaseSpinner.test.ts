/**
 * ============================================
 * TEST: BaseSpinner Component
 * ============================================
 *
 * Tests for spinner component with multiple sizes and colors.
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseSpinner from '@presentation/components/ui/BaseSpinner.vue';

describe('BaseSpinner', () => {
  describe('Rendering', () => {
    it('should render spinner with default size (md)', () => {
      const wrapper = mount(BaseSpinner);
      const spinner = wrapper.find('[role="status"]');

      expect(spinner.exists()).toBe(true);
      expect(spinner.classes()).toContain('h-8');
      expect(spinner.classes()).toContain('w-8');
    });

    it('should render spinner with xs size', () => {
      const wrapper = mount(BaseSpinner, {
        props: { size: 'xs' },
      });
      const spinner = wrapper.find('[role="status"]');

      expect(spinner.classes()).toContain('h-3');
      expect(spinner.classes()).toContain('w-3');
    });

    it('should render spinner with sm size', () => {
      const wrapper = mount(BaseSpinner, {
        props: { size: 'sm' },
      });
      const spinner = wrapper.find('[role="status"]');

      expect(spinner.classes()).toContain('h-5');
      expect(spinner.classes()).toContain('w-5');
    });

    it('should render spinner with lg size', () => {
      const wrapper = mount(BaseSpinner, {
        props: { size: 'lg' },
      });
      const spinner = wrapper.find('[role="status"]');

      expect(spinner.classes()).toContain('h-12');
      expect(spinner.classes()).toContain('w-12');
    });

    it('should render spinner with xl size', () => {
      const wrapper = mount(BaseSpinner, {
        props: { size: 'xl' },
      });
      const spinner = wrapper.find('[role="status"]');

      expect(spinner.classes()).toContain('h-16');
      expect(spinner.classes()).toContain('w-16');
    });
  });

  describe('Colors', () => {
    it('should render with primary color by default', () => {
      const wrapper = mount(BaseSpinner);
      const spinner = wrapper.find('[role="status"]');

      expect(spinner.classes()).toContain('border-primary-600');
    });

    it('should render with success color', () => {
      const wrapper = mount(BaseSpinner, {
        props: { color: 'success' },
      });
      const spinner = wrapper.find('[role="status"]');

      expect(spinner.classes()).toContain('border-success-600');
    });

    it('should render with error color', () => {
      const wrapper = mount(BaseSpinner, {
        props: { color: 'error' },
      });
      const spinner = wrapper.find('[role="status"]');

      expect(spinner.classes()).toContain('border-error-600');
    });

    it('should render with warning color', () => {
      const wrapper = mount(BaseSpinner, {
        props: { color: 'warning' },
      });
      const spinner = wrapper.find('[role="status"]');

      expect(spinner.classes()).toContain('border-warning-600');
    });

    it('should render with info color', () => {
      const wrapper = mount(BaseSpinner, {
        props: { color: 'info' },
      });
      const spinner = wrapper.find('[role="status"]');

      expect(spinner.classes()).toContain('border-info-600');
    });
  });

  describe('Accessibility', () => {
    it('should have role="status"', () => {
      const wrapper = mount(BaseSpinner);
      const spinner = wrapper.find('[role="status"]');

      expect(spinner.exists()).toBe(true);
    });

    it('should have sr-only text "Loading..."', () => {
      const wrapper = mount(BaseSpinner);
      const srText = wrapper.find('.sr-only');

      expect(srText.exists()).toBe(true);
      expect(srText.text()).toBe('Loading...');
    });
  });

  describe('Animation', () => {
    it('should have animate-spin class', () => {
      const wrapper = mount(BaseSpinner);
      const spinner = wrapper.find('[role="status"]');

      expect(spinner.classes()).toContain('animate-spin');
    });
  });
});
