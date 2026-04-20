---
workflowStatus: 'in-progress'
totalSteps: 5
stepsCompleted: ['step-05-generate-output']
lastStep: 'step-05-generate-output'
nextStep: ''
lastSaved: '2026-04-20T02:41:55Z'
workflowType: 'testarch-test-design'
inputDocuments:
  - '.planning/PROJECT.md'
  - '.planning/ROADMAP.md'
  - 'package.json'
---

# Test Design for Architecture: Astrobiologia.com.br Portal

**Purpose:** Architectural concerns, testability gaps, and NFR requirements for review by Architecture/Dev teams. Serves as a contract between QA and Engineering on what must be addressed before test development begins.

**Date:** 2026-04-20
**Author:** Murat (Master Test Architect)
**Status:** Architecture Review Pending
**Project:** Astrobiologia.com.br
**PRD Reference:** [.planning/PROJECT.md](file:///Users/me/Sites/astrobiologia/.planning/PROJECT.md)
**ADR Reference:** [.planning/phases/02-administrative-cms-articles-crud/02-CONTEXT.md](file:///Users/me/Sites/astrobiologia/.planning/phases/02-administrative-cms-articles-crud/02-CONTEXT.md)

---

## Executive Summary

**Scope:** Full-stack journalistic portal including Public UI, Administrative CMS, and Multilingual (i18n) support.

**Business Context:**
- **Impact**: High visibility scientific journalism.
- **Problem**: Need for a premium, low-maintenance, multi-language portal.
- **GA Launch**: Phase 5 (i18n) shipped; Phase 6 (Search) in progress.

**Architecture:**
- **Key Decision 1**: SvelteKit (Svelte 5) with SSR for performance and SEO.
- **Key Decision 2**: Appwrite Cloud for all backend services (Auth, DB, Storage).
- **Key Decision 3**: Paraglide-js for typesafe, localized routing.

**Risk Summary:**
- **Total risks**: 6
- **High-priority (≥6)**: 2 risks requiring immediate mitigation.
- **Test effort**: ~35–50 hours (~1.5 weeks for 1 engineer).

---

## Quick Guide

### 🚨 BLOCKERS - Team Must Decide (Can't Proceed Without)

1. **B1: E2E Test Project/Environment** - We need a dedicated Appwrite Project for testing to avoid polluting production data.
2. **B2: DeepL Sandbox/Mock** - We need a way to test i18n drafting without incurring costs or hitting production rate limits.

### ⚠️ HIGH PRIORITY - Team Should Validate

1. **R2: Admin Security Validation** - Recommendation to implement E2E checks for every `/admin` route redirect.
2. **R5: Appwrite Resilience** - Recommendation to implement error boundaries for 5xx/4xx API failures from Appwrite.

---

## For Architects and Devs - Open Topics 👷

### Risk Assessment

**Total risks identified**: 6 (2 high-priority score ≥6, 2 medium, 2 low)

#### High-Priority Risks (Score ≥6) - IMMEDIATE ATTENTION

| Risk ID | Category | Description | Probability | Impact | Score | Mitigation | Owner | Timeline |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **R2** | **SEC** | Admin Unauthorized Access | 2 | 3 | **6** | Server-side auth guards + E2E validation | Dev Team | Phase 6 |
| **R5** | **OPS** | Appwrite API Failure | 2 | 3 | **6** | Error boundaries & graceful fallbacks | Dev Team | Phase 7 |

#### Medium-Priority Risks (Score 3-5)

| Risk ID | Category | Description | Probability | Impact | Score | Mitigation | Owner |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **R3** | **BUS** | Broken Translations (i18n) | 2 | 2 | **4** | Paraglide key validation | Dev Team |
| **R6** | **BUS** | DeepL API Cost Spike | 2 | 2 | **4** | Caching & Rate Limiting | Dev Team |

#### Low-Priority Risks (Score 1-2)

| Risk ID | Category | Description | Probability | Impact | Score | Mitigation | Owner |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **R1** | **BUS** | Minor SEO Metadata Drift | 1 | 2 | **2** | Automated SEO audits | Dev Team |
| **R4** | **OPS** | Image Optimization Latency | 2 | 1 | **2** | Lazy loading + monitoring | Dev Team |

---

### Testability Concerns and Architectural Gaps

**🚨 ACTIONABLE CONCERNS - Architecture Team Must Address**

#### 1. Blockers to Fast Feedback (WHAT WE NEED FROM ARCHITECTURE)

| Concern | Impact | What Architecture Must Provide | Owner | Timeline |
| :--- | :--- | :--- | :--- | :--- |
| **No Test Environment** | Production pollution | Dedicated Appwrite Test Project | DevOps/Admin | Immediate |
| **DeepL Mocking** | Non-deterministic tests | Sandbox or explicit mock interface | Backend | Phase 6 |

---

### Testability Assessment Summary

#### What Works Well
- ✅ **Modular Data Layer**: `appwrite.ts` is easy to unit test and mock.
- ✅ **Svelte 5 Runes**: High observability into component state.
- ✅ **Paraglide-js**: Predictable, localized URL structures for E2E.

---

### Assumptions and Dependencies

#### Assumptions
1. Appwrite Cloud free tier quotas are sufficient for the current traffic and testing load.
2. Paraglide-js continues to support Svelte 5 official releases.

#### Dependencies
1. **Playwright Installation**: Required to start E2E implementation.
2. **Appwrite API Keys**: Required for administrative service-layer testing.

---

**End of Architecture Document**
