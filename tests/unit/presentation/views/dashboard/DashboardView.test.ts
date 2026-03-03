/**
 * ============================================
 * TEST: DashboardView Component
 * ============================================
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createMemoryHistory } from 'vue-router';
import { i18n } from '@infrastructure/i18n/i18n.config.js';
import DashboardView from '@presentation/views/dashboard/DashboardView.vue';
import { useAuthStore } from '@presentation/stores/auth.store.js';
import { useRbacStore } from '@presentation/stores/rbac.store.js';

const createMockRouter = () => {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/dashboard', name: 'dashboard', component: DashboardView },
      { path: '/surgical-block', name: 'surgical-block', component: { template: '<div></div>' } },
      { path: '/emergency', name: 'emergency', component: { template: '<div></div>' } },
      { path: '/data-analytics', name: 'data-analytics', component: { template: '<div></div>' } },
      { path: '/wristband-printing', name: 'wristband-printing', component: { template: '<div></div>' } },
      { path: '/label-printing', name: 'label-printing', component: { template: '<div></div>' } },
      { path: '/admin', name: 'admin-dashboard', component: { template: '<div></div>' } },
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
        global: { plugins: [router, i18n] },
      });

      const dashboardLayout = wrapper.findComponent({ name: 'DashboardLayout' });
      expect(dashboardLayout.exists()).toBe(true);
    });

    it('should render dashboard title', async () => {
      const router = createMockRouter();
      await router.push('/dashboard');

      const wrapper = mount(DashboardView, {
        global: { plugins: [router, i18n] },
      });

      expect(wrapper.text()).toContain('Panel Principal');
    });

    it('should render welcome message without user', async () => {
      const router = createMockRouter();
      await router.push('/dashboard');

      const authStore = useAuthStore();
      authStore.user = null;

      const wrapper = mount(DashboardView, {
        global: { plugins: [router, i18n] },
      });

      expect(wrapper.text()).toContain('Bienvenido de nuevo');
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
        global: { plugins: [router, i18n] },
      });

      expect(wrapper.text()).toContain('John Doe');
    });

    it('should render module selection subtitle', async () => {
      const router = createMockRouter();
      await router.push('/dashboard');

      const wrapper = mount(DashboardView, {
        global: { plugins: [router, i18n] },
      });

      expect(wrapper.text()).toContain('Seleccione un módulo para continuar');
    });
  });

  describe('Navigation Cards', () => {
    it('should render 5 navigation option cards', async () => {
      const router = createMockRouter();
      await router.push('/dashboard');

      const wrapper = mount(DashboardView, {
        global: { plugins: [router, i18n] },
      });

      const cards = wrapper.findAll('[data-testid^="module-card-"]');
      expect(cards).toHaveLength(5);
    });

    it('should render Surgical Block card', async () => {
      const router = createMockRouter();
      await router.push('/dashboard');

      const wrapper = mount(DashboardView, {
        global: { plugins: [router, i18n] },
      });

      expect(wrapper.text()).toContain('Bloque Quirúrgico');
    });

    it('should render Emergency card', async () => {
      const router = createMockRouter();
      await router.push('/dashboard');

      const wrapper = mount(DashboardView, {
        global: { plugins: [router, i18n] },
      });

      expect(wrapper.text()).toContain('Urgencias');
    });

    it('should render Data & Analytics card', async () => {
      const router = createMockRouter();
      await router.push('/dashboard');

      const wrapper = mount(DashboardView, {
        global: { plugins: [router, i18n] },
      });

      expect(wrapper.text()).toContain('Datos y Análisis');
    });

    it('should render Wristband Printing card', async () => {
      const router = createMockRouter();
      await router.push('/dashboard');

      const wrapper = mount(DashboardView, {
        global: { plugins: [router, i18n] },
      });

      expect(wrapper.text()).toContain('Impresión de Pulseras');
    });

    it('should render Label Printing card', async () => {
      const router = createMockRouter();
      await router.push('/dashboard');

      const wrapper = mount(DashboardView, {
        global: { plugins: [router, i18n] },
      });

      expect(wrapper.text()).toContain('Impresión de Etiquetas');
    });

    it('should navigate to surgical-block on card click', async () => {
      const router = createMockRouter();
      await router.push('/dashboard');

      const wrapper = mount(DashboardView, {
        global: { plugins: [router, i18n] },
      });

      const card = wrapper.find('[data-testid="module-card-surgical-block"]');
      await card.trigger('click');
      await flushPromises();
      expect(router.currentRoute.value.name).toBe('surgical-block');
    });

    it('should navigate to emergency on card click', async () => {
      const router = createMockRouter();
      await router.push('/dashboard');

      const wrapper = mount(DashboardView, {
        global: { plugins: [router, i18n] },
      });

      const card = wrapper.find('[data-testid="module-card-emergency"]');
      await card.trigger('click');
      await flushPromises();
      expect(router.currentRoute.value.name).toBe('emergency');
    });

    it('should navigate to data-analytics on card click', async () => {
      const router = createMockRouter();
      await router.push('/dashboard');

      const wrapper = mount(DashboardView, {
        global: { plugins: [router, i18n] },
      });

      const card = wrapper.find('[data-testid="module-card-data-analytics"]');
      await card.trigger('click');
      await flushPromises();
      expect(router.currentRoute.value.name).toBe('data-analytics');
    });

    it('should navigate to wristband-printing on card click', async () => {
      const router = createMockRouter();
      await router.push('/dashboard');

      const wrapper = mount(DashboardView, {
        global: { plugins: [router, i18n] },
      });

      const card = wrapper.find('[data-testid="module-card-wristband-printing"]');
      await card.trigger('click');
      await flushPromises();
      expect(router.currentRoute.value.name).toBe('wristband-printing');
    });

    it('should navigate to label-printing on card click', async () => {
      const router = createMockRouter();
      await router.push('/dashboard');

      const wrapper = mount(DashboardView, {
        global: { plugins: [router, i18n] },
      });

      const card = wrapper.find('[data-testid="module-card-label-printing"]');
      await card.trigger('click');
      await flushPromises();
      expect(router.currentRoute.value.name).toBe('label-printing');
    });
  });

  describe('Admin Panel Card', () => {
    it('should show admin panel card for admin user', async () => {
      const router = createMockRouter();
      await router.push('/dashboard');

      const authStore = useAuthStore();
      authStore.user = {
        id: '1',
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        status: 'ACTIVE',
        fullName: 'Admin User',
        emailVerified: true,
        systemRole: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const wrapper = mount(DashboardView, {
        global: { plugins: [router, i18n] },
      });

      expect(wrapper.find('[data-testid="admin-panel-card"]').exists()).toBe(true);
    });

    it('should hide admin panel card for regular user', async () => {
      const router = createMockRouter();
      await router.push('/dashboard');

      const authStore = useAuthStore();
      authStore.user = {
        id: '1',
        email: 'user@example.com',
        firstName: 'Regular',
        lastName: 'User',
        status: 'ACTIVE',
        fullName: 'Regular User',
        emailVerified: true,
        systemRole: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const wrapper = mount(DashboardView, {
        global: { plugins: [router, i18n] },
      });

      expect(wrapper.find('[data-testid="admin-panel-card"]').exists()).toBe(false);
    });

    it('should show admin panel card for super_admin user', async () => {
      const router = createMockRouter();
      await router.push('/dashboard');

      const authStore = useAuthStore();
      authStore.user = {
        id: '1',
        email: 'super@example.com',
        firstName: 'Super',
        lastName: 'Admin',
        status: 'ACTIVE',
        fullName: 'Super Admin',
        emailVerified: true,
        systemRole: 'super_admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const wrapper = mount(DashboardView, {
        global: { plugins: [router, i18n] },
      });

      expect(wrapper.find('[data-testid="admin-panel-card"]').exists()).toBe(true);
    });

    it('should navigate to /admin when admin card is clicked', async () => {
      const router = createMockRouter();
      await router.push('/dashboard');

      const authStore = useAuthStore();
      authStore.user = {
        id: '1',
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        status: 'ACTIVE',
        fullName: 'Admin User',
        emailVerified: true,
        systemRole: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const wrapper = mount(DashboardView, {
        global: { plugins: [router, i18n] },
      });

      await wrapper.find('[data-testid="admin-panel-card"]').trigger('click');
      await flushPromises();
      expect(router.currentRoute.value.path).toBe('/admin');
    });
  });

  describe('My Organizations Section', () => {
    it('should show my organizations section when user has organizations', async () => {
      const router = createMockRouter();
      await router.push('/dashboard');

      const rbacStore = useRbacStore();
      rbacStore.userOrganizations = [
        {
          organizationId: 'org-1',
          organizationName: 'Hospital Central',
          organizationType: 'hospital',
          role: 'doctor',
          joinedAt: '2024-01-01',
          isActive: true,
        },
      ];

      const wrapper = mount(DashboardView, {
        global: { plugins: [router, i18n] },
      });

      expect(wrapper.find('[data-testid="my-organizations-section"]').exists()).toBe(true);
    });

    it('should hide my organizations section when user has no organizations', async () => {
      const router = createMockRouter();
      await router.push('/dashboard');

      const rbacStore = useRbacStore();
      rbacStore.userOrganizations = [];

      const wrapper = mount(DashboardView, {
        global: { plugins: [router, i18n] },
      });

      expect(wrapper.find('[data-testid="my-organizations-section"]').exists()).toBe(false);
    });

    it('should show view all link', async () => {
      const router = createMockRouter();
      await router.push('/dashboard');

      const rbacStore = useRbacStore();
      rbacStore.userOrganizations = [
        {
          organizationId: 'org-1',
          organizationName: 'Hospital Central',
          organizationType: 'hospital',
          role: 'doctor',
          joinedAt: '2024-01-01',
          isActive: true,
        },
      ];

      const wrapper = mount(DashboardView, {
        global: { plugins: [router, i18n] },
      });

      expect(wrapper.find('[data-testid="view-all-orgs"]').exists()).toBe(true);
    });

    it('should show max 4 organization cards', async () => {
      const router = createMockRouter();
      await router.push('/dashboard');

      const rbacStore = useRbacStore();
      rbacStore.userOrganizations = Array.from({ length: 6 }, (_, i) => ({
        organizationId: `org-${i + 1}`,
        organizationName: `Organization ${i + 1}`,
        organizationType: 'hospital',
        role: 'doctor',
        joinedAt: '2024-01-01',
        isActive: true,
      }));

      const wrapper = mount(DashboardView, {
        global: { plugins: [router, i18n] },
      });

      const orgCards = wrapper.findAll('[data-testid^="org-card-"]');
      expect(orgCards).toHaveLength(4);
    });
  });
});
