<!--
  ============================================
  VIEW: Admin Analytics (Monitoring)
  ============================================

  System-wide monitoring dashboard for admins and superadmins.
  Requires 'view_all_data' permission (superadmin bypasses check).

  Sections:
  1. KPI Cards — total users, orgs, admins, active orgs
  2. Users — donut by role + donut by status
  3. Auth providers — local / google / microsoft stat cards
  4. Organizations — horizontal bar by type + donut by status
  5. Admins & permissions — compact table with permission badges
  6. Email verification — vertical bar chart
-->

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { Doughnut, Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import AdminLayout from '@presentation/components/layout/AdminLayout.vue';
import BaseSkeleton from '@presentation/components/ui/BaseSkeleton.vue';
import BasePagination from '@presentation/components/ui/BasePagination.vue';
import { useAdminStore } from '@presentation/stores/admin.store.js';
import { useOrganizationStore } from '@presentation/stores/organization.store.js';
import { useAuthStore } from '@presentation/stores/auth.store.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const { t } = useI18n();
const router = useRouter();
const adminStore = useAdminStore();
const orgStore = useOrganizationStore();
const authStore = useAuthStore();

const isSuperAdmin = computed(() => authStore.user?.systemRole === 'super_admin');

const isLoading = ref(true);

// ─── KPIs ──────────────────────────────────────────────────────────────────
const totalUsers = computed(() => adminStore.userStats?.total ?? 0);
const totalOrgs = computed(() => orgStore.pagination.total);
const totalAdmins = computed(() => adminStore.admins.length);
const activeOrgs = computed(() => orgStore.organizations.filter((o) => o.active).length);
const inactiveOrgs = computed(() => orgStore.organizations.filter((o) => !o.active).length);

// ─── Users by role ─────────────────────────────────────────────────────────
const usersByRole = computed(() => ({
  user: adminStore.userStats?.byRole.user ?? 0,
  admin: adminStore.userStats?.byRole.admin ?? 0,
  super_admin: adminStore.userStats?.byRole.super_admin ?? 0,
}));

const roleChartData = computed(() => ({
  labels: [
    t('admin.analytics.roles.user'),
    t('admin.analytics.roles.admin'),
    t('admin.analytics.roles.superAdmin'),
  ],
  datasets: [
    {
      data: [usersByRole.value.user, usersByRole.value.admin, usersByRole.value.super_admin],
      backgroundColor: ['#6B7280', '#3B82F6', '#8B5CF6'],
      borderWidth: 0,
    },
  ],
}));

// ─── Users by status ───────────────────────────────────────────────────────
const usersByStatus = computed(() => ({
  active: adminStore.userStats?.byStatus.active ?? 0,
  inactive: adminStore.userStats?.byStatus.deactivated ?? 0,
  pending: adminStore.userStats?.byStatus.pending_verification ?? 0,
}));

const statusChartData = computed(() => ({
  labels: [
    t('admin.analytics.status.active'),
    t('admin.analytics.status.inactive'),
    t('admin.analytics.status.pending'),
  ],
  datasets: [
    {
      data: [usersByStatus.value.active, usersByStatus.value.inactive, usersByStatus.value.pending],
      backgroundColor: ['#10B981', '#EF4444', '#F59E0B'],
      borderWidth: 0,
    },
  ],
}));

// ─── Auth providers ────────────────────────────────────────────────────────
const authProviders = computed(() => {
  const stats = adminStore.userStats;
  const total = stats?.total || 1;
  const local = stats?.byProvider.local ?? 0;
  const google = stats?.byProvider.google ?? 0;
  const microsoft = stats?.byProvider.microsoft ?? 0;
  return [
    { key: 'local', label: t('admin.analytics.providers.local'), count: local, pct: Math.round((local / total) * 100), color: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200' },
    { key: 'google', label: t('admin.analytics.providers.google'), count: google, pct: Math.round((google / total) * 100), color: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300' },
    { key: 'microsoft', label: t('admin.analytics.providers.microsoft'), count: microsoft, pct: Math.round((microsoft / total) * 100), color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' },
  ];
});

// ─── Organizations by type ──────────────────────────────────────────────────
const orgsByType = computed(() => {
  const counts: Record<string, number> = {};
  for (const org of orgStore.organizations) {
    counts[org.type] = (counts[org.type] ?? 0) + 1;
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
});

const orgTypeChartData = computed(() => ({
  labels: orgsByType.value.map(([type]) => type),
  datasets: [
    {
      label: t('admin.analytics.orgs.count'),
      data: orgsByType.value.map(([, count]) => count),
      backgroundColor: '#3B82F6',
      borderRadius: 4,
    },
  ],
}));

// ─── Org status donut ──────────────────────────────────────────────────────
const orgStatusChartData = computed(() => ({
  labels: [t('admin.analytics.status.active'), t('admin.analytics.status.inactive')],
  datasets: [
    {
      data: [activeOrgs.value, inactiveOrgs.value],
      backgroundColor: ['#10B981', '#EF4444'],
      borderWidth: 0,
    },
  ],
}));

// ─── Email verification ────────────────────────────────────────────────────
const emailVerificationData = computed(() => {
  const verified = adminStore.userStats?.emailVerified ?? 0;
  const unverified = (adminStore.userStats?.total ?? 0) - verified;
  return {
    labels: [t('admin.analytics.email.verified'), t('admin.analytics.email.unverified')],
    datasets: [
      {
        label: t('admin.analytics.email.title'),
        data: [verified, unverified],
        backgroundColor: ['#10B981', '#F59E0B'],
        borderRadius: 4,
      },
    ],
  };
});

// ─── Chart options ─────────────────────────────────────────────────────────
const donutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' as const },
  },
};

const horizontalBarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y' as const,
  plugins: { legend: { display: false } },
  scales: {
    x: { ticks: { precision: 0 }, grid: { color: 'rgba(107,114,128,0.1)' } },
  },
};

const verticalBarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { ticks: { precision: 0 }, grid: { color: 'rgba(107,114,128,0.1)' } },
  },
};

