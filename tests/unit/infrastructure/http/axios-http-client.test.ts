/**
 * ============================================
 * UNIT TEST: Axios HTTP Client
 * ============================================
 *
 * Tests para el adapter de Axios que implementa IHttpClient.
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import axios, { type AxiosInstance } from 'axios';
import { AxiosHttpClient } from '@infrastructure/http/axios-http-client.js';
import type { HttpRequestConfig } from '@application/ports/http-client.port.js';

// Mock axios
vi.mock('axios');

describe('AxiosHttpClient', () => {
  let httpClient: AxiosHttpClient;
  let mockAxiosInstance: Partial<AxiosInstance>;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Create mock axios instance
    mockAxiosInstance = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      interceptors: {
        request: { use: vi.fn(), eject: vi.fn(), clear: vi.fn() },
        response: { use: vi.fn(), eject: vi.fn(), clear: vi.fn() },
      } as any,
    };

    // Mock axios.create to return our mock instance
    vi.mocked(axios.create).mockReturnValue(mockAxiosInstance as AxiosInstance);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should create axios instance with correct baseURL', () => {
      const baseURL = 'http://localhost:3000';
      httpClient = new AxiosHttpClient(baseURL);

      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: 'http://localhost:3000',
        })
      );
    });

    it('should create axios instance with 10 second timeout', () => {
      const baseURL = 'http://localhost:3000';
      httpClient = new AxiosHttpClient(baseURL);

      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          timeout: 10000,
        })
      );
    });

    it('should create axios instance with default JSON headers', () => {
      const baseURL = 'http://localhost:3000';
      httpClient = new AxiosHttpClient(baseURL);

      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
    });
  });

  describe('get', () => {
    beforeEach(() => {
      httpClient = new AxiosHttpClient('http://localhost:3000');
    });

    it('should execute GET request and return HttpResponse', async () => {
      const mockResponse = {
        data: { id: 1, name: 'Test' },
        status: 200,
        headers: { 'content-type': 'application/json' },
      };

      vi.mocked(mockAxiosInstance.get!).mockResolvedValue(mockResponse);

      const result = await httpClient.get('/api/users/1');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/users/1', {});
      expect(result).toEqual({
        data: { id: 1, name: 'Test' },
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    });

    it('should pass config (headers, params) to axios', async () => {
      const mockResponse = {
        data: { users: [] },
        status: 200,
        headers: {},
      };

      vi.mocked(mockAxiosInstance.get!).mockResolvedValue(mockResponse);

      const config: HttpRequestConfig = {
        headers: { 'X-Custom-Header': 'value' },
        params: { page: 1, limit: 10 },
      };

      await httpClient.get('/api/users', config);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/users', config);
    });

    it('should propagate axios errors', async () => {
      const axiosError = new Error('Network Error');
      vi.mocked(mockAxiosInstance.get!).mockRejectedValue(axiosError);

      await expect(httpClient.get('/api/users')).rejects.toThrow('Network Error');
    });
  });

  describe('post', () => {
    beforeEach(() => {
      httpClient = new AxiosHttpClient('http://localhost:3000');
    });

    it('should execute POST request with data', async () => {
      const mockResponse = {
        data: { id: 1, email: 'user@example.com' },
        status: 201,
        headers: {},
      };

      vi.mocked(mockAxiosInstance.post!).mockResolvedValue(mockResponse);

      const requestData = { email: 'user@example.com', password: 'Password123!' };

      const result = await httpClient.post('/api/auth/login', requestData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/auth/login', requestData, {});
      expect(result.data).toEqual({ id: 1, email: 'user@example.com' });
      expect(result.status).toBe(201);
    });

    it('should pass config to axios', async () => {
      const mockResponse = {
        data: { success: true },
        status: 200,
        headers: {},
      };

      vi.mocked(mockAxiosInstance.post!).mockResolvedValue(mockResponse);

      const requestData = { name: 'Test' };
      const config: HttpRequestConfig = {
        headers: { Authorization: 'Bearer token' },
      };

      await httpClient.post('/api/resource', requestData, config);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/resource', requestData, config);
    });

    it('should handle POST without data', async () => {
      const mockResponse = {
        data: { success: true },
        status: 200,
        headers: {},
      };

      vi.mocked(mockAxiosInstance.post!).mockResolvedValue(mockResponse);

      await httpClient.post('/api/action');

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/action', undefined, {});
    });
  });

  describe('put', () => {
    beforeEach(() => {
      httpClient = new AxiosHttpClient('http://localhost:3000');
    });

    it('should execute PUT request with data', async () => {
      const mockResponse = {
        data: { id: 1, name: 'Updated Name' },
        status: 200,
        headers: {},
      };

      vi.mocked(mockAxiosInstance.put!).mockResolvedValue(mockResponse);

      const requestData = { name: 'Updated Name' };

      const result = await httpClient.put('/api/users/1', requestData);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/api/users/1', requestData, {});
      expect(result.data).toEqual({ id: 1, name: 'Updated Name' });
    });

    it('should pass config to axios', async () => {
      const mockResponse = {
        data: { success: true },
        status: 200,
        headers: {},
      };

      vi.mocked(mockAxiosInstance.put!).mockResolvedValue(mockResponse);

      const requestData = { status: 'active' };
      const config: HttpRequestConfig = {
        headers: { Authorization: 'Bearer token' },
      };

      await httpClient.put('/api/users/1', requestData, config);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/api/users/1', requestData, config);
    });
  });

  describe('delete', () => {
    beforeEach(() => {
      httpClient = new AxiosHttpClient('http://localhost:3000');
    });

    it('should execute DELETE request', async () => {
      const mockResponse = {
        data: { success: true },
        status: 204,
        headers: {},
      };

      vi.mocked(mockAxiosInstance.delete!).mockResolvedValue(mockResponse);

      const result = await httpClient.delete('/api/users/1');

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/api/users/1', {});
      expect(result.status).toBe(204);
    });

    it('should pass config to axios', async () => {
      const mockResponse = {
        data: null,
        status: 204,
        headers: {},
      };

      vi.mocked(mockAxiosInstance.delete!).mockResolvedValue(mockResponse);

      const config: HttpRequestConfig = {
        headers: { Authorization: 'Bearer token' },
      };

      await httpClient.delete('/api/users/1', config);

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/api/users/1', config);
    });
  });

  describe('getAxiosInstance', () => {
    it('should expose axios instance for interceptor setup', () => {
      httpClient = new AxiosHttpClient('http://localhost:3000');

      const instance = httpClient.getAxiosInstance();

      expect(instance).toBe(mockAxiosInstance);
    });
  });
});
