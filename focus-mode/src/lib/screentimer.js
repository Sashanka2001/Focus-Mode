import stats from './stats';

const STORAGE_KEY = "focusmode-screentime";
const subscribers = new Set();
let interval = null;

const state = {
  screenTime: 0, // seconds
  lastActive: Date.now(),
};
let pendingScreenIncrement = 0; // accumulate seconds before flushing to stats

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {}
}

function notify() {
  for (const cb of subscribers) cb({ ...state });
}


function flushPending() {
  if (pendingScreenIncrement > 0) {
    try {
      const dateKey = new Date().toLocaleDateString();
      stats.incrementScreenTime(dateKey, pendingScreenIncrement);
    } catch (e) {}
    pendingScreenIncrement = 0;
    // persist current state when flushing
    persist();
  }
}

function tick() {
  try {
    if (Date.now() - state.lastActive < 60000) {
      state.screenTime = (state.screenTime || 0) + 1;
      pendingScreenIncrement += 1;
      // flush once per minute to reduce localStorage churn
      if (pendingScreenIncrement >= 60) {
        flushPending();
      }
      // notify every second for live UI updates
      notify();
    }
  } catch (e) {}
}

function ensureInterval() {
  if (!interval) interval = setInterval(tick, 1000);
}

function activity() {
  state.lastActive = Date.now();
  persist();
  notify();
}

// initialize from storage
try {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    const stored = JSON.parse(raw);
    if (typeof stored.screenTime === 'number') state.screenTime = stored.screenTime;
    if (stored.lastActive) state.lastActive = stored.lastActive;
  }
} catch (e) {}

// start ticking
ensureInterval();

// attach global activity listeners so module keeps track regardless of components
if (typeof window !== 'undefined') {
  ['mousemove', 'keydown', 'mousedown', 'touchstart'].forEach((ev) =>
    window.addEventListener(ev, activity, { passive: true }),
  );
  // flush pending increments when the page unloads
  window.addEventListener('beforeunload', () => {
    try { flushPending(); } catch (e) {}
  });
}

export function subscribeScreenTime(cb) {
  subscribers.add(cb);
  cb({ ...state });
  return () => subscribers.delete(cb);
}

export function getScreenTime() {
  return { ...state };
}

export function resetScreenTime() {
  state.screenTime = 0;
  pendingScreenIncrement = 0;
  persist();
  notify();
}

export default {
  subscribeScreenTime,
  getScreenTime,
  resetScreenTime,
};
