/**
 * ============================================
 * TEST: BaseSelect Component
 * ============================================
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseSelect from '@presentation/components/ui/BaseSelect.vue';

const options = [
  { value: 'hospital', label: 'Hospital' },
  { value: 'clinic', label: 'Clinic' },
  { value: 'pharmacy', label: 'Pharmacy' },
];

describe('BaseSelect', () => {
  it('should render options', () => {
    const wrapper = mount(BaseSelect, {
      props: { modelValue: '', options },
    });
    const optionElements = wrapper.findAll('option');
    expect(optionElements.length).toBe(3);
  });

  it('should render label when provided', () => {
    const wrapper = mount(BaseSelect, {
      props: { modelValue: '', options, label: 'Type' },
    });
    expect(wrapper.find('label').text()).toBe('Type');
  });

  it('should render placeholder option when provided', () => {
    const wrapper = mount(BaseSelect, {
      props: { modelValue: '', options, placeholder: 'Select...' },
    });
    const optionElements = wrapper.findAll('option');
    expect(optionElements.length).toBe(4);
    expect(optionElements[0].text()).toBe('Select...');
  });

  it('should emit update:modelValue on change', async () => {
    const wrapper = mount(BaseSelect, {
      props: { modelValue: '', options },
    });
    const select = wrapper.find('select');
    await select.setValue('clinic');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['clinic']);
  });

  it('should show error message when provided', () => {
    const wrapper = mount(BaseSelect, {
      props: { modelValue: '', options, error: 'Required' },
    });
    expect(wrapper.find('p').text()).toBe('Required');
  });

  it('should apply error border class', () => {
    const wrapper = mount(BaseSelect, {
      props: { modelValue: '', options, error: 'Required' },
    });
    expect(wrapper.find('select').element.className).toContain('border-red-500');
  });

  it('should be disabled when disabled prop is true', () => {
    const wrapper = mount(BaseSelect, {
      props: { modelValue: '', options, disabled: true },
    });
    expect(wrapper.find('select').attributes('disabled')).toBeDefined();
  });
});
