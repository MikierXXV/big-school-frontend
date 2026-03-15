/**
 * ============================================
 * TEST: PromoteUserModal Component
 * ============================================
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import PromoteUserModal from '@presentation/components/admin/PromoteUserModal.vue';

const { mockAdminStore } = vi.hoisted(() => {
  const mockAdminStore = {
    usersList: null as any,
    isLoading: false,
    fetchUsers: vi.fn(),
    promoteUser: vi.fn(),
  };
  return { mockAdminStore };
});

vi.mock('@presentation/stores/admin.store.js', () => ({
  useAdminStore: () => mockAdminStore,
}));

vi.mock('@presentation/components/ui/BaseModal.vue', () => ({
  default: { template: '<div data-testid="base-modal"><slot /></div>', props: ['open', 'title', 'size'] },
}));

vi.mock('@presentation/components/ui/BaseBadge.vue', () => ({
  default: { template: '<span><slot /></span>', props: ['variant', 'size'] },
}));

vi.mock('@presentation/components/ui/ConfirmDialog.vue', () => ({
  default: { template: '<div></div>', props: ['open', 'title', 'message'] },
}));

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      admin: { users: { promote: 'Promote to Admin', search: 'Search users...', confirmPromote: 'Are you sure?' } },
      common: { search: 'Search', cancel: 'Cancel', noResults: 'No results', loading: 'Loading...', name: 'Name', role: 'Role', actions: 'Actions' },
      roles: { super_admin: 'Super Admin', admin: 'Administrator', user: 'User' },
    },
  },
});

function mountModal(props: Record<string, any> = {}) {
  return mount(PromoteUserModal, {
    props: { open: true, ...props },
    global: { plugins: [i18n] },
  });
}

describe('PromoteUserModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAdminStore.usersList = null;
    mockAdminStore.isLoading = false;
  });

  it('should render the modal content', () => {
    const wrapper = mountModal();
    expect(wrapper.find('[data-testid="promote-user-modal"]').exists()).toBe(true);
  });

  it('should render search input', () => {
    const wrapper = mountModal();
    expect(wrapper.find('[data-testid="promote-search-input"]').exists()).toBe(true);
  });

  it('should call fetchUsers with limit 500 when opened', async () => {
    const wrapper = mountModal({ open: false });
    await wrapper.setProps({ open: true });
    await new Promise((r) => setTimeout(r, 0));
    expect(mockAdminStore.fetchUsers).toHaveBeenCalledWith({ limit: 500 });
  });

  it('should display user results', () => {
    mockAdminStore.usersList = {
      users: [
        { id: 'u-1', email: 'john@test.com', firstName: 'John', lastName: 'Doe', systemRole: 'user', status: 'ACTIVE', emailVerified: true, createdAt: '' },
      ],
      total: 1,
      page: 1,
      limit: 500,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
    };
    const wrapper = mountModal();
    expect(wrapper.find('[data-testid="user-row-u-1"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('John');
    expect(wrapper.text()).toContain('Doe');
  });

  it('should show promote button for regular users', () => {
    mockAdminStore.usersList = {
      users: [
        { id: 'u-1', email: 'john@test.com', firstName: 'John', lastName: 'Doe', systemRole: 'user', status: 'ACTIVE', emailVerified: true, createdAt: '' },
      ],
      total: 1,
      page: 1,
      limit: 500,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
    };
    const wrapper = mountModal();
    expect(wrapper.find('[data-testid="promote-btn-u-1"]').exists()).toBe(true);
  });

  it('should show no results when empty', () => {
    mockAdminStore.usersList = { users: [], total: 0, page: 1, limit: 500, totalPages: 0, hasNext: false, hasPrevious: false };
    const wrapper = mountModal();
    expect(wrapper.find('[data-testid="promote-no-results"]').exists()).toBe(true);
  });

  it('should emit close when cancel is clicked', async () => {
    const wrapper = mountModal();
    const buttons = wrapper.findAll('button');
    const cancelBtn = buttons.find((b) => b.text() === 'Cancel');
    await cancelBtn!.trigger('click');
    expect(wrapper.emitted('close')).toBeTruthy();
  });
});
