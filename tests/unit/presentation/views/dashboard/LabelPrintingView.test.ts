/**
 * ============================================
 * TEST: LabelPrintingView Component
 * ============================================
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createMemoryHistory } from 'vue-router';
import { i18n } from '@infrastructure/i18n/i18n.config.js';
import LabelPrintingView from '@presentation/views/dashboard/LabelPrintingView.vue';

const createMockRouter = () => {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: '/label-printing',
        name: 'label-printing',
        component: LabelPrintingView,
      },
      {
        path: '/dashboard',
        name: 'dashboard',
        component: { template: '<div>Dashboard</div>' },
      },
    ],
  });
};

describe('LabelPrintingView', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('Rendering', () => {
    it('should render within DashboardLayout', async () => {
      const router = createMockRouter();
      await router.push('/label-printing');

      const wrapper = mount(LabelPrintingView, {
        global: { plugins: [router, i18n] },
      });

      const dashboardLayout = wrapper.findComponent({ name: 'DashboardLayout' });
      expect(dashboardLayout.exists()).toBe(true);
    });

    it('should render the module title', async () => {
      const router = createMockRouter();
      await router.push('/label-printing');

      const wrapper = mount(LabelPrintingView, {
        global: { plugins: [router, i18n] },
      });

      expect(wrapper.text()).toContain('Impresión de Etiquetas');
    });

    it('should render placeholder content', async () => {
      const router = createMockRouter();
      await router.push('/label-printing');

      const wrapper = mount(LabelPrintingView, {
        global: { plugins: [router, i18n] },
      });

      expect(wrapper.text()).toContain('en construcción');
    });

    it('should render a back to dashboard link', async () => {
      const router = createMockRouter();
      await router.push('/label-printing');

      const wrapper = mount(LabelPrintingView, {
        global: { plugins: [router, i18n] },
      });

      const backLink = wrapper.find('a[href="/dashboard"]');
      expect(backLink.exists()).toBe(true);
    });
  });
});
