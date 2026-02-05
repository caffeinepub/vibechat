# Specification

## Summary
**Goal:** Populate the Videos tab with a simple, frontend-only sponsored/ad-style feed and a basic in-app watch experience using mock items.

**Planned changes:**
- Replace the placeholder content in `frontend/src/pages/VideosPage.tsx` with a scrollable feed of at least 3 “Sponsored” mock video items, each showing a thumbnail, title, and short description (English).
- Add a small disclaimer in the Videos tab indicating the sponsored items are sample/demo content, and ensure the feed layout is responsive on mobile and desktop.
- Implement a client-side “watch” viewer (modal/sheet) that opens when a feed item is tapped/clicked, showing a full-bleed vertical viewer with item details, a close/back control, and an auto-advancing progress indicator (simulated playback).
- Add and reference static generated thumbnail images under `frontend/public/assets/generated/` via `/assets/generated/...` paths (no backend changes, no third-party ad networks).

**User-visible outcome:** The Videos tab shows a responsive sponsored demo feed with watchable mock items; selecting an item opens an in-app viewer that simulates playback with a progress indicator and clear close/back control.
