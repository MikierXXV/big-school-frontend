/**
 * ============================================
 * COMPOSABLE: useForm
 * ============================================
 *
 * Composable para manejo de formularios.
 *
 * TODO: Implementar composable completo
 */

import { ref } from 'vue';

export function useForm<T>(initialValues: T) {
  const values = ref<T>(initialValues);
  const errors = ref<Record<string, string>>({});
  const isSubmitting = ref(false);

  // TODO: Implementar validacion y submit
  // function validate(): boolean
  // async function handleSubmit(onSubmit: (values: T) => Promise<void>): Promise<void>

  return {
    values,
    errors,
    isSubmitting,
  };
}
