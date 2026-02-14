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
  </form>
</template>

<script setup lang="ts">
import { useForm } from '@presentation/composables/useForm.js';
import { useAuth } from '@presentation/composables/useAuth.js';
import { required, email } from '@shared/utils/validation.util.js';
import BaseInput from '@presentation/components/ui/BaseInput.vue';
import BaseButton from '@presentation/components/ui/BaseButton.vue';
import BaseAlert from '@presentation/components/ui/BaseAlert.vue';

const { login, error, clearError } = useAuth();

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
    email: [required, email],
    password: [required],
  }
);

async function onSubmit() {
  await login({
    email: values.value.email,
    password: values.value.password,
    rememberMe: values.value.rememberMe,
  });
}

// Create the submit handler that includes validation
const submitHandler = handleSubmit(onSubmit);
</script>
