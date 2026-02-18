/**
 * ============================================
 * TEST: HomeView Component
 * ============================================
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createMemoryHistory } from 'vue-router';
import { i18n } from '@infrastructure/i18n/i18n.config.js';
import HomeView from '@presentation/views/HomeView.vue';
import { useAuthStore } from '@presentation/stores/auth.store.js';

const createMockRouter = () => {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: HomeView },
      { path: '/login', name: 'login', component: { template: '<div>Login</div>' } },
      { path: '/register', name: 'register', component: { template: '<div>Register</div>' } },
      { path: '/dashboard', name: 'dashboard', component: { template: '<div>Dashboard</div>' } },
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
        global: { plugins: [router, i18n] },
      });

      expect(wrapper.find('.home-view').exists()).toBe(true);
    });

    it('should render hero section with Health Care Suite branding', async () => {
      const router = createMockRouter();
      await router.push('/');

      const wrapper = mount(HomeView, {
        global: { plugins: [router, i18n] },
      });

      expect(wrapper.find('.hero').exists()).toBe(true);
      expect(wrapper.text()).toContain('Health Care Suite');
    });

    it('should render features section with 5 module cards', async () => {
      const router = createMockRouter();
      await router.push('/');

      const wrapper = mount(HomeView, {
        global: { plugins: [router, i18n] },
      });

      expect(wrapper.find('.features').exists()).toBe(true);
      expect(wrapper.text()).toContain('Módulos del Sistema');
      expect(wrapper.text()).toContain('Bloque Quirúrgico');
      expect(wrapper.text()).toContain('Urgencias');
      expect(wrapper.text()).toContain('Datos y Análisis');
      expect(wrapper.text()).toContain('Impresión de Pulseras');
      expect(wrapper.text()).toContain('Impresión de Etiquetas');
    });

    it('should render CTA section', async () => {
      const router = createMockRouter();
      await router.push('/');

      const wrapper = mount(HomeView, {
        global: { plugins: [router, i18n] },
      });

      expect(wrapper.find('.cta').exists()).toBe(true);
      expect(wrapper.text()).toContain('¿Listo para comenzar?');
    });
  });

  describe('Authentication State', () => {
    it('should show guest CTAs when not authenticated', async () => {
      const router = createMockRouter();
      await router.push('/');

      const authStore = useAuthStore();
      authStore.user = null;

      const wrapper = mount(HomeView, {
        global: { plugins: [router, i18n] },
      });

      expect(wrapper.text()).toContain('Comenzar');
      expect(wrapper.text()).toContain('Iniciar Sesión');
      expect(wrapper.text()).toContain('Crear Cuenta');
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
        global: { plugins: [router, i18n] },
      });

      expect(wrapper.text()).toContain('Ir al Panel');
      expect(wrapper.text()).toContain('Continuar al Panel');
    });
  });
});
