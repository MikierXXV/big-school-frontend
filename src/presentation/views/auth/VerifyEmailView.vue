<!--
  ============================================
  VIEW: Verify Email
  ============================================

  Página de verificación de email.
  Extrae el token de los query params y verifica el email.
-->

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { BaseCard, BaseSpinner } from '@presentation/components/ui/index.js';
import { useAuth } from '@presentation/composables/useAuth.js';

const route = useRoute();
const router = useRouter();
const { verifyEmail, error, clearError } = useAuth();

const isVerifying = ref(true);
const isSuccess = ref(false);
const verificationError = ref<string | null>(null);

const token = computed(() => route.query.token as string);

onMounted(async () => {
  clearError();

  if (!token.value) {
    verificationError.value = 'Verification token is missing';
    isVerifying.value = false;
    return;
  }

  try {
    await verifyEmail(token.value);
    isSuccess.value = true;

    // Redirect to login after 3 seconds
    setTimeout(() => {
      router.push({ name: 'login' });
    }, 3000);
  } catch (err) {
    verificationError.value = error.value || 'Verification failed';
  } finally {
    isVerifying.value = false;
  }
});
</script>

<template>
  <div class="verify-email-view">
    <BaseCard title="Email Verification" class="max-w-md mx-auto">
      <!-- Loading State -->
      <div v-if="isVerifying" class="text-center py-8">
        <BaseSpinner size="lg" class="mx-auto mb-4" />
        <p class="text-gray-600 dark:text-gray-400">Verifying your email...</p>
      </div>

      <!-- Success State -->
      <div v-else-if="isSuccess" class="text-center py-8">
        <div class="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">Email Verified!</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          Your email has been successfully verified. You can now log in to your account.
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-500">
          Redirecting to login page...
        </p>
      </div>

      <!-- Error State -->
      <div v-else-if="verificationError" class="text-center py-8">
        <div class="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">Verification Failed</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          {{ verificationError }}
        </p>
        <router-link
          to="/login"
          class="inline-block px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors"
        >
          Go to Login
        </router-link>
      </div>
    </BaseCard>
  </div>
</template>

<style scoped>
.verify-email-view {
  @apply container mx-auto px-4 py-8;
}
</style>
