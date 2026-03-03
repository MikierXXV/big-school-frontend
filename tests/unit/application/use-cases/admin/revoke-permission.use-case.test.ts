/**
 * ============================================
 * UNIT TEST: RevokePermissionUseCase
 * ============================================
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RevokePermissionUseCase } from '@application/use-cases/admin/revoke-permission.use-case.js';
import type { IAdminRepository } from '@domain/repositories/admin.repository.interface.js';
import type { RevokePermissionDTO, AdminPermissionsDTO } from '@application/dtos/admin/admin.dto.js';

describe('RevokePermissionUseCase', () => {
  let useCase: RevokePermissionUseCase;
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
    useCase = new RevokePermissionUseCase({ adminRepository: mockRepo });
  });

  it('should delegate to adminRepository.revokePermission with the data', async () => {
    const data: RevokePermissionDTO = {
      userId: 'admin-1',
      permission: 'manage_users',
    };
    const expected: AdminPermissionsDTO = {
      userId: 'admin-1',
      permissions: [],
    };
    vi.mocked(mockRepo.revokePermission).mockResolvedValue(expected);

    const result = await useCase.execute(data);

    expect(mockRepo.revokePermission).toHaveBeenCalledWith(data);
    expect(result).toBe(expected);
  });

  it('should propagate errors from the repository', async () => {
    vi.mocked(mockRepo.revokePermission).mockRejectedValue(new Error('Permission not found'));

    await expect(useCase.execute({ userId: 'admin-1', permission: 'manage_users' })).rejects.toThrow('Permission not found');
  });
});
