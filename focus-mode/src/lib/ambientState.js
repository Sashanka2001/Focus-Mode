// Minimal pub/sub state for the Ambient iframe player
let state = {
  playing: false,
  url: null,
};

const listeners = new Set();

function setState(next) {
  state = { ...state, ...next };
  listeners.forEach((cb) => {
    try { cb(state); } catch (e) {}
  });
}

function getState() {
  return state;
}

function subscribe(cb) {
  listeners.add(cb);
  try { cb(state); } catch (e) {}
  return () => listeners.delete(cb);
}

export default { setState, getState, subscribe };
