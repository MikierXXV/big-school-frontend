/**
 * ============================================
 * TYPE AUGMENTATION: Vue Router RouteMeta
 * ============================================
 *
 * Extends RouteMeta with RBAC properties.
 */

import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    requiresGuest?: boolean;
    requiresRole?: string[];
    requiresPermission?: string;
  }
}
