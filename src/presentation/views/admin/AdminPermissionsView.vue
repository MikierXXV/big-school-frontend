<!--
  ============================================
  VIEW: Admin Permissions
  ============================================

  SuperAdmin view for managing admin permissions with toggle switches.
-->

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import AdminLayout from '@presentation/components/layout/AdminLayout.vue';
import BaseToggleSwitch from '@presentation/components/ui/BaseToggleSwitch.vue';
import { useAdminStore } from '@presentation/stores/admin.store.js';
import { AdminPermission } from '@domain/value-objects/admin-permission.value-object.js';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const adminStore = useAdminStore();

const userId = route.params.userId as string;

const allPermissions = Object.values(AdminPermission);

const permissionStates = computed(() => {
  if (!adminStore.adminPermissions) return {};
  const granted = adminStore.adminPermissions.permissions.map((p) => p.permission);
  return Object.fromEntries(allPermissions.map((p) => [p, granted.includes(p)]));
});

function getGrantInfo(permission: string): { grantedBy: string; grantedAt: string } | null {
  if (!adminStore.adminPermissions) return null;
  const grant = adminStore.adminPermissions.permissions.find((p) => p.permission === permission);
  return grant ? { grantedBy: grant.grantedBy, grantedAt: grant.grantedAt } : null;
}

function resolveUserLabel(id: string): string {
  // Check paginated users list (UserListItemDTO uses .id)
  const user = adminStore.usersList?.users.find((u) => u.id === id);
  if (user) {
    const name = `${user.firstName} ${user.lastName}`.trim();
    return name || user.email;
  }
  // Fall back to admins list (AdminDTO uses .userId)
  const admin = adminStore.admins.find((a) => a.userId === id);
  if (admin) {
    const name = `${admin.firstName} ${admin.lastName}`.trim();
    return name || admin.email;
  }
  return id;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

async function handleToggle(permission: string, enabled: boolean): Promise<void> {
  if (enabled) {
    await adminStore.grantPermissions(userId, [permission]);
  } else {
    await adminStore.revokePermission(userId, permission);
  }
  await adminStore.fetchPermissions(userId);
}

onMounted(() => {
  adminStore.fetchPermissions(userId);
  adminStore.fetchUsers({ limit: 500 });
  adminStore.fetchAdmins();
});
</script>

<template>
  <AdminLayout>
    <div data-testid="admin-permissions-view">
      <!-- Back link -->
      <button
        data-testid="back-btn"
        class="mb-4 text-sm text-primary-600 dark:text-primary-400 hover:underline"
        @click="router.push('/admin/users')"
      >
        &larr; {{ t('common.back') || 'Back' }}
      </button>

      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        {{ t('admin.permissions.title') }}
      </h1>
      <p v-if="adminStore.adminPermissions" class="text-gray-600 dark:text-gray-400 mb-6">
        {{ t('common.user') || 'User' }}: {{ resolveUserLabel(adminStore.adminPermissions.userId) }}
      </p>

      <!-- Loading -->
      <div v-if="adminStore.isLoading && !adminStore.adminPermissions" data-testid="permissions-loading" class="text-center py-8 text-gray-500">
        {{ t('common.loading') || 'Loading...' }}
      </div>

      <!-- Permission cards -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="perm in allPermissions"
          :key="perm"
          :data-testid="`permission-card-${perm}`"
          class="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
        >
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {{ t(`permissions.${perm}`) }}
            </h3>
            <BaseToggleSwitch
              :model-value="permissionStates[perm] || false"
              :disabled="adminStore.isLoading"
              @update:model-value="(val: boolean) => handleToggle(perm, val)"
            />
          </div>
          <div v-if="getGrantInfo(perm)" class="text-xs text-gray-500 dark:text-gray-400">
            {{ t('admin.permissions.grant') }}: {{ resolveUserLabel(getGrantInfo(perm)!.grantedBy) }}
            · {{ formatDate(getGrantInfo(perm)!.grantedAt) }}
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>
