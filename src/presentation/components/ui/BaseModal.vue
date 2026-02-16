<template>
  <TransitionRoot :show="open" as="template">
    <Dialog as="div" class="relative z-50" @close="handleClose">
      <!-- Backdrop -->
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      </TransitionChild>

      <!-- Modal Container -->
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel :class="panelClasses">
              <!-- Header -->
              <div v-if="title || showClose" class="flex items-start justify-between mb-4">
                <DialogTitle v-if="title" as="h3" class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ title }}
                </DialogTitle>
                <button
                  v-if="showClose"
                  type="button"
                  aria-label="Close modal"
                  class="rounded-md p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                  @click="handleClose"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <!-- Content -->
              <div class="text-gray-700 dark:text-gray-200">
                <slot />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
  TransitionChild,
} from '@headlessui/vue';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface Props {
  open: boolean;
  title?: string;
  size?: ModalSize;
  showClose?: boolean;
  closeOnBackdropClick?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  showClose: true,
  closeOnBackdropClick: true,
});

const emit = defineEmits<{
  close: [];
}>();

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };
  return sizes[props.size];
});

const panelClasses = computed(() => {
  return [
    'relative',
    'w-full',
    sizeClasses.value,
    'p-6',
    'bg-white',
    'dark:bg-gray-800',
    'border',
    'border-gray-200',
    'dark:border-gray-700',
    'rounded-lg',
    'shadow-xl',
    'transform',
    'transition-all',
  ];
});

function handleClose() {
  if (props.closeOnBackdropClick) {
    emit('close');
  }
}
</script>
