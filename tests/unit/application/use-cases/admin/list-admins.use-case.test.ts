/**
 * ============================================
 * UNIT TEST: ListAdminsUseCase
 * ============================================
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ListAdminsUseCase } from '@application/use-cases/admin/list-admins.use-case.js';
import type { IAdminRepository } from '@domain/repositories/admin.repository.interface.js';
import type { AdminListDTO } from '@application/dtos/admin/admin.dto.js';

describe('ListAdminsUseCase', () => {
  let useCase: ListAdminsUseCase;
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
    useCase = new ListAdminsUseCase({ adminRepository: mockRepo });
  });

  it('should delegate to adminRepository.listAdmins', async () => {
    const expected: AdminListDTO = {
      admins: [
        {
          userId: 'admin-1',
          email: 'admin@example.com',
          firstName: 'Admin',
          lastName: 'User',
          systemRole: 'admin',
          permissions: ['manage_users'],
        },
      ],
    };
    vi.mocked(mockRepo.listAdmins).mockResolvedValue(expected);

    const result = await useCase.execute();

    expect(mockRepo.listAdmins).toHaveBeenCalled();
    expect(result).toBe(expected);
  });

  it('should propagate errors from the repository', async () => {
    vi.mocked(mockRepo.listAdmins).mockRejectedValue(new Error('Forbidden'));

    await expect(useCase.execute()).rejects.toThrow('Forbidden');
  });
});
