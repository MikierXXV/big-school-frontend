<!--
  ============================================
  VIEW: My Organizations
  ============================================

  Lists all organizations the current user belongs to.
-->

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { DashboardLayout } from '@presentation/components/layout/index.js';
import OrganizationCard from '@presentation/components/dashboard/OrganizationCard.vue';
import { useRBAC } from '@presentation/composables/useRBAC.js';

const { t } = useI18n();
const { userOrganizations, isLoading } = useRBAC();
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

      <!-- Organizations Grid -->
      <div v-else-if="userOrganizations.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <OrganizationCard
          v-for="membership in userOrganizations"
          :key="membership.organizationId"
          :membership="membership"
        />
      </div>

      <!-- Empty -->
      <div v-else data-testid="orgs-empty" class="text-center py-8 text-gray-500">
        {{ t('common.noResults') }}
      </div>
    </div>
  </DashboardLayout>
</template>
