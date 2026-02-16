/**
 * ============================================
 * ADAPTER: Axios HTTP Client
 * ============================================
 *
 * Implementacion del puerto IHttpClient usando Axios.
 *
 * RESPONSABILIDADES:
 * - Ejecutar peticiones HTTP
 * - Manejar interceptors (auth, errores)
 * - Configurar baseURL y headers por defecto
 */

import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import type { IHttpClient, HttpResponse, HttpRequestConfig } from '@application/ports/http-client.port.js';

export class AxiosHttpClient implements IHttpClient {
  private readonly axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 10000, // 10 seconds
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor: attach Authorization header from stored token
    this.axiosInstance.interceptors.request.use((config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async get<T>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    const response = await this.axiosInstance.get<T>(url, config || {});
    return this.mapAxiosResponse(response);
  }

  async post<T>(url: string, data?: unknown, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    const response = await this.axiosInstance.post<T>(url, data, config || {});
    return this.mapAxiosResponse(response);
  }

  async put<T>(url: string, data?: unknown, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    const response = await this.axiosInstance.put<T>(url, data, config || {});
    return this.mapAxiosResponse(response);
  }

  async delete<T>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    const response = await this.axiosInstance.delete<T>(url, config || {});
    return this.mapAxiosResponse(response);
  }

  /**
   * Maps Axios response to HttpResponse interface
   */
  private mapAxiosResponse<T>(response: AxiosResponse<T>): HttpResponse<T> {
    return {
      data: response.data,
      status: response.status,
      headers: response.headers as Record<string, string>,
    };
  }

  /**
   * Exposes the Axios instance for interceptor setup
   */
  public getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}
