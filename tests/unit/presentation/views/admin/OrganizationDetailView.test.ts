/**
 * ============================================
 * TEST: OrganizationDetailView
 * ============================================
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import OrganizationDetailView from '@presentation/views/admin/OrganizationDetailView.vue';

const {
  mockIsSuperAdmin,
  mockRouterPush,
  mockFetchOrganization,
  mockFetchMembers,
  mockDeleteOrganization,
  mockRemoveMember,
  mockOrgStore,
} = vi.hoisted(() => {
  const mockFetchOrganization = vi.fn();
  const mockFetchMembers = vi.fn();
  const mockDeleteOrganization = vi.fn();
  const mockRemoveMember = vi.fn();

  const mockOrgStore = {
    currentOrganization: null as any,
    members: [] as any[],
    isLoading: false,
    error: null as string | null,
    fetchOrganization: mockFetchOrganization,
    fetchMembers: mockFetchMembers,
    updateOrganization: vi.fn(),
    deleteOrganization: mockDeleteOrganization,
    assignMember: vi.fn(),
    changeMemberRole: vi.fn(),
    removeMember: mockRemoveMember,
  };

  return {
    mockIsSuperAdmin: { value: true, __v_isRef: true },
    mockRouterPush: vi.fn(),
    mockFetchOrganization,
    mockFetchMembers,
    mockDeleteOrganization,
    mockRemoveMember,
    mockOrgStore,
  };
});

vi.mock('@presentation/composables/useRBAC.js', () => ({
  useRBAC: () => ({
    isSuperAdmin: mockIsSuperAdmin,
    canAccess: vi.fn(() => true),
  }),
}));

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockRouterPush }),
  useRoute: () => ({ params: { id: 'org-1' }, meta: {} }),
}));

vi.mock('@presentation/components/layout/AdminLayout.vue', () => ({
  default: { template: '<div data-testid="admin-layout"><slot /></div>' },
}));

vi.mock('@presentation/components/admin/OrganizationFormModal.vue', () => ({
  default: { template: '<div data-testid="org-form-modal"></div>', props: ['open', 'organization'] },
}));

vi.mock('@presentation/components/admin/AssignMemberModal.vue', () => ({
  default: { template: '<div data-testid="assign-modal"></div>', props: ['open'] },
}));

vi.mock('@presentation/components/ui/ConfirmDialog.vue', () => ({
  default: { template: '<div data-testid="confirm-dialog"></div>', props: ['open', 'title', 'message', 'confirmVariant'] },
}));

vi.mock('@presentation/components/ui/BaseBadge.vue', () => ({
  default: { template: '<span data-testid="badge"><slot /></span>', props: ['variant', 'size'] },
}));

vi.mock('@presentation/components/ui/BaseSelect.vue', () => ({
  default: {
    template: '<select><option v-for="o in options" :key="o.value" :value="o.value">{{ o.label }}</option></select>',
    props: ['modelValue', 'options'],
    emits: ['update:modelValue'],
  },
}));

vi.mock('@presentation/stores/organization.store.js', () => ({
  useOrganizationStore: () => mockOrgStore,
}));

const mockOrg = {
  id: 'org-1',
  name: 'Hospital Central',
  type: 'hospital',
  description: 'Main hospital',
  address: '123 Main St',
  contactEmail: 'contact@hospital.com',
  contactPhone: '555-0100',
  active: true,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
};

const mockMembers = [
  {
    id: 'mem-1',
    userId: 'user-1',
    email: 'doc@hospital.com',
    firstName: 'John',
    lastName: 'Doe',
    organizationId: 'org-1',
    role: 'doctor',
    joinedAt: '2024-01-01',
    isActive: true,
  },
];

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      admin: {
        organizations: { delete: 'Delete', confirmDelete: 'Are you sure?', edit: 'Edit' },
        members: { title: 'Members', assign: 'Assign Member', changeRole: 'Role', remove: 'Remove', confirmRemove: 'Remove member?' },
      },
      organizations: {
        types: { hospital: 'Hospital' },
        roles: { org_admin: 'Administrator', doctor: 'Doctor', nurse: 'Nurse', specialist: 'Specialist', staff: 'Staff', guest: 'Guest' },
      },
      common: {
        back: 'Back',
        edit: 'Edit',
        delete: 'Delete',
        active: 'Active',
        inactive: 'Inactive',
        noResults: 'No results',
        loading: 'Loading...',
        name: 'Name',
        type: 'Type',
        status: 'Status',
        phone: 'Phone',
        address: 'Address',
        description: 'Description',
        actions: 'Actions',
      },
    },
  },
});

function mountView() {
  return mount(OrganizationDetailView, {
    global: { plugins: [i18n] },
  });
}

describe('OrganizationDetailView', () => {
  beforeEach(() => {
    mockIsSuperAdmin.value = true;
    mockRouterPush.mockClear();
    mockFetchOrganization.mockClear();
    mockFetchMembers.mockClear();
    mockOrgStore.currentOrganization = mockOrg;
    mockOrgStore.members = mockMembers;
    mockOrgStore.isLoading = false;
  });

  it('should render the view', () => {
    const wrapper = mountView();
    expect(wrapper.find('[data-testid="org-detail-view"]').exists()).toBe(true);
  });

  it('should display organization name', () => {
    const wrapper = mountView();
    expect(wrapper.text()).toContain('Hospital Central');
  });

  it('should display organization details', () => {
    const wrapper = mountView();
    expect(wrapper.text()).toContain('contact@hospital.com');
    expect(wrapper.text()).toContain('555-0100');
    expect(wrapper.text()).toContain('123 Main St');
    expect(wrapper.text()).toContain('Main hospital');
  });

  it('should show edit button', () => {
    const wrapper = mountView();
    expect(wrapper.find('[data-testid="edit-org-btn"]').exists()).toBe(true);
  });

  it('should show delete button for super admin', () => {
    const wrapper = mountView();
    expect(wrapper.find('[data-testid="delete-org-btn"]').exists()).toBe(true);
  });

  it('should hide delete button for non super admin', () => {
    mockIsSuperAdmin.value = false;
    const wrapper = mountView();
    expect(wrapper.find('[data-testid="delete-org-btn"]').exists()).toBe(false);
  });

  it('should display member rows', () => {
    const wrapper = mountView();
    expect(wrapper.find('[data-testid="member-row-user-1"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('John');
    expect(wrapper.text()).toContain('Doe');
    expect(wrapper.text()).toContain('doc@hospital.com');
  });

  it('should show assign member button', () => {
    const wrapper = mountView();
    expect(wrapper.find('[data-testid="assign-member-btn"]').exists()).toBe(true);
  });

  it('should show remove button per member', () => {
    const wrapper = mountView();
    expect(wrapper.find('[data-testid="remove-member-user-1"]').exists()).toBe(true);
  });

  it('should call fetchOrganization and fetchMembers on mount', async () => {
    mountView();
    await new Promise((r) => setTimeout(r, 0));
    expect(mockFetchOrganization).toHaveBeenCalledWith('org-1');
    expect(mockFetchMembers).toHaveBeenCalledWith('org-1');
  });

  it('should show back button', () => {
    const wrapper = mountView();
    expect(wrapper.find('[data-testid="back-btn"]').exists()).toBe(true);
  });

  it('should navigate back when back button is clicked', async () => {
    const wrapper = mountView();
    await wrapper.find('[data-testid="back-btn"]').trigger('click');
    expect(mockRouterPush).toHaveBeenCalledWith('/admin/organizations');
  });

  it('should show no-members message when empty', () => {
    mockOrgStore.members = [];
    const wrapper = mountView();
    expect(wrapper.find('[data-testid="no-members"]').exists()).toBe(true);
  });

  it('should show Members section title', () => {
    const wrapper = mountView();
    expect(wrapper.text()).toContain('Members');
  });
});
