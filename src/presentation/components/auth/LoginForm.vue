<template>
  <form @submit="submitHandler" class="space-y-6">
    <!-- Email Field -->
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
        Email
      </label>
      <BaseInput
        id="email"
        v-model="values.email"
        type="email"
        placeholder="you@example.com"
        autocomplete="email"
        :error="touched.email && errors.email ? errors.email : ''"
        @blur="setFieldTouched('email', true)"
      />
    </div>

    <!-- Password Field -->
    <div>
      <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
        Password
      </label>
      <BaseInput
        id="password"
        v-model="values.password"
        type="password"
        placeholder="••••••••"
        autocomplete="current-password"
        :error="touched.password && errors.password ? errors.password : ''"
        @blur="setFieldTouched('password', true)"
      />
    </div>

    <!-- Remember Me & Forgot Password -->
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <input
          id="remember-me"
          v-model="values.rememberMe"
          type="checkbox"
          class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
        />
        <label for="remember-me" class="ml-2 block text-sm text-gray-700 dark:text-gray-200">
          Remember me
        </label>
      </div>

      <div class="text-sm">
        <a href="/forgot-password" class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
          Forgot password?
        </a>
      </div>
    </div>

    <!-- Error Message -->
    <BaseAlert v-if="error" variant="error" :dismissible="true" @close="clearError">
      {{ error }}
    </BaseAlert>

    <!-- Submit Button -->
    <BaseButton
      type="submit"
      variant="primary"
      :loading="isSubmitting"
      class="w-full"
    >
      Sign in
    </BaseButton>

    <!-- OAuth Divider -->
    <div class="relative">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-gray-300 dark:border-gray-600" />
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">Or continue with</span>
      </div>
    </div>

    <!-- OAuth Buttons -->
    <div class="grid grid-cols-2 gap-3">
      <OAuthButton
        provider="google"
        label="Google"
        :loading="oauthLoading === 'google'"
        @click="handleOAuth('google')"
      />
      <OAuthButton
        provider="microsoft"
        label="Microsoft"
        :loading="oauthLoading === 'microsoft'"
        @click="handleOAuth('microsoft')"
      />
    </div>

    <!-- Register Link -->
    <div class="text-center text-sm">
      <span class="text-gray-600 dark:text-gray-400">Don't have an account?</span>
      <a href="/register" class="ml-1 font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
        Create account
      </a>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useForm } from '@presentation/composables/useForm.js';
import { useAuth } from '@presentation/composables/useAuth.js';
import { required, email } from '@shared/utils/validation.util.js';
import BaseInput from '@presentation/components/ui/BaseInput.vue';
import BaseButton from '@presentation/components/ui/BaseButton.vue';
import BaseAlert from '@presentation/components/ui/BaseAlert.vue';
import OAuthButton from '@presentation/components/auth/OAuthButton.vue';

const { loginAndRedirect, initiateOAuthLogin, error, clearError } = useAuth();

const oauthLoading = ref<'google' | 'microsoft' | null>(null);

async function handleOAuth(provider: 'google' | 'microsoft'): Promise<void> {
  oauthLoading.value = provider;
  try {
    await initiateOAuthLogin(provider);
  } catch (err) {
    oauthLoading.value = null;
    error.value = err instanceof Error ? err.message : 'OAuth login failed';
  }
  // Note: if successful, page navigates away — no need to reset oauthLoading
}

const {
  values,
  errors,
  touched,
  isSubmitting,
  setFieldTouched,
  handleSubmit,
} = useForm(
  {
    email: '',
    password: '',
    rememberMe: false,
  },
  {
    email: [(v: string) => required(v, 'Email is required'), email],
    password: [(v: string) => required(v, 'Password is required')],
  }
);

async function onSubmit() {
  await loginAndRedirect({
    email: values.value.email,
    password: values.value.password,
    rememberMe: values.value.rememberMe,
  });
}

// Create the submit handler that includes validation
const submitHandler = handleSubmit(onSubmit);
</script>
