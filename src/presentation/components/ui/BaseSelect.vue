<!--
  ============================================
  COMPONENT: BaseSelect
  ============================================

  Select dropdown with v-model support and dark mode.
-->

<script setup lang="ts">
import { computed } from 'vue';

interface SelectOption {
  value: string;
  label: string;
}

interface Props {
  modelValue: string;
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  disabled: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const selectClasses = computed(() => [
  'block w-full rounded-md border px-3 py-2 text-sm transition-colors',
  'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
  props.error
    ? 'border-red-500 dark:border-red-400'
    : 'border-gray-300 dark:border-gray-600',
  props.disabled ? 'opacity-50 cursor-not-allowed' : '',
]);

function handleChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  emit('update:modelValue', target.value);
}
</script>

<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {{ label }}
    </label>
    <select
      :value="modelValue"
      :disabled="disabled"
      :class="selectClasses"
      @change="handleChange"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <p v-if="error" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ error }}</p>
  </div>
</template>
