/**
 * ============================================
 * TEST: BaseToggleSwitch Component
 * ============================================
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseToggleSwitch from '@presentation/components/ui/BaseToggleSwitch.vue';

describe('BaseToggleSwitch', () => {
  it('should render with label', () => {
    const wrapper = mount(BaseToggleSwitch, {
      props: { modelValue: false, label: 'Enable feature' },
    });
    expect(wrapper.text()).toContain('Enable feature');
  });

  it('should apply active class when modelValue is true', () => {
    const wrapper = mount(BaseToggleSwitch, {
      props: { modelValue: true },
    });
    expect(wrapper.find('button').element.className).toContain('bg-primary-600');
  });

  it('should apply inactive class when modelValue is false', () => {
    const wrapper = mount(BaseToggleSwitch, {
      props: { modelValue: false },
    });
    expect(wrapper.find('button').element.className).toContain('bg-gray-300');
  });

  it('should apply disabled styles when disabled', () => {
    const wrapper = mount(BaseToggleSwitch, {
      props: { modelValue: false, disabled: true },
    });
    expect(wrapper.find('button').element.className).toContain('opacity-50');
  });

  it('should render without label', () => {
    const wrapper = mount(BaseToggleSwitch, {
      props: { modelValue: false },
    });
    expect(wrapper.findAll('span').filter(s => !s.classes().includes('sr-only') && !s.element.className.includes('inline-block')).length).toBe(0);
  });
});
