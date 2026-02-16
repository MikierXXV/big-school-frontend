<template>
  <form @submit="submitHandler" class="space-y-6">
    <!-- Email Field -->
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
        Email Address
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
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        We'll send you a link to reset your password
      </p>
    </div>

    <!-- Error Message -->
    <BaseAlert v-if="error" variant="error" :dismissible="true" @close="clearError">
      {{ error }}
    </BaseAlert>

    <!-- Success Message -->
    <BaseAlert v-if="success" variant="success" :dismissible="false">
      {{ success }}
    </BaseAlert>

    <!-- Submit Button -->
    <BaseButton
      type="submit"
      variant="primary"
      :loading="isSubmitting"
      class="w-full"
    >
      Send Reset Link
    </BaseButton>

    <!-- Back to Login Link -->
    <div class="text-center text-sm">
      <a href="/login" class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
        ← Back to login
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

const { requestPasswordReset, error, clearError } = useAuth();
const success = ref<string | null>(null);

const {
  values,
  errors,
  touched,
  isSubmitting,
  setFieldTouched,
  handleSubmit,
  resetForm,
} = useForm(
  {
    email: '',
  },
  {
    email: [required, email],
  }
);

async function onSubmit() {
  success.value = null;
  await requestPasswordReset(values.value.email);
  success.value = 'Password reset link sent! Check your email.';
  resetForm();
}

const submitHandler = handleSubmit(onSubmit);
</script>
