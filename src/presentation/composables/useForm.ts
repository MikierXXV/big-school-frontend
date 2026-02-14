/**
 * ============================================
 * COMPOSABLE: useForm
 * ============================================
 *
 * Composable for form management with validation.
 */

import { ref } from 'vue';

export type ValidationRule<T = any> = (value: T) => string;
export type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule<T[K]>[];
};

export function useForm<T extends Record<string, any>>(
  initialValues: T,
  validationRules?: ValidationRules<T>
) {
  // Store a copy of initial values to reset to later
  const storedInitialValues = { ...initialValues };

  const values = ref<T>({ ...initialValues }) as typeof ref<T>;
  const errors = ref<Record<string, string>>({});
  const touched = ref<Record<string, boolean>>({});
  const isSubmitting = ref(false);

  /**
   * Validate a single field
   */
  function validateField(fieldName: keyof T): boolean {
    const rules = validationRules?.[fieldName];
    if (!rules || rules.length === 0) {
      delete errors.value[fieldName as string];
      return true;
    }

    const value = values.value[fieldName];

    // Run validators until one fails
    for (const rule of rules) {
      const errorMessage = rule(value);
      if (errorMessage) {
        errors.value[fieldName as string] = errorMessage;
        return false;
      }
    }

    // All validators passed
    delete errors.value[fieldName as string];
    return true;
  }

  /**
   * Validate all fields
   */
  function validateForm(): boolean {
    if (!validationRules) return true;

    let isValid = true;

    // Clear previous errors
    errors.value = {};

    // Validate each field
    for (const fieldName in validationRules) {
      const fieldIsValid = validateField(fieldName);
      if (!fieldIsValid) {
        isValid = false;
        // Mark field as touched so error displays
        touched.value[fieldName as string] = true;
      }
    }

    return isValid;
  }

  /**
   * Mark a field as touched or untouched
   */
  function setFieldTouched(fieldName: keyof T, isTouched: boolean): void {
    touched.value[fieldName as string] = isTouched;
  }

  /**
   * Handle form submission - returns a function that can be used as @submit handler
   */
  function handleSubmit(
    submitFn: () => void | Promise<void>
  ): (event?: Event) => Promise<void> {
    return async (event?: Event) => {
      if (event) {
        event.preventDefault();
      }

      const isValid = validateForm();
      if (!isValid) {
        return;
      }

      try {
        isSubmitting.value = true;
        await submitFn();
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        isSubmitting.value = false;
      }
    };
  }

  /**
   * Reset form to initial state
   */
  function resetForm(): void {
    // Reset each field individually to maintain reactivity
    for (const key in storedInitialValues) {
      values.value[key] = storedInitialValues[key];
    }
    errors.value = {};
    touched.value = {};
  }

  return {
    values,
    errors,
    touched,
    isSubmitting,
    validateField,
    validateForm,
    setFieldTouched,
    handleSubmit,
    resetForm,
  };
}
