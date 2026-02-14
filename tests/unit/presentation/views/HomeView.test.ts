/**
 * ============================================
 * TEST: HomeView Component
 * ============================================
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createMemoryHistory } from 'vue-router';
import HomeView from '@presentation/views/HomeView.vue';
import { useAuthStore } from '@presentation/stores/auth.store.js';

const createMockRouter = () => {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: '/',
        name: 'home',
        component: HomeView,
      },
      {
        path: '/login',
        name: 'login',
        component: { template: '<div>Login</div>' },
      },
      {
        path: '/register',
        name: 'register',
        component: { template: '<div>Register</div>' },
      },
      {
        path: '/dashboard',
        name: 'dashboard',
        component: { template: '<div>Dashboard</div>' },
      },
    ],
  });
};

describe('HomeView', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('Rendering', () => {
    it('should render home view', async () => {
      const router = createMockRouter();
      await router.push('/');

      const wrapper = mount(HomeView, {
        global: {
          plugins: [router],
        },
      });

      expect(wrapper.find('.home-view').exists()).toBe(true);
    });

    it('should render hero section', async () => {
      const router = createMockRouter();
      await router.push('/');

      const wrapper = mount(HomeView, {
        global: {
          plugins: [router],
        },
      });

      expect(wrapper.find('.hero').exists()).toBe(true);
      expect(wrapper.text()).toContain('Welcome to Big School');
    });

    it('should render features section', async () => {
      const router = createMockRouter();
      await router.push('/');

      const wrapper = mount(HomeView, {
        global: {
          plugins: [router],
        },
      });

      expect(wrapper.find('.features').exists()).toBe(true);
      expect(wrapper.text()).toContain('Why Choose Big School?');
      expect(wrapper.text()).toContain('Expert Courses');
      expect(wrapper.text()).toContain('Track Progress');
      expect(wrapper.text()).toContain('Learn at Your Pace');
    });

    it('should render CTA section', async () => {
      const router = createMockRouter();
      await router.push('/');

      const wrapper = mount(HomeView, {
        global: {
          plugins: [router],
        },
      });

      expect(wrapper.find('.cta').exists()).toBe(true);
      expect(wrapper.text()).toContain('Ready to Start Learning?');
    });
  });

  describe('Authentication State', () => {
    it('should show guest CTAs when not authenticated', async () => {
      const router = createMockRouter();
      await router.push('/');

      const authStore = useAuthStore();
      authStore.user = null;

      const wrapper = mount(HomeView, {
        global: {
          plugins: [router],
        },
      });

      expect(wrapper.text()).toContain('Get Started');
      expect(wrapper.text()).toContain('Sign In');
      expect(wrapper.text()).toContain('Create Free Account');
    });

    it('should show authenticated CTAs when logged in', async () => {
      const router = createMockRouter();
      await router.push('/');

      const authStore = useAuthStore();
      authStore.user = {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        status: 'ACTIVE',
        fullName: 'Test User',
        emailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      authStore.accessToken = 'valid-access-token';

      const wrapper = mount(HomeView, {
        global: {
          plugins: [router],
        },
      });

      expect(wrapper.text()).toContain('Go to Dashboard');
      expect(wrapper.text()).toContain('Continue Learning');
    });
  });
});
