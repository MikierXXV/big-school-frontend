/**
 * ============================================
 * UNIT TEST: PromoteAdminUseCase
 * ============================================
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PromoteAdminUseCase } from '@application/use-cases/admin/promote-admin.use-case.js';
import type { IAdminRepository } from '@domain/repositories/admin.repository.interface.js';
import type { PromoteUserDTO } from '@application/dtos/admin/admin.dto.js';

describe('PromoteAdminUseCase', () => {
  let useCase: PromoteAdminUseCase;
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
    useCase = new PromoteAdminUseCase({ adminRepository: mockRepo });
  });

  it('should delegate to adminRepository.promote with the data', async () => {
    const data: PromoteUserDTO = { userId: 'user-1' };
    vi.mocked(mockRepo.promote).mockResolvedValue(undefined);

    await useCase.execute(data);

    expect(mockRepo.promote).toHaveBeenCalledWith(data);
  });

  it('should propagate errors from the repository', async () => {
    vi.mocked(mockRepo.promote).mockRejectedValue(new Error('Forbidden'));

    await expect(useCase.execute({ userId: 'user-1' })).rejects.toThrow('Forbidden');
  });
});
