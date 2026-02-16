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
    <BaseCard title="Forgot Password" class="max-w-md mx-auto">
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
