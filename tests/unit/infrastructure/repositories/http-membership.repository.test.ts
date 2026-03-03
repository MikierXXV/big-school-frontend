/**
 * ============================================
 * UNIT TEST: HttpMembershipRepository
 * ============================================
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HttpMembershipRepository } from '@infrastructure/repositories/http-membership.repository.js';
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

describe('HttpMembershipRepository', () => {
  let repo: HttpMembershipRepository;
  let httpClient: IHttpClient;

  beforeEach(() => {
    httpClient = createMockHttpClient();
    repo = new HttpMembershipRepository(httpClient);
  });

  describe('assign', () => {
    it('should POST to /api/organizations/:orgId/members', async () => {
      const data = { userId: 'user-1', role: 'doctor' };
      const memberData = { id: 'mem-1', userId: 'user-1', email: 'john@test.com', firstName: 'John', lastName: 'Doe', organizationId: 'org-1', role: 'doctor', joinedAt: '', isActive: true };
      vi.mocked(httpClient.post).mockResolvedValue(mockResponse(memberData));

      const result = await repo.assign('org-1', data);

      expect(httpClient.post).toHaveBeenCalledWith('/api/organizations/org-1/members', data);
      expect(result).toEqual(memberData);
    });
  });

  describe('remove', () => {
    it('should DELETE /api/organizations/:orgId/members/:userId', async () => {
      vi.mocked(httpClient.delete).mockResolvedValue(mockResponse(null));

      await repo.remove('org-1', 'user-1');

      expect(httpClient.delete).toHaveBeenCalledWith('/api/organizations/org-1/members/user-1');
    });
  });

  describe('changeRole', () => {
    it('should PUT to /api/organizations/:orgId/members/:userId/role', async () => {
      const data = { role: 'nurse' };
      const memberData = { id: 'mem-1', userId: 'user-1', email: 'john@test.com', firstName: 'John', lastName: 'Doe', organizationId: 'org-1', role: 'nurse', joinedAt: '', isActive: true };
      vi.mocked(httpClient.put).mockResolvedValue(mockResponse(memberData));

      const result = await repo.changeRole('org-1', 'user-1', data);

      expect(httpClient.put).toHaveBeenCalledWith('/api/organizations/org-1/members/user-1/role', data);
      expect(result).toEqual(memberData);
    });
  });

  describe('getMembers', () => {
    it('should GET /api/organizations/:orgId/members', async () => {
      const members = [{ id: 'mem-1', userId: 'user-1', email: 'john@test.com', firstName: 'John', lastName: 'Doe', organizationId: 'org-1', role: 'doctor', joinedAt: '', isActive: true }];
      vi.mocked(httpClient.get).mockResolvedValue(mockResponse(members));

      const result = await repo.getMembers('org-1');

      expect(httpClient.get).toHaveBeenCalledWith('/api/organizations/org-1/members');
      expect(result).toEqual(members);
    });
  });

  describe('getUserOrganizations', () => {
    it('should GET /api/users/:userId/organizations', async () => {
      const orgs = [{ organizationId: 'org-1', organizationName: 'Hospital', organizationType: 'hospital', role: 'doctor', joinedAt: '', isActive: true }];
      vi.mocked(httpClient.get).mockResolvedValue(mockResponse(orgs));

      const result = await repo.getUserOrganizations('user-1');

      expect(httpClient.get).toHaveBeenCalledWith('/api/users/user-1/organizations');
      expect(result).toEqual(orgs);
    });
  });
});
