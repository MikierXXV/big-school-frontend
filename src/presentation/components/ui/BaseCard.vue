<!--
  ============================================
  COMPONENT: BaseCard
  ============================================

  Tarjeta base reutilizable.

  TODO: Implementar componente completo
-->

<script setup lang="ts">
interface Props {
  title?: string;
  padding?: boolean;
}

withDefaults(defineProps<Props>(), {
  padding: true,
});
</script>

<template>
  <div class="base-card" :class="{ 'p-6': padding }">
    <h3 v-if="title" class="card-title">{{ title }}</h3>
    <slot />
  </div>
</template>

<style scoped>
.base-card {
  @apply bg-white rounded-lg shadow;
}

.card-title {
  @apply text-xl font-semibold mb-4;
}
</style>
