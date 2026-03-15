<!--
  ============================================
  COMPONENT: PromoteUserModal
  ============================================

  Modal to search for a user and promote them to admin.
-->

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import BaseModal from '@presentation/components/ui/BaseModal.vue';
import BaseBadge from '@presentation/components/ui/BaseBadge.vue';
import ConfirmDialog from '@presentation/components/ui/ConfirmDialog.vue';
import { useAdminStore } from '@presentation/stores/admin.store.js';
import { ShieldCheckIcon } from '@heroicons/vue/24/outline';

interface Props {
  open: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  promoted: [];
}>();

const { t } = useI18n();
const adminStore = useAdminStore();

const searchQuery = ref('');
const promotingUserId = ref<string | null>(null);
const confirmingUserId = ref<string | null>(null);

const filteredUsers = computed(() => {
  const users = adminStore.usersList?.users ?? [];
  const term = searchQuery.value.trim().toLowerCase();
  if (!term) return users;
  return users.filter(
    (u) =>
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term)
  );
});

async function handlePromote(): Promise<void> {
  if (!confirmingUserId.value) return;
  promotingUserId.value = confirmingUserId.value;
  confirmingUserId.value = null;
  await adminStore.promoteUser(promotingUserId.value);
  promotingUserId.value = null;
  emit('promoted');
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      searchQuery.value = '';
      adminStore.fetchUsers({ limit: 500 });
    }
  },
);
</script>

<template>
  <BaseModal
    :open="open"
    :title="t('admin.users.promote')"
    size="2xl"
    @close="emit('close')"
  >
    <div data-testid="promote-user-modal" class="space-y-4">
      <!-- Search input -->
      <input
        v-model="searchQuery"
        type="text"
        data-testid="promote-search-input"
        :placeholder="t('admin.users.search')"
        class="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      />

      <!-- Loading -->
      <div v-if="adminStore.isLoading" class="text-center py-6 text-gray-500 text-sm">
        {{ t('common.loading') }}
      </div>

      <!-- Results table -->
      <div v-else-if="filteredUsers.length > 0" class="overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
        <div>
          <table class="w-full table-fixed divide-y divide-gray-200 dark:divide-gray-700">
            <colgroup>
              <col class="w-[22%]" />
              <col class="w-[42%]" />
              <col class="w-[22%]" />
              <col class="w-[14%]" />
            </colgroup>
            <thead class="bg-gray-50 dark:bg-gray-700 sticky top-0">
              <tr>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ t('common.name') }}
                </th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ t('common.role') }}
                </th>
                <th class="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ t('common.actions') }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
              <tr
                v-for="user in filteredUsers"
                :key="user.id"
                :data-testid="`user-row-${user.id}`"
                class="hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {{ user.firstName }} {{ user.lastName }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 truncate">
                  {{ user.email }}
                </td>
                <td class="px-4 py-3 text-sm">
                  <BaseBadge :variant="user.systemRole === 'user' ? 'neutral' : 'info'" size="sm">
                    {{ t(`roles.${user.systemRole}`) }}
                  </BaseBadge>
                </td>
                <td class="px-4 py-3 text-center">
                  <button
                    v-if="user.systemRole === 'user'"
                    :data-testid="`promote-btn-${user.id}`"
                    :disabled="promotingUserId === user.id"
                    :title="t('admin.users.promote')"
                    class="inline-flex items-center justify-center p-1.5 text-primary-600 hover:text-primary-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    @click="confirmingUserId = user.id"
                  >
                    <ShieldCheckIcon class="w-4 h-4" />
                  </button>
                  <span v-else class="inline-flex items-center justify-center p-1.5 text-gray-300 dark:text-gray-600 cursor-default" :title="t(`roles.${user.systemRole}`)">
                    <ShieldCheckIcon class="w-4 h-4" />
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Empty -->
      <div v-else data-testid="promote-no-results" class="text-center py-6 text-sm text-gray-500">
        {{ t('common.noResults') }}
      </div>

      <!-- Footer -->
      <div class="flex justify-end pt-2">
        <button
          type="button"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
          @click="emit('close')"
        >
          {{ t('common.cancel') }}
        </button>
      </div>
    </div>
  </BaseModal>

  <!-- Promote confirmation dialog -->
  <ConfirmDialog
    :open="confirmingUserId !== null"
    :title="t('admin.users.promote')"
    :message="t('admin.users.confirmPromote')"
    @confirm="handlePromote"
    @cancel="confirmingUserId = null"
  />
</template>
