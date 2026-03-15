<!--
  ============================================
  COMPONENT: BasePagination
  ============================================

  Pagination component with Previous/Next buttons, page numbers, and showing info.
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

/**
 * Returns visible page numbers with ellipsis as null.
 * Always shows first, last, current, and up to 2 neighbours.
 * Example for page 5 of 10: [1, null, 4, 5, 6, null, 10]
 */
const visiblePages = computed<(number | null)[]>(() => {
  const total = props.totalPages;
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const current = props.page;
  const pages: (number | null)[] = [1];

  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);

  if (left > 2) pages.push(null);
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < total - 1) pages.push(null);

  pages.push(total);
  return pages;
});

function goToPage(p: number) {
  if (p >= 1 && p <= props.totalPages && p !== props.page) {
    emit('page-change', p);
  }
}
</script>

<template>
  <div class="flex items-center justify-between px-4 py-3">
    <!-- Showing X-Y of Z -->
    <div class="text-sm text-gray-700 dark:text-gray-300">
      {{ t('common.showing', { from, to, total }) }}
    </div>

    <!-- Previous · page numbers · Next -->
    <div class="flex items-center gap-1">
      <button
        :disabled="!hasPrevious"
        class="px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        @click="goToPage(page - 1)"
      >
        {{ t('common.previous') }}
      </button>

      <template v-for="(p, i) in visiblePages" :key="i">
        <!-- Ellipsis -->
        <span
          v-if="p === null"
          class="px-2 py-1.5 text-sm text-gray-400 dark:text-gray-500 select-none"
        >…</span>
        <!-- Page button -->
        <button
          v-else
          :disabled="p === page"
          :aria-current="p === page ? 'page' : undefined"
          :class="[
            'min-w-[2rem] px-2 py-1.5 text-sm font-medium rounded-md border transition-colors',
            p === page
              ? 'border-primary-500 bg-primary-600 text-white cursor-default'
              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700',
          ]"
          @click="goToPage(p)"
        >
          {{ p }}
        </button>
      </template>

      <button
        :disabled="!hasNext"
        class="px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        @click="goToPage(page + 1)"
      >
        {{ t('common.next') }}
      </button>
    </div>
  </div>
</template>
