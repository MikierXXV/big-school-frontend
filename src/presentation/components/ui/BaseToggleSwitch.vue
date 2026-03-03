<!--
  ============================================
  COMPONENT: BaseToggleSwitch
  ============================================

  Toggle switch using HeadlessUI Switch.
-->

<script setup lang="ts">
import { Switch } from '@headlessui/vue';
import { computed } from 'vue';

interface Props {
  modelValue: boolean;
  label?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const switchClasses = computed(() => [
  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800',
  props.modelValue ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600',
  props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
]);

const indicatorClasses = computed(() => [
  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
  props.modelValue ? 'translate-x-6' : 'translate-x-1',
]);

function toggle(value: boolean) {
  if (!props.disabled) {
    emit('update:modelValue', value);
  }
}
</script>

<template>
  <div class="flex items-center gap-3">
    <Switch
      :model-value="modelValue"
      :disabled="disabled"
      :class="switchClasses"
      @update:model-value="toggle"
    >
      <span class="sr-only">{{ label }}</span>
      <span :class="indicatorClasses" />
    </Switch>
    <span v-if="label" class="text-sm text-gray-700 dark:text-gray-300">{{ label }}</span>
  </div>
</template>
