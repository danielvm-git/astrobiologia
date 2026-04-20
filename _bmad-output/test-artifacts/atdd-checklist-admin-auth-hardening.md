---
stepsCompleted: ['step-01-preflight-and-context', 'step-02-generation-mode', 'step-03-test-strategy', 'step-04c-aggregate', 'step-05-validate-and-complete']
lastStep: 'step-05-validate-and-complete'
lastSaved: '2026-04-20T02:55:00Z'
storyId: '2.1'
storyKey: 'admin-auth-hardening'
storyFile: '.planning/phases/02-administrative-cms-articles-crud/02-PLAN.md'
atddChecklistPath: '_bmad-output/test-artifacts/atdd-checklist-admin-auth-hardening.md'
generatedTestFiles: ['tests/atdd/hooks-auth.test.ts', 'tests/atdd/admin-login.spec.ts']
---

# ATDD Checklist: Admin Auth Hardening

## TDD Red Phase (Current)
✅ Red-phase test scaffolds generated

- **API/Integration Tests**: 2 tests (all skipped) in `tests/atdd/hooks-auth.test.ts`
- **E2E Tests**: 2 tests (all skipped) in `tests/atdd/admin-login.spec.ts`

## Acceptance Criteria Coverage
- [ ] **Admin routes are protected by a server-side auth guard**
  - Covered by: `tests/atdd/hooks-auth.test.ts` -> `[P0] should redirect unauthenticated user`
- [ ] **Unauthorized access to /admin/* redirects to /admin/login**
  - Covered by: `tests/atdd/hooks-auth.test.ts` -> `[P0] should redirect unauthenticated user`
- [ ] **Authenticated access to /admin/login redirects to /admin/dashboard**
  - Covered by: `tests/atdd/admin-login.spec.ts` -> `[P0] should login successfully`
- [ ] **Session cookie sync with client-side SDK**
  - Covered by: `tests/atdd/hooks-auth.test.ts` -> `[P0] should allow authenticated user`

## Next Steps (Task-by-Task Activation)
1. **Remove `test.skip()`** from the current test file or scenario.
2. **Run tests**: `npm test` or `npx playwright test`.
3. **Verify the activated test fails** first (Red Phase).
4. **Implement the logic** to make the test pass (Green Phase).
5. **Verify the test passes**.
6. **Commit passing tests**.

## Implementation Guidance
- **Endpoints**: SvelteKit Form Actions in `src/routes/admin/login/+page.server.ts`.
- **Logic**: `src/hooks.server.ts` handles the `handleAdminAuth` logic.
- **Utils**: `$lib/server/appwrite.ts` provides `createSessionClient`.

---
**Status**: Step 4C Complete. Ready for Step 5 (Validation and Complete).
