const STORAGE_KEY = "focusmode-timer";

const subscribers = new Set();
let interval = null;
let onCompleteCallback = null;

const state = {
  isActive: false,
  durationMinutes: 25,
  startTimestamp: null,
  remainingSeconds: 25 * 60,
};

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {}
}

function notify() {
  for (const cb of subscribers) cb({ ...state });
}

function tick() {
  if (!state.isActive || !state.startTimestamp) return;
  const elapsed = Math.floor((Date.now() - state.startTimestamp) / 1000);
  const total = state.durationMinutes * 60;
  const remaining = Math.max(total - elapsed, 0);
  state.remainingSeconds = remaining;
  if (remaining <= 0) {
    state.isActive = false;
    state.startTimestamp = null;
    clearInterval(interval);
    interval = null;
    persist();
    notify();
    if (typeof onCompleteCallback === 'function') onCompleteCallback();
    return;
  }
  persist();
  notify();
}

function ensureInterval() {
  if (!interval) interval = setInterval(tick, 1000);
}

export function initTimerFromStorage(defaultMinutes = 25) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const stored = JSON.parse(raw);
    if (stored.durationMinutes) state.durationMinutes = stored.durationMinutes;
    if (stored.isActive && stored.startTimestamp) {
      state.isActive = true;
      state.startTimestamp = stored.startTimestamp;
      const elapsed = Math.floor((Date.now() - state.startTimestamp) / 1000);
      const total = state.durationMinutes * 60;
      state.remainingSeconds = Math.max(total - elapsed, 0);
      if (state.remainingSeconds > 0) ensureInterval();
      else {
        state.isActive = false;
        state.startTimestamp = null;
      }
    } else if (stored.isActive === false && typeof stored.remainingSeconds === 'number') {
      state.isActive = false;
      state.remainingSeconds = stored.remainingSeconds;
    }
  } catch (e) {}
}

export function subscribeTimer(cb) {
  subscribers.add(cb);
  cb({ ...state });
  return () => subscribers.delete(cb);
}

export function setOnComplete(fn) {
  onCompleteCallback = fn;
}

export function startTimer(minutes) {
  const nextMinutes = minutes ?? state.durationMinutes;
  state.durationMinutes = nextMinutes;
  state.startTimestamp = Date.now();
  state.isActive = true;
  state.remainingSeconds = nextMinutes * 60;
  persist();
  ensureInterval();
  notify();
}

export function stopTimer() {
  state.isActive = false;
  // keep remainingSeconds as-is
  state.startTimestamp = null;
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
  persist();
  notify();
}

export function resetTimer(minutes) {
  const nextMinutes = minutes ?? state.durationMinutes;
  state.durationMinutes = nextMinutes;
  state.remainingSeconds = nextMinutes * 60;
  state.isActive = false;
  state.startTimestamp = null;
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
  persist();
  notify();
}

export function getTimerState() {
  return { ...state };
}

// initialize immediately
initTimerFromStorage();

export default {
  subscribeTimer,
  startTimer,
  stopTimer,
  resetTimer,
  getTimerState,
  setOnComplete,
};
