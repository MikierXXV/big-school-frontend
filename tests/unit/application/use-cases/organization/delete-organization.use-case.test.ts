/**
 * ============================================
 * UNIT TEST: DeleteOrganizationUseCase
 * ============================================
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DeleteOrganizationUseCase } from '@application/use-cases/organization/delete-organization.use-case.js';
import type { IOrganizationRepository } from '@domain/repositories/organization.repository.interface.js';

describe('DeleteOrganizationUseCase', () => {
  let useCase: DeleteOrganizationUseCase;
  let mockRepo: IOrganizationRepository;

  beforeEach(() => {
    mockRepo = {
      create: vi.fn(),
      list: vi.fn(),
      getById: vi.fn(),
      update: vi.fn(),
      deactivate: vi.fn(),
    };
    useCase = new DeleteOrganizationUseCase({ organizationRepository: mockRepo });
  });

  it('should delegate to organizationRepository.deactivate with the id', async () => {
    vi.mocked(mockRepo.deactivate).mockResolvedValue(undefined);

    await useCase.execute('org-1');

    expect(mockRepo.deactivate).toHaveBeenCalledWith('org-1');
  });

  it('should propagate errors from the repository', async () => {
    vi.mocked(mockRepo.deactivate).mockRejectedValue(new Error('Not found'));

    await expect(useCase.execute('invalid-id')).rejects.toThrow('Not found');
  });
});
