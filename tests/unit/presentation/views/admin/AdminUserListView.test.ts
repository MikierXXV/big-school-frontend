/**
 * ============================================
 * TEST: AdminUserListView
 * ============================================
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import AdminUserListView from '@presentation/views/admin/AdminUserListView.vue';

const { mockRouterPush, mockAdminStore } = vi.hoisted(() => {
  const mockFetchAdmins = vi.fn();
  const mockDemoteUser = vi.fn();

  const mockAdminStore = {
    admins: [] as any[],
    isLoading: false,
    error: null as string | null,
    fetchAdmins: mockFetchAdmins,
    demoteUser: mockDemoteUser,
  };

  return {
    mockRouterPush: vi.fn(),
    mockAdminStore,
  };
});

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockRouterPush }),
  useRoute: () => ({ params: {}, meta: {} }),
}));

vi.mock('@presentation/components/layout/AdminLayout.vue', () => ({
  default: { template: '<div data-testid="admin-layout"><slot /></div>' },
}));

vi.mock('@presentation/components/admin/PromoteUserModal.vue', () => ({
  default: { template: '<div data-testid="promote-modal"></div>', props: ['open'] },
}));

vi.mock('@presentation/components/ui/ConfirmDialog.vue', () => ({
  default: { template: '<div data-testid="confirm-dialog"></div>', props: ['open', 'title', 'message', 'confirmVariant'] },
}));

vi.mock('@presentation/components/ui/BaseBadge.vue', () => ({
  default: { template: '<span><slot /></span>', props: ['variant', 'size'] },
}));

vi.mock('@presentation/stores/admin.store.js', () => ({
  useAdminStore: () => mockAdminStore,
}));

const mockAdmins = [
  {
    userId: 'admin-1',
    email: 'admin@test.com',
    firstName: 'Admin',
    lastName: 'One',
    systemRole: 'admin',
    permissions: ['manage_users', 'manage_organizations'],
  },
  {
    userId: 'super-1',
    email: 'super@test.com',
    firstName: 'Super',
    lastName: 'Admin',
    systemRole: 'super_admin',
    permissions: [],
  },
];

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      admin: {
        users: { title: 'User Management', promote: 'Promote to Admin', demote: 'Demote to User', confirmDemote: 'Are you sure?' },
        permissions: { title: 'Permissions' },
      },
      common: { name: 'Name', role: 'Role', actions: 'Actions', loading: 'Loading...', noResults: 'No results' },
      roles: { super_admin: 'Super Admin', admin: 'Administrator', user: 'User' },
      permissions: { manage_users: 'Manage Users', manage_organizations: 'Manage Organizations', assign_members: 'Assign Members', view_all_data: 'View All Data' },
    },
  },
});

function mountView() {
  return mount(AdminUserListView, {
    global: { plugins: [i18n] },
  });
}

describe('AdminUserListView', () => {
  beforeEach(() => {
    mockRouterPush.mockClear();
    mockAdminStore.fetchAdmins.mockClear();
    mockAdminStore.isLoading = false;
    mockAdminStore.error = null;
    mockAdminStore.admins = [...mockAdmins];
  });

  it('should render the view', () => {
    const wrapper = mountView();
    expect(wrapper.find('[data-testid="admin-user-list"]').exists()).toBe(true);
  });

  it('should show title', () => {
    const wrapper = mountView();
    expect(wrapper.text()).toContain('User Management');
  });

  it('should show promote button', () => {
    const wrapper = mountView();
    expect(wrapper.find('[data-testid="promote-user-btn"]').exists()).toBe(true);
  });

  it('should render admin rows', () => {
    const wrapper = mountView();
    expect(wrapper.find('[data-testid="admin-row-admin-1"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="admin-row-super-1"]').exists()).toBe(true);
  });

  it('should display admin names and emails', () => {
    const wrapper = mountView();
    expect(wrapper.text()).toContain('Admin');
    expect(wrapper.text()).toContain('One');
    expect(wrapper.text()).toContain('admin@test.com');
  });

  it('should show demote button for regular admin but not super admin', () => {
    const wrapper = mountView();
    expect(wrapper.find('[data-testid="demote-btn-admin-1"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="demote-btn-super-1"]').exists()).toBe(false);
  });

  it('should show permissions button for each admin', () => {
    const wrapper = mountView();
    expect(wrapper.find('[data-testid="permissions-btn-admin-1"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="permissions-btn-super-1"]').exists()).toBe(true);
  });

  it('should navigate to permissions view', async () => {
    const wrapper = mountView();
    await wrapper.find('[data-testid="permissions-btn-admin-1"]').trigger('click');
    expect(mockRouterPush).toHaveBeenCalledWith('/admin/users/admin-1/permissions');
  });

  it('should call fetchAdmins on mount', async () => {
    mountView();
    await new Promise((r) => setTimeout(r, 0));
    expect(mockAdminStore.fetchAdmins).toHaveBeenCalled();
  });

  it('should show loading state', () => {
    mockAdminStore.isLoading = true;
    mockAdminStore.admins = [];
    const wrapper = mountView();
    expect(wrapper.find('[data-testid="admins-loading"]').exists()).toBe(true);
  });

  it('should show error state', () => {
    mockAdminStore.error = 'Forbidden';
    mockAdminStore.admins = [];
    const wrapper = mountView();
    expect(wrapper.find('[data-testid="admins-error"]').exists()).toBe(true);
  });

  it('should show empty state', () => {
    mockAdminStore.admins = [];
    const wrapper = mountView();
    expect(wrapper.find('[data-testid="admins-empty"]').exists()).toBe(true);
  });

  it('should display permissions badges', () => {
    const wrapper = mountView();
    expect(wrapper.text()).toContain('Manage Users');
    expect(wrapper.text()).toContain('Manage Organizations');
  });
});
