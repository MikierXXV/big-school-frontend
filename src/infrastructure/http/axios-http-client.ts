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

    // Response interceptor: extract user-friendly error messages from backend
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (axios.isAxiosError(error) && error.response?.data) {
          const data = error.response.data as Record<string, unknown>;

          // Backend returns { success: false, error: { message: "..." } }
          const backendError = data.error as Record<string, unknown> | undefined;
          const message = backendError?.message
            ?? data.message
            ?? this.getDefaultErrorMessage(error.response.status);

          return Promise.reject(new Error(message as string));
        }

        // Network error or timeout
        if (error.code === 'ECONNABORTED') {
          return Promise.reject(new Error('The request timed out. Please try again.'));
        }
        if (!error.response) {
          return Promise.reject(new Error('Unable to connect to the server. Check your connection.'));
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Returns a user-friendly message for common HTTP status codes.
   */
  private getDefaultErrorMessage(status: number): string {
    const messages: Record<number, string> = {
      400: 'The request contains invalid data. Please check and try again.',
      401: 'Invalid credentials or session expired. Please sign in again.',
      403: 'You do not have permission to perform this action.',
      404: 'The requested resource was not found.',
      409: 'This action conflicts with existing data.',
      422: 'The submitted data is not valid. Please review the form.',
      429: 'Too many requests. Please wait a moment and try again.',
      500: 'An internal server error occurred. Please try again later.',
      503: 'The service is temporarily unavailable. Please try again later.',
    };
    return messages[status] ?? `An unexpected error occurred (${status}).`;
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
