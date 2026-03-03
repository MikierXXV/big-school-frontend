/**
 * ============================================
 * UNIT TEST: CreateOrganizationUseCase
 * ============================================
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CreateOrganizationUseCase } from '@application/use-cases/organization/create-organization.use-case.js';
import type { IOrganizationRepository } from '@domain/repositories/organization.repository.interface.js';
import type { CreateOrganizationDTO, OrganizationDTO } from '@application/dtos/organization/organization.dto.js';

describe('CreateOrganizationUseCase', () => {
  let useCase: CreateOrganizationUseCase;
  let mockRepo: IOrganizationRepository;

  beforeEach(() => {
    mockRepo = {
      create: vi.fn(),
      list: vi.fn(),
      getById: vi.fn(),
      update: vi.fn(),
      deactivate: vi.fn(),
    };
    useCase = new CreateOrganizationUseCase({ organizationRepository: mockRepo });
  });

  it('should delegate to organizationRepository.create with the input data', async () => {
    const input: CreateOrganizationDTO = {
      name: 'Hospital Central',
      type: 'hospital',
      description: 'Main hospital',
      address: 'Calle Principal 1',
      contactEmail: 'admin@hospital.com',
      contactPhone: '600123456',
    };
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
    vi.mocked(mockRepo.create).mockResolvedValue(expected);

    const result = await useCase.execute(input);

    expect(mockRepo.create).toHaveBeenCalledWith(input);
    expect(result).toBe(expected);
  });

  it('should propagate errors from the repository', async () => {
    const input: CreateOrganizationDTO = { name: 'Test', type: 'clinic', description: '', address: '', contactEmail: '', contactPhone: '' };
    vi.mocked(mockRepo.create).mockRejectedValue(new Error('Network error'));

    await expect(useCase.execute(input)).rejects.toThrow('Network error');
  });
});
