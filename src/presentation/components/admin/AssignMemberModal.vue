<!--
  ============================================
  COMPONENT: AssignMemberModal
  ============================================

  Modal for assigning a member to an organization with a role.
  Includes user search autocomplete.
-->

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import BaseModal from '@presentation/components/ui/BaseModal.vue';
import BaseSelect from '@presentation/components/ui/BaseSelect.vue';
import { OrganizationRole } from '@domain/value-objects/organization-role.value-object.js';
import type { AssignMemberDTO } from '@application/dtos/organization/membership.dto.js';
import type { UserListItemDTO } from '@application/dtos/admin/admin.dto.js';
import { createContainer } from '@infrastructure/di/container.js';

const { useCases } = createContainer();

interface Props {
  open: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  close: [];
  submit: [data: AssignMemberDTO];
}>();

const { t } = useI18n();

const searchQuery = ref('');
const suggestions = ref<UserListItemDTO[]>([]);
const selectedUser = ref<UserListItemDTO | null>(null);
const isSearching = ref(false);
const showDropdown = ref(false);
const role = ref('');
const formError = ref<string | null>(null);

let searchTimer: ReturnType<typeof setTimeout> | null = null;

const roleOptions = Object.values(OrganizationRole).map((val) => ({
  value: val,
  label: t(`organizations.roles.${val}`),
}));

watch(searchQuery, (val) => {
  formError.value = null;
  if (!val.trim()) {
    suggestions.value = [];
    showDropdown.value = false;
    return;
  }
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(async () => {
    isSearching.value = true;
    try {
      const result = await useCases.listUsersUseCase.execute({ search: val, limit: 8 });
      suggestions.value = result.users;
      showDropdown.value = true;
    } finally {
      isSearching.value = false;
    }
  }, 300);
});

function selectUser(user: UserListItemDTO): void {
  selectedUser.value = user;
  searchQuery.value = '';
  showDropdown.value = false;
  formError.value = null;
}

function clearSelection(): void {
  selectedUser.value = null;
  searchQuery.value = '';
  suggestions.value = [];
  showDropdown.value = false;
}

function handleSubmit(): void {
  if (!selectedUser.value || !role.value) {
    formError.value = t('common.error') ?? 'User and role are required';
    return;
  }
  emit('submit', {
    userId: selectedUser.value.id,
    role: role.value,
  });
}

function resetForm(): void {
  searchQuery.value = '';
  selectedUser.value = null;
  role.value = '';
  formError.value = null;
  suggestions.value = [];
  showDropdown.value = false;
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
      <!-- User search -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ t('admin.users.search') }}
        </label>

        <!-- Selected user chip -->
        <div
          v-if="selectedUser"
          class="flex items-center gap-2 p-2 bg-primary-50 dark:bg-primary-900/20 rounded-md border border-primary-200 dark:border-primary-700"
          data-testid="selected-user-chip"
        >
          <span class="text-sm text-primary-800 dark:text-primary-300 flex-1">
            {{ selectedUser.firstName }} {{ selectedUser.lastName }}
            <span class="text-xs text-primary-500 dark:text-primary-400 ml-1">({{ selectedUser.email }})</span>
          </span>
          <button
            type="button"
            class="text-primary-500 hover:text-primary-700 dark:hover:text-primary-300 font-bold text-base leading-none"
            @click="clearSelection"
          >
            ×
          </button>
        </div>

        <!-- Search input + dropdown -->
        <div v-else class="relative">
          <input
            v-model="searchQuery"
            type="text"
            data-testid="member-userid-input"
            :placeholder="t('admin.users.search')"
            class="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <span
            v-if="isSearching"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"
          >...</span>

          <!-- Results dropdown -->
          <ul
            v-if="showDropdown && suggestions.length > 0"
            class="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 max-h-48 overflow-y-auto"
            data-testid="user-suggestions"
          >
            <li
              v-for="user in suggestions"
              :key="user.id"
              class="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              @click="selectUser(user)"
            >
              <span class="font-medium text-gray-900 dark:text-gray-100">{{ user.firstName }} {{ user.lastName }}</span>
              <span class="text-gray-500 dark:text-gray-400 ml-2 text-xs">{{ user.email }}</span>
            </li>
          </ul>

          <!-- No results -->
          <div
            v-else-if="showDropdown && !isSearching && suggestions.length === 0"
            class="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 rounded-md shadow border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm text-gray-500 dark:text-gray-400"
          >
            {{ t('common.noResults') }}
          </div>
        </div>
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
