/**
 * ============================================
 * TEST: OrganizationListView
 * ============================================
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import OrganizationListView from '@presentation/views/admin/OrganizationListView.vue';

const {
  mockIsSuperAdmin,
  mockCanAccess,
  mockRouterPush,
  mockFetchOrganizations,
  mockCreateOrganization,
  mockOrgStore,
} = vi.hoisted(() => {
  const mockFetchOrganizations = vi.fn();
  const mockCreateOrganization = vi.fn();

  const mockOrgStore = {
    organizations: [] as any[],
    pagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
    isLoading: false,
    error: null as string | null,
    fetchOrganizations: mockFetchOrganizations,
    createOrganization: mockCreateOrganization,
  };

  return {
    mockIsSuperAdmin: { value: true, __v_isRef: true },
    mockCanAccess: vi.fn(() => true),
    mockRouterPush: vi.fn(),
    mockFetchOrganizations,
    mockCreateOrganization,
    mockOrgStore,
  };
});

vi.mock('@presentation/composables/useRBAC.js', () => ({
  useRBAC: () => ({
    isSuperAdmin: mockIsSuperAdmin,
    canAccess: mockCanAccess,
  }),
}));

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockRouterPush }),
  useRoute: () => ({ params: {}, meta: {} }),
}));

vi.mock('@presentation/components/layout/AdminLayout.vue', () => ({
  default: { template: '<div data-testid="admin-layout"><slot /></div>' },
}));

vi.mock('@presentation/components/admin/OrganizationFormModal.vue', () => ({
  default: { template: '<div data-testid="org-form-modal"></div>', props: ['open', 'organization'] },
}));

vi.mock('@presentation/stores/organization.store.js', () => ({
  useOrganizationStore: () => mockOrgStore,
}));

const mockOrgs = [
  {
    id: 'org-1',
    name: 'Hospital Central',
    type: 'hospital',
    description: 'Main',
    address: '123 St',
    contactEmail: 'h@h.com',
    contactPhone: '555',
    active: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'org-2',
    name: 'Clinic Norte',
    type: 'clinic',
    description: 'North',
    address: '456 Ave',
    contactEmail: 'c@c.com',
    contactPhone: '556',
    active: false,
    createdAt: '2024-01-02',
    updatedAt: '2024-01-02',
  },
];

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      admin: {
        organizations: { title: 'Organization Management', create: 'Create Organization' },
      },
      organizations: {
        types: {
          hospital: 'Hospital',
          clinic: 'Clinic',
          health_center: 'Health Center',
          laboratory: 'Laboratory',
          pharmacy: 'Pharmacy',
          other: 'Other',
        },
      },
      common: {
        all: 'All',
        active: 'Active',
        inactive: 'Inactive',
        noResults: 'No results found',
        filter: 'Filter by type',
        showing: 'Showing {from}-{to} of {total}',
        previous: 'Previous',
        next: 'Next',
        loading: 'Loading...',
        name: 'Name',
        type: 'Type',
        status: 'Status',
      },
    },
  },
});

function mountView() {
  return mount(OrganizationListView, {
    global: { plugins: [i18n] },
  });
}

describe('OrganizationListView', () => {
  beforeEach(() => {
    mockIsSuperAdmin.value = true;
    mockFetchOrganizations.mockClear();
    mockRouterPush.mockClear();
    mockOrgStore.isLoading = false;
    mockOrgStore.error = null;
    mockOrgStore.organizations = [...mockOrgs];
    mockOrgStore.pagination = { total: 2, page: 1, limit: 20, totalPages: 1 };
  });

  it('should render the view', () => {
    const wrapper = mountView();
    expect(wrapper.find('[data-testid="org-list-view"]').exists()).toBe(true);
  });

  it('should show title', () => {
    const wrapper = mountView();
    expect(wrapper.text()).toContain('Organization Management');
  });

  it('should show create button for super admin', () => {
    const wrapper = mountView();
    expect(wrapper.find('[data-testid="create-org-btn"]').exists()).toBe(true);
  });

  it('should hide create button for non super admin', () => {
    mockIsSuperAdmin.value = false;
    const wrapper = mountView();
    expect(wrapper.find('[data-testid="create-org-btn"]').exists()).toBe(false);
  });

  it('should render organization rows', () => {
    const wrapper = mountView();
    expect(wrapper.find('[data-testid="org-row-org-1"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="org-row-org-2"]').exists()).toBe(true);
  });

  it('should display organization names', () => {
    const wrapper = mountView();
    expect(wrapper.text()).toContain('Hospital Central');
    expect(wrapper.text()).toContain('Clinic Norte');
  });

  it('should show active/inactive badges', () => {
    const wrapper = mountView();
    expect(wrapper.text()).toContain('Active');
    expect(wrapper.text()).toContain('Inactive');
  });

  it('should navigate to detail when clicking a row', async () => {
    const wrapper = mountView();
    await wrapper.find('[data-testid="org-row-org-1"]').trigger('click');
    expect(mockRouterPush).toHaveBeenCalledWith('/admin/organizations/org-1');
  });

  it('should call fetchOrganizations on mount', () => {
    mountView();
    expect(mockFetchOrganizations).toHaveBeenCalled();
  });

  it('should show loading state', () => {
    mockOrgStore.isLoading = true;
    mockOrgStore.organizations = [];
    const wrapper = mountView();
    expect(wrapper.find('[data-testid="org-loading"]').exists()).toBe(true);
  });

  it('should show error state', () => {
    mockOrgStore.error = 'Network error';
    mockOrgStore.organizations = [];
    const wrapper = mountView();
    expect(wrapper.find('[data-testid="org-error"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('Network error');
  });

  it('should show empty state when no organizations', () => {
    mockOrgStore.organizations = [];
    const wrapper = mountView();
    expect(wrapper.find('[data-testid="org-empty"]').exists()).toBe(true);
  });

  it('should display contact emails', () => {
    const wrapper = mountView();
    expect(wrapper.text()).toContain('h@h.com');
    expect(wrapper.text()).toContain('c@c.com');
  });
});
