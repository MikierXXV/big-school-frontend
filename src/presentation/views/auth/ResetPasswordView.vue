<!--
  ============================================
  VIEW: Reset Password
  ============================================

  Página de reseteo de contraseña.
  Extrae el token de los query params y muestra el formulario de reset.
-->

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { BaseCard } from '@presentation/components/ui/index.js';
import { ResetPasswordForm } from '@presentation/components/auth/index.js';

const route = useRoute();

const token = computed(() => route.query.token as string);
const hasToken = computed(() => !!token.value);
</script>

<template>
  <div class="reset-password-view">
    <BaseCard title="Reset Password" class="max-w-md mx-auto">
      <!-- No Token Error -->
      <div v-if="!hasToken" class="text-center py-8">
        <div class="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Invalid Reset Link</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          This password reset link is invalid or has expired.
        </p>
        <router-link
          to="/forgot-password"
          class="inline-block px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors"
        >
          Request New Reset Link
        </router-link>
      </div>

      <!-- Reset Form -->
      <div v-else>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Enter your new password below.
        </p>
        <ResetPasswordForm :token="token" />
      </div>
    </BaseCard>
  </div>
</template>

<style scoped>
.reset-password-view {
  @apply container mx-auto px-4 py-8;
}
</style>
