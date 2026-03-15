/**
 * ============================================
 * TEST: AdminPermissionsView
 * ============================================
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import AdminPermissionsView from '@presentation/views/admin/AdminPermissionsView.vue';

const { mockRouterPush, mockAdminStore } = vi.hoisted(() => {
  const mockFetchPermissions = vi.fn();
  const mockGrantPermissions = vi.fn();
  const mockRevokePermission = vi.fn();
  const mockFetchUsers = vi.fn();
  const mockFetchAdmins = vi.fn();

  const mockAdminStore = {
    adminPermissions: null as any,
    isLoading: false,
    error: null as string | null,
    admins: [] as any[],
    usersList: null as any,
    fetchPermissions: mockFetchPermissions,
    grantPermissions: mockGrantPermissions,
    revokePermission: mockRevokePermission,
    fetchUsers: mockFetchUsers,
    fetchAdmins: mockFetchAdmins,
  };

  return {
    mockRouterPush: vi.fn(),
    mockAdminStore,
  };
});

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockRouterPush }),
  useRoute: () => ({ params: { userId: 'admin-1' }, meta: {} }),
}));

vi.mock('@presentation/components/layout/AdminLayout.vue', () => ({
  default: { template: '<div data-testid="admin-layout"><slot /></div>' },
}));

vi.mock('@presentation/components/ui/BaseToggleSwitch.vue', () => ({
  default: {
    template: '<button :data-testid="`toggle-${modelValue}`" @click="$emit(\'update:modelValue\', !modelValue)">{{ modelValue ? "ON" : "OFF" }}</button>',
    props: ['modelValue', 'disabled'],
    emits: ['update:modelValue'],
  },
}));

vi.mock('@presentation/stores/admin.store.js', () => ({
  useAdminStore: () => mockAdminStore,
}));

const mockPermissions = {
  userId: 'admin-1',
  permissions: [
    { permission: 'manage_users', grantedBy: 'super-1', grantedAt: '2024-01-01' },
    { permission: 'manage_organizations', grantedBy: 'super-1', grantedAt: '2024-01-02' },
  ],
};

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      admin: {
        permissions: { title: 'Permission Management', grant: 'Granted by' },
      },
      common: { back: 'Back', user: 'User', loading: 'Loading...' },
      permissions: {
        manage_users: 'Manage Users',
        manage_organizations: 'Manage Organizations',
        assign_members: 'Assign Members',
        view_all_data: 'View All Data',
      },
    },
  },
});

function mountView() {
  return mount(AdminPermissionsView, {
    global: { plugins: [i18n] },
  });
}

describe('AdminPermissionsView', () => {
  beforeEach(() => {
    mockRouterPush.mockClear();
    mockAdminStore.fetchPermissions.mockClear();
    mockAdminStore.grantPermissions.mockClear();
    mockAdminStore.revokePermission.mockClear();
    mockAdminStore.fetchUsers.mockClear();
    mockAdminStore.fetchAdmins.mockClear();
    mockAdminStore.adminPermissions = mockPermissions;
    mockAdminStore.isLoading = false;
    mockAdminStore.admins = [];
    mockAdminStore.usersList = null;
  });

  it('should render the view', () => {
    const wrapper = mountView();
    expect(wrapper.find('[data-testid="admin-permissions-view"]').exists()).toBe(true);
  });

  it('should show title', () => {
    const wrapper = mountView();
    expect(wrapper.text()).toContain('Permission Management');
  });

  it('should show back button', () => {
    const wrapper = mountView();
    expect(wrapper.find('[data-testid="back-btn"]').exists()).toBe(true);
  });

  it('should navigate back when back button is clicked', async () => {
    const wrapper = mountView();
    await wrapper.find('[data-testid="back-btn"]').trigger('click');
    expect(mockRouterPush).toHaveBeenCalledWith('/admin/users');
  });

  it('should display user ID', () => {
    const wrapper = mountView();
    expect(wrapper.text()).toContain('admin-1');
  });

  it('should render permission cards for all 4 permissions', () => {
    const wrapper = mountView();
    expect(wrapper.find('[data-testid="permission-card-manage_users"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="permission-card-manage_organizations"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="permission-card-assign_members"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="permission-card-view_all_data"]').exists()).toBe(true);
  });

  it('should show permission labels', () => {
    const wrapper = mountView();
    expect(wrapper.text()).toContain('Manage Users');
    expect(wrapper.text()).toContain('Manage Organizations');
    expect(wrapper.text()).toContain('Assign Members');
    expect(wrapper.text()).toContain('View All Data');
  });

  it('should show granted info for active permissions', () => {
    const wrapper = mountView();
    expect(wrapper.text()).toContain('super-1');
  });

  it('should call fetchPermissions on mount', async () => {
    mountView();
    await new Promise((r) => setTimeout(r, 0));
    expect(mockAdminStore.fetchPermissions).toHaveBeenCalledWith('admin-1');
  });

  it('should show loading state', () => {
    mockAdminStore.isLoading = true;
    mockAdminStore.adminPermissions = null;
    const wrapper = mountView();
    expect(wrapper.find('[data-testid="permissions-loading"]').exists()).toBe(true);
  });
});
