/**
 * ============================================
 * PORT: Storage
 * ============================================
 *
 * Define el contrato para almacenamiento local.
 * La implementacion (localStorage) estara en Infrastructure.
 */

export interface IStorageService {
  setItem(key: string, value: string): void;
  getItem(key: string): string | null;
  removeItem(key: string): void;
  clear(): void;
}
