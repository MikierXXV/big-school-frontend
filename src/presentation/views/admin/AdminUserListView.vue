<!--
  ============================================
  VIEW: Admin User List
  ============================================

  SuperAdmin view for listing admins, promoting/demoting users.
-->

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import AdminLayout from '@presentation/components/layout/AdminLayout.vue';
import BaseBadge from '@presentation/components/ui/BaseBadge.vue';
import ConfirmDialog from '@presentation/components/ui/ConfirmDialog.vue';
import PromoteUserModal from '@presentation/components/admin/PromoteUserModal.vue';
import { useAdminStore } from '@presentation/stores/admin.store.js';

const { t } = useI18n();
const router = useRouter();
const adminStore = useAdminStore();

const showPromoteModal = ref(false);
const demotingUserId = ref<string | null>(null);

async function handleDemote(): Promise<void> {
  if (!demotingUserId.value) return;
  await adminStore.demoteUser(demotingUserId.value);
  demotingUserId.value = null;
}

function handlePromoted(): void {
  showPromoteModal.value = false;
  adminStore.fetchAdmins();
}

function goToPermissions(userId: string): void {
  router.push(`/admin/users/${userId}/permissions`);
}

onMounted(() => {
  adminStore.fetchAdmins();
});
</script>

<template>
  <AdminLayout>
    <div data-testid="admin-user-list">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {{ t('admin.users.title') }}
        </h1>
        <button
          data-testid="promote-user-btn"
          class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
          @click="showPromoteModal = true"
        >
          {{ t('admin.users.promote') }}
        </button>
      </div>

      <!-- Loading -->
      <div v-if="adminStore.isLoading && adminStore.admins.length === 0" data-testid="admins-loading" class="text-center py-8 text-gray-500">
        {{ t('common.loading') || 'Loading...' }}
      </div>

      <!-- Error -->
      <div v-else-if="adminStore.error" data-testid="admins-error" class="text-center py-8 text-red-600">
        {{ adminStore.error }}
      </div>

      <!-- Admin table -->
      <div v-else-if="adminStore.admins.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('common.name') || 'Name' }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Email
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('common.role') || 'Role' }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('admin.permissions.title') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('common.actions') }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="admin in adminStore.admins"
              :key="admin.userId"
              :data-testid="`admin-row-${admin.userId}`"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ admin.firstName }} {{ admin.lastName }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ admin.email }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <BaseBadge :variant="admin.systemRole === 'super_admin' ? 'warning' : 'info'" size="sm">
                  {{ t(`roles.${admin.systemRole}`) }}
                </BaseBadge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div class="flex gap-1 flex-wrap">
                  <BaseBadge
                    v-for="perm in admin.permissions"
                    :key="perm"
                    variant="neutral"
                    size="sm"
                  >
                    {{ t(`permissions.${perm}`) }}
                  </BaseBadge>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                <button
                  :data-testid="`permissions-btn-${admin.userId}`"
                  class="text-primary-600 hover:text-primary-800 text-sm font-medium"
                  @click="goToPermissions(admin.userId)"
                >
                  {{ t('admin.permissions.title') }}
                </button>
                <button
                  v-if="admin.systemRole !== 'super_admin'"
                  :data-testid="`demote-btn-${admin.userId}`"
                  class="text-red-600 hover:text-red-800 text-sm font-medium"
                  @click="demotingUserId = admin.userId"
                >
                  {{ t('admin.users.demote') }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty -->
      <div v-else data-testid="admins-empty" class="text-center py-8 text-gray-500">
        {{ t('common.noResults') }}
      </div>

      <!-- Promote Modal -->
      <PromoteUserModal
        :open="showPromoteModal"
        @close="showPromoteModal = false"
        @promoted="handlePromoted"
      />

      <!-- Demote Confirm -->
      <ConfirmDialog
        :open="demotingUserId !== null"
        :title="t('admin.users.demote')"
        :message="t('admin.users.confirmDemote')"
        confirm-variant="danger"
        @confirm="handleDemote"
        @cancel="demotingUserId = null"
      />
    </div>
  </AdminLayout>
</template>
