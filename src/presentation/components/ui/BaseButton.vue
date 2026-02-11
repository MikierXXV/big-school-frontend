<!--
  ============================================
  COMPONENT: BaseButton
  ============================================

  Boton base reutilizable con variantes.
  Usa Tailwind CSS para estilos.

  PROPS:
  - variant: 'primary' | 'secondary' | 'danger'
  - size: 'sm' | 'md' | 'lg'
  - loading: boolean
  - disabled: boolean

  TODO: Implementar componente completo
-->

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
});
</script>

<template>
  <button class="base-button">
    <slot />
  </button>
</template>

<style scoped>
/* TODO: Implementar estilos con Tailwind */
.base-button {
  @apply px-4 py-2 rounded font-medium;
}
</style>
