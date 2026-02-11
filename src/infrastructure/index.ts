/**
 * ============================================
 * INFRASTRUCTURE LAYER - BARREL EXPORT
 * ============================================
 *
 * Implementaciones concretas de los puertos.
 * Esta capa conoce tecnologias especificas: Axios, localStorage, Sentry.
 *
 * CONTENIDO:
 * - HTTP: Cliente Axios con interceptors
 * - Repositories: Implementaciones de repositorios
 * - Storage: Servicio de almacenamiento local
 * - Sentry: Configuracion de monitoreo
 * - i18n: Configuracion de internacionalizacion
 * - Styles: Estilos globales (Tailwind)
 */

export * from './http/index.js';
export * from './repositories/index.js';
export * from './storage/index.js';
export * from './sentry/index.js';
export * from './i18n/index.js';
