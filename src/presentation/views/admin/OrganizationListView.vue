<!--
  ============================================
  VIEW: Organization List
  ============================================

  Admin view for listing, filtering and creating organizations.
-->

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import AdminLayout from '@presentation/components/layout/AdminLayout.vue';
import BasePagination from '@presentation/components/ui/BasePagination.vue';
import BaseSelect from '@presentation/components/ui/BaseSelect.vue';
import BaseBadge from '@presentation/components/ui/BaseBadge.vue';
import OrganizationFormModal from '@presentation/components/admin/OrganizationFormModal.vue';
import { useOrganizationStore } from '@presentation/stores/organization.store.js';
import { useRBAC } from '@presentation/composables/useRBAC.js';
import { OrganizationType } from '@domain/value-objects/organization-type.value-object.js';
import type { CreateOrganizationDTO } from '@application/dtos/organization/organization.dto.js';

const { t } = useI18n();
const router = useRouter();
const orgStore = useOrganizationStore();
const { isSuperAdmin } = useRBAC();

const filterType = ref('');
const showCreateModal = ref(false);

const typeOptions = [
  { value: '', label: t('common.all') || 'All' },
  ...Object.values(OrganizationType).map((val) => ({
    value: val,
    label: t(`organizations.types.${val}`),
  })),
];

function badgeVariant(active: boolean): 'success' | 'neutral' {
  return active ? 'success' : 'neutral';
}

async function loadOrganizations(page = 1): Promise<void> {
  const query: Record<string, any> = { page, limit: 20 };
  if (filterType.value) query.type = filterType.value;
  await orgStore.fetchOrganizations(query);
}

function handlePageChange(page: number): void {
  loadOrganizations(page);
}

function handleFilterChange(): void {
  loadOrganizations(1);
}

function goToDetail(id: string): void {
  router.push(`/admin/organizations/${id}`);
}

async function handleCreate(data: CreateOrganizationDTO): Promise<void> {
  await orgStore.createOrganization(data);
  showCreateModal.value = false;
  await loadOrganizations(1);
}

onMounted(() => {
  loadOrganizations();
});
</script>

<template>
  <AdminLayout>
    <div data-testid="org-list-view">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {{ t('admin.organizations.title') }}
        </h1>
        <button
          v-if="isSuperAdmin"
          data-testid="create-org-btn"
          class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
          @click="showCreateModal = true"
        >
          {{ t('admin.organizations.create') }}
        </button>
      </div>

      <!-- Filters -->
      <div class="mb-4 flex gap-4">
        <BaseSelect
          v-model="filterType"
          :options="typeOptions"
          :label="t('common.filter') || 'Filter by type'"
          data-testid="filter-type"
          @update:model-value="handleFilterChange"
        />
      </div>

      <!-- Loading -->
      <div v-if="orgStore.isLoading" data-testid="org-loading" class="text-center py-8 text-gray-500">
        {{ t('common.loading') || 'Loading...' }}
      </div>

      <!-- Error -->
      <div v-else-if="orgStore.error" data-testid="org-error" class="text-center py-8 text-red-600">
        {{ orgStore.error }}
      </div>

      <!-- Table -->
      <div v-else-if="orgStore.organizations.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('common.name') || 'Name' }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('common.type') || 'Type' }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('common.status') || 'Status' }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Email
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="org in orgStore.organizations"
              :key="org.id"
              :data-testid="`org-row-${org.id}`"
              class="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              @click="goToDetail(org.id)"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ org.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <BaseBadge variant="info" size="sm">{{ t(`organizations.types.${org.type}`) }}</BaseBadge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <BaseBadge :variant="badgeVariant(org.active)" size="sm">
                  {{ org.active ? t('common.active') : t('common.inactive') }}
                </BaseBadge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ org.contactEmail }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div class="px-6 py-3 border-t border-gray-200 dark:border-gray-700">
          <BasePagination
            :page="orgStore.pagination.page"
            :total-pages="orgStore.pagination.totalPages"
            :total="orgStore.pagination.total"
            :limit="orgStore.pagination.limit"
            @page-change="handlePageChange"
          />
        </div>
      </div>

      <!-- Empty state -->
      <div v-else data-testid="org-empty" class="text-center py-8 text-gray-500">
        {{ t('common.noResults') }}
      </div>

      <!-- Create Modal -->
      <OrganizationFormModal
        :open="showCreateModal"
        @close="showCreateModal = false"
        @submit="handleCreate"
      />
    </div>
  </AdminLayout>
</template>
