import { describe, it, expect, vi } from 'vitest';
import APIClient from './api-client';

// Mock axios with factory function
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: vi.fn(),
      interceptors: {
        response: {
          use: vi.fn()
        }
      }
    }))
  }
}));

describe('APIClient', () => {
  it('should create instance with correct endpoint', () => {
    const apiClient = new APIClient('/games');
    expect(apiClient.endpoint).toBe('/games');
  });

  it('should handle basic functionality', () => {
    const apiClient = new APIClient('/games');
    expect(apiClient).toBeDefined();
    expect(typeof apiClient.getAll).toBe('function');
  });

  it('should create axios instance', () => {
    // Just test that we can create the client without errors
    const apiClient = new APIClient('/test');
    expect(apiClient).toBeDefined();
    expect(apiClient.endpoint).toBe('/test');
  });
}); 