/**
 * ============================================
 * TEST: AssignMemberModal Component
 * ============================================
 */

import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import AssignMemberModal from '@presentation/components/admin/AssignMemberModal.vue';

vi.mock('@presentation/components/ui/BaseModal.vue', () => ({
  default: {
    template: '<div data-testid="base-modal"><slot /></div>',
    props: ['open', 'title', 'size'],
  },
}));

vi.mock('@presentation/components/ui/BaseSelect.vue', () => ({
  default: {
    template: '<select data-testid="role-select" :value="modelValue" @change="$emit(\'update:modelValue\', $event.target.value)"><option v-for="o in options" :key="o.value" :value="o.value">{{ o.label }}</option></select>',
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
        members: { assign: 'Assign Member', changeRole: 'Role' },
        users: { search: 'Search users...' },
      },
      organizations: {
        roles: {
          org_admin: 'Administrator',
          doctor: 'Doctor',
          nurse: 'Nurse',
          specialist: 'Specialist',
          staff: 'Staff',
          guest: 'Guest',
        },
      },
      common: { cancel: 'Cancel', select: 'Select...' },
    },
  },
});

function mountModal(props: Record<string, any> = {}) {
  return mount(AssignMemberModal, {
    props: { open: true, ...props },
    global: { plugins: [i18n] },
  });
}

describe('AssignMemberModal', () => {
  it('should render the form', () => {
    const wrapper = mountModal();
    expect(wrapper.find('[data-testid="assign-member-form"]').exists()).toBe(true);
  });

  it('should render user ID input', () => {
    const wrapper = mountModal();
    expect(wrapper.find('[data-testid="member-userid-input"]').exists()).toBe(true);
  });

  it('should render role select', () => {
    const wrapper = mountModal();
    expect(wrapper.find('select').exists()).toBe(true);
  });

  it('should show error when submitting empty form', async () => {
    const wrapper = mountModal();
    await wrapper.find('[data-testid="assign-member-form"]').trigger('submit');
    expect(wrapper.find('[data-testid="assign-error"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('User ID and role are required');
  });

  it('should emit submit with form data', async () => {
    const wrapper = mountModal();

    await wrapper.find('[data-testid="member-userid-input"]').setValue('user-123');
    await wrapper.find('select').setValue('doctor');
    await wrapper.find('[data-testid="assign-member-form"]').trigger('submit');

    const emitted = wrapper.emitted('submit');
    expect(emitted).toBeTruthy();
    expect(emitted![0][0]).toEqual({ userId: 'user-123', role: 'doctor' });
  });

  it('should emit close when cancel button is clicked', async () => {
    const wrapper = mountModal();
    const buttons = wrapper.findAll('button');
    const cancelBtn = buttons.find((b) => b.text() === 'Cancel');
    await cancelBtn!.trigger('click');
    expect(wrapper.emitted('close')).toBeTruthy();
  });

  it('should render submit button with Assign Member text', () => {
    const wrapper = mountModal();
    expect(wrapper.find('[data-testid="assign-submit-btn"]').text()).toBe('Assign Member');
  });
});
