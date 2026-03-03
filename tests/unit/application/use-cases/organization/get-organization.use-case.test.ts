/**
 * ============================================
 * UNIT TEST: GetOrganizationUseCase
 * ============================================
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GetOrganizationUseCase } from '@application/use-cases/organization/get-organization.use-case.js';
import type { IOrganizationRepository } from '@domain/repositories/organization.repository.interface.js';
import type { OrganizationDTO } from '@application/dtos/organization/organization.dto.js';

describe('GetOrganizationUseCase', () => {
  let useCase: GetOrganizationUseCase;
  let mockRepo: IOrganizationRepository;

  beforeEach(() => {
    mockRepo = {
      create: vi.fn(),
      list: vi.fn(),
      getById: vi.fn(),
      update: vi.fn(),
      deactivate: vi.fn(),
    };
    useCase = new GetOrganizationUseCase({ organizationRepository: mockRepo });
  });

  it('should delegate to organizationRepository.getById with the id', async () => {
    const expected: OrganizationDTO = {
      id: 'org-1',
      name: 'Hospital Central',
      type: 'hospital',
      description: 'Main hospital',
      address: 'Calle Principal 1',
      contactEmail: 'admin@hospital.com',
      contactPhone: '600123456',
      active: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };
    vi.mocked(mockRepo.getById).mockResolvedValue(expected);

    const result = await useCase.execute('org-1');

    expect(mockRepo.getById).toHaveBeenCalledWith('org-1');
    expect(result).toBe(expected);
  });

  it('should propagate errors from the repository', async () => {
    vi.mocked(mockRepo.getById).mockRejectedValue(new Error('Not found'));

    await expect(useCase.execute('invalid-id')).rejects.toThrow('Not found');
  });
});
