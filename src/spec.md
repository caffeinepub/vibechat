# Specification

## Summary
**Goal:** Make Vibechat installable as a PWA (Add to Home Screen) with a manifest, icons, service worker, and a simple install prompt in the unauthenticated UI.

**Planned changes:**
- Add a web app manifest in frontend public assets with required PWA fields (name/short_name, start_url, standalone display, theme/background colors) and icon declarations (including maskable).
- Update `frontend/index.html` to reference the manifest, set theme-color metadata, and link to existing favicon and Apple touch icon assets.
- Add a baseline service worker (`/sw.js`) that installs/activates cleanly and performs minimal safe caching for core app shell assets without breaking normal online/authenticated usage.
- Register the service worker from an editable React file (e.g., `App.tsx`) only when supported and in production-like environments.
- Add an unauthenticated “Install Vibechat” UI action that triggers the browser install prompt when available, and shows an English fallback message when not.

**User-visible outcome:** Users on supported browsers/devices can install Vibechat from the landing/pre-login experience (or follow clear guidance to use “Add to Home Screen” when the prompt isn’t available), and the app loads normally with baseline PWA behavior enabled.
