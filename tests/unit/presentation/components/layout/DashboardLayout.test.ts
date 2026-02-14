/**
 * ============================================
 * TEST: DashboardLayout Component
 * ============================================
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import DashboardLayout from '@presentation/components/layout/DashboardLayout.vue';

describe('DashboardLayout', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('Rendering', () => {
    it('should render main layout container', () => {
      const wrapper = mount(DashboardLayout);

      const container = wrapper.find('[data-testid="dashboard-layout"]');
      expect(container.exists()).toBe(true);
    });

    it('should render AppHeader component', () => {
      const wrapper = mount(DashboardLayout);

      const header = wrapper.findComponent({ name: 'AppHeader' });
      expect(header.exists()).toBe(true);
    });

    it('should render AppFooter component', () => {
      const wrapper = mount(DashboardLayout);

      const footer = wrapper.findComponent({ name: 'AppFooter' });
      expect(footer.exists()).toBe(true);
    });

    it('should render slot content', () => {
      const wrapper = mount(DashboardLayout, {
        slots: {
          default: '<div data-testid="slot-content">Test Content</div>',
        },
      });

      const slotContent = wrapper.find('[data-testid="slot-content"]');
      expect(slotContent.exists()).toBe(true);
      expect(slotContent.text()).toBe('Test Content');
    });
  });

  describe('Layout Structure', () => {
    it('should use flexbox column layout', () => {
      const wrapper = mount(DashboardLayout);

      const container = wrapper.find('[data-testid="dashboard-layout"]');
      expect(container.classes()).toContain('flex');
      expect(container.classes()).toContain('flex-col');
    });

    it('should have minimum height of full screen', () => {
      const wrapper = mount(DashboardLayout);

      const container = wrapper.find('[data-testid="dashboard-layout"]');
      expect(container.classes()).toContain('min-h-screen');
    });
  });
});
