# Specification

## Summary
**Goal:** Enable publishing by removing production build blockers and adding a simple publish readiness check plus in-app publishing guidance.

**Planned changes:**
- Fix frontend TypeScript/ESLint issues that prevent a successful production build (e.g., remove unused React imports).
- Add a minimal backend “publish readiness” query API that returns the caller principal (or text) and a static status/version string.
- Add a small frontend UI section to run the readiness check and display success/failure results in English (including anonymous calls).
- Add a concise “How to publish” help section in the frontend with step-by-step instructions and brief troubleshooting tips.

**User-visible outcome:** The app builds successfully for production, users can run a readiness check to confirm the canister is callable, and they can follow clear in-app instructions for publishing (with basic troubleshooting guidance).
