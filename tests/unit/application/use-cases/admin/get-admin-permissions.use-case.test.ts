/**
 * ============================================
 * UNIT TEST: GetAdminPermissionsUseCase
 * ============================================
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GetAdminPermissionsUseCase } from '@application/use-cases/admin/get-admin-permissions.use-case.js';
import type { IAdminRepository } from '@domain/repositories/admin.repository.interface.js';
import type { AdminPermissionsDTO } from '@application/dtos/admin/admin.dto.js';

describe('GetAdminPermissionsUseCase', () => {
  let useCase: GetAdminPermissionsUseCase;
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
    useCase = new GetAdminPermissionsUseCase({ adminRepository: mockRepo });
  });

  it('should delegate to adminRepository.getPermissions with userId', async () => {
    const expected: AdminPermissionsDTO = {
      userId: 'admin-1',
      permissions: [
        {
          permission: 'manage_users',
          grantedBy: 'super-admin-1',
          grantedAt: '2024-01-01T00:00:00Z',
        },
      ],
    };
    vi.mocked(mockRepo.getPermissions).mockResolvedValue(expected);

    const result = await useCase.execute('admin-1');

    expect(mockRepo.getPermissions).toHaveBeenCalledWith('admin-1');
    expect(result).toBe(expected);
  });

  it('should propagate errors from the repository', async () => {
    vi.mocked(mockRepo.getPermissions).mockRejectedValue(new Error('Not found'));

    await expect(useCase.execute('invalid-id')).rejects.toThrow('Not found');
  });
});
