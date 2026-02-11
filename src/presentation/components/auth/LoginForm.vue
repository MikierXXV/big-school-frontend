<!--
  ============================================
  COMPONENT: LoginForm
  ============================================

  Formulario de login.

  TODO: Implementar componente completo
-->

<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from '@presentation/composables/useAuth.js';
import BaseInput from '../ui/BaseInput.vue';
import BaseButton from '../ui/BaseButton.vue';

const { login } = useAuth();

const email = ref('');
const password = ref('');
const loading = ref(false);

async function handleSubmit(): Promise<void> {
  loading.value = true;
  try {
    await login(email.value, password.value);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <form class="login-form" @submit.prevent="handleSubmit">
    <BaseInput
      v-model="email"
      type="email"
      placeholder="Email"
    />
    <BaseInput
      v-model="password"
      type="password"
      placeholder="Password"
    />
    <BaseButton
      type="submit"
      :loading="loading"
      :disabled="loading"
    >
      Login
    </BaseButton>
  </form>
</template>

<style scoped>
.login-form {
  @apply space-y-4;
}
</style>
