<!--
  ============================================
  COMPONENT: BaseInput
  ============================================

  Input base reutilizable.

  TODO: Implementar componente completo
-->

<script setup lang="ts">
interface Props {
  modelValue: string;
  type?: 'text' | 'email' | 'password';
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
});

defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>

<template>
  <div class="base-input-wrapper">
    <input
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      class="base-input"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="error" class="error-message">{{ error }}</p>
  </div>
</template>

<style scoped>
/* TODO: Implementar estilos completos */
.base-input {
  @apply w-full px-4 py-2 border rounded;
}

.error-message {
  @apply text-red-500 text-sm mt-1;
}
</style>
