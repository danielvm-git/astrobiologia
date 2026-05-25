import { afterEach } from "vitest";

// Reset all mocks after each test to ensure isolation
afterEach(() => {
  vi.restoreAllMocks();
});
