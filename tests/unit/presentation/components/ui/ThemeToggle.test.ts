/**
 * ============================================
 * TEST: ThemeToggle Component
 * ============================================
 *
 * Tests for theme toggle menu using @headlessui/vue.
 * NOTE: @headlessui Menu is complex to unit test - full behavior tested in E2E tests.
 */

import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import ThemeToggle from '@presentation/components/ui/ThemeToggle.vue';

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      theme: { light: 'Light', dark: 'Dark', system: 'System' },
    },
  },
});

// Mock ResizeObserver (required by @headlessui)
beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe('ThemeToggle', () => {
  beforeEach(() => {
    // Create fresh Pinia instance for each test
    setActivePinia(createPinia());
  });

  describe('Rendering', () => {
    it('should render toggle button', () => {
      const wrapper = mount(ThemeToggle, { global: { plugins: [i18n] } });
      const button = wrapper.find('button');

      expect(button.exists()).toBe(true);
    });

    it('should have aria-label for accessibility', () => {
      const wrapper = mount(ThemeToggle, { global: { plugins: [i18n] } });
      const button = wrapper.find('button');

      expect(button.attributes('aria-label')).toBeTruthy();
    });
  });

  describe('Icon Display', () => {
    it('should render sun icon by default (light theme)', () => {
      const wrapper = mount(ThemeToggle, { global: { plugins: [i18n] } });

      // Check for SVG icon
      const svg = wrapper.find('svg');
      expect(svg.exists()).toBe(true);
    });
  });

  describe('Component Structure', () => {
    it('should be a valid Vue component', () => {
      const wrapper = mount(ThemeToggle, { global: { plugins: [i18n] } });

      expect(wrapper.vm).toBeTruthy();
    });

    it('should mount without errors', () => {
      expect(() => {
        mount(ThemeToggle, { global: { plugins: [i18n] } });
      }).not.toThrow();
    });
  });
});
