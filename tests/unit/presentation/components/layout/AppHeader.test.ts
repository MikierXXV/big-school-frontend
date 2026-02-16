/**
 * ============================================
 * TEST: AppHeader Component
 * ============================================
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import AppHeader from '@presentation/components/layout/AppHeader.vue';

describe('AppHeader', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('Rendering', () => {
    it('should render header element', () => {
      const wrapper = mount(AppHeader);

      const header = wrapper.find('header');
      expect(header.exists()).toBe(true);
    });

    it('should render logo/brand name', () => {
      const wrapper = mount(AppHeader);

      expect(wrapper.text()).toContain('Big School');
    });

    it('should render theme toggle component', () => {
      const wrapper = mount(AppHeader);

      const themeToggle = wrapper.findComponent({ name: 'ThemeToggle' });
      expect(themeToggle.exists()).toBe(true);
    });

    it('should have dark mode classes', () => {
      const wrapper = mount(AppHeader);

      const header = wrapper.find('header');
      expect(header.classes()).toContain('dark:bg-gray-800');
    });
  });

  describe('Navigation', () => {
    it('should render navigation links', () => {
      const wrapper = mount(AppHeader);

      const nav = wrapper.find('nav');
      expect(nav.exists()).toBe(true);
    });

    it('should render Dashboard link when authenticated', () => {
      const wrapper = mount(AppHeader, {
        props: { isAuthenticated: true },
      });

      const dashboardLink = wrapper.find('a[href="/dashboard"]');
      expect(dashboardLink.exists()).toBe(true);
    });
  });

  describe('Mobile Menu', () => {
    it('should render mobile menu button', () => {
      const wrapper = mount(AppHeader);

      // Look for button with menu icon or mobile menu class
      const mobileButton = wrapper.find('button[aria-label="Toggle menu"]');
      expect(mobileButton.exists()).toBe(true);
    });
  });

  describe('User Menu', () => {
    it('should render user menu when authenticated', () => {
      const wrapper = mount(AppHeader, {
        props: { isAuthenticated: true },
      });

      // User menu should be visible
      const userButton = wrapper.find('[aria-label="User menu"]');
      expect(userButton.exists()).toBe(true);
    });

    it('should render login link when not authenticated', () => {
      const wrapper = mount(AppHeader, {
        props: { isAuthenticated: false },
      });

      const loginLink = wrapper.find('a[href="/login"]');
      expect(loginLink.exists()).toBe(true);
    });
  });
});
