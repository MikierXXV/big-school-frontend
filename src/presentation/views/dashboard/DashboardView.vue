<!--
  ============================================
  VIEW: Dashboard
  ============================================

  Panel principal de Health Care Suite.
-->

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { DashboardLayout } from '@presentation/components/layout/index.js';
import { useAuth } from '@presentation/composables/useAuth.js';

const { t } = useI18n();
const router = useRouter();
const { user } = useAuth();

interface ModuleCard {
  id: string;
  route: string;
  titleKey: string;
  descriptionKey: string;
  iconColor: string;
  iconBg: string;
  iconBgDark: string;
  iconPath: string;
}

const modules: ModuleCard[] = [
  {
    id: 'surgical-block',
    route: 'surgical-block',
    titleKey: 'dashboard.modules.surgicalBlock.title',
    descriptionKey: 'dashboard.modules.surgicalBlock.description',
    iconColor: 'text-red-600 dark:text-red-400',
    iconBg: 'bg-red-100',
    iconBgDark: 'dark:bg-red-900',
    iconPath: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  },
  {
    id: 'emergency',
    route: 'emergency',
    titleKey: 'dashboard.modules.emergency.title',
    descriptionKey: 'dashboard.modules.emergency.description',
    iconColor: 'text-orange-600 dark:text-orange-400',
    iconBg: 'bg-orange-100',
    iconBgDark: 'dark:bg-orange-900',
    iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  },
  {
    id: 'data-analytics',
    route: 'data-analytics',
    titleKey: 'dashboard.modules.dataAnalytics.title',
    descriptionKey: 'dashboard.modules.dataAnalytics.description',
    iconColor: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-100',
    iconBgDark: 'dark:bg-blue-900',
    iconPath: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  },
  {
    id: 'wristband-printing',
    route: 'wristband-printing',
    titleKey: 'dashboard.modules.wristbandPrinting.title',
    descriptionKey: 'dashboard.modules.wristbandPrinting.description',
    iconColor: 'text-green-600 dark:text-green-400',
    iconBg: 'bg-green-100',
    iconBgDark: 'dark:bg-green-900',
    iconPath: 'M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2',
  },
  {
    id: 'label-printing',
    route: 'label-printing',
    titleKey: 'dashboard.modules.labelPrinting.title',
    descriptionKey: 'dashboard.modules.labelPrinting.description',
    iconColor: 'text-purple-600 dark:text-purple-400',
    iconBg: 'bg-purple-100',
    iconBgDark: 'dark:bg-purple-900',
    iconPath: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
  },
];

function navigateTo(routeName: string): void {
  router.push({ name: routeName });
}
</script>

<template>
  <DashboardLayout>
    <div class="dashboard-content">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        {{ t('dashboard.title') }}
      </h1>

      <!-- Welcome Message -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {{ t('dashboard.welcome.greeting') }}{{ user ? `, ${user.fullName}` : '' }}!
        </h2>
        <p class="text-gray-600 dark:text-gray-400">
          {{ t('dashboard.welcome.subtitle') }}
        </p>
      </div>

      <!-- Module Navigation Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="mod in modules"
          :key="mod.id"
          :data-testid="`module-card-${mod.id}`"
          class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
          @click="navigateTo(mod.route)"
        >
          <div class="flex items-center mb-4">
            <div
              :class="[
                'w-12 h-12 rounded-full flex items-center justify-center',
                mod.iconBg,
                mod.iconBgDark,
              ]"
            >
              <svg
                :class="['w-6 h-6', mod.iconColor]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  :d="mod.iconPath"
                />
              </svg>
            </div>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {{ t(mod.titleKey) }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ t(mod.descriptionKey) }}
          </p>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<style scoped>
.dashboard-content {
  /* Additional styles if needed */
}
</style>
