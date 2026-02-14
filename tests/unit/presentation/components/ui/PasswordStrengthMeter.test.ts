/**
 * ============================================
 * TEST: PasswordStrengthMeter Component
 * ============================================
 *
 * Tests for password strength visual indicator.
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PasswordStrengthMeter from '@presentation/components/ui/PasswordStrengthMeter.vue';

describe('PasswordStrengthMeter', () => {
  describe('Visual Indicator', () => {
    it('should render progress bar', () => {
      const wrapper = mount(PasswordStrengthMeter, {
        props: { password: '' },
      });

      const progressBar = wrapper.find('[role="progressbar"]');
      expect(progressBar.exists()).toBe(true);
    });

    it('should show 0% width for score 0', () => {
      const wrapper = mount(PasswordStrengthMeter, {
        props: { password: '' },
      });

      const progressBar = wrapper.find('[role="progressbar"]');
      expect(progressBar.attributes('style')).toContain('width: 0%');
    });

    it('should show 100% width for score 5', () => {
      const wrapper = mount(PasswordStrengthMeter, {
        props: { password: 'MyP@ssw0rd!2024' },
      });

      const progressBar = wrapper.find('[role="progressbar"]');
      expect(progressBar.attributes('style')).toContain('width: 100%');
    });

    it('should show 60% width for score 3', () => {
      const wrapper = mount(PasswordStrengthMeter, {
        props: { password: 'Abcdefgh' },
      });

      const progressBar = wrapper.find('[role="progressbar"]');
      expect(progressBar.attributes('style')).toContain('width: 60%');
    });
  });

  describe('Color Coding', () => {
    it('should have gray color for score 0', () => {
      const wrapper = mount(PasswordStrengthMeter, {
        props: { password: '' },
      });

      const progressBar = wrapper.find('[role="progressbar"]');
      expect(progressBar.classes()).toContain('bg-gray-300');
    });

    it('should have red color for score 1', () => {
      const wrapper = mount(PasswordStrengthMeter, {
        props: { password: 'abc' },
      });

      const progressBar = wrapper.find('[role="progressbar"]');
      expect(progressBar.classes()).toContain('bg-error-500');
    });

    it('should have orange color for score 2', () => {
      const wrapper = mount(PasswordStrengthMeter, {
        props: { password: 'abcdefgh' },
      });

      const progressBar = wrapper.find('[role="progressbar"]');
      expect(progressBar.classes()).toContain('bg-warning-500');
    });

    it('should have yellow color for score 3', () => {
      const wrapper = mount(PasswordStrengthMeter, {
        props: { password: 'Abcdefgh' },
      });

      const progressBar = wrapper.find('[role="progressbar"]');
      expect(progressBar.classes()).toContain('bg-warning-400');
    });

    it('should have light green color for score 4', () => {
      const wrapper = mount(PasswordStrengthMeter, {
        props: { password: 'Abcdefgh123' },
      });

      const progressBar = wrapper.find('[role="progressbar"]');
      expect(progressBar.classes()).toContain('bg-success-400');
    });

    it('should have green color for score 5', () => {
      const wrapper = mount(PasswordStrengthMeter, {
        props: { password: 'MyP@ssw0rd!2024' },
      });

      const progressBar = wrapper.find('[role="progressbar"]');
      expect(progressBar.classes()).toContain('bg-success-500');
    });
  });

  describe('Feedback Messages', () => {
    it('should display feedback messages', () => {
      const wrapper = mount(PasswordStrengthMeter, {
        props: { password: 'abc' },
      });

      const text = wrapper.text();
      expect(text).toContain('Too short');
    });

    it('should display multiple feedback messages', () => {
      const wrapper = mount(PasswordStrengthMeter, {
        props: { password: 'abcdefgh' },
      });

      const text = wrapper.text();
      expect(text).toContain('Add uppercase');
    });

    it('should display success message for strong password', () => {
      const wrapper = mount(PasswordStrengthMeter, {
        props: { password: 'MyP@ssw0rd!2024' },
      });

      const text = wrapper.text();
      expect(text).toContain('Very strong');
    });
  });

  describe('Accessibility', () => {
    it('should have aria-label on progress bar', () => {
      const wrapper = mount(PasswordStrengthMeter, {
        props: { password: 'test' },
      });

      const progressBar = wrapper.find('[role="progressbar"]');
      expect(progressBar.attributes('aria-label')).toBeTruthy();
    });

    it('should have aria-valuenow attribute', () => {
      const wrapper = mount(PasswordStrengthMeter, {
        props: { password: 'Abcdefgh' },
      });

      const progressBar = wrapper.find('[role="progressbar"]');
      expect(progressBar.attributes('aria-valuenow')).toBe('60');
    });
  });
});
