<!--
  ============================================
  COMPONENT: LanguageSelector
  ============================================

  Displays CA | ES | EN buttons in the header.
  Active locale is highlighted with primary color.
  Selection persists via localStorage.
-->

<template>
  <div class="flex items-center rounded-md p-1 text-xs font-semibold">
    <template v-for="(locale, index) in SUPPORTED_LOCALES" :key="locale">
      <button
        :class="[
          'px-1.5 py-0.5 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 dark:focus:ring-offset-gray-900',
          currentLocale === locale
            ? 'text-primary-600 dark:text-primary-400'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200',
        ]"
        @click="setLocale(locale)"
      >
        {{ locale.toUpperCase() }}
      </button>
      <span
        v-if="index < SUPPORTED_LOCALES.length - 1"
        class="text-gray-300 dark:text-gray-600 select-none px-0.5"
      >|</span>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useLocale } from '@presentation/composables/useLocale.js';

const { currentLocale, setLocale, SUPPORTED_LOCALES } = useLocale();
</script>
