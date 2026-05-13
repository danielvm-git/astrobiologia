---
phase: 2026-05-13
plan: appwrite-non-interactive-deployment
subsystem: devops
tags: [github-actions, appwrite, deployment]
tech-stack: [GitHub Actions, Appwrite CLI]
key-files: [.github/workflows/ci.yml, appwrite.json, DEPLOYMENT.md]
duration: 10m
date: 2026-05-13
---

# Phase 2026-05-13 Plan appwrite-non-interactive-deployment: Non-Interactive Appwrite Deployment Summary

## One-liner
Implemented non-interactive Appwrite deployment in GitHub Actions using `--force` flag and templated `appwrite.json`.

## Key Decisions

### Add build steps to deploy job
The `deploy-appwrite-sites` job in `ci.yml` was modified to include `pnpm install` and `pnpm run build`. This ensures that the `dist` folder exists and contains the latest build before being pushed to Appwrite, following the "Source of Truth" principle where GHA builds the artifacts.

### Use sed for config templating
`appwrite.json` is used as a template with `PROJECT_ID` and `SITE_ID` placeholders, which are replaced at runtime in GHA using `sed`. This keeps secrets out of the repository while maintaining a valid configuration file structure.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Functionality] Added build steps to deploy job**
- **Found during:** Task 3
- **Issue:** The deployment job lacked build steps, which would cause the `appwrite push sites` command to fail or push empty/stale files since it points to `apps/web-astro/dist`.
- **Fix:** Added `pnpm install` and `pnpm run build` steps to the `deploy-appwrite-sites` job.
- **Files modified:** `.github/workflows/ci.yml`
- **Commit:** 33c1cee

## Self-Check: PASSED
