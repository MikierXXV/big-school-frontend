/**
 * ============================================
 * TEST: AppHeader Component
 * ============================================
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import AppHeader from '@presentation/components/layout/AppHeader.vue';
import { useAuthStore } from '@presentation/stores/auth.store.js';

vi.mock('@presentation/components/ui/LanguageSelector.vue', () => ({
  default: { template: '<div data-testid="language-selector"></div>' },
}));

vi.mock('@presentation/components/ui/ThemeToggle.vue', () => ({
  default: { template: '<button aria-label="Toggle theme"><svg /></button>', name: 'ThemeToggle' },
}));

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      nav: { dashboard: 'Dashboard', adminPanel: 'Admin Panel', profile: 'Profile', settings: 'Settings' },
      auth: { login: 'Login', logout: 'Logout' },
    },
  },
});

function mountHeader(props: Record<string, any> = {}) {
  return mount(AppHeader, {
    props,
    global: { plugins: [i18n] },
  });
}

describe('AppHeader', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('Rendering', () => {
    it('should render header element', () => {
      const wrapper = mountHeader();

      const header = wrapper.find('header');
      expect(header.exists()).toBe(true);
    });

    it('should render logo/brand name', () => {
      const wrapper = mountHeader();

      expect(wrapper.text()).toContain('Health Care Suite');
    });

    it('should render theme toggle component', () => {
      const wrapper = mountHeader();

      const themeToggle = wrapper.findComponent({ name: 'ThemeToggle' });
      expect(themeToggle.exists()).toBe(true);
    });

    it('should have dark mode classes', () => {
      const wrapper = mountHeader();

      const header = wrapper.find('header');
      expect(header.classes()).toContain('dark:bg-gray-800');
    });
  });

  describe('Navigation', () => {
    it('should render navigation links', () => {
      const wrapper = mountHeader();

      const nav = wrapper.find('nav');
      expect(nav.exists()).toBe(true);
    });

    it('should render Dashboard link when authenticated', () => {
      const wrapper = mountHeader({ isAuthenticated: true });

      const dashboardLink = wrapper.find('a[href="/dashboard"]');
      expect(dashboardLink.exists()).toBe(true);
    });
  });

  describe('Mobile Menu', () => {
    it('should render mobile menu button', () => {
      const wrapper = mountHeader();

      const mobileButton = wrapper.find('button[aria-label="Toggle menu"]');
      expect(mobileButton.exists()).toBe(true);
    });
  });

  describe('User Menu', () => {
    it('should render user menu when authenticated', () => {
      const wrapper = mountHeader({ isAuthenticated: true });

      const userButton = wrapper.find('[aria-label="User menu"]');
      expect(userButton.exists()).toBe(true);
    });

    it('should render login link when not authenticated', () => {
      const wrapper = mountHeader({ isAuthenticated: false });

      const loginLink = wrapper.find('a[href="/login"]');
      expect(loginLink.exists()).toBe(true);
    });
  });

  describe('Admin Link', () => {
    it('should show admin link for admin user', () => {
      const authStore = useAuthStore();
      authStore.user = {
        id: '1',
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        status: 'ACTIVE',
        fullName: 'Admin User',
        emailVerified: true,
        systemRole: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const wrapper = mountHeader({ isAuthenticated: true });

      expect(wrapper.find('[data-testid="admin-link"]').exists()).toBe(true);
    });

    it('should show admin link for super_admin user', () => {
      const authStore = useAuthStore();
      authStore.user = {
        id: '1',
        email: 'super@example.com',
        firstName: 'Super',
        lastName: 'Admin',
        status: 'ACTIVE',
        fullName: 'Super Admin',
        emailVerified: true,
        systemRole: 'super_admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const wrapper = mountHeader({ isAuthenticated: true });

      expect(wrapper.find('[data-testid="admin-link"]').exists()).toBe(true);
    });

    it('should hide admin link for regular user', () => {
      const authStore = useAuthStore();
      authStore.user = {
        id: '1',
        email: 'user@example.com',
        firstName: 'Regular',
        lastName: 'User',
        status: 'ACTIVE',
        fullName: 'Regular User',
        emailVerified: true,
        systemRole: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const wrapper = mountHeader({ isAuthenticated: true });

      expect(wrapper.find('[data-testid="admin-link"]').exists()).toBe(false);
    });

    it('should hide admin link when not authenticated', () => {
      const wrapper = mountHeader({ isAuthenticated: false });

      expect(wrapper.find('[data-testid="admin-link"]').exists()).toBe(false);
    });
  });
});
