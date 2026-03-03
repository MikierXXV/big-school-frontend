/**
 * ============================================
 * UNIT TEST: DemoteAdminUseCase
 * ============================================
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DemoteAdminUseCase } from '@application/use-cases/admin/demote-admin.use-case.js';
import type { IAdminRepository } from '@domain/repositories/admin.repository.interface.js';
import type { DemoteUserDTO } from '@application/dtos/admin/admin.dto.js';

describe('DemoteAdminUseCase', () => {
  let useCase: DemoteAdminUseCase;
  let mockRepo: IAdminRepository;

  beforeEach(() => {
    mockRepo = {
      promote: vi.fn(),
      demote: vi.fn(),
      listAdmins: vi.fn(),
      getPermissions: vi.fn(),
      grantPermissions: vi.fn(),
      revokePermission: vi.fn(),
      listUsers: vi.fn(),
    };
    useCase = new DemoteAdminUseCase({ adminRepository: mockRepo });
  });

  it('should delegate to adminRepository.demote with the data', async () => {
    const data: DemoteUserDTO = { userId: 'admin-1' };
    vi.mocked(mockRepo.demote).mockResolvedValue(undefined);

    await useCase.execute(data);

    expect(mockRepo.demote).toHaveBeenCalledWith(data);
  });

  it('should propagate errors from the repository', async () => {
    vi.mocked(mockRepo.demote).mockRejectedValue(new Error('Cannot demote self'));

    await expect(useCase.execute({ userId: 'admin-1' })).rejects.toThrow('Cannot demote self');
  });
});
