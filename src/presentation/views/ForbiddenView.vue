<!--
  ============================================
  VIEW: Forbidden (403)
  ============================================

  Displayed when user lacks permissions to access a page.
-->

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import DashboardLayout from '@presentation/components/layout/DashboardLayout.vue';

const router = useRouter();
const { t } = useI18n();

function goToDashboard(): void {
  router.push('/dashboard');
}
</script>

<template>
  <DashboardLayout>
    <div class="forbidden-view">
      <h1 class="text-6xl font-bold text-red-500">403</h1>
      <p class="mt-4 text-xl text-gray-700 dark:text-gray-300">
        {{ t('forbidden.title') }}
      </p>
      <p class="mt-2 text-gray-500 dark:text-gray-400">
        {{ t('forbidden.message') }}
      </p>
      <button
        class="mt-8 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
        @click="goToDashboard"
      >
        {{ t('forbidden.goBack') }}
      </button>
    </div>
  </DashboardLayout>
</template>

<style scoped>
.forbidden-view {
  @apply flex flex-col items-center justify-center min-h-[50vh] text-center;
}
</style>
