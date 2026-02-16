/**
 * ============================================
 * TEST: BaseSkeleton Component
 * ============================================
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseSkeleton from '@presentation/components/ui/BaseSkeleton.vue';

describe('BaseSkeleton', () => {
  describe('Rendering', () => {
    it('should render skeleton with default props', () => {
      const wrapper = mount(BaseSkeleton);

      const skeleton = wrapper.find('[data-testid="skeleton-item"]');
      expect(skeleton.exists()).toBe(true);
      expect(skeleton.classes()).toContain('animate-pulse');
      expect(skeleton.classes()).toContain('bg-gray-200');
    });

    it('should render multiple skeleton items based on count', () => {
      const wrapper = mount(BaseSkeleton, {
        props: { count: 3 },
      });

      const skeletons = wrapper.findAll('[data-testid="skeleton-item"]');
      expect(skeletons.length).toBe(3);
    });
  });

  describe('Variants', () => {
    it('should apply text variant classes', () => {
      const wrapper = mount(BaseSkeleton, {
        props: { variant: 'text' },
      });

      const skeleton = wrapper.find('[data-testid="skeleton-item"]');
      expect(skeleton.classes()).toContain('rounded');
    });

    it('should apply circular variant classes', () => {
      const wrapper = mount(BaseSkeleton, {
        props: { variant: 'circular' },
      });

      const skeleton = wrapper.find('[data-testid="skeleton-item"]');
      expect(skeleton.classes()).toContain('rounded-full');
    });

    it('should apply rectangular variant classes', () => {
      const wrapper = mount(BaseSkeleton, {
        props: { variant: 'rectangular' },
      });

      const skeleton = wrapper.find('[data-testid="skeleton-item"]');
      expect(skeleton.classes()).toContain('rounded-md');
    });
  });

  describe('Sizing', () => {
    it('should apply custom width and height', () => {
      const wrapper = mount(BaseSkeleton, {
        props: {
          width: '200px',
          height: '50px',
        },
      });

      const skeleton = wrapper.find('[data-testid="skeleton-item"]');
      expect(skeleton.attributes('style')).toContain('width: 200px');
      expect(skeleton.attributes('style')).toContain('height: 50px');
    });

    it('should use default width and height', () => {
      const wrapper = mount(BaseSkeleton);

      const skeleton = wrapper.find('[data-testid="skeleton-item"]');
      expect(skeleton.attributes('style')).toContain('width: 100%');
      expect(skeleton.attributes('style')).toContain('height: 1rem');
    });
  });
});
