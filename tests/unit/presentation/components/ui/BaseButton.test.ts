/**
 * ============================================
 * UNIT TEST: BaseButton Component
 * ============================================
 *
 * Tests para el componente BaseButton.
 *
 * TODO: Implementar tests completos
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseButton from '@presentation/components/ui/BaseButton.vue';

describe('BaseButton', () => {
  it('renders slot content', () => {
    const wrapper = mount(BaseButton, {
      slots: {
        default: 'Click me',
      },
    });

    expect(wrapper.text()).toContain('Click me');
  });

  it('applies default variant and size', () => {
    const wrapper = mount(BaseButton);
    expect(wrapper.props('variant')).toBe('primary');
    expect(wrapper.props('size')).toBe('md');
  });

  // TODO: Agregar tests de props y eventos
  // TODO: Test variant styles
  // TODO: Test disabled state
  // TODO: Test loading state
});
