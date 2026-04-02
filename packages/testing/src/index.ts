// @project/testing — Shared test helpers, fixtures, mocks

/**
 * Test icerisinde async islemlerin tamamlanmasini bekler
 */
export function waitFor(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Mock API response olusturur
 */
export function createMockResponse<T>(data: T, delay = 0): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), delay));
}

/**
 * Mock error response olusturur
 */
export function createMockError(message: string, status = 500): Promise<never> {
  return Promise.reject(new Error(`[${status}] ${message}`));
}
