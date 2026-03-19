/**
 * ============================================
 * TEST: AdminLayout Component
 * ============================================
 */

import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import AdminLayout from '@presentation/components/layout/AdminLayout.vue';

// Mock child components
vi.mock('@presentation/components/layout/AppHeader.vue', () => ({
  default: { template: '<header data-testid="app-header">Header</header>' },
}));
vi.mock('@presentation/components/layout/AppFooter.vue', () => ({
  default: { template: '<footer data-testid="app-footer">Footer</footer>' },
}));
vi.mock('@presentation/components/layout/AdminSidebar.vue', () => ({
  default: { template: '<aside data-testid="admin-sidebar">Sidebar</aside>', props: ['open'], emits: ['close'] },
}));

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en: { nav: { adminPanel: 'Admin' } } },
});

function mountLayout(slots = { default: '<p>Content</p>' }) {
  return mount(AdminLayout, { global: { plugins: [i18n] }, slots });
}

describe('AdminLayout', () => {
  it('should render with data-testid', () => {
    const wrapper = mountLayout();
    expect(wrapper.find('[data-testid="admin-layout"]').exists()).toBe(true);
  });

  it('should render AppHeader', () => {
    const wrapper = mountLayout();
    expect(wrapper.find('[data-testid="app-header"]').exists()).toBe(true);
  });

  it('should render AdminSidebar', () => {
    const wrapper = mountLayout();
    expect(wrapper.find('[data-testid="admin-sidebar"]').exists()).toBe(true);
  });

  it('should render AppFooter', () => {
    const wrapper = mountLayout();
    expect(wrapper.find('[data-testid="app-footer"]').exists()).toBe(true);
  });

  it('should render slot content', () => {
    const wrapper = mountLayout({ default: '<p data-testid="slot-content">Admin Page Content</p>' });
    expect(wrapper.find('[data-testid="slot-content"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('Admin Page Content');
  });
});
