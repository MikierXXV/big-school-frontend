/**
 * ============================================
 * UNIT TEST: RemoveMemberUseCase
 * ============================================
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RemoveMemberUseCase } from '@application/use-cases/membership/remove-member.use-case.js';
import type { IMembershipRepository } from '@domain/repositories/membership.repository.interface.js';

describe('RemoveMemberUseCase', () => {
  let useCase: RemoveMemberUseCase;
  let mockRepo: IMembershipRepository;

  beforeEach(() => {
    mockRepo = {
      assign: vi.fn(),
      remove: vi.fn(),
      changeRole: vi.fn(),
      getMembers: vi.fn(),
      getUserOrganizations: vi.fn(),
    };
    useCase = new RemoveMemberUseCase({ membershipRepository: mockRepo });
  });

  it('should delegate to membershipRepository.remove with orgId and userId', async () => {
    vi.mocked(mockRepo.remove).mockResolvedValue(undefined);

    await useCase.execute('org-1', 'user-1');

    expect(mockRepo.remove).toHaveBeenCalledWith('org-1', 'user-1');
  });

  it('should propagate errors from the repository', async () => {
    vi.mocked(mockRepo.remove).mockRejectedValue(new Error('Member not found'));

    await expect(useCase.execute('org-1', 'user-1')).rejects.toThrow('Member not found');
  });
});
