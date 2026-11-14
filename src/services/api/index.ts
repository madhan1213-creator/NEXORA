/**
 * API Service Layer
 * Centralized API client definitions for Nexora.
 * Prepared for real backend integration (REST / GraphQL).
 * Currently isolated from UI components to guarantee zero fake mock backend coupling.
 */

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

// Base fetch wrapper template ready for backend connection
export async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText} (${response.status})`);
  }

  const data = await response.json();
  return {
    data,
    status: response.status,
  };
}
