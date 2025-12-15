import auth from './auth';

function getKey() {
  try {
    const s = auth.getState();
    return s && s.isOwner ? 'focusmode-stats-owner' : 'focusmode-stats-public';
  } catch (e) {
    return 'focusmode-stats-public';
  }
}

function getStorage() {
  try {
    const raw = localStorage.getItem(getKey());
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveStorage(obj) {
  try {
    localStorage.setItem(getKey(), JSON.stringify(obj));
    try {
      if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
        window.dispatchEvent(new Event('focusmode-stats-updated'));
      }
    } catch (e) {}
  } catch (e) {}
}

export function addSession({ dateKey, sessionSeconds = 0, tabSwitches = 0, screenTimeSeconds = 0 }) {
  const stats = getStorage();
  const day = stats[dateKey] || { sessions: 0, tabSwitches: 0, screenTime: 0 };
  day.sessions = (day.sessions || 0) + 1;
  day.tabSwitches = (day.tabSwitches || 0) + tabSwitches;
  day.screenTime = (day.screenTime || 0) + (screenTimeSeconds || 0);
  stats[dateKey] = day;
  saveStorage(stats);
}

export function incrementTabSwitch(dateKey, count = 1) {
  const stats = getStorage();
  const day = stats[dateKey] || { sessions: 0, tabSwitches: 0, screenTime: 0 };
  day.tabSwitches = (day.tabSwitches || 0) + count;
  stats[dateKey] = day;
  saveStorage(stats);
}

export function incrementScreenTime(dateKey, seconds = 1) {
  const stats = getStorage();
  const day = stats[dateKey] || { sessions: 0, tabSwitches: 0, screenTime: 0 };
  day.screenTime = (day.screenTime || 0) + seconds;
  stats[dateKey] = day;
  saveStorage(stats);
}

export function getStats() {
  return getStorage();
}

export default { addSession, incrementTabSwitch, getStats };
