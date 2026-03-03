<!--
  ============================================
  COMPONENT: PromoteUserModal
  ============================================

  Modal to search for a user and promote them to admin.
-->

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import BaseModal from '@presentation/components/ui/BaseModal.vue';
import BaseBadge from '@presentation/components/ui/BaseBadge.vue';
import { useAdminStore } from '@presentation/stores/admin.store.js';

interface Props {
  open: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  close: [];
  promoted: [];
}>();

const { t } = useI18n();
const adminStore = useAdminStore();

const searchQuery = ref('');
const isSearching = ref(false);
const promotingUserId = ref<string | null>(null);

async function handleSearch(): Promise<void> {
  if (!searchQuery.value.trim()) return;
  isSearching.value = true;
  await adminStore.fetchUsers({ search: searchQuery.value.trim(), page: 1, limit: 10 });
  isSearching.value = false;
}

async function handlePromote(userId: string): Promise<void> {
  promotingUserId.value = userId;
  await adminStore.promoteUser(userId);
  promotingUserId.value = null;
  emit('promoted');
}

watch(
  () => open,
  (isOpen) => {
    if (isOpen) {
      searchQuery.value = '';
    }
  },
);
</script>

<template>
  <BaseModal
    :open="open"
    :title="t('admin.users.promote')"
    size="lg"
    @close="emit('close')"
  >
    <div data-testid="promote-user-modal" class="space-y-4">
      <!-- Search -->
      <form class="flex gap-2" @submit.prevent="handleSearch">
        <input
          v-model="searchQuery"
          type="text"
          data-testid="promote-search-input"
          :placeholder="t('admin.users.search')"
          class="flex-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
        <button
          type="submit"
          data-testid="promote-search-btn"
          class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
        >
          {{ t('common.search') }}
        </button>
      </form>

      <!-- Loading -->
      <div v-if="isSearching" class="text-center py-4 text-gray-500">
        {{ t('common.loading') || 'Loading...' }}
      </div>

      <!-- Results -->
      <div v-else-if="adminStore.usersList && adminStore.usersList.users.length > 0">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                {{ t('common.name') || 'Name' }}
              </th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Email
              </th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                {{ t('common.role') || 'Role' }}
              </th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                {{ t('common.actions') }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="user in adminStore.usersList.users"
              :key="user.id"
              :data-testid="`user-row-${user.id}`"
            >
              <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                {{ user.fullName }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                {{ user.email }}
              </td>
              <td class="px-4 py-3 text-sm">
                <BaseBadge :variant="user.systemRole === 'user' ? 'neutral' : 'info'" size="sm">
                  {{ t(`roles.${user.systemRole}`) }}
                </BaseBadge>
              </td>
              <td class="px-4 py-3 text-sm">
                <button
                  v-if="user.systemRole === 'user'"
                  :data-testid="`promote-btn-${user.id}`"
                  :disabled="promotingUserId === user.id"
                  class="text-primary-600 hover:text-primary-800 text-sm font-medium disabled:opacity-50"
                  @click="handlePromote(user.id)"
                >
                  {{ t('admin.users.promote') }}
                </button>
                <span v-else class="text-sm text-gray-400">{{ t('roles.admin') }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty -->
      <div v-else-if="adminStore.usersList" data-testid="promote-no-results" class="text-center py-4 text-gray-500">
        {{ t('common.noResults') }}
      </div>

      <!-- Cancel -->
      <div class="flex justify-end pt-4">
        <button
          type="button"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
          @click="emit('close')"
        >
          {{ t('common.cancel') || 'Cancel' }}
        </button>
      </div>
    </div>
  </BaseModal>
</template>
