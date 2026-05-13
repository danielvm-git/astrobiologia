# CLAUDE.md Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform `CLAUDE.md` into a high-signal, agent-centric instruction set based on Karpathy and Akita best practices.

**Architecture:** A tiered instruction set focusing on Evidence gathering, Structural constraints (300-line limit), and Behavioral seniority (Goal-driven loops).

**Tech Stack:** Markdown, ctxo MCP, pnpm, Nuxt 3, Astro.

---

### Task 1: Consolidate Evidence-First Workflow

**Files:**

- Modify: `CLAUDE.md`

- [ ] **Step 1: Replace mandatory ctxo section with Generalized Evidence Workflow**

Update the header and first section to prioritize "Evidence" over specific tools. Ensure it allows for `grep/glob` fallback when `ctxo` is unavailable.

- [ ] **Step 2: Define "No Blind Reading" rule**

Add explicit instruction that agents must use search tools before reading full source files.

- [ ] **Step 3: Commit Evidence Workflow**

```bash
git add CLAUDE.md
git commit -m "chore: update CLAUDE.md with evidence-first workflow"
```

---

### Task 2: Implement Structural Constraints (Clean Code for Agents)

**Files:**

- Modify: `CLAUDE.md`

- [ ] **Step 1: Add "Clean Code for Agents" section**

Include the following rules:

- **The 300-Line Limit:** Files > 300 lines must be decomposed.
- **Function Granularity:** 4-20 lines per function.
- **Lexical Searchability:** Unique, descriptive naming for grep-friendliness.
- **Intent Comments:** Focus on "Why" (provenance) rather than "What".

- [ ] **Step 2: Commit Structural Constraints**

```bash
git add CLAUDE.md
git commit -m "chore: add clean code for agents structural rules to CLAUDE.md"
```

---

### Task 3: Implement Behavioral Seniority (Senior Engineer Loop)

**Files:**

- Modify: `CLAUDE.md`

- [ ] **Step 1: Refactor Behavioral guidelines into "Senior Engineer Loop"**

Merge Karpathy's principles:

- **Thinking Aloud:** List assumptions and blast radius before coding.
- **Surgical Diffs:** Touch only what is requested; clean up only orphans.
- **Goal-Driven Execution:** Loop until verified by a test or command.
- **Push Back:** Suggest simpler paths for over-engineered requests.

- [ ] **Step 2: Commit Behavioral Seniority**

```bash
git add CLAUDE.md
git commit -m "chore: add senior engineer behavioral guidelines to CLAUDE.md"
```

---

### Task 4: Refresh Project-Specific Commands

**Files:**

- Modify: `CLAUDE.md`

- [ ] **Step 1: Update Build/Test commands section**

Ensure `pnpm` filters for `@astrobiologia/web-astro` and `@astrobiologia/web-nuxt` are clear and prioritized. Add common aliases for "Fast Tests" vs "Full Suite".

- [ ] **Step 2: Verify all command paths**

Check `package.json` to ensure aliases in `CLAUDE.md` match actual project scripts.

- [ ] **Step 3: Commit Command Refresh**

```bash
git add CLAUDE.md
git commit -m "chore: refresh project-specific commands in CLAUDE.md"
```

---

### Task 5: Final Review and Validation

**Files:**

- Read: `CLAUDE.md`
- Read: `PROJECT_SUMMARY.md`

- [ ] **Step 1: Self-verify token efficiency**

Ensure the final `CLAUDE.md` is concise and doesn't contain redundant instructions.

- [ ] **Step 2: Run a dummy "Thought Pass"**

As the agent, read the new `CLAUDE.md` and confirm it provides clear, actionable guidance for a hypothetical feature addition.

- [ ] **Step 3: Final Commit and Sync**

```bash
git add CLAUDE.md
git commit -m "docs: finalize CLAUDE.md rebuild"
```
