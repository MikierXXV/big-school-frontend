/**
 * ============================================
 * UNIT TEST: HttpOrganizationRepository
 * ============================================
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HttpOrganizationRepository } from '@infrastructure/repositories/http-organization.repository.js';
import type { IHttpClient, HttpResponse } from '@application/ports/http-client.port.js';

function createMockHttpClient(): IHttpClient {
  return {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  };
}

function mockResponse<T>(data: T): HttpResponse<any> {
  return { data: { data }, status: 200, headers: {} };
}

describe('HttpOrganizationRepository', () => {
  let repo: HttpOrganizationRepository;
  let httpClient: IHttpClient;

  beforeEach(() => {
    httpClient = createMockHttpClient();
    repo = new HttpOrganizationRepository(httpClient);
  });

  describe('create', () => {
    it('should POST to /api/organizations and return data', async () => {
      const input = { name: 'Hospital', type: 'hospital', description: '', address: '', contactEmail: '', contactPhone: '' };
      const orgData = { id: 'org-1', ...input, active: true, createdAt: '', updatedAt: '' };
      vi.mocked(httpClient.post).mockResolvedValue(mockResponse(orgData));

      const result = await repo.create(input);

      expect(httpClient.post).toHaveBeenCalledWith('/api/organizations', input);
      expect(result).toEqual(orgData);
    });
  });

  describe('list', () => {
    it('should GET /api/organizations with query params', async () => {
      const query = { page: 1, limit: 10, type: 'hospital' };
      const responseData = { organizations: [], total: 0, page: 1, limit: 10, totalPages: 0, hasNext: false, hasPrevious: false };
      vi.mocked(httpClient.get).mockResolvedValue(mockResponse(responseData));

      const result = await repo.list(query);

      expect(httpClient.get).toHaveBeenCalledWith('/api/organizations', { params: { page: 1, limit: 10, type: 'hospital' } });
      expect(result).toEqual(responseData);
    });

    it('should omit undefined query params', async () => {
      vi.mocked(httpClient.get).mockResolvedValue(mockResponse({ organizations: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrevious: false }));

      await repo.list({});

      expect(httpClient.get).toHaveBeenCalledWith('/api/organizations', { params: {} });
    });
  });

  describe('getById', () => {
    it('should GET /api/organizations/:id', async () => {
      const orgData = { id: 'org-1', name: 'Hospital', type: 'hospital', description: '', address: '', contactEmail: '', contactPhone: '', active: true, createdAt: '', updatedAt: '' };
      vi.mocked(httpClient.get).mockResolvedValue(mockResponse(orgData));

      const result = await repo.getById('org-1');

      expect(httpClient.get).toHaveBeenCalledWith('/api/organizations/org-1');
      expect(result).toEqual(orgData);
    });
  });

  describe('update', () => {
    it('should PUT /api/organizations/:id with data', async () => {
      const updateData = { name: 'Updated' };
      const orgData = { id: 'org-1', name: 'Updated', type: 'hospital', description: '', address: '', contactEmail: '', contactPhone: '', active: true, createdAt: '', updatedAt: '' };
      vi.mocked(httpClient.put).mockResolvedValue(mockResponse(orgData));

      const result = await repo.update('org-1', updateData);

      expect(httpClient.put).toHaveBeenCalledWith('/api/organizations/org-1', updateData);
      expect(result).toEqual(orgData);
    });
  });

  describe('deactivate', () => {
    it('should DELETE /api/organizations/:id', async () => {
      vi.mocked(httpClient.delete).mockResolvedValue(mockResponse(null));

      await repo.deactivate('org-1');

      expect(httpClient.delete).toHaveBeenCalledWith('/api/organizations/org-1');
    });
  });
});
