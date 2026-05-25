// test-only — do not import in production code
export interface TestUser {
  $id: string;
  email: string;
  name: string;
  password: string;
  role: "admin" | "editor" | "reader";
}

export function createUser(overrides: Partial<TestUser> = {}): TestUser {
  return {
    $id: crypto.randomUUID(),
    email: `test_${Math.random().toString(36).slice(2, 8)}@example.com`,
    name: "Test User",
    password: "TestPassword123!",
    role: "reader",
    ...overrides,
  };
}

export function createAdminUser(overrides: Partial<TestUser> = {}): TestUser {
  return createUser({
    email: `admin_${Math.random().toString(36).slice(2, 8)}@example.com`,
    name: "Admin User",
    role: "admin",
    ...overrides,
  });
}

export function createUserList(
  count = 3,
  overrides: Partial<TestUser> = {}
): TestUser[] {
  return Array.from({ length: count }, (_, i) =>
    createUser({
      $id: crypto.randomUUID(),
      email: `user_${i}@example.com`,
      name: `User ${i + 1}`,
      ...overrides,
    })
  );
}
