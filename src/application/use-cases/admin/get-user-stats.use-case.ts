/**
 * ============================================
 * USE CASE: GetUserStats
 * ============================================
 */

import type { IAdminRepository } from '@domain/repositories/admin.repository.interface.js';
import type { UserStatsDTO } from '../../dtos/admin/admin.dto.js';

export interface GetUserStatsDeps {
  adminRepository: IAdminRepository;
}

export class GetUserStatsUseCase {
  constructor(private readonly deps: GetUserStatsDeps) {}

  async execute(): Promise<UserStatsDTO> {
    return this.deps.adminRepository.getUserStats();
  }
}
