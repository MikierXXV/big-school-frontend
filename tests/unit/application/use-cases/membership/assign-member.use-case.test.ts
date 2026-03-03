/**
 * ============================================
 * UNIT TEST: AssignMemberUseCase
 * ============================================
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AssignMemberUseCase } from '@application/use-cases/membership/assign-member.use-case.js';
import type { IMembershipRepository } from '@domain/repositories/membership.repository.interface.js';
import type { AssignMemberDTO, MembershipDTO } from '@application/dtos/organization/membership.dto.js';

describe('AssignMemberUseCase', () => {
  let useCase: AssignMemberUseCase;
  let mockRepo: IMembershipRepository;

  beforeEach(() => {
    mockRepo = {
      assign: vi.fn(),
      remove: vi.fn(),
      changeRole: vi.fn(),
      getMembers: vi.fn(),
      getUserOrganizations: vi.fn(),
    };
    useCase = new AssignMemberUseCase({ membershipRepository: mockRepo });
  });

  it('should delegate to membershipRepository.assign with orgId and data', async () => {
    const data: AssignMemberDTO = { userId: 'user-1', role: 'doctor' };
    const expected: MembershipDTO = {
      id: 'mem-1',
      userId: 'user-1',
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      organizationId: 'org-1',
      role: 'doctor',
      joinedAt: '2024-01-01T00:00:00Z',
      isActive: true,
    };
    vi.mocked(mockRepo.assign).mockResolvedValue(expected);

    const result = await useCase.execute('org-1', data);

    expect(mockRepo.assign).toHaveBeenCalledWith('org-1', data);
    expect(result).toBe(expected);
  });

  it('should propagate errors from the repository', async () => {
    const data: AssignMemberDTO = { userId: 'user-1', role: 'doctor' };
    vi.mocked(mockRepo.assign).mockRejectedValue(new Error('Already exists'));

    await expect(useCase.execute('org-1', data)).rejects.toThrow('Already exists');
  });
});
