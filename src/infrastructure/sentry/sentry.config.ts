/**
 * ============================================
 * CONFIG: Sentry
 * ============================================
 *
 * Configuracion de Sentry para monitoreo de errores.
 *
 * RESPONSABILIDADES:
 * - Capturar errores no manejados
 * - Tracking de performance (10% de transacciones)
 * - Contexto de navegacion via Vue Router
 * - Filtrar errores de dominio esperados (credenciales, sesion, permisos)
 */

import * as Sentry from '@sentry/vue';
import type { App } from 'vue';
import type { Router } from 'vue-router';

/**
 * Codigos de error de dominio esperados — no enviar a Sentry.
 * Son errores de flujo normal de usuario, no bugs.
 */
const IGNORED_ERROR_CODES = [
  'DOMAIN_INVALID_CREDENTIALS',
  'DOMAIN_USER_NOT_FOUND',
  'DOMAIN_EMAIL_ALREADY_EXISTS',
  'DOMAIN_FORBIDDEN',
  'DOMAIN_INSUFFICIENT_PERMISSIONS',
  'DOMAIN_ORGANIZATION_NOT_FOUND',
  'DOMAIN_REFRESH_TOKEN_EXPIRED',
  'DOMAIN_INVALID_VERIFICATION_TOKEN',
  'DOMAIN_EMAIL_ALREADY_VERIFIED',
  'DOMAIN_ACCOUNT_LOCKED',
  'DOMAIN_EMAIL_NOT_VERIFIED',
];

export function initSentry(app: App, router: Router): void {
  Sentry.init({
    app,
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    integrations: [
      new Sentry.BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      }),
    ],
    tracesSampleRate: 0.1,
    beforeSend(event, hint) {
      const error = hint?.originalException;
      if (error && typeof error === 'object' && 'code' in error) {
        if (IGNORED_ERROR_CODES.includes((error as { code: string }).code)) {
          return null;
        }
      }
      return event;
    },
  });
}
