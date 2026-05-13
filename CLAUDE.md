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

## Behavioral guidelines

Reduce common LLM coding mistakes. Merge with project-specific Cursor rules and skills as needed.

### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
