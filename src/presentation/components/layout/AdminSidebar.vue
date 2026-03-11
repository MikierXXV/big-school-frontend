<!--
  ============================================
  COMPONENT: AdminSidebar
  ============================================

  Sidebar navigation for admin panel.
  Links are conditionally shown based on RBAC permissions.
-->

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRBAC } from '@presentation/composables/useRBAC.js';

const { t } = useI18n();
const { isSuperAdmin, canAccess } = useRBAC();

const navItems = [
  {
    to: '/admin',
    label: () => t('admin.dashboard.title'),
    show: () => true,
    icon: 'dashboard',
  },
  {
    to: '/admin/organizations',
    label: () => t('admin.organizations.title'),
    show: () => canAccess(['super_admin', 'admin'], 'manage_organizations'),
    icon: 'organizations',
  },
  {
    to: '/admin/users',
    label: () => t('admin.users.title'),
    show: () => isSuperAdmin.value,
    icon: 'users',
  },
];
</script>

<template>
  <aside class="w-64 shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
    <nav class="p-4 space-y-1">
      <template v-for="item in navItems" :key="item.to">
        <router-link
          v-if="item.show()"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400"
        >
          <!-- Dashboard icon -->
          <svg v-if="item.icon === 'dashboard'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <!-- Organizations icon -->
          <svg v-if="item.icon === 'organizations'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <!-- Users icon -->
          <svg v-if="item.icon === 'users'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {{ item.label() }}
        </router-link>
      </template>
    </nav>
  </aside>
</template>
