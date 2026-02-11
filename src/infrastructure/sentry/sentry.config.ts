/**
 * ============================================
 * CONFIG: Sentry
 * ============================================
 *
 * Configuracion de Sentry para monitoreo de errores.
 *
 * RESPONSABILIDADES:
 * - Capturar errores no manejados
 * - Tracking de performance
 * - Contexto de usuario
 *
 * TODO: Implementar configuracion con DSN de produccion
 */

import * as Sentry from '@sentry/vue';
import type { App } from 'vue';

export function initSentry(app: App): void {
  // TODO: Implementar inicializacion
  // Sentry.init({
  //   app,
  //   dsn: import.meta.env.VITE_SENTRY_DSN,
  //   environment: import.meta.env.MODE,
  //   tracesSampleRate: 1.0,
  // });
}
