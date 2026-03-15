<!--
  ============================================
  VIEW: UserSettings
  ============================================

  Language and appearance settings.
-->

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { DashboardLayout } from '@presentation/components/layout/index.js';
import ThemeToggle from '@presentation/components/ui/ThemeToggle.vue';
import LanguageSelector from '@presentation/components/ui/LanguageSelector.vue';

const { t } = useI18n();
</script>

<template>
  <DashboardLayout>
    <div class="max-w-2xl">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        {{ t('settings.title') }}
      </h1>

      <div class="space-y-4">
        <!-- Appearance card -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ t('settings.appearance') }}
              </span>
            </div>
            <ThemeToggle />
          </div>
        </div>

        <!-- Language card -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ t('settings.language') }}
              </span>
            </div>
            <LanguageSelector />
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>
