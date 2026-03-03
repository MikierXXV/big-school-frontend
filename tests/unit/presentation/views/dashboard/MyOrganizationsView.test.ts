/**
 * ============================================
 * TEST: MyOrganizationsView
 * ============================================
 */

import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import MyOrganizationsView from '@presentation/views/dashboard/MyOrganizationsView.vue';

const { mockUserOrganizations, mockIsLoading } = vi.hoisted(() => ({
  mockUserOrganizations: { value: [] as any[], __v_isRef: true },
  mockIsLoading: { value: false, __v_isRef: true },
}));

vi.mock('@presentation/composables/useRBAC.js', () => ({
  useRBAC: () => ({
    userOrganizations: mockUserOrganizations,
    isLoading: mockIsLoading,
    isSuperAdmin: { value: false, __v_isRef: true },
    isAdmin: { value: false, __v_isRef: true },
    hasElevatedRole: { value: false, __v_isRef: true },
  }),
}));

vi.mock('@presentation/components/layout/index.js', () => ({
  DashboardLayout: { template: '<div data-testid="dashboard-layout"><slot /></div>' },
}));

vi.mock('@presentation/components/dashboard/OrganizationCard.vue', () => ({
  default: {
    template: '<div :data-testid="`org-card-${membership.organizationId}`">{{ membership.organizationName }}</div>',
    props: ['membership'],
  },
}));

const mockOrgs = [
  {
    organizationId: 'org-1',
    organizationName: 'Hospital Central',
    organizationType: 'hospital',
    role: 'doctor',
    joinedAt: '2024-01-01',
    isActive: true,
  },
  {
    organizationId: 'org-2',
    organizationName: 'Clinic Norte',
    organizationType: 'clinic',
    role: 'nurse',
    joinedAt: '2024-02-01',
    isActive: true,
  },
];

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      dashboard: { myOrganizations: { title: 'My Organizations', viewAll: 'View all' } },
      common: { loading: 'Loading...', noResults: 'No results' },
    },
  },
});

function mountView() {
  return mount(MyOrganizationsView, {
    global: { plugins: [i18n] },
  });
}

describe('MyOrganizationsView', () => {
  it('should render the view', () => {
    const wrapper = mountView();
    expect(wrapper.find('[data-testid="my-organizations-view"]').exists()).toBe(true);
  });

  it('should show title', () => {
    const wrapper = mountView();
    expect(wrapper.text()).toContain('My Organizations');
  });

  it('should show loading state', () => {
    mockIsLoading.value = true;
    mockUserOrganizations.value = [];
    const wrapper = mountView();
    expect(wrapper.find('[data-testid="orgs-loading"]').exists()).toBe(true);
    mockIsLoading.value = false;
  });

  it('should show empty state when no organizations', () => {
    mockUserOrganizations.value = [];
    const wrapper = mountView();
    expect(wrapper.find('[data-testid="orgs-empty"]').exists()).toBe(true);
  });

  it('should render organization cards', () => {
    mockUserOrganizations.value = mockOrgs;
    const wrapper = mountView();
    expect(wrapper.find('[data-testid="org-card-org-1"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="org-card-org-2"]').exists()).toBe(true);
  });

  it('should display organization names', () => {
    mockUserOrganizations.value = mockOrgs;
    const wrapper = mountView();
    expect(wrapper.text()).toContain('Hospital Central');
    expect(wrapper.text()).toContain('Clinic Norte');
  });

  it('should not show empty state when organizations exist', () => {
    mockUserOrganizations.value = mockOrgs;
    const wrapper = mountView();
    expect(wrapper.find('[data-testid="orgs-empty"]').exists()).toBe(false);
  });

  it('should not show loading when not loading', () => {
    mockIsLoading.value = false;
    mockUserOrganizations.value = mockOrgs;
    const wrapper = mountView();
    expect(wrapper.find('[data-testid="orgs-loading"]').exists()).toBe(false);
  });

  it('should render inside DashboardLayout', () => {
    const wrapper = mountView();
    expect(wrapper.find('[data-testid="dashboard-layout"]').exists()).toBe(true);
  });

  it('should show no results text when empty', () => {
    mockUserOrganizations.value = [];
    const wrapper = mountView();
    expect(wrapper.text()).toContain('No results');
  });
});
