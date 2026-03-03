/**
 * ============================================
 * UNIT TEST: UpdateOrganizationUseCase
 * ============================================
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UpdateOrganizationUseCase } from '@application/use-cases/organization/update-organization.use-case.js';
import type { IOrganizationRepository } from '@domain/repositories/organization.repository.interface.js';
import type { OrganizationDTO } from '@application/dtos/organization/organization.dto.js';

describe('UpdateOrganizationUseCase', () => {
  let useCase: UpdateOrganizationUseCase;
  let mockRepo: IOrganizationRepository;

  beforeEach(() => {
    mockRepo = {
      create: vi.fn(),
      list: vi.fn(),
      getById: vi.fn(),
      update: vi.fn(),
      deactivate: vi.fn(),
    };
    useCase = new UpdateOrganizationUseCase({ organizationRepository: mockRepo });
  });

  it('should delegate to organizationRepository.update with id and data', async () => {
    const updateData = { name: 'Updated Hospital' };
    const expected: OrganizationDTO = {
      id: 'org-1',
      name: 'Updated Hospital',
      type: 'hospital',
      description: 'Main hospital',
      address: 'Calle Principal 1',
      contactEmail: 'admin@hospital.com',
      contactPhone: '600123456',
      active: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z',
    };
    vi.mocked(mockRepo.update).mockResolvedValue(expected);

    const result = await useCase.execute('org-1', updateData);

    expect(mockRepo.update).toHaveBeenCalledWith('org-1', updateData);
    expect(result).toBe(expected);
  });

  it('should propagate errors from the repository', async () => {
    vi.mocked(mockRepo.update).mockRejectedValue(new Error('Forbidden'));

    await expect(useCase.execute('org-1', { name: 'X' })).rejects.toThrow('Forbidden');
  });
});
