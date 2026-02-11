<!--
  ============================================
  COMPONENT: RegisterForm
  ============================================

  Formulario de registro.

  TODO: Implementar componente completo
-->

<script setup lang="ts">
import { ref } from 'vue';
import BaseInput from '../ui/BaseInput.vue';
import BaseButton from '../ui/BaseButton.vue';

const email = ref('');
const password = ref('');
const firstName = ref('');
const lastName = ref('');
const loading = ref(false);

async function handleSubmit(): Promise<void> {
  // TODO: Implementar registro
  loading.value = true;
  try {
    // await register(...)
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <form class="register-form" @submit.prevent="handleSubmit">
    <BaseInput
      v-model="firstName"
      placeholder="First Name"
    />
    <BaseInput
      v-model="lastName"
      placeholder="Last Name"
    />
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
      Register
    </BaseButton>
  </form>
</template>

<style scoped>
.register-form {
  @apply space-y-4;
}
</style>
