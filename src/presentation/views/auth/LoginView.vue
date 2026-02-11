<!--
  ============================================
  VIEW: Login
  ============================================

  Pagina de login.

  TODO: Implementar view completo
-->

<script setup lang="ts">
import { LoginForm } from '@presentation/components/auth/index.js';
import { BaseCard } from '@presentation/components/ui/index.js';
</script>

<template>
  <div class="login-view">
    <BaseCard title="Login" class="max-w-md mx-auto">
      <LoginForm />
    </BaseCard>
  </div>
</template>

<style scoped>
.login-view {
  @apply container mx-auto px-4 py-8;
}
</style>
