/**
 * ============================================
 * TEST: BaseModal Component
 * ============================================
 *
 * Tests for modal dialog using @headlessui/vue with backdrop, animations, and focus trap.
 * NOTE: @headlessui Dialog is complex to unit test - full behavior tested in E2E tests.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseModal from '@presentation/components/ui/BaseModal.vue';

// Mock ResizeObserver (required by @headlessui)
beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe('BaseModal', () => {
  describe('Basic Rendering', () => {
    it('should accept open prop', () => {
      const wrapper = mount(BaseModal, {
        props: { open: false },
      });

      expect(wrapper.props('open')).toBe(false);
    });

    it('should accept title prop', () => {
      const wrapper = mount(BaseModal, {
        props: {
          open: true,
          title: 'Test Modal',
        },
      });

      expect(wrapper.props('title')).toBe('Test Modal');
    });

    it('should accept size prop', () => {
      const wrapper = mount(BaseModal, {
        props: {
          open: true,
          size: 'lg',
        },
      });

      expect(wrapper.props('size')).toBe('lg');
    });

    it('should have default size of md', () => {
      const wrapper = mount(BaseModal, {
        props: { open: true },
      });

      expect(wrapper.props('size')).toBe('md');
    });

    it('should accept showClose prop', () => {
      const wrapper = mount(BaseModal, {
        props: {
          open: true,
          showClose: false,
        },
      });

      expect(wrapper.props('showClose')).toBe(false);
    });

    it('should have showClose default to true', () => {
      const wrapper = mount(BaseModal, {
        props: { open: true },
      });

      expect(wrapper.props('showClose')).toBe(true);
    });

    it('should accept closeOnBackdropClick prop', () => {
      const wrapper = mount(BaseModal, {
        props: {
          open: true,
          closeOnBackdropClick: false,
        },
      });

      expect(wrapper.props('closeOnBackdropClick')).toBe(false);
    });

    it('should have closeOnBackdropClick default to true', () => {
      const wrapper = mount(BaseModal, {
        props: { open: true },
      });

      expect(wrapper.props('closeOnBackdropClick')).toBe(true);
    });
  });

  describe('Events', () => {
    it('should define close event', () => {
      const wrapper = mount(BaseModal, {
        props: { open: true },
      });

      // Check that emits include 'close'
      expect(wrapper.vm.$options.emits).toContain('close');
    });
  });
});
