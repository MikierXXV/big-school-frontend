/**
 * ============================================
 * TEST: ConfirmDialog Component
 * ============================================
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ConfirmDialog from '@presentation/components/ui/ConfirmDialog.vue';

describe('ConfirmDialog', () => {
  const defaultProps = {
    open: true,
    title: 'Confirm Action',
    message: 'Are you sure?',
  };

  it('should render title and message when open', () => {
    const wrapper = mount(ConfirmDialog, {
      props: defaultProps,
      global: { stubs: { BaseModal: { template: '<div><slot /></div>', props: ['open', 'title', 'size'] } } },
    });
    expect(wrapper.text()).toContain('Are you sure?');
  });

  it('should emit confirm when confirm button is clicked', async () => {
    const wrapper = mount(ConfirmDialog, {
      props: defaultProps,
      global: { stubs: { BaseModal: { template: '<div><slot /></div>', props: ['open', 'title', 'size'] } } },
    });
    const buttons = wrapper.findAll('button');
    const confirmButton = buttons[buttons.length - 1];
    await confirmButton.trigger('click');
    expect(wrapper.emitted('confirm')).toHaveLength(1);
  });

  it('should emit cancel when cancel button is clicked', async () => {
    const wrapper = mount(ConfirmDialog, {
      props: defaultProps,
      global: { stubs: { BaseModal: { template: '<div><slot /></div>', props: ['open', 'title', 'size'] } } },
    });
    const buttons = wrapper.findAll('button');
    await buttons[0].trigger('click');
    expect(wrapper.emitted('cancel')).toHaveLength(1);
  });

  it('should apply danger variant to confirm button', () => {
    const wrapper = mount(ConfirmDialog, {
      props: { ...defaultProps, confirmVariant: 'danger' },
      global: { stubs: { BaseModal: { template: '<div><slot /></div>', props: ['open', 'title', 'size'] } } },
    });
    const buttons = wrapper.findAll('button');
    const confirmButton = buttons[buttons.length - 1];
    expect(confirmButton.element.className).toContain('bg-red-600');
  });

  it('should use custom confirm and cancel text', () => {
    const wrapper = mount(ConfirmDialog, {
      props: { ...defaultProps, confirmText: 'Delete', cancelText: 'Keep' },
      global: { stubs: { BaseModal: { template: '<div><slot /></div>', props: ['open', 'title', 'size'] } } },
    });
    expect(wrapper.text()).toContain('Delete');
    expect(wrapper.text()).toContain('Keep');
  });
});
