<!--
  ============================================
  VIEW: Admin Dashboard
  ============================================

  Main admin panel view showing summary cards and quick access to admin sections.
  Conditioned by admin permissions.
-->

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import AdminLayout from '@presentation/components/layout/AdminLayout.vue';
import { useRBAC } from '@presentation/composables/useRBAC.js';

const { t } = useI18n();
const router = useRouter();
const { isSuperAdmin, canAccess } = useRBAC();

interface AdminCard {
  id: string;
  route: string;
  titleKey: string;
  descriptionKey: string;
  iconColor: string;
  iconBg: string;
  iconPath: string;
  show: () => boolean;
}

const cards: AdminCard[] = [
  {
    id: 'organizations',
    route: '/admin/organizations',
    titleKey: 'admin.organizations.title',
    descriptionKey: 'admin.dashboard.description',
    iconColor: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-100 dark:bg-blue-900',
    iconPath: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    show: () => canAccess(['super_admin', 'admin'], 'manage_organizations'),
  },
  {
    id: 'users',
    route: '/admin/users',
    titleKey: 'admin.users.title',
    descriptionKey: 'admin.users.title',
    iconColor: 'text-green-600 dark:text-green-400',
    iconBg: 'bg-green-100 dark:bg-green-900',
    iconPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    show: () => isSuperAdmin.value,
  },
  {
    id: 'permissions',
    route: '/admin/users',
    titleKey: 'admin.permissions.title',
    descriptionKey: 'admin.permissions.title',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    iconBg: 'bg-yellow-100 dark:bg-yellow-900',
    iconPath: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    show: () => isSuperAdmin.value,
  },
];

function navigateTo(route: string): void {
  router.push(route);
}
</script>

<template>
  <AdminLayout>
    <div data-testid="admin-dashboard">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        {{ t('admin.dashboard.title') }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mb-8">
        {{ t('admin.dashboard.description') }}
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <template v-for="card in cards" :key="card.id">
          <div
            v-if="card.show()"
            :data-testid="`admin-card-${card.id}`"
            class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
            @click="navigateTo(card.route)"
          >
            <div class="flex items-center mb-4">
              <div :class="['w-12 h-12 rounded-full flex items-center justify-center', card.iconBg]">
                <svg :class="['w-6 h-6', card.iconColor]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="card.iconPath" />
                </svg>
              </div>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {{ t(card.titleKey) }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ t(card.descriptionKey) }}
            </p>
          </div>
        </template>
      </div>
    </div>
  </AdminLayout>
</template>