// ─── Admins table: search + pagination ────────────────────────────────────
const ADMIN_PAGE_SIZE = 15;
const adminSearch = ref('');
const adminPage = ref(1);

let searchDebounce: ReturnType<typeof setTimeout> | null = null;
function onAdminSearch(): void {
  adminPage.value = 1;
  if (searchDebounce) clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => {}, 0); // flush; filtering is client-side
}

const filteredAdmins = computed(() => {
  const term = adminSearch.value.trim().toLowerCase();
  if (!term) return adminStore.admins;
  return adminStore.admins.filter(
    (a) =>
      a.email.toLowerCase().includes(term) ||
      `${a.firstName} ${a.lastName}`.toLowerCase().includes(term),
  );
});

const adminTotalPages = computed(() => Math.max(1, Math.ceil(filteredAdmins.value.length / ADMIN_PAGE_SIZE)));

const paginatedAdmins = computed(() => {
  const start = (adminPage.value - 1) * ADMIN_PAGE_SIZE;
  return filteredAdmins.value.slice(start, start + ADMIN_PAGE_SIZE);
});

// ─── Permission badges ─────────────────────────────────────────────────────
const permissionColors: Record<string, string> = {
  manage_users: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  manage_organizations: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  assign_members: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  view_all_data: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};

const permissionLabels: Record<string, string> = {
  manage_users: 'Usr',
  manage_organizations: 'Org',
  assign_members: 'Mbr',
  view_all_data: 'All',
};

// ─── Scoped (admin) computeds ──────────────────────────────────────────────
const allScopedMembers = computed(() =>
  Object.values(adminStore.myOrgMembers).flat(),
);

