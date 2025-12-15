// Simple owner auth module. Uses Vite env var VITE_OWNER_PASSWORD.
// This is a lightweight client-side protection: not a replacement for real backend auth.

const OWNER_KEY = 'focusmode-owner-auth-token';

const envPassword = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_OWNER_PASSWORD
  ? import.meta.env.VITE_OWNER_PASSWORD
  : null;

let isOwner = Boolean(localStorage.getItem(OWNER_KEY));
const listeners = new Set();

function notify() {
  listeners.forEach((cb) => {
    try { cb(isOwner); } catch (e) {}
  });
}

function login(password) {
  // First try env password if provided, else fallback to 'ownerpass' (development only)
  const correct = envPassword || 'ownerpass';
  if (password === correct) {
    localStorage.setItem(OWNER_KEY, '1');
    isOwner = true;
    // migrate existing generic stats to owner key if present
    try {
      const raw = localStorage.getItem('focusmode-stats');
      if (raw) {
        const ownerKey = 'focusmode-stats-owner';
        if (!localStorage.getItem(ownerKey)) {
          localStorage.setItem(ownerKey, raw);
          localStorage.removeItem('focusmode-stats');
        }
      }
    } catch (e) {}
    notify();
    return true;
  }
  return false;
}

function logout() {
  localStorage.removeItem(OWNER_KEY);
  isOwner = false;
  notify();
}

function subscribe(cb) {
  listeners.add(cb);
  try { cb(isOwner); } catch (e) {}
  return () => listeners.delete(cb);
}

function getState() {
  return { isOwner };
}

export default { login, logout, subscribe, getState };
