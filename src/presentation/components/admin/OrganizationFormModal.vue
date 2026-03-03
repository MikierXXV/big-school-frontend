<!--
  ============================================
  COMPONENT: OrganizationFormModal
  ============================================

  Modal form for creating or editing an organization.
-->

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import BaseModal from '@presentation/components/ui/BaseModal.vue';
import BaseSelect from '@presentation/components/ui/BaseSelect.vue';
import type { OrganizationDTO, CreateOrganizationDTO } from '@application/dtos/organization/organization.dto.js';
import { OrganizationType } from '@domain/value-objects/organization-type.value-object.js';

interface Props {
  open: boolean;
  organization?: OrganizationDTO | null;
}

const props = withDefaults(defineProps<Props>(), {
  organization: null,
});

const emit = defineEmits<{
  close: [];
  submit: [data: CreateOrganizationDTO];
}>();

const { t } = useI18n();

const isEditing = computed(() => !!props.organization);

const name = ref('');
const type = ref('');
const description = ref('');
const address = ref('');
const contactEmail = ref('');
const contactPhone = ref('');
const formError = ref<string | null>(null);

const typeOptions = Object.values(OrganizationType).map((val) => ({
  value: val,
  label: t(`organizations.types.${val}`),
}));

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen && props.organization) {
      name.value = props.organization.name;
      type.value = props.organization.type;
      description.value = props.organization.description;
      address.value = props.organization.address;
      contactEmail.value = props.organization.contactEmail;
      contactPhone.value = props.organization.contactPhone;
    } else if (isOpen) {
      name.value = '';
      type.value = '';
      description.value = '';
      address.value = '';
      contactEmail.value = '';
      contactPhone.value = '';
    }
    formError.value = null;
  },
);

function handleSubmit(): void {
  if (!name.value.trim() || !type.value) {
    formError.value = 'Name and type are required';
    return;
  }
  emit('submit', {
    name: name.value.trim(),
    type: type.value,
    description: description.value.trim(),
    address: address.value.trim(),
    contactEmail: contactEmail.value.trim(),
    contactPhone: contactPhone.value.trim(),
  });
}
</script>

<template>
  <BaseModal
    :open="open"
    :title="isEditing ? t('admin.organizations.edit') : t('admin.organizations.create')"
    size="lg"
    @close="emit('close')"
  >
    <form data-testid="org-form" class="space-y-4" @submit.prevent="handleSubmit">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('common.name') || 'Name' }}</label>
        <input
          v-model="name"
          type="text"
          data-testid="org-name-input"
          class="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <BaseSelect
        v-model="type"
        :options="typeOptions"
        :label="t('organizations.types.hospital').split(' ')[0] || 'Type'"
        :placeholder="t('common.select') || 'Select...'"
        data-testid="org-type-select"
      />

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('common.description') || 'Description' }}</label>
        <textarea
          v-model="description"
          data-testid="org-description-input"
          rows="3"
          class="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        ></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('common.address') || 'Address' }}</label>
        <input
          v-model="address"
          type="text"
          data-testid="org-address-input"
          class="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
          <input
            v-model="contactEmail"
            type="email"
            data-testid="org-email-input"
            class="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('common.phone') || 'Phone' }}</label>
          <input
            v-model="contactPhone"
            type="tel"
            data-testid="org-phone-input"
            class="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      <p v-if="formError" class="text-sm text-red-600">{{ formError }}</p>

      <div class="flex justify-end gap-3 pt-4">
        <button
          type="button"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
          @click="emit('close')"
        >
          {{ t('common.cancel') || 'Cancel' }}
        </button>
        <button
          type="submit"
          data-testid="org-submit-btn"
          class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
        >
          {{ isEditing ? t('common.edit') : t('common.create') }}
        </button>
      </div>
    </form>
  </BaseModal>
</template>
