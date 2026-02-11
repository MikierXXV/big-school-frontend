<!--
  ============================================
  COMPONENT: BaseModal
  ============================================

  Modal base reutilizable.

  TODO: Implementar componente completo con @headlessui/vue
-->

<script setup lang="ts">
interface Props {
  isOpen: boolean;
  title?: string;
}

defineProps<Props>();

defineEmits<{
  close: [];
}>();
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <h2 v-if="title" class="modal-title">{{ title }}</h2>
      <slot />
    </div>
  </div>
</template>

<style scoped>
/* TODO: Implementar modal completo */
.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center;
}

.modal-content {
  @apply bg-white rounded-lg p-6 max-w-md w-full;
}

.modal-title {
  @apply text-2xl font-bold mb-4;
}
</style>
