# Specification

## Summary
**Goal:** Make the PWA install prompt feel one-tap and remove confusing “Dismiss” wording, while still guiding users on browsers/devices that can’t install programmatically.

**Planned changes:**
- Update `frontend/src/components/PWAInstallCallout.tsx` to show a prominent primary CTA labeled “Install” (or “Install Vibechat”) that triggers the captured `beforeinstallprompt` install prompt when available.
- Remove any UI button labeled “Dismiss” from the install callout.
- Add concise English manual-install instructions when `isInstallable` is false (e.g., use the browser menu “Add to Home Screen” / “Install App”), explicitly noting availability depends on browser/device.
- Add a secondary way to hide the callout without using the word “Dismiss” (e.g., “Not now” or an X icon) and persist the hidden state locally so it remains hidden after refresh/reload.
- Ensure the callout disappears after successful installation and stays hidden regardless of any saved hide state.

**User-visible outcome:** Users see a clear “Install” button when one-tap install is supported; otherwise they see short instructions on how to install from their browser menu, and they can hide the prompt without a “Dismiss” button and without it reappearing on reload.
