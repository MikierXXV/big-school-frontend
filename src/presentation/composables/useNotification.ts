/**
 * ============================================
 * COMPOSABLE: useNotification
 * ============================================
 *
 * Composable para mostrar notificaciones.
 *
 * TODO: Implementar composable completo
 */

export function useNotification() {
  function success(message: string): void {
    // TODO: Implementar notificacion success
    console.log('Success:', message);
  }

  function error(message: string): void {
    // TODO: Implementar notificacion error
    console.error('Error:', message);
  }

  function info(message: string): void {
    // TODO: Implementar notificacion info
    console.info('Info:', message);
  }

  return {
    success,
    error,
    info,
  };
}
