<!--
  ============================================
  COMPONENT: ConfirmDialog
  ============================================

  Confirmation dialog using BaseModal.
-->

<script setup lang="ts">
import BaseModal from './BaseModal.vue';

type ConfirmVariant = 'primary' | 'danger';

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: ConfirmVariant;
}

withDefaults(defineProps<Props>(), {
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  confirmVariant: 'primary',
});

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();
</script>

<template>
  <BaseModal :open="open" :title="title" size="sm" @close="emit('cancel')">
    <p class="text-sm text-gray-600 dark:text-gray-300 mb-6">
      {{ message }}
    </p>
    <div class="flex justify-end gap-3">
      <button
        type="button"
        class="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        @click="emit('cancel')"
      >
        {{ cancelText }}
      </button>
      <button
        type="button"
        :class="[
          'px-4 py-2 text-sm font-medium rounded-md text-white transition-colors',
          confirmVariant === 'danger'
            ? 'bg-red-600 hover:bg-red-700'
            : 'bg-primary-600 hover:bg-primary-700',
        ]"
        @click="emit('confirm')"
      >
        {{ confirmText }}
      </button>
    </div>
  </BaseModal>
</template>
