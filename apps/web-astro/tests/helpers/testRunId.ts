const RUN_ID = process.env.E2E_RUN_ID ?? process.env.GITHUB_RUN_ID ?? "local";
let seq = 0;

/** Deterministic per-run unique id for E2E data (no Math.random in steps). */
export function testRunId(prefix = "e2e"): string {
  seq += 1;
  return `${prefix}-${RUN_ID}-${seq}`;
}

export function uniqueTitle(base: string): string {
  return `${base} ${testRunId()}`;
}
