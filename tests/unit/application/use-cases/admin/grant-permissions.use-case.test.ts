/**
 * ============================================
 * UNIT TEST: GrantPermissionsUseCase
 * ============================================
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GrantPermissionsUseCase } from '@application/use-cases/admin/grant-permissions.use-case.js';
import type { IAdminRepository } from '@domain/repositories/admin.repository.interface.js';
import type { GrantPermissionsDTO, AdminPermissionsDTO } from '@application/dtos/admin/admin.dto.js';

describe('GrantPermissionsUseCase', () => {
  let useCase: GrantPermissionsUseCase;
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
    useCase = new GrantPermissionsUseCase({ adminRepository: mockRepo });
  });

  it('should delegate to adminRepository.grantPermissions with the data', async () => {
    const data: GrantPermissionsDTO = {
      userId: 'admin-1',
      permissions: ['manage_users', 'manage_organizations'],
    };
    const expected: AdminPermissionsDTO = {
      userId: 'admin-1',
      permissions: [
        { permission: 'manage_users', grantedBy: 'super-admin-1', grantedAt: '2024-01-01T00:00:00Z' },
        { permission: 'manage_organizations', grantedBy: 'super-admin-1', grantedAt: '2024-01-01T00:00:00Z' },
      ],
    };
    vi.mocked(mockRepo.grantPermissions).mockResolvedValue(expected);

    const result = await useCase.execute(data);

    expect(mockRepo.grantPermissions).toHaveBeenCalledWith(data);
    expect(result).toBe(expected);
  });

  it('should propagate errors from the repository', async () => {
    vi.mocked(mockRepo.grantPermissions).mockRejectedValue(new Error('Forbidden'));

    await expect(useCase.execute({ userId: 'admin-1', permissions: ['manage_users'] })).rejects.toThrow('Forbidden');
  });
});
