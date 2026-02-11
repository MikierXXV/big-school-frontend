/**
 * ============================================
 * DOMAIN LAYER - BARREL EXPORT
 * ============================================
 *
 * Punto de entrada unico para la capa de dominio.
 * Esta capa contiene la logica de negocio pura del frontend.
 *
 * PRINCIPIOS:
 * - El dominio es el corazon de la aplicacion
 * - No conoce Vue, ni HTTP, ni almacenamiento
 * - Solo expresa reglas de negocio mediante entidades y value objects
 *
 * CONTENIDO:
 * - Entities: Objetos con identidad (User)
 * - Value Objects: Objetos inmutables sin identidad (Email, UserId)
 * - Repository Interfaces: Contratos para acceso a datos
 * - Domain Errors: Errores especificos del dominio
 */

export * from './entities/index.js';
export * from './value-objects/index.js';
export * from './repositories/index.js';
export * from './errors/index.js';
