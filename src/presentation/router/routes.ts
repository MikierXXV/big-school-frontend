/**
 * ============================================
 * ROUTER: Routes Configuration
 * ============================================
 *
 * Definicion de rutas de la aplicacion.
 *
 * RUTAS PUBLICAS:
 * - /login
 * - /register
 * - /forgot-password
 *
 * RUTAS PROTEGIDAS:
 * - /dashboard
 * - /profile
 *
 * TODO: Implementar rutas completas
 */

import type { RouteRecordRaw } from 'vue-router';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@presentation/views/HomeView.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@presentation/views/auth/LoginView.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@presentation/views/auth/RegisterView.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('@presentation/views/auth/ForgotPasswordView.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@presentation/views/dashboard/DashboardView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@presentation/views/NotFoundView.vue'),
  },
];
