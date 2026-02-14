/**
 * ============================================
 * TEST: BaseCard Component
 * ============================================
 *
 * Tests for card component with padding/shadow variants and hover effects.
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseCard from '@presentation/components/ui/BaseCard.vue';

describe('BaseCard', () => {
  describe('Rendering', () => {
    it('should render slot content', () => {
      const wrapper = mount(BaseCard, {
        slots: { default: 'Card content' },
      });

      expect(wrapper.text()).toContain('Card content');
    });

    it('should render as div element', () => {
      const wrapper = mount(BaseCard);
      expect(wrapper.element.tagName).toBe('DIV');
    });
  });

  describe('Padding Variants', () => {
    it('should apply md padding by default', () => {
      const wrapper = mount(BaseCard);
      const card = wrapper.element as HTMLElement;

      expect(card.className).toContain('p-6');
    });

    it('should apply sm padding', () => {
      const wrapper = mount(BaseCard, {
        props: { padding: 'sm' },
      });
      const card = wrapper.element as HTMLElement;

      expect(card.className).toContain('p-4');
    });

    it('should apply lg padding', () => {
      const wrapper = mount(BaseCard, {
        props: { padding: 'lg' },
      });
      const card = wrapper.element as HTMLElement;

      expect(card.className).toContain('p-8');
    });

    it('should apply none padding', () => {
      const wrapper = mount(BaseCard, {
        props: { padding: 'none' },
      });
      const card = wrapper.element as HTMLElement;

      expect(card.className).toContain('p-0');
    });
  });

  describe('Shadow Variants', () => {
    it('should apply md shadow by default', () => {
      const wrapper = mount(BaseCard);
      const card = wrapper.element as HTMLElement;

      expect(card.className).toContain('shadow-md');
    });

    it('should apply sm shadow', () => {
      const wrapper = mount(BaseCard, {
        props: { shadow: 'sm' },
      });
      const card = wrapper.element as HTMLElement;

      expect(card.className).toContain('shadow-sm');
    });

    it('should apply lg shadow', () => {
      const wrapper = mount(BaseCard, {
        props: { shadow: 'lg' },
      });
      const card = wrapper.element as HTMLElement;

      expect(card.className).toContain('shadow-lg');
    });

    it('should apply none shadow', () => {
      const wrapper = mount(BaseCard, {
        props: { shadow: 'none' },
      });
      const card = wrapper.element as HTMLElement;

      expect(card.className).toContain('shadow-none');
    });
  });

  describe('Hover Effect', () => {
    it('should not have hover effect by default', () => {
      const wrapper = mount(BaseCard);
      const card = wrapper.element as HTMLElement;

      expect(card.className).not.toContain('hover:shadow-lg');
    });

    it('should apply hover effect when hoverable prop is true', () => {
      const wrapper = mount(BaseCard, {
        props: { hoverable: true },
      });
      const card = wrapper.element as HTMLElement;

      expect(card.className).toContain('hover:shadow-lg');
      expect(card.className).toContain('transition-shadow');
    });
  });

  describe('Dark Mode', () => {
    it('should have dark mode background classes', () => {
      const wrapper = mount(BaseCard);
      const card = wrapper.element as HTMLElement;

      expect(card.className).toContain('bg-white');
      expect(card.className).toContain('dark:bg-gray-800');
    });

    it('should have dark mode border classes', () => {
      const wrapper = mount(BaseCard);
      const card = wrapper.element as HTMLElement;

      expect(card.className).toContain('border-gray-200');
      expect(card.className).toContain('dark:border-gray-700');
    });
  });

  describe('Rounded Corners', () => {
    it('should have rounded corners', () => {
      const wrapper = mount(BaseCard);
      const card = wrapper.element as HTMLElement;

      expect(card.className).toContain('rounded-lg');
    });
  });
});
