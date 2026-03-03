<!--
  ============================================
  COMPONENT: OrganizationCard
  ============================================

  Reusable card to display a user's organization membership.
-->

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import BaseBadge from '@presentation/components/ui/BaseBadge.vue';
import type { UserOrganizationDTO } from '@application/dtos/organization/membership.dto.js';

interface Props {
  membership: UserOrganizationDTO;
}

defineProps<Props>();

const { t } = useI18n();
</script>

<template>
  <div
    :data-testid="`org-card-${membership.organizationId}`"
    class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-md transition-shadow"
  >
    <h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">
      {{ membership.organizationName }}
    </h3>
    <div class="flex gap-2 mb-2">
      <BaseBadge variant="info" size="sm">
        {{ t(`organizations.types.${membership.organizationType}`) }}
      </BaseBadge>
      <BaseBadge variant="success" size="sm">
        {{ t(`organizations.roles.${membership.role}`) }}
      </BaseBadge>
    </div>
    <p class="text-xs text-gray-500 dark:text-gray-400">
      {{ membership.joinedAt }}
    </p>
  </div>
</template>
