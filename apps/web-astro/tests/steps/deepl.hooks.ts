import { Before } from "../fixtures/base.fixture";
import { test } from "@playwright/test";
import { loadE2eEnv } from "../helpers/e2eEnv";

Before({ tags: "@deepl" }, () => {
  loadE2eEnv();
  test.skip(!process.env.DEEPL_API_KEY?.trim(), "DEEPL_API_KEY not set");
});
