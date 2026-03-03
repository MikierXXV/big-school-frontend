/**
 * ============================================
 * UNIT TEST: GetUserOrganizationsUseCase
 * ============================================
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GetUserOrganizationsUseCase } from '@application/use-cases/membership/get-user-organizations.use-case.js';
import type { IMembershipRepository } from '@domain/repositories/membership.repository.interface.js';
import type { UserOrganizationDTO } from '@application/dtos/organization/membership.dto.js';

describe('GetUserOrganizationsUseCase', () => {
  let useCase: GetUserOrganizationsUseCase;
  let mockRepo: IMembershipRepository;

  beforeEach(() => {
    mockRepo = {
      assign: vi.fn(),
      remove: vi.fn(),
      changeRole: vi.fn(),
      getMembers: vi.fn(),
      getUserOrganizations: vi.fn(),
    };
    useCase = new GetUserOrganizationsUseCase({ membershipRepository: mockRepo });
  });

  it('should delegate to membershipRepository.getUserOrganizations with userId', async () => {
    const expected: UserOrganizationDTO[] = [
      {
        organizationId: 'org-1',
        organizationName: 'Hospital Central',
        organizationType: 'hospital',
        role: 'doctor',
        joinedAt: '2024-01-01T00:00:00Z',
      },
    ];
    vi.mocked(mockRepo.getUserOrganizations).mockResolvedValue(expected);

    const result = await useCase.execute('user-1');

    expect(mockRepo.getUserOrganizations).toHaveBeenCalledWith('user-1');
    expect(result).toBe(expected);
  });

  it('should propagate errors from the repository', async () => {
    vi.mocked(mockRepo.getUserOrganizations).mockRejectedValue(new Error('Forbidden'));

    await expect(useCase.execute('user-1')).rejects.toThrow('Forbidden');
  });
});
