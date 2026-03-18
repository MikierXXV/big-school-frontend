<!--
  ============================================
  COMPONENT: AboutModal
  ============================================

  Modal "Sobre nosotros" — muestra identidad de la empresa
  con enlace CTA al sitio web corporativo.
-->

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import BaseModal from '@presentation/components/ui/BaseModal.vue';
import BaseButton from '@presentation/components/ui/BaseButton.vue';

defineProps<{ open: boolean }>();
defineEmits<{ close: [] }>();

const { t } = useI18n();
</script>

<template>
  <BaseModal :open="open" :title="t('about.modal.title')" size="lg" @close="$emit('close')">
    <div class="space-y-5">
      <!-- Brand -->
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center shrink-0">
          <svg class="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <div>
          <p class="font-bold text-gray-900 dark:text-white">Health Care Suite</p>
          <p class="text-sm text-primary-600 dark:text-primary-400 font-medium">{{ t('about.modal.tagline') }}</p>
        </div>
      </div>

      <!-- Description -->
      <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
        {{ t('about.modal.description') }}
      </p>

      <!-- CTA card -->
      <div class="bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-700 rounded-xl p-4">
        <p class="text-sm text-primary-800 dark:text-primary-200 mb-3">
          {{ t('about.modal.ctaDescription') }}
        </p>
        <a
          href="https://www.hlanalytics.org/"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white text-sm font-medium rounded-full transition-colors duration-200"
        >
          {{ t('about.modal.ctaButton') }}
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      <!-- Close -->
      <div class="flex justify-end pt-1">
        <BaseButton variant="ghost" size="sm" @click="$emit('close')">
          {{ t('common.cancel') }}
        </BaseButton>
      </div>
    </div>
  </BaseModal>
</template>
