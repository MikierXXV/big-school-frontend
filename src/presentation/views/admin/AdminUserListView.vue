<!--
  ============================================
  VIEW: Admin User List
  ============================================

  SuperAdmin view for listing all users with role filter, search, and pagination.
-->

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
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

async function loadUsers(search?: string): Promise<void> {
  await Promise.all([
    adminStore.fetchUsers({ limit: 500, ...(search ? { search } : {}) }),
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

let searchDebounce: ReturnType<typeof setTimeout> | null = null;

function handleSearchInput(): void {
  currentPage.value = 1;
  if (searchDebounce) clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => {
    loadUsers(searchText.value.trim() || undefined);
  }, 300);
}

function handleFilterChange(): void {
  currentPage.value = 1;
}

const filteredUsers = computed(() => {
  let users = adminStore.usersList?.users ?? [];
  if (filterRole.value) {
    users = users.filter((u) => u.systemRole === filterRole.value);
  }
  return users;
});

// When role filter is active, count client-side; otherwise use server total
const totalFiltered = computed(() =>
  filterRole.value ? filteredUsers.value.length : (adminStore.usersList?.total ?? filteredUsers.value.length)
);
const totalPages = computed(() => Math.max(1, Math.ceil(filteredUsers.value.length / PAGE_SIZE)));

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
                <div class="flex items-center gap-1.5">
                  {{ user.email }}
                  <!-- Google badge -->
                  <svg v-if="user.authProvider === 'google'" :title="'Google'" class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <!-- Microsoft badge -->
                  <svg v-else-if="user.authProvider === 'microsoft'" :title="'Microsoft'" class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1" y="1" width="10" height="10" fill="#F25022"/>
                    <rect x="13" y="1" width="10" height="10" fill="#7FBA00"/>
                    <rect x="1" y="13" width="10" height="10" fill="#00A4EF"/>
                    <rect x="13" y="13" width="10" height="10" fill="#FFB900"/>
                  </svg>
                </div>
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
        <div class="border-t border-gray-200 dark:border-gray-700">
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
