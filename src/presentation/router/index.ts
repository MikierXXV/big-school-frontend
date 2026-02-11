/**
 * ============================================
 * ROUTER - EXPORT
 * ============================================
 */

import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes.js';
import { authGuard } from './guards/auth.guard.js';

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Global guards
router.beforeEach(authGuard);

export * from './routes.js';
export * from './guards/index.js';
