import type { Mock } from "vitest";
import type { RuntimeConfigStub } from "./nuxt-helpers";

type NuxtTestGlobals = typeof globalThis & {
  useRuntimeConfig: Mock<() => RuntimeConfigStub>;
};

export { type RuntimeConfigStub } from "./nuxt-helpers";

export const setRuntimeConfig = (value: RuntimeConfigStub) => {
  (globalThis as NuxtTestGlobals).useRuntimeConfig.mockReturnValue(value);
};
