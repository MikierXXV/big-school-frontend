<!--
  ============================================
  VIEW: My Organizations
  ============================================

  Lists all organizations the current user belongs to.
  Supports client-side search filtering.
-->

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { DashboardLayout } from '@presentation/components/layout/index.js';
import BaseBadge from '@presentation/components/ui/BaseBadge.vue';
import { useRBAC } from '@presentation/composables/useRBAC.js';
import { useRbacStore } from '@presentation/stores/rbac.store.js';
import { useAuthStore } from '@presentation/stores/auth.store.js';
import type { UserOrganizationDTO } from '@application/dtos/organization/membership.dto.js';

const { t } = useI18n();
const { userOrganizations, isLoading } = useRBAC();
const rbacStore = useRbacStore();
const authStore = useAuthStore();

onMounted(async () => {
  if (authStore.user?.id) {
    await rbacStore.fetchUserOrganizations(authStore.user.id);
  }
});

const searchQuery = ref('');

const filteredOrganizations = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return userOrganizations.value;
  return userOrganizations.value.filter((m) =>
    m.organizationName.toLowerCase().includes(q),
  );
});

function roleBadgeVariant(role: string): 'warning' | 'info' | 'neutral' {
  if (role === 'org_admin') return 'warning';
  if (role === 'doctor' || role === 'nurse' || role === 'specialist') return 'info';
  return 'neutral';
}

function roleBorderClass(role: string): string {
  if (role === 'org_admin') return 'border-l-4 border-l-yellow-400 dark:border-l-yellow-500';
  if (role === 'doctor' || role === 'nurse' || role === 'specialist') return 'border-l-4 border-l-primary-500';
  return 'border-l-4 border-l-gray-300 dark:border-l-gray-600';
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ca-ES', { day: 'numeric', month: 'short', year: 'numeric' });
}
</script>

<template>
  <DashboardLayout>
    <div data-testid="my-organizations-view">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        {{ t('dashboard.myOrganizations.title') }}
      </h1>

      <!-- Loading -->
      <div v-if="isLoading" data-testid="orgs-loading" class="text-center py-8 text-gray-500">
        {{ t('common.loading') }}
      </div>

      <template v-else>
        <!-- Search -->
        <div class="mb-6">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="t('dashboard.myOrganizations.searchPlaceholder')"
            class="w-full max-w-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <!-- Organizations Grid -->
        <div
          v-if="filteredOrganizations.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <div
            v-for="membership in filteredOrganizations"
            :key="membership.organizationId"
            :class="['bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col overflow-hidden', roleBorderClass(membership.role)]"
          >
            <!-- Card header -->
            <div class="flex items-start gap-3 p-4 pb-3">
              <div class="flex-shrink-0 w-10 h-10 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-gray-900 dark:text-gray-100 text-base leading-tight truncate">
                  {{ membership.organizationName }}
                </p>
                <BaseBadge variant="neutral" size="sm" class="mt-1">
                  {{ t(`organizations.types.${membership.organizationType}`) }}
                </BaseBadge>
              </div>
            </div>

            <!-- Divider -->
            <div class="border-t border-gray-100 dark:border-gray-700 mx-4" />

            <!-- Role + date -->
            <div class="p-4 pt-3 flex flex-col gap-2">
              <div class="flex items-center gap-2">
                <span class="text-xs text-gray-500 dark:text-gray-400">{{ t('dashboard.myOrganizations.yourRole') }}:</span>
                <BaseBadge :variant="roleBadgeVariant(membership.role)" size="sm">
                  {{ t(`organizations.roles.${membership.role}`) }}
                </BaseBadge>
              </div>
              <div class="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <span>{{ t('dashboard.myOrganizations.memberSince') }}: {{ formatDate(membership.joinedAt) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else data-testid="orgs-empty" class="text-center py-12 text-gray-500 dark:text-gray-400">
          <svg class="mx-auto mb-4 w-12 h-12 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
          <p class="text-sm">
            {{ searchQuery.trim() ? t('common.noResults') : t('dashboard.myOrganizations.noOrganizations') }}
          </p>
        </div>
      </template>
    </div>
  </DashboardLayout>
</template>