const totalScopedMembers = computed(() => allScopedMembers.value.length);

const membersByRole = computed(() => {
  const counts: Record<string, number> = {};
  for (const m of allScopedMembers.value) {
    counts[m.role] = (counts[m.role] ?? 0) + 1;
  }
  return counts;
});

const scopedOrgsByType = computed(() => {
  const counts: Record<string, number> = {};
  for (const org of adminStore.myOrgs) {
    counts[org.organizationType] = (counts[org.organizationType] ?? 0) + 1;
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
});

const scopedActiveOrgs = computed(() => adminStore.myOrgs.filter((o) => o.isActive).length);

const scopedOrgTypeChartData = computed(() => ({
  labels: scopedOrgsByType.value.map(([type]) => type),
  datasets: [
    {
      label: t('admin.analytics.orgs.count'),
      data: scopedOrgsByType.value.map(([, count]) => count),
      backgroundColor: '#3B82F6',
      borderRadius: 4,
    },
  ],
}));

const memberRoleLabels: Record<string, string> = {
  org_admin: 'admin.analytics.scoped.orgRoles.org_admin',
  doctor: 'admin.analytics.scoped.orgRoles.doctor',
  nurse: 'admin.analytics.scoped.orgRoles.nurse',
  specialist: 'admin.analytics.scoped.orgRoles.specialist',
  staff: 'admin.analytics.scoped.orgRoles.staff',
  guest: 'admin.analytics.scoped.orgRoles.guest',
};

const memberRoleColors = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#6B7280', '#EC4899'];

const memberRoleChartData = computed(() => {
  const roles = Object.keys(membersByRole.value);
  return {
    labels: roles.map((r) => t(memberRoleLabels[r] ?? r)),
    datasets: [
      {
        data: roles.map((r) => membersByRole.value[r]),
        backgroundColor: roles.map((_, i) => memberRoleColors[i % memberRoleColors.length]),
        borderWidth: 0,
      },
    ],
  };
});

const scopedKpiCards = computed(() => [
  {
    label: t('admin.analytics.scoped.kpis.myOrgs'),
    value: adminStore.myOrgs.length,
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    iconBg: 'bg-green-100 dark:bg-green-900/30',
    iconColor: 'text-green-600 dark:text-green-400',
  },
  {
    label: t('admin.analytics.scoped.kpis.totalMembers'),
    value: totalScopedMembers.value,
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    label: t('admin.analytics.scoped.kpis.orgTypes'),
    value: scopedOrgsByType.value.length,
    icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
    iconBg: 'bg-purple-100 dark:bg-purple-900/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
  {
    label: t('admin.analytics.scoped.kpis.activeOrgs'),
    value: scopedActiveOrgs.value,
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
]);

// ─── KPI card config ───────────────────────────────────────────────────────
const kpiCards = computed(() => [
  {
    label: t('admin.analytics.kpis.totalUsers'),
    value: totalUsers.value,
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    label: t('admin.analytics.kpis.totalOrgs'),
    value: totalOrgs.value,
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    iconBg: 'bg-green-100 dark:bg-green-900/30',
    iconColor: 'text-green-600 dark:text-green-400',
  },
  {
    label: t('admin.analytics.kpis.totalAdmins'),
    value: totalAdmins.value,
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    iconBg: 'bg-purple-100 dark:bg-purple-900/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
  {
    label: t('admin.analytics.kpis.activeOrgs'),
    value: activeOrgs.value,
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
]);

// ─── Load data ─────────────────────────────────────────────────────────────
onMounted(async () => {
  try {
    if (isSuperAdmin.value) {
      await Promise.all([
        adminStore.fetchUserStats(),
        orgStore.fetchOrganizations({ limit: 500 }),
        adminStore.fetchAdmins(),
      ]);
    } else {
      const userId = authStore.user?.id;
      if (userId) {
        await adminStore.fetchMyOrganizationsWithMembers(userId);
      }
    }
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <AdminLayout>
    <div data-testid="admin-analytics">
      <!-- Page header -->
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        {{ isSuperAdmin ? t('admin.analytics.title') : t('admin.analytics.scoped.title') }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mb-8">
        {{ isSuperAdmin ? t('admin.analytics.description') : t('admin.analytics.scoped.description') }}
      </p>

      <!-- ── Section 1: KPI Cards ─────────────────────────────────────── -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <template v-if="isLoading">
          <div v-for="n in 4" :key="n" class="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
            <BaseSkeleton class="w-10 h-10 rounded-full mb-3" />
            <BaseSkeleton class="w-16 h-7 mb-1" />
            <BaseSkeleton class="w-24 h-4" />
          </div>
        </template>
        <template v-else>
          <div
            v-for="card in isSuperAdmin ? kpiCards : scopedKpiCards"
            :key="card.label"
            class="bg-white dark:bg-gray-800 rounded-lg shadow p-5"
          >
            <div :class="['w-10 h-10 rounded-full flex items-center justify-center mb-3', card.iconBg]">
              <svg :class="['w-5 h-5', card.iconColor]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="card.icon" />
              </svg>
            </div>
            <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ card.value }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{{ card.label }}</p>
          </div>
        </template>
      </div>

      <!-- ══════════════════════════════════════════════════════════════ -->
      <!-- SUPER ADMIN VIEW                                              -->
      <!-- ══════════════════════════════════════════════════════════════ -->
      <template v-if="isSuperAdmin">
        <!-- ── Section 2: Users ─────────────────────────────────────── -->
        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          {{ t('admin.analytics.users.title') }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
            <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
              {{ t('admin.analytics.users.byRole') }}
            </h3>
            <template v-if="isLoading">
              <BaseSkeleton class="w-full h-48" />
            </template>
            <div v-else class="h-48">
              <Doughnut :data="roleChartData" :options="donutOptions" />
            </div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
            <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
              {{ t('admin.analytics.users.byStatus') }}
            </h3>
            <template v-if="isLoading">
              <BaseSkeleton class="w-full h-48" />
            </template>
            <div v-else class="h-48">
              <Doughnut :data="statusChartData" :options="donutOptions" />
            </div>
          </div>
        </div>

        <!-- ── Section 3: Auth providers ─────────────────────────────── -->
        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          {{ t('admin.analytics.providers.title') }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <template v-if="isLoading">
            <div v-for="n in 3" :key="n" class="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
              <BaseSkeleton class="w-24 h-5 mb-3" />
              <BaseSkeleton class="w-16 h-8 mb-1" />
              <BaseSkeleton class="w-12 h-4" />
            </div>
          </template>
          <template v-else>
            <div
              v-for="provider in authProviders"
              :key="provider.key"
              :class="['rounded-lg shadow p-5', provider.color]"
            >
              <p class="text-sm font-medium mb-2 opacity-80">{{ provider.label }}</p>
              <p class="text-3xl font-bold">{{ provider.count }}</p>
              <p class="text-sm mt-1 opacity-60">{{ provider.pct }}%</p>
            </div>
          </template>
        </div>

        <!-- ── Section 4: Organizations ───────────────────────────────── -->
        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          {{ t('admin.analytics.orgs.title') }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
            <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
              {{ t('admin.analytics.orgs.byType') }}
            </h3>
            <template v-if="isLoading">
              <BaseSkeleton class="w-full h-48" />
            </template>
            <div v-else-if="orgsByType.length === 0" class="h-48 flex items-center justify-center text-sm text-gray-400">
              {{ t('admin.analytics.empty') }}
            </div>
            <div v-else :style="{ height: Math.max(192, orgsByType.length * 36) + 'px' }">
              <Bar :data="orgTypeChartData" :options="horizontalBarOptions" />
            </div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
            <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
              {{ t('admin.analytics.orgs.byStatus') }}
            </h3>
            <template v-if="isLoading">
              <BaseSkeleton class="w-full h-48" />
            </template>
            <div v-else class="h-48">
              <Doughnut :data="orgStatusChartData" :options="donutOptions" />
            </div>
          </div>
        </div>

        <!-- ── Section 5: Admins & permissions ────────────────────────── -->
        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          {{ t('admin.analytics.admins.title') }}
        </h2>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow mb-8 overflow-hidden">
          <div class="px-5 py-3 border-b border-gray-200 dark:border-gray-700">
            <input
              v-model="adminSearch"
              type="text"
              :placeholder="t('admin.analytics.admins.search')"
              class="w-full sm:w-72 px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              @input="onAdminSearch"
            />
          </div>
          <template v-if="isLoading">
            <div class="p-5 space-y-3">
              <BaseSkeleton v-for="n in 4" :key="n" class="w-full h-8" />
            </div>
          </template>
          <div v-else-if="filteredAdmins.length === 0" class="p-8 text-center text-sm text-gray-400">
            {{ adminSearch.trim() ? t('admin.analytics.admins.noResults') : t('admin.analytics.empty') }}
          </div>
          <div v-else class="overflow-x-auto">
            <table class="w-full text-sm min-w-[480px]">
              <thead>
                <tr class="border-b border-gray-200 dark:border-gray-700">
                  <th class="text-left px-5 py-3 font-medium text-gray-600 dark:text-gray-400">{{ t('admin.analytics.admins.name') }}</th>
                  <th class="text-left px-5 py-3 font-medium text-gray-600 dark:text-gray-400 hidden sm:table-cell">{{ t('admin.analytics.admins.email') }}</th>
                  <th class="text-left px-5 py-3 font-medium text-gray-600 dark:text-gray-400">{{ t('admin.analytics.admins.permissions') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="admin in paginatedAdmins"
                  :key="admin.userId"
                  class="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer transition-colors"
                  @click="router.push(`/admin/users/${admin.userId}/permissions`)"
                >
                  <td class="px-5 py-3 font-medium text-gray-900 dark:text-gray-100">
                    <div>{{ admin.firstName }} {{ admin.lastName }}</div>
                    <div class="text-xs text-gray-400 sm:hidden truncate max-w-[140px]">{{ admin.email }}</div>
                  </td>
                  <td class="px-5 py-3 text-gray-600 dark:text-gray-400 hidden sm:table-cell">{{ admin.email }}</td>
                  <td class="px-5 py-3">
                    <span v-if="admin.permissions.length === 0" class="text-gray-400 text-xs">—</span>
                    <div v-else class="flex flex-wrap gap-1">
                      <span
                        v-for="perm in admin.permissions"
                        :key="perm"
                        :class="['inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium', permissionColors[perm] ?? 'bg-gray-100 text-gray-600']"
                      >
                        {{ permissionLabels[perm] ?? perm }}
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="!isLoading && adminTotalPages > 1" class="px-5 py-3 border-t border-gray-200 dark:border-gray-700">
            <BasePagination
              :page="adminPage"
              :total-pages="adminTotalPages"
              :total="filteredAdmins.length"
              :limit="ADMIN_PAGE_SIZE"
              @page-change="adminPage = $event"
            />
          </div>
        </div>

        <!-- ── Section 6: Email verification ──────────────────────────── -->
        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          {{ t('admin.analytics.email.title') }}
        </h2>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
          <template v-if="isLoading">
            <BaseSkeleton class="w-full h-48" />
          </template>
          <div v-else class="h-48">
            <Bar :data="emailVerificationData" :options="verticalBarOptions" />
          </div>
        </div>
      </template>

      <!-- ══════════════════════════════════════════════════════════════ -->
      <!-- ADMIN SCOPED VIEW                                             -->
      <!-- ══════════════════════════════════════════════════════════════ -->
      <template v-else>
        <!-- Context banner -->
        <div class="flex items-start gap-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-4 py-3 mb-8 text-sm text-blue-700 dark:text-blue-300">
          <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ t('admin.analytics.scoped.banner') }}</span>
        </div>

        <!-- Empty state -->
        <div v-if="!isLoading && adminStore.myOrgs.length === 0" class="flex flex-col items-center justify-center py-20 text-center">
          <svg class="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {{ t('admin.analytics.scoped.empty.title') }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
            {{ t('admin.analytics.scoped.empty.description') }}
          </p>
        </div>

        <!-- Scoped content when admin has orgs -->
        <template v-else-if="!isLoading">
          <!-- ── Scoped Section: Organizations by type ─────────────── -->
          <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            {{ t('admin.analytics.orgs.title') }}
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
              <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
                {{ t('admin.analytics.orgs.byType') }}
              </h3>
              <div v-if="scopedOrgsByType.length === 0" class="h-48 flex items-center justify-center text-sm text-gray-400">
                {{ t('admin.analytics.empty') }}
              </div>
              <div v-else :style="{ height: Math.max(192, scopedOrgsByType.length * 36) + 'px' }">
                <Bar :data="scopedOrgTypeChartData" :options="horizontalBarOptions" />
              </div>
            </div>

            <!-- ── Scoped Section: Members by role ────────────────── -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
              <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
                {{ t('admin.analytics.scoped.members.title') }}
              </h3>
              <div v-if="totalScopedMembers === 0" class="h-48 flex items-center justify-center text-sm text-gray-400">
                {{ t('admin.analytics.empty') }}
              </div>
              <div v-else class="h-48">
                <Doughnut :data="memberRoleChartData" :options="donutOptions" />
              </div>
            </div>
          </div>

          <!-- ── Scoped Section: Organization list ─────────────────── -->
          <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            {{ t('admin.analytics.scoped.title').split('—')[0].trim() }}
          </h2>
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mb-8">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-gray-200 dark:border-gray-700">
                  <th class="text-left px-5 py-3 font-medium text-gray-600 dark:text-gray-400">{{ t('admin.analytics.admins.name') }}</th>
                  <th class="text-left px-5 py-3 font-medium text-gray-600 dark:text-gray-400 hidden sm:table-cell">{{ t('admin.analytics.orgs.byType') }}</th>
                  <th class="text-left px-5 py-3 font-medium text-gray-600 dark:text-gray-400">{{ t('admin.analytics.scoped.kpis.totalMembers') }}</th>
                  <th class="text-left px-5 py-3 font-medium text-gray-600 dark:text-gray-400 hidden sm:table-cell">{{ t('admin.analytics.kpis.activeOrgs') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="org in adminStore.myOrgs"
                  :key="org.organizationId"
                  class="border-b border-gray-100 dark:border-gray-700/50"
                >
                  <td class="px-5 py-3 font-medium text-gray-900 dark:text-gray-100">{{ org.organizationName }}</td>
                  <td class="px-5 py-3 text-gray-600 dark:text-gray-400 hidden sm:table-cell">{{ org.organizationType }}</td>
                  <td class="px-5 py-3 text-gray-700 dark:text-gray-300">{{ (adminStore.myOrgMembers[org.organizationId] ?? []).length }}</td>
                  <td class="px-5 py-3 hidden sm:table-cell">
                    <span :class="org.isActive ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'">
                      {{ org.isActive ? t('admin.analytics.status.active') : t('admin.analytics.status.inactive') }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>

        <!-- Loading skeleton for scoped view -->
        <template v-else>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div v-for="n in 2" :key="n" class="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
              <BaseSkeleton class="w-full h-48" />
            </div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-5 space-y-3">
            <BaseSkeleton v-for="n in 3" :key="n" class="w-full h-8" />
          </div>
        </template>
      </template>
    </div>
  </AdminLayout>
</template>
