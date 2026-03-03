/**
 * ============================================
 * UNIT TEST: ListUsersUseCase
 * ============================================
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ListUsersUseCase } from '@application/use-cases/admin/list-users.use-case.js';
import type { IAdminRepository } from '@domain/repositories/admin.repository.interface.js';
import type { PaginatedUsersDTO } from '@application/dtos/admin/admin.dto.js';

describe('ListUsersUseCase', () => {
  let useCase: ListUsersUseCase;
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
    useCase = new ListUsersUseCase({ adminRepository: mockRepo });
  });

  it('should delegate to adminRepository.listUsers with query params', async () => {
    const query = { page: 1, limit: 20, search: 'john' };
    const expected: PaginatedUsersDTO = {
      users: [
        {
          id: 'user-1',
          email: 'john@example.com',
          firstName: 'John',
          lastName: 'Doe',
          fullName: 'John Doe',
          systemRole: 'user',
          status: 'active',
          emailVerified: true,
          createdAt: '2024-01-01T00:00:00Z',
        },
      ],
      total: 1,
      page: 1,
      limit: 20,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
    };
    vi.mocked(mockRepo.listUsers).mockResolvedValue(expected);

    const result = await useCase.execute(query);

    expect(mockRepo.listUsers).toHaveBeenCalledWith(query);
    expect(result).toBe(expected);
  });

  it('should use empty query by default', async () => {
    const expected: PaginatedUsersDTO = {
      users: [],
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0,
      hasNext: false,
      hasPrevious: false,
    };
    vi.mocked(mockRepo.listUsers).mockResolvedValue(expected);

    await useCase.execute();

    expect(mockRepo.listUsers).toHaveBeenCalledWith({});
  });

  it('should propagate errors from the repository', async () => {
    vi.mocked(mockRepo.listUsers).mockRejectedValue(new Error('Forbidden'));

    await expect(useCase.execute()).rejects.toThrow('Forbidden');
  });
});
