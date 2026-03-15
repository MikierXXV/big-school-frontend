/**
 * ============================================
 * TEST: UserSettingsView
 * ============================================
 */

import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import UserSettingsView from '@presentation/views/dashboard/UserSettingsView.vue';

vi.mock('@presentation/components/layout/index.js', () => ({
  DashboardLayout: { template: '<div data-testid="dashboard-layout"><slot /></div>' },
}));

vi.mock('@presentation/components/ui/ThemeToggle.vue', () => ({
  default: { template: '<div data-testid="theme-toggle" />' },
}));

vi.mock('@presentation/components/ui/LanguageSelector.vue', () => ({
  default: { template: '<div data-testid="language-selector" />' },
}));

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      settings: {
        title: 'Settings',
        appearance: 'Appearance',
        language: 'Language',
      },
    },
  },
});

function mountView() {
  return mount(UserSettingsView, {
    global: { plugins: [i18n] },
  });
}

describe('UserSettingsView', () => {
  it('should render inside DashboardLayout', () => {
    const wrapper = mountView();
    expect(wrapper.find('[data-testid="dashboard-layout"]').exists()).toBe(true);
  });

  it('should show settings title', () => {
    const wrapper = mountView();
    expect(wrapper.text()).toContain('Settings');
  });

  it('should show appearance label', () => {
    const wrapper = mountView();
    expect(wrapper.text()).toContain('Appearance');
  });

  it('should show language label', () => {
    const wrapper = mountView();
    expect(wrapper.text()).toContain('Language');
  });

  it('should include ThemeToggle component', () => {
    const wrapper = mountView();
    expect(wrapper.find('[data-testid="theme-toggle"]').exists()).toBe(true);
  });

  it('should include LanguageSelector component', () => {
    const wrapper = mountView();
    expect(wrapper.find('[data-testid="language-selector"]').exists()).toBe(true);
  });
});
