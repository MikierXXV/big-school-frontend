/**
 * ============================================
 * TYPES: Common
 * ============================================
 *
 * Tipos comunes reutilizables.
 */

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type ID = string;

export interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}
