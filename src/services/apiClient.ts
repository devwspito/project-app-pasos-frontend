/**
 * Axios API client with authentication interceptors.
 *
 * Features:
 * - Automatic token attachment to requests
 * - Token refresh on 401 responses
 * - Typed HTTP methods (get, post, put, delete)
 *
 * Usage:
 * import { apiClient } from '@/services/apiClient';
 * const response = await apiClient.get<MyDataType>('/endpoint');
 */

import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import { getToken, getRefreshToken, setTokens, clearTokens } from '@/utils/tokenStorage';

/**
 * Base URL for API requests - uses environment variable or defaults to localhost
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Flag to prevent multiple simultaneous token refresh attempts
 */
let isRefreshing = false;

/**
 * Queue of requests waiting for token refresh
 */
let failedRequestsQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}> = [];

/**
 * Process queued requests after token refresh
 */
const processQueue = (error: Error | null, token: string | null = null): void => {
  failedRequestsQueue.forEach((request) => {
    if (error) {
      request.reject(error);
    } else if (token) {
      request.resolve(token);
    }
  });
  failedRequestsQueue = [];
};

/**
 * Create axios instance with base configuration
 */
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

/**
 * Request interceptor - adds Authorization header with Bearer token
 */
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    const token = await getToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - handles 401 errors and attempts token refresh
 */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  async (error: AxiosError): Promise<AxiosResponse> => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Check if error is 401 and we haven't already tried to retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise<AxiosResponse>((resolve, reject) => {
          failedRequestsQueue.push({
            resolve: async (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              try {
                const response = await axiosInstance(originalRequest);
                resolve(response);
              } catch (err) {
                reject(err);
              }
            },
            reject: (err: Error) => {
              reject(err);
            },
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await getRefreshToken();

        if (!refreshToken) {
          // No refresh token - clear tokens and reject
          await clearTokens();
          processQueue(new Error('No refresh token available'));
          return Promise.reject(error);
        }

        // Attempt to refresh the token
        const refreshResponse = await axios.post<{
          success: boolean;
          data: {
            token: string;
            refreshToken: string;
          };
        }>(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        if (refreshResponse.data.success) {
          const { token: newToken, refreshToken: newRefreshToken } =
            refreshResponse.data.data;

          // Store new tokens
          await setTokens(newToken, newRefreshToken);

          // Update authorization header for retry
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }

          // Process queued requests with new token
          processQueue(null, newToken);

          // Retry original request
          return axiosInstance(originalRequest);
        } else {
          // Refresh failed - clear tokens
          await clearTokens();
          processQueue(new Error('Token refresh failed'));
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // Refresh request failed - clear tokens
        await clearTokens();
        processQueue(refreshError instanceof Error ? refreshError : new Error('Token refresh failed'));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Typed API client with convenience methods
 */
export const apiClient = {
  /**
   * Performs a GET request
   * @template T - Expected response data type
   * @param url - Request URL (relative to base URL)
   * @param config - Optional axios config
   * @returns Promise with typed response
   */
  get: <T>(
    url: string,
    config?: Parameters<typeof axiosInstance.get>[1]
  ): Promise<AxiosResponse<T>> => {
    return axiosInstance.get<T>(url, config);
  },

  /**
   * Performs a POST request
   * @template T - Expected response data type
   * @param url - Request URL (relative to base URL)
   * @param data - Request body data
   * @param config - Optional axios config
   * @returns Promise with typed response
   */
  post: <T>(
    url: string,
    data?: unknown,
    config?: Parameters<typeof axiosInstance.post>[2]
  ): Promise<AxiosResponse<T>> => {
    return axiosInstance.post<T>(url, data, config);
  },

  /**
   * Performs a PUT request
   * @template T - Expected response data type
   * @param url - Request URL (relative to base URL)
   * @param data - Request body data
   * @param config - Optional axios config
   * @returns Promise with typed response
   */
  put: <T>(
    url: string,
    data?: unknown,
    config?: Parameters<typeof axiosInstance.put>[2]
  ): Promise<AxiosResponse<T>> => {
    return axiosInstance.put<T>(url, data, config);
  },

  /**
   * Performs a DELETE request
   * @template T - Expected response data type
   * @param url - Request URL (relative to base URL)
   * @param config - Optional axios config
   * @returns Promise with typed response
   */
  delete: <T>(
    url: string,
    config?: Parameters<typeof axiosInstance.delete>[1]
  ): Promise<AxiosResponse<T>> => {
    return axiosInstance.delete<T>(url, config);
  },

  /**
   * Access to the underlying axios instance for advanced use cases
   */
  instance: axiosInstance,
};

export default apiClient;
