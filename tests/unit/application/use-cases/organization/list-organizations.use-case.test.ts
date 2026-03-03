/**
 * ============================================
 * UNIT TEST: ListOrganizationsUseCase
 * ============================================
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ListOrganizationsUseCase } from '@application/use-cases/organization/list-organizations.use-case.js';
import type { IOrganizationRepository } from '@domain/repositories/organization.repository.interface.js';
import type { PaginatedOrganizationsDTO } from '@application/dtos/organization/organization.dto.js';

describe('ListOrganizationsUseCase', () => {
  let useCase: ListOrganizationsUseCase;
  let mockRepo: IOrganizationRepository;

  beforeEach(() => {
    mockRepo = {
      create: vi.fn(),
      list: vi.fn(),
      getById: vi.fn(),
      update: vi.fn(),
      deactivate: vi.fn(),
    };
    useCase = new ListOrganizationsUseCase({ organizationRepository: mockRepo });
  });

  it('should delegate to organizationRepository.list with query params', async () => {
    const query = { page: 2, limit: 10, type: 'hospital' };
    const expected: PaginatedOrganizationsDTO = {
      organizations: [],
      total: 0,
      page: 2,
      limit: 10,
      totalPages: 0,
      hasNext: false,
      hasPrevious: true,
    };
    vi.mocked(mockRepo.list).mockResolvedValue(expected);

    const result = await useCase.execute(query);

    expect(mockRepo.list).toHaveBeenCalledWith(query);
    expect(result).toBe(expected);
  });

  it('should use empty query by default', async () => {
    const expected: PaginatedOrganizationsDTO = {
      organizations: [],
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0,
      hasNext: false,
      hasPrevious: false,
    };
    vi.mocked(mockRepo.list).mockResolvedValue(expected);

    await useCase.execute();

    expect(mockRepo.list).toHaveBeenCalledWith({});
  });

  it('should propagate errors from the repository', async () => {
    vi.mocked(mockRepo.list).mockRejectedValue(new Error('Server error'));

    await expect(useCase.execute()).rejects.toThrow('Server error');
  });
});
