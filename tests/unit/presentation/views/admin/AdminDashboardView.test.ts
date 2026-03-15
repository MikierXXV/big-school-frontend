/**
 * ============================================
 * TEST: AdminDashboardView
 * ============================================
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import AdminDashboardView from '@presentation/views/admin/AdminDashboardView.vue';

// Hoisted mocks for useRBAC and useRouter
const { mockIsSuperAdmin, mockCanAccess, mockRouterPush } = vi.hoisted(() => ({
  mockIsSuperAdmin: { value: false },
  mockCanAccess: vi.fn(() => false),
  mockRouterPush: vi.fn(),
}));

vi.mock('@presentation/composables/useRBAC.js', () => ({
  useRBAC: () => ({
    isSuperAdmin: mockIsSuperAdmin,
    canAccess: mockCanAccess,
  }),
}));

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockRouterPush }),
  useRoute: () => ({ meta: {} }),
}));

// Mock AdminLayout to simplify testing
vi.mock('@presentation/components/layout/AdminLayout.vue', () => ({
  default: {
    template: '<div data-testid="admin-layout"><slot /></div>',
  },
}));

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      admin: {
        dashboard: {
          title: 'Administration Panel',
          description: 'Manage users, organizations, and system permissions',
        },
        organizations: { title: 'Organization Management' },
        users: { title: 'User Management' },
        permissions: { title: 'Permission Management' },
      },
    },
  },
});

function mountView() {
  return mount(AdminDashboardView, {
    global: {
      plugins: [i18n],
    },
  });
}

describe('AdminDashboardView', () => {
  beforeEach(() => {
    mockIsSuperAdmin.value = false;
    mockCanAccess.mockReturnValue(false);
    mockRouterPush.mockClear();
  });

  it('should render within AdminLayout', () => {
    const wrapper = mountView();
    expect(wrapper.find('[data-testid="admin-layout"]').exists()).toBe(true);
  });

  it('should show title and description', () => {
    const wrapper = mountView();
    expect(wrapper.text()).toContain('Administration Panel');
    expect(wrapper.text()).toContain('Manage users, organizations, and system permissions');
  });

  it('should show organizations card when canAccess returns true', () => {
    mockCanAccess.mockReturnValue(true);
    const wrapper = mountView();
    expect(wrapper.find('[data-testid="admin-card-organizations"]').exists()).toBe(true);
  });

  it('should hide organizations card when canAccess returns false', () => {
    mockCanAccess.mockReturnValue(false);
    const wrapper = mountView();
    expect(wrapper.find('[data-testid="admin-card-organizations"]').exists()).toBe(false);
  });

  it('should show users card when isSuperAdmin is true', () => {
    mockIsSuperAdmin.value = true;
    mockCanAccess.mockReturnValue(true);
    const wrapper = mountView();
    expect(wrapper.find('[data-testid="admin-card-users"]').exists()).toBe(true);
  });

  it('should hide users card when isSuperAdmin is false', () => {
    mockIsSuperAdmin.value = false;
    const wrapper = mountView();
    expect(wrapper.find('[data-testid="admin-card-users"]').exists()).toBe(false);
  });

  it('should show all cards for super admin', () => {
    mockIsSuperAdmin.value = true;
    mockCanAccess.mockReturnValue(true);
    const wrapper = mountView();

    expect(wrapper.find('[data-testid="admin-card-organizations"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="admin-card-users"]').exists()).toBe(true);
  });

  it('should navigate when clicking a card', async () => {
    mockCanAccess.mockReturnValue(true);
    const wrapper = mountView();
    const card = wrapper.find('[data-testid="admin-card-organizations"]');

    await card.trigger('click');

    expect(mockRouterPush).toHaveBeenCalledWith('/admin/organizations');
  });
});
