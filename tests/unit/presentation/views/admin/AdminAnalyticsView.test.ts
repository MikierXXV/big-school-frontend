/**
 * ============================================
 * TEST: AdminAnalyticsView
 * ============================================
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import AdminAnalyticsView from '@presentation/views/admin/AdminAnalyticsView.vue';

const { mockAdminStore, mockOrgStore, mockAuthStore } = vi.hoisted(() => {
  const mockFetchUserStats = vi.fn();
  const mockFetchAdmins = vi.fn();
  const mockFetchUsers = vi.fn();

  const mockAdminStore = {
    admins: [] as any[],
    usersList: null as any,
    userStats: null as any,
    myOrgs: [] as any[],
    myOrgMembers: {} as Record<string, any[]>,
    isLoading: false,
    error: null as string | null,
    fetchUserStats: mockFetchUserStats,
    fetchAdmins: mockFetchAdmins,
    fetchUsers: mockFetchUsers,
    fetchMyOrganizationsWithMembers: vi.fn(),
  };

  const mockOrgStore = {
    organizations: [] as any[],
    pagination: { total: 0 },
    fetchOrganizations: vi.fn(),
  };

  const mockAuthStore = {
    user: { id: 'super-admin-id', systemRole: 'super_admin' },
  };

  return { mockAdminStore, mockOrgStore, mockAuthStore };
});

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useRoute: () => ({ params: {}, meta: {} }),
}));

vi.mock('@presentation/stores/admin.store.js', () => ({
  useAdminStore: () => mockAdminStore,
}));

vi.mock('@presentation/stores/organization.store.js', () => ({
  useOrganizationStore: () => mockOrgStore,
}));

vi.mock('@presentation/stores/auth.store.js', () => ({
  useAuthStore: () => mockAuthStore,
}));

vi.mock('@presentation/components/layout/AdminLayout.vue', () => ({
  default: { template: '<div data-testid="admin-layout"><slot /></div>' },
}));

vi.mock('@presentation/components/ui/BaseSkeleton.vue', () => ({
  default: { template: '<div data-testid="skeleton"></div>' },
}));

vi.mock('@presentation/components/ui/BasePagination.vue', () => ({
  default: { template: '<div data-testid="base-pagination"></div>', props: ['page', 'totalPages', 'total', 'limit'] },
}));

vi.mock('vue-chartjs', () => ({
  Doughnut: { template: '<canvas data-testid="doughnut-chart"></canvas>', props: ['data', 'options'] },
  Bar: { template: '<canvas data-testid="bar-chart"></canvas>', props: ['data', 'options'] },
}));

vi.mock('chart.js', () => ({
  Chart: { register: vi.fn() },
  ArcElement: {},
  Tooltip: {},
  Legend: {},
  CategoryScale: {},
  LinearScale: {},
  BarElement: {},
  Title: {},
}));

const mockStats = {
  total: 150,
  emailVerified: 120,
  byRole: { user: 130, admin: 15, super_admin: 5 },
  byStatus: { active: 140, suspended: 3, pending_verification: 5, deactivated: 2 },
  byProvider: { local: 100, google: 30, microsoft: 20 },
};

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      admin: {
        analytics: {
          title: 'Analytics',
          description: 'System monitoring',
          empty: 'No data',
          kpis: { totalUsers: 'Total Users', totalOrgs: 'Total Orgs', totalAdmins: 'Total Admins', activeOrgs: 'Active Orgs' },
          roles: { user: 'User', admin: 'Admin', superAdmin: 'Super Admin' },
          status: { active: 'Active', inactive: 'Inactive', pending: 'Pending' },
          providers: { title: 'Auth Providers', local: 'Local', google: 'Google', microsoft: 'Microsoft' },
          users: { title: 'Users', byRole: 'By Role', byStatus: 'By Status' },
          orgs: { title: 'Organizations', byType: 'By Type', byStatus: 'By Status', count: 'Count' },
          admins: { title: 'Admins', search: 'Search admins', name: 'Name', email: 'Email', permissions: 'Permissions', noResults: 'No results' },
          email: { title: 'Email Verification', verified: 'Verified', unverified: 'Unverified' },
          scoped: {
            title: 'My Organizations — Analytics',
            description: 'Data from your organizations',
            banner: 'Viewing data from your organizations',
            kpis: { myOrgs: 'My Orgs', totalMembers: 'Total Members', orgTypes: 'Org Types', activeOrgs: 'Active Orgs' },
            members: { title: 'Member Distribution', byRole: 'By Role' },
            empty: { title: 'No organizations', description: 'No organizations assigned.' },
            orgRoles: { org_admin: 'Admin', doctor: 'Doctor', nurse: 'Nurse', specialist: 'Specialist', staff: 'Staff', guest: 'Guest' },
          },
        },
      },
    },
  },
});

function mountView() {
  return mount(AdminAnalyticsView, { global: { plugins: [i18n] } });
}

describe('AdminAnalyticsView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAdminStore.userStats = null;
    mockAdminStore.admins = [];
    mockAdminStore.isLoading = false;
    mockOrgStore.organizations = [];
    mockOrgStore.pagination = { total: 0 };
    mockAdminStore.fetchUserStats.mockResolvedValue(undefined);
    mockAdminStore.fetchAdmins.mockResolvedValue(undefined);
    mockOrgStore.fetchOrganizations.mockResolvedValue(undefined);
  });

  it('should render the analytics view', () => {
    const wrapper = mountView();
    expect(wrapper.find('[data-testid="admin-analytics"]').exists()).toBe(true);
  });

  it('should show title', () => {
    const wrapper = mountView();
    expect(wrapper.text()).toContain('Analytics');
  });

  it('should call fetchUserStats and fetchAdmins on mount', async () => {
    mountView();
    await new Promise((r) => setTimeout(r, 0));
    expect(mockAdminStore.fetchUserStats).toHaveBeenCalled();
    expect(mockAdminStore.fetchAdmins).toHaveBeenCalled();
    expect(mockOrgStore.fetchOrganizations).toHaveBeenCalled();
  });

  it('should NOT call fetchUsers on mount', async () => {
    mountView();
    await new Promise((r) => setTimeout(r, 0));
    expect(mockAdminStore.fetchUsers).not.toHaveBeenCalled();
  });

  it('should display totalUsers from userStats', async () => {
    mockAdminStore.userStats = { ...mockStats };
    const wrapper = mountView();
    await new Promise((r) => setTimeout(r, 0));
    expect(wrapper.text()).toContain('150');
  });

  it('should show 0 for totalUsers when stats is null', async () => {
    mockAdminStore.userStats = null;
    const wrapper = mountView();
    await new Promise((r) => setTimeout(r, 0));
    expect(wrapper.text()).toContain('0');
  });

  it('should display google and microsoft provider counts from userStats', async () => {
    mockAdminStore.userStats = { ...mockStats };
    const wrapper = mountView();
    await new Promise((r) => setTimeout(r, 0));
    expect(wrapper.text()).toContain('30');
    expect(wrapper.text()).toContain('20');
  });

  it('should show skeleton elements while loading', () => {
    mockAdminStore.isLoading = true;
    mockAdminStore.fetchUserStats.mockReturnValue(new Promise(() => {}));
    const wrapper = mountView();
    expect(wrapper.findAll('[data-testid="skeleton"]').length).toBeGreaterThan(0);
  });
});
