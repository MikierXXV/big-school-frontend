/**
 * ============================================
 * TEST: BaseBadge Component
 * ============================================
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseBadge from '@presentation/components/ui/BaseBadge.vue';

describe('BaseBadge', () => {
  it('should render slot content', () => {
    const wrapper = mount(BaseBadge, {
      slots: { default: 'Active' },
    });
    expect(wrapper.text()).toContain('Active');
  });

  it('should apply neutral variant by default', () => {
    const wrapper = mount(BaseBadge);
    expect(wrapper.element.className).toContain('bg-gray-100');
  });

  it('should apply success variant classes', () => {
    const wrapper = mount(BaseBadge, { props: { variant: 'success' } });
    expect(wrapper.element.className).toContain('bg-green-100');
    expect(wrapper.element.className).toContain('text-green-800');
  });

  it('should apply error variant classes', () => {
    const wrapper = mount(BaseBadge, { props: { variant: 'error' } });
    expect(wrapper.element.className).toContain('bg-red-100');
  });

  it('should apply warning variant classes', () => {
    const wrapper = mount(BaseBadge, { props: { variant: 'warning' } });
    expect(wrapper.element.className).toContain('bg-yellow-100');
  });

  it('should apply info variant classes', () => {
    const wrapper = mount(BaseBadge, { props: { variant: 'info' } });
    expect(wrapper.element.className).toContain('bg-blue-100');
  });

  it('should apply sm size classes', () => {
    const wrapper = mount(BaseBadge, { props: { size: 'sm' } });
    expect(wrapper.element.className).toContain('text-xs');
  });

  it('should apply md size classes by default', () => {
    const wrapper = mount(BaseBadge);
    expect(wrapper.element.className).toContain('text-sm');
  });
});
