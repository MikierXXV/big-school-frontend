<!--
  ============================================
  VIEW: Organization Detail
  ============================================

  Admin view showing organization info and member management.
-->

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import AdminLayout from '@presentation/components/layout/AdminLayout.vue';
import BaseBadge from '@presentation/components/ui/BaseBadge.vue';
import BaseSelect from '@presentation/components/ui/BaseSelect.vue';
import ConfirmDialog from '@presentation/components/ui/ConfirmDialog.vue';
import OrganizationFormModal from '@presentation/components/admin/OrganizationFormModal.vue';
import AssignMemberModal from '@presentation/components/admin/AssignMemberModal.vue';
import { useOrganizationStore } from '@presentation/stores/organization.store.js';
import { useRBAC } from '@presentation/composables/useRBAC.js';
import { OrganizationRole } from '@domain/value-objects/organization-role.value-object.js';
import type { AssignMemberDTO, ChangeMemberRoleDTO } from '@application/dtos/organization/membership.dto.js';
import type { CreateOrganizationDTO } from '@application/dtos/organization/organization.dto.js';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const orgStore = useOrganizationStore();
const { isSuperAdmin } = useRBAC();

const orgId = route.params.id as string;

const showEditModal = ref(false);
const showDeleteConfirm = ref(false);
const showAssignModal = ref(false);
const removingMemberId = ref<string | null>(null);

const roleOptions = Object.values(OrganizationRole).map((val) => ({
  value: val,
  label: t(`organizations.roles.${val}`),
}));

async function handleEdit(data: CreateOrganizationDTO): Promise<void> {
  await orgStore.updateOrganization(orgId, data);
  showEditModal.value = false;
}

async function handleDelete(): Promise<void> {
  await orgStore.deleteOrganization(orgId);
  showDeleteConfirm.value = false;
  router.push('/admin/organizations');
}

async function handleAssign(data: AssignMemberDTO): Promise<void> {
  await orgStore.assignMember(orgId, data);
  showAssignModal.value = false;
}

async function handleRoleChange(userId: string, newRole: string): Promise<void> {
  const data: ChangeMemberRoleDTO = { role: newRole };
  await orgStore.changeMemberRole(orgId, userId, data);
}

async function handleRemoveMember(): Promise<void> {
  if (!removingMemberId.value) return;
  await orgStore.removeMember(orgId, removingMemberId.value);
  removingMemberId.value = null;
}

onMounted(async () => {
  await orgStore.fetchOrganization(orgId);
  await orgStore.fetchMembers(orgId);
});
</script>

<template>
  <AdminLayout>
    <div data-testid="org-detail-view">
      <!-- Back link -->
      <button
        data-testid="back-btn"
        class="mb-4 text-sm text-primary-600 dark:text-primary-400 hover:underline"
        @click="router.push('/admin/organizations')"
      >
        &larr; {{ t('common.back') || 'Back' }}
      </button>

      <!-- Loading -->
      <div v-if="orgStore.isLoading && !orgStore.currentOrganization" data-testid="detail-loading" class="text-center py-8 text-gray-500">
        {{ t('common.loading') || 'Loading...' }}
      </div>

      <!-- Organization Info -->
      <template v-else-if="orgStore.currentOrganization">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <div class="flex items-center justify-between mb-4">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {{ orgStore.currentOrganization.name }}
            </h1>
            <div class="flex gap-2">
              <button
                data-testid="edit-org-btn"
                class="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                @click="showEditModal = true"
              >
                {{ t('common.edit') }}
              </button>
              <button
                v-if="isSuperAdmin"
                data-testid="delete-org-btn"
                class="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                @click="showDeleteConfirm = true"
              >
                {{ t('common.delete') }}
              </button>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-500 dark:text-gray-400">{{ t('common.type') || 'Type' }}:</span>
              <BaseBadge variant="info" size="sm" class="ml-2">
                {{ t(`organizations.types.${orgStore.currentOrganization.type}`) }}
              </BaseBadge>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400">{{ t('common.status') || 'Status' }}:</span>
              <BaseBadge :variant="orgStore.currentOrganization.active ? 'success' : 'neutral'" size="sm" class="ml-2">
                {{ orgStore.currentOrganization.active ? t('common.active') : t('common.inactive') }}
              </BaseBadge>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400">Email:</span>
              <span class="ml-2 text-gray-900 dark:text-gray-100">{{ orgStore.currentOrganization.contactEmail }}</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400">{{ t('common.phone') || 'Phone' }}:</span>
              <span class="ml-2 text-gray-900 dark:text-gray-100">{{ orgStore.currentOrganization.contactPhone }}</span>
            </div>
            <div class="col-span-2">
              <span class="text-gray-500 dark:text-gray-400">{{ t('common.address') || 'Address' }}:</span>
              <span class="ml-2 text-gray-900 dark:text-gray-100">{{ orgStore.currentOrganization.address }}</span>
            </div>
            <div class="col-span-2">
              <span class="text-gray-500 dark:text-gray-400">{{ t('common.description') || 'Description' }}:</span>
              <p class="mt-1 text-gray-900 dark:text-gray-100">{{ orgStore.currentOrganization.description }}</p>
            </div>
          </div>
        </div>

        <!-- Members section -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {{ t('admin.members.title') }}
            </h2>
            <button
              data-testid="assign-member-btn"
              class="px-3 py-1.5 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
              @click="showAssignModal = true"
            >
              {{ t('admin.members.assign') }}
            </button>
          </div>

          <div v-if="orgStore.members.length > 0">
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
                    {{ t('admin.members.changeRole') || 'Role' }}
                  </th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    {{ t('common.actions') }}
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr
                  v-for="member in orgStore.members"
                  :key="member.userId"
                  :data-testid="`member-row-${member.userId}`"
                >
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                    {{ member.firstName }} {{ member.lastName }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    {{ member.email }}
                  </td>
                  <td class="px-4 py-3 text-sm">
                    <BaseSelect
                      :model-value="member.role"
                      :options="roleOptions"
                      @update:model-value="(val: string) => handleRoleChange(member.userId, val)"
                    />
                  </td>
                  <td class="px-4 py-3 text-sm">
                    <button
                      :data-testid="`remove-member-${member.userId}`"
                      class="text-red-600 hover:text-red-800 text-sm font-medium"
                      @click="removingMemberId = member.userId"
                    >
                      {{ t('admin.members.remove') }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else data-testid="no-members" class="text-center py-4 text-gray-500">
            {{ t('common.noResults') }}
          </div>
        </div>
      </template>

      <!-- Edit Modal -->
      <OrganizationFormModal
        :open="showEditModal"
        :organization="orgStore.currentOrganization"
        @close="showEditModal = false"
        @submit="handleEdit"
      />

      <!-- Delete Confirm -->
      <ConfirmDialog
        :open="showDeleteConfirm"
        :title="t('admin.organizations.delete')"
        :message="t('admin.organizations.confirmDelete')"
        confirm-variant="danger"
        @confirm="handleDelete"
        @cancel="showDeleteConfirm = false"
      />

      <!-- Assign Member Modal -->
      <AssignMemberModal
        :open="showAssignModal"
        @close="showAssignModal = false"
        @submit="handleAssign"
      />

      <!-- Remove Member Confirm -->
      <ConfirmDialog
        :open="removingMemberId !== null"
        :title="t('admin.members.remove')"
        :message="t('admin.members.confirmRemove')"
        confirm-variant="danger"
        @confirm="handleRemoveMember"
        @cancel="removingMemberId = null"
      />
    </div>
  </AdminLayout>
</template>
