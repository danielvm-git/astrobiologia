# Agent instructions

Coding agents working in this repository must follow an **Evidence-First Workflow** before reading or changing source files. Tooling and evidence-gathering rules override assumptions. The behavioral guidelines below complement that workflow: they bias toward **caution over speed**. For trivial tasks (obvious one-liners, typos), use judgment—not every step needs full rigor.

## Evidence-First Workflow (MANDATORY)

**ALWAYS gather evidence before reading source files or making code changes.** You must prove your understanding of dependencies, intent, and impact using the best available tools.

### 1. No Blind Reading

**DO NOT read full source files to discover symbols or understand logic.** This wastes tokens and leads to context bloat. Instead:

- Use `search_symbols` or `grep_search` to find relevant code.
- Use `list_directory` or `glob` to map structure.
- Only read specific lines or small ranges once targets are identified.

### 2. Evidence Gathering Tools

| Goal                       | Primary (High Fidelity)     | Fallback (Standard)           |
| -------------------------- | --------------------------- | ----------------------------- |
| **Dependency Analysis**    | `get_blast_radius` (ctxo)   | `grep_search` (importers)     |
| **Historical Context**     | `get_why_context` (ctxo)    | `git log`, `git blame`        |
| **Symbol Discovery**       | `search_symbols` (ctxo)     | `grep_search`                 |
| **Architectural Overlays** | `get_architectural_overlay` | `PROJECT_SUMMARY.md`, `docs/` |

### 3. Before ANY Code Modification

1. **Gather Evidence:** Call `get_blast_radius` (or grep importers) for the symbol you are about to change.
2. **Check Intent:** Call `get_why_context` (or check git logs) to understand why the code exists as it does.
3. **Plan Surgically:** Only then read and edit the specific lines required.

### 4. Task-Specific Context (ctxo)

If `ctxo` MCP tools are available, use them to bootstrap your context for specific tasks:

- **Fixing a bug:** `get_context_for_task(taskType: "fix")`
- **Adding a feature:** `get_context_for_task(taskType: "extend")`
- **Refactoring:** `get_context_for_task(taskType: "refactor")`
- **Understanding:** `get_context_for_task(taskType: "understand")`

### 5. PR Impact

Before reviewing a PR, call `get_pr_impact` to get a full risk assessment with co-change analysis.

### NEVER Do These

- NEVER edit a function without first proving you know what it breaks (Evidence).
- NEVER skip checking intent—reverted code and anti-patterns are invisible without it.
- NEVER grep source files for symbol discovery when `search_symbols` is available.
- NEVER manually trace imports when `find_importers` or `grep` can give the dependency graph.

Superpowers: https://github.com/obra/superpowers

## Clean Code for Agents (STRUCTURAL)

To minimize hallucination and maximize token efficiency, follow these structural rules:

### 1. The 300-Line Limit

Keep files focused. **No file should exceed 300 lines** (max 500 in exceptional cases). Large files cause truncation and loss of context. If a file grows large, decompose it into smaller, focused modules.

### 2. Function Granularity

Keep functions small: **4–20 lines is the ideal range.** A small function fits entirely within a single attention window, leading to better reasoning and fewer bugs.

### 3. Lexical Searchability (Grep-Friendliness)

Use unique, descriptive, and grep-friendly names for symbols. Avoid generic names like `data`, `item`, or `handler`. A search for a symbol should ideally return exactly one target, not dozens of unrelated hits.

### 4. Intent-Focused Comments (Provenance)

Comments should explain **Why** (intent, business rules, workarounds), not **What**. The agent can read the code to understand what it does; it needs comments to understand the "Provenance" or the reasoning behind non-obvious logic.

## Senior Engineer Loop (BEHAVIORAL)

To minimize logic errors and prevent over-engineering, follow the Senior Engineer Loop:

### 1. Thinking Aloud (Validation Phase)

Before implementing, explicitly state your assumptions and findings in the chat.

- **Surface Tradeoffs:** Present multiple interpretations/approaches—don't pick silently.
- **Blast Radius:** Name what might break based on your evidence gathering.
- **Stop on Confusion:** If a request is ambiguous, stop and name the confusion. Ask before guessing.

### 2. Surgical Diffs (Implementation Phase)

Touch only what you must. Follow the "Leave it better than you found it" rule **only** for the lines you are directly changing.

- **Minimal Footprint:** Don't "improve" adjacent code, comments, or formatting unless requested.
- **Match Existing Style:** Adhere to local patterns even if you prefer a different architecture.
- **Cleanup Your Mess:** Remove imports, variables, or functions that YOUR changes made unused. Don't remove pre-existing dead code unless asked.

### 3. Goal-Driven Execution (Verification Phase)

Every task must have a verifiable success criterion. Loop until verified.

- **Reproduction First:** For bug fixes, write a test that reproduces the failure before fixing.
- **Continuous Validation:** Run tests/lint/build after every logical chunk, not just at the end.
- **Evidence of Success:** Claims of "Tests pass" must be backed by the actual command output in the chat.

### 4. Ruthless Simplicity

Bias toward the minimum code that solves the problem. Nothing speculative.

- **No YAGNI:** No features, abstractions, or "configurability" beyond the current request.
- **Rewrite to Simplify:** If you write 200 lines and it could be 50, rewrite it.
- **Push Back:** If a request is over-engineered or a simpler path exists, suggest it.

**The loop is working if:** Diffs are small, logic is verified by tests, and questions happen before implementation rather than after mistakes.

## Project Commands (REFERENCE)

### Web Astro (Primary)

- **Dev:** `pnpm --filter @astrobiologia/web-astro dev`
- **Build:** `pnpm --filter @astrobiologia/web-astro build`
- **Check (Lint/Type):** `pnpm --filter @astrobiologia/web-astro check`
- **Unit Tests:** `pnpm --filter @astrobiologia/web-astro test:unit`
- **Coverage:** `pnpm --filter @astrobiologia/web-astro test:coverage`
- **Report Watch:** `pnpm report:astro:watch`

### Global / Monorepo

- **Preflight (Full Check):** `pnpm preflight`
- **Global Check:** `pnpm check`
- **Global Test:** `pnpm test:all`
