<template>
  <form @submit="submitHandler" class="space-y-6">
    <!-- First Name Field -->
    <div>
      <label for="firstName" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
        First Name
      </label>
      <BaseInput
        id="firstName"
        v-model="values.firstName"
        type="text"
        placeholder="John"
        autocomplete="given-name"
        :error="touched.firstName && errors.firstName ? errors.firstName : ''"
        @blur="setFieldTouched('firstName', true)"
      />
    </div>

    <!-- Last Name Field -->
    <div>
      <label for="lastName" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
        Last Name
      </label>
      <BaseInput
        id="lastName"
        v-model="values.lastName"
        type="text"
        placeholder="Doe"
        autocomplete="family-name"
        :error="touched.lastName && errors.lastName ? errors.lastName : ''"
        @blur="setFieldTouched('lastName', true)"
      />
    </div>

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
        autocomplete="new-password"
        :error="touched.password && errors.password ? errors.password : ''"
        @blur="setFieldTouched('password', true)"
      />

      <!-- Password Strength Meter -->
      <div class="mt-2">
        <PasswordStrengthMeter :password="values.password" />
      </div>
    </div>

    <!-- Password Confirmation Field -->
    <div>
      <label for="passwordConfirmation" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
        Confirm Password
      </label>
      <BaseInput
        id="passwordConfirmation"
        v-model="values.passwordConfirmation"
        type="password"
        placeholder="••••••••"
        autocomplete="new-password"
        :error="touched.passwordConfirmation && errors.passwordConfirmation ? errors.passwordConfirmation : ''"
        @blur="setFieldTouched('passwordConfirmation', true)"
      />
    </div>

    <!-- Terms Checkbox -->
    <div class="flex items-start">
      <div class="flex items-center h-5">
        <input
          id="acceptTerms"
          v-model="values.acceptTerms"
          type="checkbox"
          class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
          @blur="setFieldTouched('acceptTerms', true)"
        />
      </div>
      <div class="ml-3 text-sm">
        <label for="acceptTerms" class="font-medium text-gray-700 dark:text-gray-200">
          I accept the <a href="/terms" class="text-primary-600 hover:text-primary-500 dark:text-primary-400">terms and conditions</a>
        </label>
        <p v-if="touched.acceptTerms && errors.acceptTerms" class="mt-1 text-sm text-error-600 dark:text-error-400">
          {{ errors.acceptTerms }}
        </p>
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
      Create Account
    </BaseButton>

    <!-- Login Link -->
    <div class="text-center text-sm">
      <span class="text-gray-600 dark:text-gray-400">Already have an account?</span>
      <a href="/login" class="ml-1 font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
        Sign in
      </a>
    </div>
  </form>
</template>

<script setup lang="ts">
import { useForm } from '@presentation/composables/useForm.js';
import { useAuth } from '@presentation/composables/useAuth.js';
import { required, email, passwordStrength, passwordMatch } from '@shared/utils/validation.util.js';
import BaseInput from '@presentation/components/ui/BaseInput.vue';
import BaseButton from '@presentation/components/ui/BaseButton.vue';
import BaseAlert from '@presentation/components/ui/BaseAlert.vue';
import PasswordStrengthMeter from '@presentation/components/ui/PasswordStrengthMeter.vue';

const { registerAndRedirect, error, clearError } = useAuth();

// Custom validator for terms acceptance
function acceptTermsValidator(value: boolean): string {
  if (!value) {
    return 'You must accept the terms and conditions';
  }
  return '';
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
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    acceptTerms: false,
  },
  {
    firstName: [required],
    lastName: [required],
    email: [required, email],
    password: [required, passwordStrength],
    passwordConfirmation: [required, passwordMatch(() => values.value.password)],
    acceptTerms: [acceptTermsValidator],
  }
);

async function onSubmit() {
  await registerAndRedirect({
    email: values.value.email,
    password: values.value.password,
    passwordConfirmation: values.value.passwordConfirmation,
    firstName: values.value.firstName,
    lastName: values.value.lastName,
    acceptTerms: values.value.acceptTerms,
  });
}

const submitHandler = handleSubmit(onSubmit);
</script>
