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
 * - /surgical-block
 * - /emergency
 * - /data-analytics
 * - /wristband-printing
 * - /label-printing
 * - /my-organizations
 * - /forbidden
 *
 * RUTAS ADMIN (requieren rol admin/super_admin):
 * - /admin
 * - /admin/organizations
 * - /admin/organizations/:id
 * - /admin/users (solo super_admin)
 * - /admin/users/:userId/permissions (solo super_admin)
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
    path: '/oauth/callback',
    name: 'oauth-callback',
    component: () => import('@presentation/views/auth/OAuthCallbackView.vue'),
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@presentation/views/dashboard/DashboardView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/surgical-block',
    name: 'surgical-block',
    component: () => import('@presentation/views/dashboard/SurgicalBlockView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/emergency',
    name: 'emergency',
    component: () => import('@presentation/views/dashboard/EmergencyView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/data-analytics',
    name: 'data-analytics',
    component: () => import('@presentation/views/dashboard/DataAnalyticsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/wristband-printing',
    name: 'wristband-printing',
    component: () => import('@presentation/views/dashboard/WristbandPrintingView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/label-printing',
    name: 'label-printing',
    component: () => import('@presentation/views/dashboard/LabelPrintingView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/my-organizations',
    name: 'my-organizations',
    component: () => import('@presentation/views/dashboard/MyOrganizationsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/forbidden',
    name: 'forbidden',
    component: () => import('@presentation/views/ForbiddenView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin',
    name: 'admin-dashboard',
    component: () => import('@presentation/views/admin/AdminDashboardView.vue'),
    meta: { requiresAuth: true, requiresRole: ['super_admin', 'admin'] },
  },
  {
    path: '/admin/organizations',
    name: 'admin-organizations',
    component: () => import('@presentation/views/admin/OrganizationListView.vue'),
    meta: { requiresAuth: true, requiresRole: ['super_admin', 'admin'], requiresPermission: 'manage_organizations' },
  },
  {
    path: '/admin/organizations/:id',
    name: 'admin-organization-detail',
    component: () => import('@presentation/views/admin/OrganizationDetailView.vue'),
    meta: { requiresAuth: true, requiresRole: ['super_admin', 'admin'] },
  },
  {
    path: '/admin/users',
    name: 'admin-users',
    component: () => import('@presentation/views/admin/AdminUserListView.vue'),
    meta: { requiresAuth: true, requiresRole: ['super_admin'] },
  },
  {
    path: '/admin/users/:userId/permissions',
    name: 'admin-user-permissions',
    component: () => import('@presentation/views/admin/AdminPermissionsView.vue'),
    meta: { requiresAuth: true, requiresRole: ['super_admin'] },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@presentation/views/NotFoundView.vue'),
  },
];
