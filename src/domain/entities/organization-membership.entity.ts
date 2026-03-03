/**
 * ============================================
 * ENTITY: OrganizationMembership
 * ============================================
 *
 * Representa la membresía de un usuario en una organización.
 */

import { OrganizationRole } from '../value-objects/organization-role.value-object.js';

/**
 * Propiedades completas de una membresía
 */
export interface OrganizationMembershipProps {
  readonly id: string;
  readonly userId: string;
  readonly organizationId: string;
  readonly role: OrganizationRole;
  readonly joinedAt: Date;
  readonly leftAt: Date | null;
  readonly createdBy: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Entity OrganizationMembership
 */
export class OrganizationMembership {
  private readonly _props: OrganizationMembershipProps;

  private constructor(props: OrganizationMembershipProps) {
    this._props = props;
  }

  /**
   * Reconstruye una membresía desde persistencia/API.
   */
  public static fromPersistence(props: OrganizationMembershipProps): OrganizationMembership {
    return new OrganizationMembership(props);
  }

  // ============================================
  // GETTERS
  // ============================================

  public get id(): string {
    return this._props.id;
  }

  public get userId(): string {
    return this._props.userId;
  }

  public get organizationId(): string {
    return this._props.organizationId;
  }

  public get role(): OrganizationRole {
    return this._props.role;
  }

  public get joinedAt(): Date {
    return new Date(this._props.joinedAt);
  }

  public get leftAt(): Date | null {
    return this._props.leftAt ? new Date(this._props.leftAt) : null;
  }

  public get createdBy(): string {
    return this._props.createdBy;
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

  /**
   * Verifica si la membresía está activa (no ha dejado la organización).
   */
  public isActive(): boolean {
    return this._props.leftAt === null;
  }
}
