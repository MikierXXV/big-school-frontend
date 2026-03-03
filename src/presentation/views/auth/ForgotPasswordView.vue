<!--
  ============================================
  VIEW: Forgot Password
  ============================================

  Página de recuperación de contraseña.
-->

<script setup lang="ts">
import { ForgotPasswordForm } from '@presentation/components/auth/index.js';
import { BaseCard } from '@presentation/components/ui/index.js';
</script>

<template>
  <div class="forgot-password-view">
    <BaseCard class="max-w-md mx-auto">
      <h1 class="text-2xl font-bold text-center text-gray-900 dark:text-gray-100 mb-6">Forgot Password</h1>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        Enter your email address and we'll send you a link to reset your password.
      </p>
      <ForgotPasswordForm />
    </BaseCard>
  </div>
</template>

<style scoped>
.forgot-password-view {
  @apply container mx-auto px-4 py-8;
}
</style>
