/**
 * ============================================
 * UNIT TEST: HttpAdminRepository
 * ============================================
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HttpAdminRepository } from '@infrastructure/repositories/http-admin.repository.js';
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

describe('HttpAdminRepository', () => {
  let repo: HttpAdminRepository;
  let httpClient: IHttpClient;

  beforeEach(() => {
    httpClient = createMockHttpClient();
    repo = new HttpAdminRepository(httpClient);
  });

  describe('promote', () => {
    it('should POST to /api/admin/promote', async () => {
      vi.mocked(httpClient.post).mockResolvedValue(mockResponse(null));

      await repo.promote({ userId: 'user-1' });

      expect(httpClient.post).toHaveBeenCalledWith('/api/admin/promote', { userId: 'user-1' });
    });
  });

  describe('demote', () => {
    it('should POST to /api/admin/demote', async () => {
      vi.mocked(httpClient.post).mockResolvedValue(mockResponse(null));

      await repo.demote({ userId: 'admin-1' });

      expect(httpClient.post).toHaveBeenCalledWith('/api/admin/demote', { userId: 'admin-1' });
    });
  });

  describe('listAdmins', () => {
    it('should GET /api/admin/list', async () => {
      const adminList = { admins: [{ userId: 'admin-1', email: 'admin@test.com', firstName: 'Admin', lastName: 'User', systemRole: 'admin', permissions: [] }] };
      vi.mocked(httpClient.get).mockResolvedValue(mockResponse(adminList));

      const result = await repo.listAdmins();

      expect(httpClient.get).toHaveBeenCalledWith('/api/admin/list');
      expect(result).toEqual(adminList);
    });
  });

  describe('getPermissions', () => {
    it('should GET /api/admin/:userId/permissions', async () => {
      const perms = { userId: 'admin-1', permissions: [{ permission: 'manage_users', grantedBy: 'super-1', grantedAt: '' }] };
      vi.mocked(httpClient.get).mockResolvedValue(mockResponse(perms));

      const result = await repo.getPermissions('admin-1');

      expect(httpClient.get).toHaveBeenCalledWith('/api/admin/admin-1/permissions');
      expect(result).toEqual(perms);
    });
  });

  describe('grantPermissions', () => {
    it('should POST to /api/admin/permissions/grant', async () => {
      const data = { userId: 'admin-1', permissions: ['manage_users'] };
      const perms = { userId: 'admin-1', permissions: [{ permission: 'manage_users', grantedBy: 'super-1', grantedAt: '' }] };
      vi.mocked(httpClient.post).mockResolvedValue(mockResponse(perms));

      const result = await repo.grantPermissions(data);

      expect(httpClient.post).toHaveBeenCalledWith('/api/admin/permissions/grant', data);
      expect(result).toEqual(perms);
    });
  });

  describe('revokePermission', () => {
    it('should POST to /api/admin/permissions/revoke', async () => {
      const data = { userId: 'admin-1', permission: 'manage_users' };
      const perms = { userId: 'admin-1', permissions: [] };
      vi.mocked(httpClient.post).mockResolvedValue(mockResponse(perms));

      const result = await repo.revokePermission(data);

      expect(httpClient.post).toHaveBeenCalledWith('/api/admin/permissions/revoke', data);
      expect(result).toEqual(perms);
    });
  });

  describe('listUsers', () => {
    it('should GET /api/users with query params', async () => {
      const query = { page: 1, limit: 20, search: 'john' };
      const usersData = { users: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrevious: false };
      vi.mocked(httpClient.get).mockResolvedValue(mockResponse(usersData));

      const result = await repo.listUsers(query);

      expect(httpClient.get).toHaveBeenCalledWith('/api/users', { params: { page: 1, limit: 20, search: 'john' } });
      expect(result).toEqual(usersData);
    });

    it('should omit undefined query params', async () => {
      vi.mocked(httpClient.get).mockResolvedValue(mockResponse({ users: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrevious: false }));

      await repo.listUsers({});

      expect(httpClient.get).toHaveBeenCalledWith('/api/users', { params: {} });
    });
  });
});
