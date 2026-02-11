/**
 * ============================================
 * ADAPTER: Axios HTTP Client
 * ============================================
 *
 * Implementacion del puerto IHttpClient usando Axios.
 *
 * RESPONSABILIDADES:
 * - Ejecutar peticiones HTTP
 * - Manejar interceptors (auth, errores)
 * - Configurar baseURL y headers por defecto
 *
 * TODO: Implementar adapter completo
 */

import type { IHttpClient } from '@application/ports/http-client.port.js';

export class AxiosHttpClient implements IHttpClient {
  // TODO: Implementar con Axios
  // - Configurar baseURL desde environment
  // - Agregar interceptors de auth y error
}
