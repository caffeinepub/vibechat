# Specification

## Summary
**Goal:** Replace the current advisory/marketing landing experience with a WhatsApp-like authenticated app navigation that starts on Chats and provides top-level sections for Chats, Groups, Status, Live, and Videos.

**Planned changes:**
- Remove the advisory/marketing-style landing screen as the primary entry for signed-in users and default the authenticated experience to the Chats section.
- Update the existing AppHeader/top navigation to present WhatsApp-like section navigation in this exact order: Chats, Groups, Status, Live, Videos; remove non-essential top-level items (e.g., Contacts).
- Add dedicated placeholder screens for Groups, Status, Live, and Videos with clear English “Coming soon” messaging so navigation works end-to-end without backend changes.

**User-visible outcome:** After signing in, users land on Chats by default and can switch between Chats, Groups, Status, Live, and Videos from the top navigation; non-Chat sections show “Coming soon” placeholder screens.
