<!--
  ============================================
  COMPONENT: AssignMemberModal
  ============================================

  Modal for assigning a member to an organization with a role.
-->

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import BaseModal from '@presentation/components/ui/BaseModal.vue';
import BaseSelect from '@presentation/components/ui/BaseSelect.vue';
import { OrganizationRole } from '@domain/value-objects/organization-role.value-object.js';
import type { AssignMemberDTO } from '@application/dtos/organization/membership.dto.js';

interface Props {
  open: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  close: [];
  submit: [data: AssignMemberDTO];
}>();

const { t } = useI18n();

const userId = ref('');
const role = ref('');
const formError = ref<string | null>(null);

const roleOptions = Object.values(OrganizationRole).map((val) => ({
  value: val,
  label: t(`organizations.roles.${val}`),
}));

watch(
  () => userId.value,
  () => {
    formError.value = null;
  },
);

function handleSubmit(): void {
  if (!userId.value.trim() || !role.value) {
    formError.value = 'User ID and role are required';
    return;
  }
  emit('submit', {
    userId: userId.value.trim(),
    role: role.value,
  });
}

function resetForm(): void {
  userId.value = '';
  role.value = '';
  formError.value = null;
}

watch(
  () => open,
  (isOpen) => {
    if (isOpen) resetForm();
  },
);
</script>

<template>
  <BaseModal
    :open="open"
    :title="t('admin.members.assign')"
    size="md"
    @close="emit('close')"
  >
    <form data-testid="assign-member-form" class="space-y-4" @submit.prevent="handleSubmit">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ t('admin.users.search') || 'User ID or Email' }}
        </label>
        <input
          v-model="userId"
          type="text"
          data-testid="member-userid-input"
          :placeholder="t('admin.users.search')"
          class="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <BaseSelect
        v-model="role"
        :options="roleOptions"
        :label="t('admin.members.changeRole') || 'Role'"
        :placeholder="t('common.select') || 'Select...'"
        data-testid="member-role-select"
      />

      <p v-if="formError" data-testid="assign-error" class="text-sm text-red-600">{{ formError }}</p>

      <div class="flex justify-end gap-3 pt-4">
        <button
          type="button"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
          @click="emit('close')"
        >
          {{ t('common.cancel') || 'Cancel' }}
        </button>
        <button
          type="submit"
          data-testid="assign-submit-btn"
          class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
        >
          {{ t('admin.members.assign') }}
        </button>
      </div>
    </form>
  </BaseModal>
</template>
