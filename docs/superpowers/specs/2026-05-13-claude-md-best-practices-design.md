# Design: High-Signal AI Agent Instructions (CLAUDE.md Rebuild)

**Date:** 2026-05-13
**Status:** Draft
**Context:** Rebuilding `CLAUDE.md` based on Andrej Karpathy's "Senior Engineer" skills and Akita on Rails' "Clean Code for Agents" principles.

## 1. Goal

Optimize the project's primary instruction file (`CLAUDE.md`) to minimize AI agent hallucination, maximize context efficiency, and enforce a "Senior Engineer" workflow of evidence gathering and verification.

## 2. Research Foundations

- **Karpathy Skills:** Focus on thinking before coding, surgical changes, simplicity, and goal-driven execution.
- **Akita Clean Code:** Focus on token efficiency (small files/functions), grep-friendly naming, and intent-focused comments.
- **ctxo Workflow:** Maintaining the high-fidelity dependency analysis while allowing for standard tool fallback.

## 3. Proposed Architecture for CLAUDE.md

### A. Evidence-First Workflow

- **Rule:** No "blind reading." Agents must search for symbols or use `ctxo` tools before reading full files.
- **Workflow:**
  1. Identify target symbols via `search_symbols` or `grep`.
  2. Analyze blast radius via `get_blast_radius` (ctxo) or `grep` importers.
  3. Validate assumptions with the user before editing.

### B. Structural Constraints (Agent Efficiency)

- **File Limit:** Max 300-500 lines. Larger files must be refactored into focused modules.
- **Function Limit:** 4-20 lines to ensure a single function fits in an LLM attention window.
- **Searchable Symbols:** Use unique, descriptive names to avoid "search noise."
- **Intent Comments:** Comments must explain _why_ (business logic, workarounds), not _what_.

### C. Behavioral Seniority

- **Surgical Diffs:** Touch only what is requested. Cleanup is limited to orphans created by the current task.
- **Goal-Driven Execution:** Every task must define a success criterion (test or command) and loop until verified.
- **Push Back:** Agents are encouraged to suggest simpler approaches if the requested one is over-engineered.

## 4. Implementation Strategy

- **Stage 1:** Consolidate existing `ctxo` mandates into a generalized "Evidence" section.
- **Stage 2:** Add "Clean Code for Agents" structural rules.
- **Stage 3:** Integrate Karpathy's behavioral guidelines into a "Senior Engineer Loop."
- **Stage 4:** Update project-specific scripts (pnpm filters, test commands) for Nuxt/Astro clarity.

## 5. Verification Plan

- **Self-Correction Check:** Run a sample "Fix this bug" task to see if the agent follows the new "Evidence -> Reproduce -> Fix -> Verify" loop.
- **Linter Check:** Ensure the new rules don't conflict with existing `.eslintrc` or `.prettierrc`.
- **Readability Check:** Ensure the instructions themselves are token-efficient.
