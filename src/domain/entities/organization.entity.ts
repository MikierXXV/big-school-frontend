/**
 * ============================================
 * ENTITY: Organization
 * ============================================
 *
 * Representa una organización sanitaria en el sistema.
 */

import { OrganizationType } from '../value-objects/organization-type.value-object.js';

/**
 * Propiedades completas de una organización
 */
export interface OrganizationProps {
  readonly id: string;
  readonly name: string;
  readonly type: OrganizationType;
  readonly description: string;
  readonly address: string;
  readonly contactEmail: string;
  readonly contactPhone: string;
  readonly active: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Entity Organization
 */
export class Organization {
  private readonly _props: OrganizationProps;

  private constructor(props: OrganizationProps) {
    this._props = props;
  }

  /**
   * Reconstruye una organización desde persistencia/API.
   */
  public static fromPersistence(props: OrganizationProps): Organization {
    return new Organization(props);
  }

  // ============================================
  // GETTERS
  // ============================================

  public get id(): string {
    return this._props.id;
  }

  public get name(): string {
    return this._props.name;
  }

  public get type(): OrganizationType {
    return this._props.type;
  }

  public get description(): string {
    return this._props.description;
  }

  public get address(): string {
    return this._props.address;
  }

  public get contactEmail(): string {
    return this._props.contactEmail;
  }

  public get contactPhone(): string {
    return this._props.contactPhone;
  }

  public get active(): boolean {
    return this._props.active;
  }

  public get createdAt(): Date {
    return new Date(this._props.createdAt);
  }

  public get updatedAt(): Date {
    return new Date(this._props.updatedAt);
  }

  // ============================================
  // BUSINESS LOGIC
  // ============================================

  public isActive(): boolean {
    return this._props.active;
  }
}
