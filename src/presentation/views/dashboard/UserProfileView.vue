<!--
  ============================================
  VIEW: UserProfile
  ============================================

  Read-only profile page showing user info from the auth store.
-->

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { DashboardLayout } from '@presentation/components/layout/index.js';
import BaseBadge from '@presentation/components/ui/BaseBadge.vue';
import { useAuth } from '@presentation/composables/useAuth.js';

const { t } = useI18n();
const { user } = useAuth();

const initials = computed(() => {
  if (!user.value) return 'U';
  return `${(user.value.firstName || '').charAt(0)}${(user.value.lastName || '').charAt(0)}`.toUpperCase() || 'U';
});

const roleBadgeVariant = computed(() => {
  if (!user.value) return 'neutral' as const;
  if (user.value.systemRole === 'super_admin') return 'warning' as const;
  if (user.value.systemRole === 'admin') return 'info' as const;
  return 'neutral' as const;
});

const statusBadgeVariant = computed(() => {
  if (user.value?.status === 'ACTIVE') return 'success' as const;
  return 'neutral' as const;
});
</script>

<template>
  <DashboardLayout>
    <div class="max-w-2xl">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        {{ t('profile.title') }}
      </h1>

      <div v-if="user" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <!-- Avatar + name row -->
        <div class="flex items-center gap-5 mb-6">
          <div class="w-16 h-16 rounded-full bg-primary-600 dark:bg-primary-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            {{ initials }}
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ user.firstName }} {{ user.lastName }}
            </h2>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-sm text-gray-500 dark:text-gray-400">{{ user.email }}</span>
              <!-- email verified indicator -->
              <span
                v-if="user.emailVerified"
                class="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400"
                :title="t('profile.emailVerified')"
              >
                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                {{ t('profile.emailVerified') }}
              </span>
              <span
                v-else
                class="inline-flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500"
              >
                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
                {{ t('profile.emailNotVerified') }}
              </span>
            </div>
          </div>
        </div>

        <!-- Role + Status badges -->
        <div class="flex items-center gap-3">
          <BaseBadge :variant="roleBadgeVariant">
            {{ t(`roles.${user.systemRole}`) }}
          </BaseBadge>
          <BaseBadge :variant="statusBadgeVariant" size="sm">
            {{ user.status === 'ACTIVE' ? t('common.active') : t('common.inactive') }}
          </BaseBadge>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>
