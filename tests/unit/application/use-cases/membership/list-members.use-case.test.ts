/**
 * ============================================
 * UNIT TEST: ListMembersUseCase
 * ============================================
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ListMembersUseCase } from '@application/use-cases/membership/list-members.use-case.js';
import type { IMembershipRepository } from '@domain/repositories/membership.repository.interface.js';
import type { MembershipDTO } from '@application/dtos/organization/membership.dto.js';

describe('ListMembersUseCase', () => {
  let useCase: ListMembersUseCase;
  let mockRepo: IMembershipRepository;

  beforeEach(() => {
    mockRepo = {
      assign: vi.fn(),
      remove: vi.fn(),
      changeRole: vi.fn(),
      getMembers: vi.fn(),
      getUserOrganizations: vi.fn(),
    };
    useCase = new ListMembersUseCase({ membershipRepository: mockRepo });
  });

  it('should delegate to membershipRepository.getMembers with orgId', async () => {
    const expected: MembershipDTO[] = [
      {
        id: 'mem-1',
        userId: 'user-1',
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        organizationId: 'org-1',
        role: 'doctor',
        joinedAt: '2024-01-01T00:00:00Z',
        isActive: true,
      },
    ];
    vi.mocked(mockRepo.getMembers).mockResolvedValue(expected);

    const result = await useCase.execute('org-1');

    expect(mockRepo.getMembers).toHaveBeenCalledWith('org-1');
    expect(result).toBe(expected);
  });

  it('should propagate errors from the repository', async () => {
    vi.mocked(mockRepo.getMembers).mockRejectedValue(new Error('Forbidden'));

    await expect(useCase.execute('org-1')).rejects.toThrow('Forbidden');
  });
});
