# Specification

## Summary
**Goal:** Let users set a profile photo by choosing from their device gallery or taking a new photo with the device camera during the WhatsApp-style auth/profile setup flow, without backend changes.

**Planned changes:**
- Update the profile photo picker UI in the profile setup step to offer two actions: select from gallery (existing file picker) and “Take photo” (camera-capable file input on supported mobile browsers).
- Keep existing image validation (type and max size) and display any validation failures in clear English.
- Add clear English fallback messaging when camera capture is unsupported or permission is denied, while still allowing gallery selection.
- Preserve existing behavior for immediate preview and saving/uploading via the current profile save flow.

**User-visible outcome:** During profile setup, users can either pick a profile photo from their gallery or take a new photo (when supported), see an immediate preview, and save it using the existing flow—with clear messages if camera capture isn’t available.
