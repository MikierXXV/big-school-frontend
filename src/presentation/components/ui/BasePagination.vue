<!--
  ============================================
  COMPONENT: BasePagination
  ============================================

  Pagination component with Previous/Next buttons and showing info.
-->

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

interface Props {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
}

const props = defineProps<Props>();
const { t } = useI18n();

const emit = defineEmits<{
  'page-change': [page: number];
}>();

const hasPrevious = computed(() => props.page > 1);
const hasNext = computed(() => props.page < props.totalPages);

const from = computed(() => Math.min((props.page - 1) * props.limit + 1, props.total));
const to = computed(() => Math.min(props.page * props.limit, props.total));

function previousPage() {
  if (hasPrevious.value) {
    emit('page-change', props.page - 1);
  }
}

function nextPage() {
  if (hasNext.value) {
    emit('page-change', props.page + 1);
  }
}
</script>

<template>
  <div class="flex items-center justify-between px-4 py-3">
    <div class="text-sm text-gray-700 dark:text-gray-300">
      {{ t('common.showing', { from, to, total }) }}
    </div>
    <div class="flex gap-2">
      <button
        :disabled="!hasPrevious"
        class="px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        @click="previousPage"
      >
        {{ t('common.previous') }}
      </button>
      <button
        :disabled="!hasNext"
        class="px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        @click="nextPage"
      >
        {{ t('common.next') }}
      </button>
    </div>
  </div>
</template>
