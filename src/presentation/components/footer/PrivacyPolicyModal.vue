<!--
  ============================================
  COMPONENT: PrivacyPolicyModal
  ============================================

  Modal con la Política de Privacidad de Health Care Suite.
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
  <BaseModal :open="open" :title="t('privacy.title')" size="2xl" @close="$emit('close')">
    <div class="space-y-4">
      <p class="text-xs text-gray-400 dark:text-gray-500">{{ t('privacy.lastUpdated') }}</p>

      <!-- Scrollable legal content -->
      <div class="max-h-[55vh] overflow-y-auto pr-2 space-y-5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">

        <div>
          <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-1">{{ t('privacy.s1.title') }}</h4>
          <p>{{ t('privacy.s1.text') }}</p>
        </div>

        <div>
          <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-1">{{ t('privacy.s2.title') }}</h4>
          <p>{{ t('privacy.s2.text') }}</p>
        </div>

        <div>
          <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-1">{{ t('privacy.s3.title') }}</h4>
          <p>{{ t('privacy.s3.text') }}</p>
        </div>

        <div>
          <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-1">{{ t('privacy.s4.title') }}</h4>
          <p>{{ t('privacy.s4.text') }}</p>
        </div>

        <div>
          <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-1">{{ t('privacy.s5.title') }}</h4>
          <p>{{ t('privacy.s5.text') }}</p>
        </div>

        <div>
          <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-1">{{ t('privacy.s6.title') }}</h4>
          <p>{{ t('privacy.s6.text') }}</p>
        </div>

        <div>
          <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-1">{{ t('privacy.s7.title') }}</h4>
          <p>{{ t('privacy.s7.text') }}</p>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-end border-t border-gray-100 dark:border-gray-700 pt-4">
        <BaseButton variant="primary" size="sm" @click="$emit('close')">
          {{ t('privacy.accept') }}
        </BaseButton>
      </div>
    </div>
  </BaseModal>
</template>
