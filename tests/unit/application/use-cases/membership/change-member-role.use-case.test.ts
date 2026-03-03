/**
 * ============================================
 * UNIT TEST: ChangeMemberRoleUseCase
 * ============================================
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ChangeMemberRoleUseCase } from '@application/use-cases/membership/change-member-role.use-case.js';
import type { IMembershipRepository } from '@domain/repositories/membership.repository.interface.js';
import type { ChangeMemberRoleDTO, MembershipDTO } from '@application/dtos/organization/membership.dto.js';

describe('ChangeMemberRoleUseCase', () => {
  let useCase: ChangeMemberRoleUseCase;
  let mockRepo: IMembershipRepository;

  beforeEach(() => {
    mockRepo = {
      assign: vi.fn(),
      remove: vi.fn(),
      changeRole: vi.fn(),
      getMembers: vi.fn(),
      getUserOrganizations: vi.fn(),
    };
    useCase = new ChangeMemberRoleUseCase({ membershipRepository: mockRepo });
  });

  it('should delegate to membershipRepository.changeRole with orgId, userId, and data', async () => {
    const data: ChangeMemberRoleDTO = { role: 'specialist' };
    const expected: MembershipDTO = {
      id: 'mem-1',
      userId: 'user-1',
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      organizationId: 'org-1',
      role: 'specialist',
      joinedAt: '2024-01-01T00:00:00Z',
      isActive: true,
    };
    vi.mocked(mockRepo.changeRole).mockResolvedValue(expected);

    const result = await useCase.execute('org-1', 'user-1', data);

    expect(mockRepo.changeRole).toHaveBeenCalledWith('org-1', 'user-1', data);
    expect(result).toBe(expected);
  });

  it('should propagate errors from the repository', async () => {
    vi.mocked(mockRepo.changeRole).mockRejectedValue(new Error('Member not found'));

    await expect(useCase.execute('org-1', 'user-1', { role: 'nurse' })).rejects.toThrow('Member not found');
  });
});
