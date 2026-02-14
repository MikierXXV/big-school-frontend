/**
 * ============================================
 * ROUTER: Routes Configuration
 * ============================================
 *
 * Definición de rutas de la aplicación.
 *
 * RUTAS PUBLICAS:
 * - / (home)
 * - /login
 * - /register
 * - /forgot-password
 * - /reset-password (con query param: token)
 * - /verify-email (con query param: token)
 *
 * RUTAS PROTEGIDAS:
 * - /dashboard
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
    path: '/reset-password',
    name: 'reset-password',
    component: () => import('@presentation/views/auth/ResetPasswordView.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/verify-email',
    name: 'verify-email',
    component: () => import('@presentation/views/auth/VerifyEmailView.vue'),
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
