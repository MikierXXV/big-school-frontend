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
  const mockFetchUsers = vi.fn();
  const mockDemoteUser = vi.fn();

  const mockAdminStore = {
    admins: [] as any[],
    usersList: null as any,
    isLoading: false,
    error: null as string | null,
    fetchAdmins: mockFetchAdmins,
    fetchUsers: mockFetchUsers,
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

vi.mock('@presentation/components/ui/BaseSelect.vue', () => ({
  default: { template: '<select><slot /></select>', props: ['modelValue', 'options', 'label'] },
}));

vi.mock('@presentation/components/ui/BasePagination.vue', () => ({
  default: { template: '<div data-testid="base-pagination"></div>', props: ['page', 'totalPages', 'total', 'limit'] },
}));

vi.mock('@presentation/stores/admin.store.js', () => ({
  useAdminStore: () => mockAdminStore,
}));

const mockUsersList = {
  users: [
    { id: 'admin-1', email: 'admin@test.com', firstName: 'Admin', lastName: 'One', systemRole: 'admin', status: 'ACTIVE', emailVerified: true, createdAt: '', fullName: 'Admin One' },
    { id: 'super-1', email: 'super@test.com', firstName: 'Super', lastName: 'Admin', systemRole: 'super_admin', status: 'ACTIVE', emailVerified: true, createdAt: '', fullName: 'Super Admin' },
  ],
  total: 2,
  page: 1,
  limit: 20,
  totalPages: 1,
  hasNext: false,
  hasPrevious: false,
};

const mockAdmins = [
  { userId: 'admin-1', email: 'admin@test.com', firstName: 'Admin', lastName: 'One', systemRole: 'admin', permissions: ['manage_users', 'manage_organizations'] },
];

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      admin: {
        users: { title: 'User Management', promote: 'Promote to Admin', demote: 'Demote to User', confirmDemote: 'Are you sure?', search: 'Search users...' },
        permissions: { title: 'Permissions' },
      },
      common: {
        name: 'Name',
        role: 'Role',
        actions: 'Actions',
        loading: 'Loading...',
        noResults: 'No results',
        all: 'All',
        status: 'Status',
        active: 'Active',
        inactive: 'Inactive',
      },
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
    mockAdminStore.fetchUsers.mockClear();
    mockAdminStore.isLoading = false;
    mockAdminStore.error = null;
    mockAdminStore.usersList = { ...mockUsersList, users: [...mockUsersList.users] };
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
    expect(wrapper.find('[data-testid="user-row-admin-1"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="user-row-super-1"]').exists()).toBe(true);
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

  it('should call fetchAdmins and fetchUsers on mount', async () => {
    mountView();
    await new Promise((r) => setTimeout(r, 0));
    expect(mockAdminStore.fetchAdmins).toHaveBeenCalled();
    expect(mockAdminStore.fetchUsers).toHaveBeenCalled();
  });

  it('should show loading state', () => {
    mockAdminStore.isLoading = true;
    mockAdminStore.usersList = null;
    const wrapper = mountView();
    expect(wrapper.find('[data-testid="users-loading"]').exists()).toBe(true);
  });

  it('should show error state', () => {
    mockAdminStore.error = 'Forbidden';
    mockAdminStore.usersList = null;
    const wrapper = mountView();
    expect(wrapper.find('[data-testid="users-error"]').exists()).toBe(true);
  });

  it('should show empty state', () => {
    mockAdminStore.usersList = { users: [], total: 0, page: 1, limit: 20, totalPages: 1, hasNext: false, hasPrevious: false };
    const wrapper = mountView();
    expect(wrapper.find('[data-testid="users-empty"]').exists()).toBe(true);
  });

  it('should display permissions badges', () => {
    const wrapper = mountView();
    // View shows abbreviated labels: 'Usr' for manage_users, 'Org' for manage_organizations
    expect(wrapper.text()).toContain('Usr');
    expect(wrapper.text()).toContain('Org');
  });
});
