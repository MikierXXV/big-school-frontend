<template>
  <form @submit="submitHandler" class="space-y-6">
    <!-- New Password Field -->
    <div>
      <label for="newPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
        New Password
      </label>
      <BaseInput
        id="newPassword"
        v-model="values.newPassword"
        type="password"
        placeholder="••••••••"
        autocomplete="new-password"
        :error="touched.newPassword && errors.newPassword ? errors.newPassword : ''"
        @blur="setFieldTouched('newPassword', true)"
      />

      <!-- Password Strength Meter -->
      <div class="mt-2">
        <PasswordStrengthMeter :password="values.newPassword" />
      </div>
    </div>

    <!-- Password Confirmation Field -->
    <div>
      <label for="passwordConfirmation" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
        Confirm New Password
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
      Reset Password
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
import { required, passwordStrength, passwordMatch } from '@shared/utils/validation.util.js';
import BaseInput from '@presentation/components/ui/BaseInput.vue';
import BaseButton from '@presentation/components/ui/BaseButton.vue';
import BaseAlert from '@presentation/components/ui/BaseAlert.vue';
import PasswordStrengthMeter from '@presentation/components/ui/PasswordStrengthMeter.vue';

interface Props {
  token: string;
}

const props = defineProps<Props>();

const { confirmPasswordReset, error, clearError } = useAuth();
const success = ref<string | null>(null);

const {
  values,
  errors,
  touched,
  isSubmitting,
  setFieldTouched,
  handleSubmit,
} = useForm(
  {
    newPassword: '',
    passwordConfirmation: '',
  },
  {
    newPassword: [required, passwordStrength],
    passwordConfirmation: [required, passwordMatch(() => values.value.newPassword)],
  }
);

async function onSubmit() {
  success.value = null;
  await confirmPasswordReset({
    token: props.token,
    newPassword: values.value.newPassword,
    passwordConfirmation: values.value.passwordConfirmation,
  });
  success.value = 'Password reset successful! You can now login with your new password.';
}

const submitHandler = handleSubmit(onSubmit);
</script>
