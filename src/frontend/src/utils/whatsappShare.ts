/**
 * Utility functions for sharing text to WhatsApp via web.whatsapp.com share URLs.
 * Note: This uses WhatsApp's public share URL feature, not an official API.
 * Media attachments are not supported through this method.
 */

/**
 * Builds a WhatsApp share URL with pre-filled text
 * @param text - The text message to share
 * @returns WhatsApp web share URL
 */
export function buildWhatsAppShareURL(text: string): string {
  const encodedText = encodeURIComponent(text);
  return `https://web.whatsapp.com/send?text=${encodedText}`;
}

/**
 * Opens WhatsApp share in a new window/tab
 * @param text - The text message to share
 */
export function openWhatsAppShare(text: string): void {
  const url = buildWhatsAppShareURL(text);
  window.open(url, '_blank', 'noopener,noreferrer');
}
