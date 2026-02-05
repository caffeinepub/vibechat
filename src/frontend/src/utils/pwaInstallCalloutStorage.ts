const STORAGE_KEY = 'vibechat_pwa_install_callout_hidden';

export function isCalloutHidden(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setCalloutHidden(hidden: boolean): void {
  try {
    if (hidden) {
      localStorage.setItem(STORAGE_KEY, 'true');
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

export function clearCalloutHidden(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Silently fail if localStorage is unavailable
  }
}
