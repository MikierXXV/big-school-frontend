<!--
  ============================================
  VIEW: Register
  ============================================

  Pagina de registro.

  TODO: Implementar view completo
-->

<script setup lang="ts">
import { RegisterForm } from '@presentation/components/auth/index.js';
import { BaseCard } from '@presentation/components/ui/index.js';
</script>

<template>
  <div class="register-view">
    <BaseCard title="Register" class="max-w-md mx-auto">
      <RegisterForm />
    </BaseCard>
  </div>
</template>

<style scoped>
.register-view {
  @apply container mx-auto px-4 py-8;
}
</style>
