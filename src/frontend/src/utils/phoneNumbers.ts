/**
 * Best-effort phone number extraction and normalization utilities
 */

/**
 * Normalize a single phone number by removing common separators and whitespace
 * Keeps leading + when present
 */
export function normalizePhoneNumber(phone: string): string {
  // Remove whitespace, parentheses, hyphens, dots
  return phone
    .trim()
    .replace(/[\s\(\)\-\.]/g, '');
}

/**
 * Extract phone numbers from a pasted text (comma or newline separated)
 * Returns deduplicated array of normalized phone numbers
 */
export function extractPhoneNumbers(text: string): string[] {
  // Split by comma or newline
  const parts = text.split(/[,\n]+/);
  
  // Normalize and filter out empty strings
  const normalized = parts
    .map(p => normalizePhoneNumber(p))
    .filter(p => p.length > 0);
  
  // Deduplicate
  return Array.from(new Set(normalized));
}

/**
 * Extract phone numbers from Web Contacts Picker API results
 */
export function extractPhoneNumbersFromContacts(contacts: any[]): string[] {
  const numbers: string[] = [];
  
  for (const contact of contacts) {
    if (contact.tel && Array.isArray(contact.tel)) {
      for (const tel of contact.tel) {
        const normalized = normalizePhoneNumber(tel);
        if (normalized.length > 0) {
          numbers.push(normalized);
        }
      }
    }
  }
  
  // Deduplicate
  return Array.from(new Set(numbers));
}

/**
 * Check if the browser supports the Contacts Picker API
 */
export function isContactsPickerSupported(): boolean {
  return 'contacts' in navigator && 'ContactsManager' in window;
}
