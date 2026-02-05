# Specification

## Summary
**Goal:** Update Vibechat with a WhatsApp-inspired chat experience and add backend support for conversations, messages, and photo/video attachments stored in existing blob storage with participant-only access.

**Planned changes:**
- Redesign the frontend to add a dedicated Chats entry point with a conversation list and a responsive conversation detail view (message timeline + composer), using WhatsApp-inspired patterns without copying WhatsApp branding/assets.
- Implement backend APIs for creating/opening conversations, listing a user’s conversations, listing messages for a conversation (paged/limited), and sending messages with optional photo/video attachments.
- Enforce access control in the backend so only conversation participants can read/write messages and retrieve attachments.
- Store message attachments as blobs linked to messages; return safe attachment metadata/references for authorized retrieval, with basic file size/type validation and clear error messages.
- Wire the new chat UI to the backend using React Query hooks for conversation/message queries and send-message mutations, including loading/progress/error states and attachment selection from the device.

**User-visible outcome:** Users can open the Chats screen, start or open a conversation, view message history, send text messages, and attach photos/videos that are stored and viewable only by conversation participants, on both mobile and desktop layouts.
