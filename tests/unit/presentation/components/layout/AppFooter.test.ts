/**
 * ============================================
 * TEST: AppFooter Component
 * ============================================
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AppFooter from '@presentation/components/layout/AppFooter.vue';

describe('AppFooter', () => {
  describe('Rendering', () => {
    it('should render footer element', () => {
      const wrapper = mount(AppFooter);

      const footer = wrapper.find('footer');
      expect(footer.exists()).toBe(true);
    });

    it('should render copyright text with current year', () => {
      const wrapper = mount(AppFooter);
      const currentYear = new Date().getFullYear();

      expect(wrapper.text()).toContain(`© ${currentYear}`);
      expect(wrapper.text()).toContain('Health Care Suite');
    });

    it('should render footer links', () => {
      const wrapper = mount(AppFooter);

      const links = wrapper.findAll('a');
      expect(links.length).toBeGreaterThan(0);
    });

    it('should have dark mode classes', () => {
      const wrapper = mount(AppFooter);

      const footer = wrapper.find('footer');
      expect(footer.classes()).toContain('dark:bg-gray-800');
    });
  });

  describe('Links', () => {
    it('should render About link', () => {
      const wrapper = mount(AppFooter);

      const aboutLink = wrapper.find('a[href="/about"]');
      expect(aboutLink.exists()).toBe(true);
    });

    it('should render Privacy link', () => {
      const wrapper = mount(AppFooter);

      const privacyLink = wrapper.find('a[href="/privacy"]');
      expect(privacyLink.exists()).toBe(true);
    });

    it('should render Terms link', () => {
      const wrapper = mount(AppFooter);

      const termsLink = wrapper.find('a[href="/terms"]');
      expect(termsLink.exists()).toBe(true);
    });
  });
});
