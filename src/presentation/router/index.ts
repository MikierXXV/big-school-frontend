/**
 * ============================================
 * ROUTER - EXPORT
 * ============================================
 */

import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes.js';
import { authGuard } from './guards/auth.guard.js';
import { rbacGuard } from './guards/rbac.guard.js';

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Global guards (order matters: auth first, then RBAC)
router.beforeEach(authGuard);
router.beforeEach(rbacGuard);

export * from './routes.js';
export * from './guards/index.js';
