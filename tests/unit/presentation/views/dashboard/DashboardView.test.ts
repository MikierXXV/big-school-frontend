/**
 * ============================================
 * TEST: DashboardView Component
 * ============================================
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createMemoryHistory } from 'vue-router';
import DashboardView from '@presentation/views/dashboard/DashboardView.vue';
import { useAuthStore } from '@presentation/stores/auth.store.js';

const createMockRouter = () => {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: '/dashboard',
        name: 'dashboard',
        component: DashboardView,
      },
    ],
  });
};

describe('DashboardView', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('Rendering', () => {
    it('should render dashboard view', async () => {
      const router = createMockRouter();
      await router.push('/dashboard');

      const wrapper = mount(DashboardView, {
        global: {
          plugins: [router],
        },
      });

      const dashboardLayout = wrapper.findComponent({ name: 'DashboardLayout' });
      expect(dashboardLayout.exists()).toBe(true);
    });

    it('should render dashboard title', async () => {
      const router = createMockRouter();
      await router.push('/dashboard');

      const wrapper = mount(DashboardView, {
        global: {
          plugins: [router],
        },
      });

      expect(wrapper.text()).toContain('Dashboard');
    });

    it('should render welcome message without user', async () => {
      const router = createMockRouter();
      await router.push('/dashboard');

      const authStore = useAuthStore();
      authStore.user = null;

      const wrapper = mount(DashboardView, {
        global: {
          plugins: [router],
        },
      });

      expect(wrapper.text()).toContain('Welcome back!');
    });

    it('should render welcome message with user full name', async () => {
      const router = createMockRouter();
      await router.push('/dashboard');

      const authStore = useAuthStore();
      authStore.user = {
        id: '1',
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        status: 'ACTIVE',
        fullName: 'John Doe',
        emailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const wrapper = mount(DashboardView, {
        global: {
          plugins: [router],
        },
      });

      expect(wrapper.text()).toContain('Welcome back, John Doe!');
    });

    it('should render stats grid with 3 cards', async () => {
      const router = createMockRouter();
      await router.push('/dashboard');

      const wrapper = mount(DashboardView, {
        global: {
          plugins: [router],
        },
      });

      const statsCards = wrapper.findAll('.bg-white.dark\\:bg-gray-800.rounded-lg.shadow');
      expect(statsCards.length).toBeGreaterThanOrEqual(3);
    });

    it('should render Total Courses stat', async () => {
      const router = createMockRouter();
      await router.push('/dashboard');

      const wrapper = mount(DashboardView, {
        global: {
          plugins: [router],
        },
      });

      expect(wrapper.text()).toContain('Total Courses');
    });

    it('should render Completed stat', async () => {
      const router = createMockRouter();
      await router.push('/dashboard');

      const wrapper = mount(DashboardView, {
        global: {
          plugins: [router],
        },
      });

      expect(wrapper.text()).toContain('Completed');
    });

    it('should render In Progress stat', async () => {
      const router = createMockRouter();
      await router.push('/dashboard');

      const wrapper = mount(DashboardView, {
        global: {
          plugins: [router],
        },
      });

      expect(wrapper.text()).toContain('In Progress');
    });
  });
});
