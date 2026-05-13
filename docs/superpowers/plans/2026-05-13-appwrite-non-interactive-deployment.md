# Plan: Non-Interactive Appwrite Deployment & Build Optimization

This plan transitions the Appwrite deployment to a non-interactive CLI workflow in GitHub Actions and optimizes the pipeline to avoid redundant builds.

## Objective

1.  Enable **non-interactive mode** for Appwrite CLI using the `--force` flag.
2.  Eliminate **redundant builds** (avoiding building once in GHA for tests and again in Appwrite Console).
3.  Ensure `appwrite.json` is correctly handled in CI.
4.  Simplify the GitHub Actions workflow.

## Context

- **Research**: [Appwrite Non-Interactive Mode](https://appwrite.io/docs/tooling/command-line/non-interactive)
- **Current State**: `ci.yml` skips deployment because `appwrite.config.json` is missing. Appwrite Console is likely connected via Git integration, causing a second build on every push.

## Proposed Architecture

- **GHA as the Source of Truth**: GHA builds the site, runs tests, and then pushes the _build result_ to Appwrite.
- **Disconnected Git Integration**: Disconnect the GitHub repository from the Appwrite Console to prevent Appwrite from building on every push.
- **Pre-built Deployment**: Push the `dist` folder directly.

---

## Tasks

### Wave 1: Configuration & Infrastructure

#### Task 1: Create Appwrite Configuration Template

Create a `appwrite.json` template that the CLI will use. We will use `appwrite.json` as it is the default CLI filename, but we will ensure GHA can find it.

- **Files**: `appwrite.json`
- **Action**: Create `appwrite.json` in the project root.
- **Implementation**:
  ```json
  {
    "projectId": "PROJECT_ID",
    "projectName": "Astrobiologia",
    "sites": [
      {
        "$id": "SITE_ID",
        "name": "web-astro",
        "entrypoint": "server/entry.mjs",
        "root": "apps/web-astro/dist",
        "ignore": ["node_modules", ".git"],
        "activate": true
      }
    ]
  }
  ```
  _Note: `PROJECT_ID` and `SITE_ID` will be replaced in CI or handled via secrets._

#### Task 2: Update DEPLOYMENT.md

Update the guide to reflect the new CLI-first workflow and how to optimize Appwrite settings.

- **Files**: `DEPLOYMENT.md`
- **Action**: Add instructions to:
  1. Disconnect Git integration in Appwrite Console.
  2. Set **Build Command** to `echo "Already built in GHA"`.
  3. Set **Output Directory** to `.` (since we push the built files).
  4. Set **Service Command** to `node server/entry.mjs`.

### Wave 2: GitHub Actions Refactor

#### Task 3: Update `ci.yml` for Non-Interactive Deployment

Refactor the `deploy-appwrite-sites` job to generate the config on the fly and use the `--force` flag.

- **Files**: `.github/workflows/ci.yml`
- **Action**:
  - Remove the `check-config` step and the `if` gates on `exists`.
  - Add a step to generate `appwrite.json` from secrets.
  - Update the `appwrite push sites` command to include `--force`.
  - Use `appwrite deploy sites` instead of `push` if pushing code.
- **Verification**: `appwrite push sites --site-id "$APPWRITE_SITE_ID" --activate --force` passes without prompts.

---

## Must-Haves

### Truths

- [ ] GHA successfully deploys to Appwrite on push to `main`.
- [ ] No manual confirmation is required during the GHA run.
- [ ] Appwrite does not run `pnpm build` again after receiving the files from GHA.

### Artifacts

- [ ] `appwrite.json` exists in the repository (templated).
- [ ] `.github/workflows/ci.yml` updated with `--force` and config generation.

### Key Links

- [ ] GHA `deploy` job -> Appwrite API (via `APPWRITE_API_KEY`).
- [ ] Appwrite Site -> `dist` content (via `appwrite.json` root).

## STRIDE Threat Model

| Threat ID   | Category               | Component            | Disposition | Mitigation Plan                                                                             |
| ----------- | ---------------------- | -------------------- | ----------- | ------------------------------------------------------------------------------------------- |
| T-DEPLOY-01 | Information Disclosure | `appwrite.json`      | mitigate    | Ensure no secrets (API keys) are committed to `appwrite.json`. Use GHA secrets for the key. |
| T-DEPLOY-02 | Tampering              | Deployment Artifacts | mitigate    | Use `--frozen-lockfile` and run tests before deployment in GHA.                             |

## Success Criteria

- Running `git push origin main` triggers a GHA run that completes the `Deploy Appwrite Sites` job successfully.
- The Appwrite Console shows a new deployment with "Already built in GHA" as the build log.
- The live site is updated correctly.
