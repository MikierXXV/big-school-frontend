<!--
  ============================================
  VIEW: Admin User List
  ============================================

  SuperAdmin view for listing all users with role filter, search, and pagination.
-->

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import AdminLayout from '@presentation/components/layout/AdminLayout.vue';
import BaseBadge from '@presentation/components/ui/BaseBadge.vue';
import BasePagination from '@presentation/components/ui/BasePagination.vue';
import BaseSelect from '@presentation/components/ui/BaseSelect.vue';
import ConfirmDialog from '@presentation/components/ui/ConfirmDialog.vue';
import PromoteUserModal from '@presentation/components/admin/PromoteUserModal.vue';
import { useAdminStore } from '@presentation/stores/admin.store.js';
import { ShieldCheckIcon, KeyIcon, UserMinusIcon } from '@heroicons/vue/24/outline';

const { t } = useI18n();
const router = useRouter();
const adminStore = useAdminStore();

const PAGE_SIZE = 20;

const filterRole = ref('');
const searchText = ref('');
const currentPage = ref(1);
const showPromoteModal = ref(false);
const demotingUserId = ref<string | null>(null);

const roleOptions = [
  { value: '', label: t('common.all') },
  { value: 'user', label: t('roles.user') },
  { value: 'admin', label: t('roles.admin') },
  { value: 'super_admin', label: t('roles.super_admin') },
];

async function loadUsers(): Promise<void> {
  await Promise.all([
    adminStore.fetchUsers({ limit: 500 }),
    adminStore.fetchAdmins(),
  ]);
  currentPage.value = 1;
}

function getUserPermissions(userId: string): string[] {
  return adminStore.admins.find((a) => a.userId === userId)?.permissions ?? [];
}

const PERMISSION_LABELS: Record<string, string> = {
  manage_users: 'Usr',
  manage_organizations: 'Org',
  assign_members: 'Mbr',
  view_all_data: 'All',
};

function handleSearchInput(): void {
  currentPage.value = 1;
}

function handleFilterChange(): void {
  currentPage.value = 1;
}

const filteredUsers = computed(() => {
  let users = adminStore.usersList?.users ?? [];
  if (filterRole.value) {
    users = users.filter((u) => u.systemRole === filterRole.value);
  }
  if (searchText.value.trim()) {
    const term = searchText.value.trim().toLowerCase();
    users = users.filter(
      (u) =>
        u.firstName.toLowerCase().includes(term) ||
        u.lastName.toLowerCase().includes(term) ||
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term)
    );
  }
  return users;
});

const totalFiltered = computed(() => filteredUsers.value.length);
const totalPages = computed(() => Math.max(1, Math.ceil(totalFiltered.value / PAGE_SIZE)));

const pagedUsers = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE;
  return filteredUsers.value.slice(start, start + PAGE_SIZE);
});

function handlePageChange(page: number): void {
  currentPage.value = page;
}

async function handleDemote(): Promise<void> {
  if (!demotingUserId.value) return;
  await adminStore.demoteUser(demotingUserId.value);
  demotingUserId.value = null;
  await loadUsers();
}

async function handlePromoted(): Promise<void> {
  showPromoteModal.value = false;
  await loadUsers();
}

function goToPermissions(userId: string): void {
  router.push(`/admin/users/${userId}/permissions`);
}

function roleBadgeVariant(role: string): 'warning' | 'info' | 'neutral' {
  if (role === 'super_admin') return 'warning';
  if (role === 'admin') return 'info';
  return 'neutral';
}

onMounted(() => {
  loadUsers();
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
          class="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
          @click="showPromoteModal = true"
        >
          <ShieldCheckIcon class="w-4 h-4" />
          {{ t('admin.users.promote') }}
        </button>
      </div>

      <!-- Filters -->
      <div class="mb-4 flex gap-4 items-end">
        <BaseSelect
          v-model="filterRole"
          :options="roleOptions"
          :label="t('common.role')"
          data-testid="filter-role"
          @update:model-value="handleFilterChange"
        />
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ t('admin.users.search') }}
          </label>
          <input
            v-model="searchText"
            type="text"
            data-testid="search-user-input"
            :placeholder="t('admin.users.search')"
            class="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            @input="handleSearchInput"
          />
        </div>
      </div>

      <!-- Loading -->
      <div v-if="adminStore.isLoading" data-testid="users-loading" class="text-center py-8 text-gray-500">
        {{ t('common.loading') }}
      </div>

      <!-- Error -->
      <div v-else-if="adminStore.error" data-testid="users-error" class="text-center py-8 text-red-600">
        {{ adminStore.error }}
      </div>

      <!-- User table -->
      <div v-else-if="pagedUsers.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('common.name') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Email
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('common.role') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('admin.permissions.title') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('common.status') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('common.actions') }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="user in pagedUsers"
              :key="user.id"
              :data-testid="`user-row-${user.id}`"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ user.firstName }} {{ user.lastName }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ user.email }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <BaseBadge :variant="roleBadgeVariant(user.systemRole)" size="sm">
                  {{ t(`roles.${user.systemRole}`) }}
                </BaseBadge>
              </td>
              <td class="px-6 py-4 text-sm">
                <div v-if="user.systemRole !== 'user'" class="flex flex-wrap gap-1">
                  <span
                    v-for="perm in getUserPermissions(user.id)"
                    :key="perm"
                    :title="t(`permissions.${perm}`)"
                    class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300"
                  >
                    {{ PERMISSION_LABELS[perm] ?? perm }}
                  </span>
                  <span
                    v-if="getUserPermissions(user.id).length === 0"
                    class="text-xs text-gray-400 dark:text-gray-500"
                  >—</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <BaseBadge :variant="user.status === 'ACTIVE' ? 'success' : 'neutral'" size="sm">
                  {{ user.status === 'ACTIVE' ? t('common.active') : t('common.inactive') }}
                </BaseBadge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                <button
                  v-if="user.systemRole !== 'user'"
                  :data-testid="`permissions-btn-${user.id}`"
                  :title="t('admin.permissions.title')"
                  class="p-1.5 text-primary-600 hover:text-primary-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded"
                  @click="goToPermissions(user.id)"
                >
                  <KeyIcon class="w-4 h-4" />
                </button>
                <button
                  v-if="user.systemRole === 'admin'"
                  :data-testid="`demote-btn-${user.id}`"
                  :title="t('admin.users.demote')"
                  class="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                  @click="demotingUserId = user.id"
                >
                  <UserMinusIcon class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div class="px-6 py-3 border-t border-gray-200 dark:border-gray-700">
          <BasePagination
            :page="currentPage"
            :total-pages="totalPages"
            :total="totalFiltered"
            :limit="PAGE_SIZE"
            @page-change="handlePageChange"
          />
        </div>
      </div>

      <!-- Empty -->
      <div v-else data-testid="users-empty" class="text-center py-8 text-gray-500">
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
