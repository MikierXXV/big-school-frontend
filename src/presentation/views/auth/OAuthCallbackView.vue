<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div class="text-center space-y-4">
      <template v-if="error">
        <p class="text-error-600 dark:text-error-400 font-medium">{{ error }}</p>
        <a
          href="/login"
          class="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400"
        >
          Back to login
        </a>
      </template>
      <template v-else>
        <div class="animate-spin rounded-full h-10 w-10 border-4 border-primary-600 border-t-transparent mx-auto" />
        <p class="text-sm text-gray-600 dark:text-gray-400">Completing sign in…</p>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { createContainer } from '@infrastructure/di/container.js';
import { useAuthStore } from '@presentation/stores/auth.store.js';
import { useNotificationStore } from '@presentation/stores/notification.store.js';
import { UserMapper } from '@application/mappers/user.mapper.js';
import type { AuthUser } from '@presentation/stores/auth.store.js';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();
const { t } = useI18n();
const error = ref<string | null>(null);

onMounted(async () => {
  const code = route.query.code as string | undefined;
  const state = route.query.state as string | undefined;
  const oauthError = route.query.error as string | undefined;

  // Provider error (e.g. user denied access)
  if (oauthError) {
    error.value = `OAuth error: ${oauthError}`;
    return;
  }

  if (!code || !state) {
    error.value = 'Invalid callback: missing code or state.';
    return;
  }

  // Retrieve saved state + provider from sessionStorage
  const savedState = sessionStorage.getItem('oauth_state');
  const provider = sessionStorage.getItem('oauth_provider');
  sessionStorage.removeItem('oauth_state');
  sessionStorage.removeItem('oauth_provider');

  if (!savedState || state !== savedState) {
    error.value = 'OAuth state mismatch — possible CSRF attack.';
    return;
  }

  if (!provider) {
    error.value = 'OAuth provider not found in session.';
    return;
  }

  try {
    const { useCases } = createContainer();
    const redirectUri = `${window.location.origin}/oauth/callback`;

    const result = await useCases.oauthLoginUseCase.execute({
      provider,
      code,
      redirectUri,
    });

    const authUser: AuthUser = {
      id: result.user.id,
      email: result.user.email,
      firstName: result.user.firstName,
      lastName: result.user.lastName,
      fullName: `${result.user.firstName} ${result.user.lastName}`,
      status: result.user.status,
      systemRole: result.user.systemRole || 'user',
      emailVerified: result.user.emailVerified,
    };

    authStore.setOAuthSession(authUser, {
      accessToken: result.tokens.accessToken,
      refreshToken: result.tokens.refreshToken,
    });

    notificationStore.success(t('auth.loginSuccess'));
    await router.push('/dashboard');
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'OAuth login failed.';
  }
});
</script>
