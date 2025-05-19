/**
 * API utility functions for making requests to the server
 */

// Base API URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Custom fetch function that adds authentication headers
 * @param url - API endpoint
 * @param options - Fetch options
 * @returns Promise with response
 */
export const apiFetch = async (url: string, options: RequestInit = {}) => {
  // Get the token from local storage
  const token = localStorage.getItem('token');

  // Set up headers with authentication if token exists
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // Make the request
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  // Handle unauthorized responses (401) - token expired or invalid
  if (response.status === 401) {
    // If the request was not to /auth/login or /auth/register
    if (!url.includes('/auth/login') && !url.includes('/auth/register')) {
      // Clear token from local storage
      localStorage.removeItem('token');
      
      // Redirect to login page
      window.location.href = '/auth';
      
      // Throw error to stop further processing
      throw new Error('Authentication expired. Please login again.');
    }
  }

  // Return response for further processing
  return response;
};

// HTTP request methods
export const api = {
  /**
   * Make a GET request
   * @param url - API endpoint
   * @returns Promise with JSON response
   */
  get: async <T>(url: string): Promise<T> => {
    const response = await apiFetch(url);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'An error occurred');
    }
    
    return response.json();
  },

  /**
   * Make a POST request
   * @param url - API endpoint
   * @param data - Data to send
   * @returns Promise with JSON response
   */
  post: async <T>(url: string, data: any): Promise<T> => {
    const response = await apiFetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'An error occurred');
    }
    
    return response.json();
  },

  /**
   * Make a PUT request
   * @param url - API endpoint
   * @param data - Data to send
   * @returns Promise with JSON response
   */
  put: async <T>(url: string, data: any): Promise<T> => {
    const response = await apiFetch(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'An error occurred');
    }
    
    return response.json();
  },

  /**
   * Make a DELETE request
   * @param url - API endpoint
   * @returns Promise with JSON response
   */
  delete: async <T>(url: string): Promise<T> => {
    const response = await apiFetch(url, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'An error occurred');
    }
    
    return response.json();
  },
};