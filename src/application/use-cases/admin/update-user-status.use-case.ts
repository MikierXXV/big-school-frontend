/**
 * ============================================
 * USE CASE: UpdateUserStatus
 * ============================================
 */

import type { IAdminRepository } from '@domain/repositories/admin.repository.interface.js';
import type { UpdateUserStatusDTO, UpdateUserStatusResponseDTO } from '@application/dtos/admin/admin.dto.js';

export class UpdateUserStatusUseCase {
  constructor(private readonly adminRepository: IAdminRepository) {}

  async execute(data: UpdateUserStatusDTO): Promise<UpdateUserStatusResponseDTO> {
    return this.adminRepository.updateUserStatus(data);
  }
}
