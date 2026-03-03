/**
 * ============================================
 * TEST: AdminSidebar Component
 * ============================================
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import AdminSidebar from '@presentation/components/layout/AdminSidebar.vue';

// Hoisted mocks for useRBAC
const { mockIsSuperAdmin, mockCanAccess } = vi.hoisted(() => ({
  mockIsSuperAdmin: { value: false },
  mockCanAccess: vi.fn(() => false),
}));

vi.mock('@presentation/composables/useRBAC.js', () => ({
  useRBAC: () => ({
    isSuperAdmin: mockIsSuperAdmin,
    canAccess: mockCanAccess,
  }),
}));

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      admin: {
        dashboard: { title: 'Administration Panel' },
        organizations: { title: 'Organization Management' },
        users: { title: 'User Management' },
      },
    },
  },
});

const routerLinkStub = {
  template: '<a :href="to" class="router-link"><slot /></a>',
  props: ['to'],
};

function mountSidebar() {
  return mount(AdminSidebar, {
    global: {
      plugins: [i18n],
      stubs: { 'router-link': routerLinkStub },
    },
  });
}

describe('AdminSidebar', () => {
  beforeEach(() => {
    mockIsSuperAdmin.value = false;
    mockCanAccess.mockReturnValue(false);
  });

  it('should always show the dashboard link', () => {
    const wrapper = mountSidebar();
    expect(wrapper.text()).toContain('Administration Panel');
  });

  it('should show organizations link when canAccess returns true', () => {
    mockCanAccess.mockImplementation((roles?: string[], permission?: string) => {
      if (permission === 'manage_organizations') return true;
      return false;
    });
    const wrapper = mountSidebar();
    expect(wrapper.text()).toContain('Organization Management');
  });

  it('should hide organizations link when canAccess returns false', () => {
    mockCanAccess.mockReturnValue(false);
    const wrapper = mountSidebar();
    expect(wrapper.text()).not.toContain('Organization Management');
  });

  it('should show users link when isSuperAdmin is true', () => {
    mockIsSuperAdmin.value = true;
    const wrapper = mountSidebar();
    expect(wrapper.text()).toContain('User Management');
  });

  it('should hide users link when isSuperAdmin is false', () => {
    mockIsSuperAdmin.value = false;
    const wrapper = mountSidebar();
    expect(wrapper.text()).not.toContain('User Management');
  });

  it('should show all links for super admin', () => {
    mockIsSuperAdmin.value = true;
    mockCanAccess.mockReturnValue(true);
    const wrapper = mountSidebar();

    expect(wrapper.text()).toContain('Administration Panel');
    expect(wrapper.text()).toContain('Organization Management');
    expect(wrapper.text()).toContain('User Management');
  });

  it('should link dashboard to /admin', () => {
    const wrapper = mountSidebar();
    const links = wrapper.findAll('.router-link');
    expect(links[0].attributes('href')).toBe('/admin');
  });

  it('should render as aside element', () => {
    const wrapper = mountSidebar();
    expect(wrapper.find('aside').exists()).toBe(true);
  });

  it('should render nav element', () => {
    const wrapper = mountSidebar();
    expect(wrapper.find('nav').exists()).toBe(true);
  });

  it('should render SVG icons for visible links', () => {
    mockIsSuperAdmin.value = true;
    mockCanAccess.mockReturnValue(true);
    const wrapper = mountSidebar();
    const svgs = wrapper.findAll('svg');
    expect(svgs.length).toBe(3);
  });
});
