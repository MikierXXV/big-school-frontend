/**
 * ============================================
 * TEST: OrganizationFormModal Component
 * ============================================
 */

import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import OrganizationFormModal from '@presentation/components/admin/OrganizationFormModal.vue';

vi.mock('@presentation/components/ui/BaseModal.vue', () => ({
  default: {
    template: '<div data-testid="base-modal"><slot /></div>',
    props: ['open', 'title', 'size'],
  },
}));

vi.mock('@presentation/components/ui/BaseSelect.vue', () => ({
  default: {
    template: '<select data-testid="base-select" :value="modelValue" @change="$emit(\'update:modelValue\', $event.target.value)"><option v-for="o in options" :key="o.value" :value="o.value">{{ o.label }}</option></select>',
    props: ['modelValue', 'options', 'label', 'placeholder'],
    emits: ['update:modelValue'],
  },
}));

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      admin: {
        organizations: { create: 'Create Organization', edit: 'Edit Organization' },
      },
      organizations: {
        types: {
          hospital: 'Hospital',
          clinic: 'Clinic',
          health_center: 'Health Center',
          laboratory: 'Laboratory',
          pharmacy: 'Pharmacy',
          other: 'Other',
        },
      },
      common: {
        name: 'Name',
        description: 'Description',
        address: 'Address',
        phone: 'Phone',
        cancel: 'Cancel',
        create: 'Create',
        edit: 'Edit',
        select: 'Select...',
      },
    },
  },
});

function mountModal(props: Record<string, any> = {}) {
  return mount(OrganizationFormModal, {
    props: { open: true, ...props },
    global: { plugins: [i18n] },
  });
}

describe('OrganizationFormModal', () => {
  it('should render the form', () => {
    const wrapper = mountModal();
    expect(wrapper.find('[data-testid="org-form"]').exists()).toBe(true);
  });

  it('should render name input', () => {
    const wrapper = mountModal();
    expect(wrapper.find('[data-testid="org-name-input"]').exists()).toBe(true);
  });

  it('should render submit button with Create text when no organization', () => {
    const wrapper = mountModal();
    expect(wrapper.find('[data-testid="org-submit-btn"]').text()).toBe('Create');
  });

  it('should render submit button with Edit text when organization provided', () => {
    const wrapper = mountModal({
      organization: {
        id: 'org-1',
        name: 'Hospital',
        type: 'hospital',
        description: 'Desc',
        address: 'Addr',
        contactEmail: 'e@e.com',
        contactPhone: '555',
        active: true,
        createdAt: '',
        updatedAt: '',
      },
    });
    expect(wrapper.find('[data-testid="org-submit-btn"]').text()).toBe('Edit');
  });

  it('should show validation error when submitting empty form', async () => {
    const wrapper = mountModal();
    await wrapper.find('[data-testid="org-form"]').trigger('submit');
    expect(wrapper.text()).toContain('Name and type are required');
  });

  it('should emit submit with form data', async () => {
    const wrapper = mountModal();

    await wrapper.find('[data-testid="org-name-input"]').setValue('Test Hospital');
    // Set type via the select element
    const select = wrapper.find('select');
    await select.setValue('hospital');

    await wrapper.find('[data-testid="org-form"]').trigger('submit');

    const emitted = wrapper.emitted('submit');
    expect(emitted).toBeTruthy();
    expect(emitted![0][0]).toMatchObject({ name: 'Test Hospital', type: 'hospital' });
  });

  it('should emit close when cancel button is clicked', async () => {
    const wrapper = mountModal();
    const buttons = wrapper.findAll('button');
    const cancelBtn = buttons.find((b) => b.text() === 'Cancel');
    await cancelBtn!.trigger('click');
    expect(wrapper.emitted('close')).toBeTruthy();
  });

  it('should render email and phone inputs', () => {
    const wrapper = mountModal();
    expect(wrapper.find('[data-testid="org-email-input"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="org-phone-input"]').exists()).toBe(true);
  });

  it('should render description textarea', () => {
    const wrapper = mountModal();
    expect(wrapper.find('[data-testid="org-description-input"]').exists()).toBe(true);
  });

  it('should render address input', () => {
    const wrapper = mountModal();
    expect(wrapper.find('[data-testid="org-address-input"]').exists()).toBe(true);
  });
});
