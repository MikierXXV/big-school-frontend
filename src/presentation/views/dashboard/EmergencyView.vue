<!--
  ============================================
  VIEW: Emergency
  ============================================

  Módulo de Urgencias (placeholder).
-->

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { DashboardLayout } from '@presentation/components/layout/index.js';

const { t } = useI18n();
</script>

<template>
  <DashboardLayout>
    <div class="module-content">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        {{ t('modules.emergency.title') }}
      </h1>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <p class="text-gray-600 dark:text-gray-400">
          {{ t('modules.emergency.placeholder') }}
        </p>
      </div>

      <div class="mt-6">
        <a
          href="/dashboard"
          class="text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium"
        >
          &larr; {{ t('dashboard.title') }}
        </a>
      </div>
    </div>
  </DashboardLayout>
</template>
