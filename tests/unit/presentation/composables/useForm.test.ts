/**
 * ============================================
 * TEST: useForm Composable
 * ============================================
 *
 * Tests for form management composable.
 */

import { describe, it, expect, vi } from 'vitest';
import { useForm } from '@presentation/composables/useForm.js';
import { nextTick } from 'vue';

// Sample validation rules
const required = (value: string) => (value ? '' : 'This field is required');
const email = (value: string) =>
  value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Invalid email' : '';

describe('useForm', () => {
  describe('Initialization', () => {
    it('should initialize with given values', () => {
      const { values } = useForm({ name: 'John', email: '' });

      expect(values.value.name).toBe('John');
      expect(values.value.email).toBe('');
    });

    it('should initialize errors as empty object', () => {
      const { errors } = useForm({ name: '' });

      expect(errors.value).toEqual({});
    });

    it('should initialize isSubmitting as false', () => {
      const { isSubmitting } = useForm({ name: '' });

      expect(isSubmitting.value).toBe(false);
    });

    it('should initialize touched as empty object', () => {
      const { touched } = useForm({ name: '' });

      expect(touched.value).toEqual({});
    });
  });

  describe('Field Validation', () => {
    it('should validate single field and set error', () => {
      const { validateField, errors } = useForm(
        { name: '' },
        { name: [required] }
      );

      validateField('name');

      expect(errors.value.name).toBe('This field is required');
    });

    it('should validate single field and clear error when valid', () => {
      const { values, validateField, errors } = useForm(
        { name: '' },
        { name: [required] }
      );

      validateField('name');
      expect(errors.value.name).toBe('This field is required');

      values.value.name = 'John';
      validateField('name');
      expect(errors.value.name).toBeUndefined();
    });

    it('should run multiple validators on a field', () => {
      const { validateField, errors } = useForm(
        { email: 'invalid' },
        { email: [required, email] }
      );

      validateField('email');

      expect(errors.value.email).toBe('Invalid email');
    });

    it('should stop at first failing validator', () => {
      const { validateField, errors } = useForm(
        { email: '' },
        { email: [required, email] }
      );

      validateField('email');

      expect(errors.value.email).toBe('This field is required');
    });
  });

  describe('Form Validation', () => {
    it('should validate all fields', () => {
      const { validateForm, errors } = useForm(
        { name: '', email: '' },
        {
          name: [required],
          email: [required, email],
        }
      );

      const isValid = validateForm();

      expect(isValid).toBe(false);
      expect(errors.value.name).toBe('This field is required');
      expect(errors.value.email).toBe('This field is required');
    });

    it('should return true when all fields are valid', () => {
      const { validateForm, errors } = useForm(
        { name: 'John', email: 'john@example.com' },
        {
          name: [required],
          email: [required, email],
        }
      );

      const isValid = validateForm();

      expect(isValid).toBe(true);
      expect(errors.value).toEqual({});
    });

    it('should clear previous errors before validating', () => {
      const { values, validateForm, errors } = useForm(
        { name: '' },
        { name: [required] }
      );

      validateForm();
      expect(errors.value.name).toBe('This field is required');

      values.value.name = 'John';
      validateForm();
      expect(errors.value.name).toBeUndefined();
    });
  });

  describe('Touched State', () => {
    it('should mark field as touched', () => {
      const { setFieldTouched, touched } = useForm({ name: '' });

      setFieldTouched('name', true);

      expect(touched.value.name).toBe(true);
    });

    it('should unmark field as touched', () => {
      const { setFieldTouched, touched } = useForm({ name: '' });

      setFieldTouched('name', true);
      setFieldTouched('name', false);

      expect(touched.value.name).toBe(false);
    });
  });

  describe('Submit Handling', () => {
    it('should call onSubmit when form is valid', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      const { handleSubmit } = useForm(
        { name: 'John' },
        { name: [required] }
      );

      const submitHandler = handleSubmit(onSubmit);
      await submitHandler();

      expect(onSubmit).toHaveBeenCalled();
    });

    it('should not call onSubmit when form is invalid', async () => {
      const onSubmit = vi.fn();
      const { handleSubmit } = useForm({ name: '' }, { name: [required] });

      const submitHandler = handleSubmit(onSubmit);
      await submitHandler();

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('should set isSubmitting to true during submit', async () => {
      const onSubmit = vi.fn().mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );
      const { handleSubmit, isSubmitting } = useForm(
        { name: 'John' },
        { name: [required] }
      );

      const submitHandler = handleSubmit(onSubmit);
      const promise = submitHandler();
      await nextTick();

      expect(isSubmitting.value).toBe(true);

      await promise;
      expect(isSubmitting.value).toBe(false);
    });

    it('should set isSubmitting to false after submit completes', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      const { handleSubmit, isSubmitting } = useForm(
        { name: 'John' },
        { name: [required] }
      );

      const submitHandler = handleSubmit(onSubmit);
      await submitHandler();

      expect(isSubmitting.value).toBe(false);
    });

    it('should set isSubmitting to false if submit throws error', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const onSubmit = vi.fn().mockRejectedValue(new Error('Submit failed'));
      const { handleSubmit, isSubmitting } = useForm(
        { name: 'John' },
        { name: [required] }
      );

      const submitHandler = handleSubmit(onSubmit);
      // Errors are caught and logged, not re-thrown
      await submitHandler();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Form submission error:',
        expect.any(Error)
      );
      expect(isSubmitting.value).toBe(false);

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Reset Form', () => {
    it('should reset values to initial values', () => {
      const { values, resetForm } = useForm({ name: 'John', email: '' });

      values.value.name = 'Jane';
      values.value.email = 'jane@example.com';

      resetForm();

      expect(values.value.name).toBe('John');
      expect(values.value.email).toBe('');
    });

    it('should clear errors on reset', () => {
      const { errors, resetForm } = useForm({ name: '' }, { name: [required] });

      errors.value.name = 'This field is required';

      resetForm();

      expect(errors.value).toEqual({});
    });

    it('should clear touched state on reset', () => {
      const { touched, setFieldTouched, resetForm } = useForm({ name: '' });

      setFieldTouched('name', true);

      resetForm();

      expect(touched.value).toEqual({});
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined validators gracefully', () => {
      const { validateForm } = useForm({ name: 'John' });

      expect(() => validateForm()).not.toThrow();
    });

    it('should handle empty validators array', () => {
      const { validateForm } = useForm({ name: 'John' }, { name: [] });

      const isValid = validateForm();

      expect(isValid).toBe(true);
    });

    it('should handle nested field names with dot notation', () => {
      const { validateField, errors } = useForm(
        { 'user.name': '' },
        { 'user.name': [required] }
      );

      validateField('user.name');

      expect(errors.value['user.name']).toBe('This field is required');
    });
  });
});
