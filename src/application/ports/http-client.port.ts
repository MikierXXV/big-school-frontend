/**
 * ============================================
 * PORT: HTTP Client
 * ============================================
 *
 * Define el contrato para el cliente HTTP.
 * La implementacion (Axios) estara en Infrastructure.
 *
 * TODO: Implementar interface completa
 */

export interface HttpResponse<T> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

export interface HttpRequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
}

export interface IHttpClient {
  get<T>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>>;
  post<T>(url: string, data?: unknown, config?: HttpRequestConfig): Promise<HttpResponse<T>>;
  put<T>(url: string, data?: unknown, config?: HttpRequestConfig): Promise<HttpResponse<T>>;
  delete<T>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>>;
}
