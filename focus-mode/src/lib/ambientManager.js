// Singleton ambient audio manager — keeps audio playing across navigation
const AMBIENT_TRACKS = [
  { id: 'bird-song', label: 'Bird Song' },
  { id: 'morning-glow', label: 'Morning Glow' },
  { id: 'calm-melody', label: 'Calm Melody' },
];

function getAudioContextConstructor() {
  if (typeof window === 'undefined') return null;
  return window.AudioContext || window.webkitAudioContext || null;
}

// Simple buffer generators (copied & simplified from hook)
function createBirdSongBuffer(context) {
  const durationSeconds = 16;
  const frameCount = context.sampleRate * durationSeconds;
  const buffer = context.createBuffer(1, frameCount, context.sampleRate);
  const d = buffer.getChannelData(0);
  for (let i = 0; i < frameCount; i += 1) {
    const t = i / context.sampleRate;
    d[i] = (Math.random() * 2 - 1) * 0.02 + Math.sin(2 * Math.PI * 1100 * t) * 0.02;
  }
  return buffer;
}

function createMorningGlowBuffer(context) {
  const durationSeconds = 20;
  const frameCount = context.sampleRate * durationSeconds;
  const buffer = context.createBuffer(1, frameCount, context.sampleRate);
  const d = buffer.getChannelData(0);
  for (let i = 0; i < frameCount; i += 1) {
    const t = i / context.sampleRate;
    d[i] = Math.sin(2 * Math.PI * 174.61 * t) * 0.03 + (Math.random() * 2 - 1) * 0.01;
  }
  return buffer;
}

function createCalmMelodyBuffer(context) {
  const durationSeconds = 16;
  const frameCount = context.sampleRate * durationSeconds;
  const buffer = context.createBuffer(1, frameCount, context.sampleRate);
  const d = buffer.getChannelData(0);
  for (let i = 0; i < frameCount; i += 1) {
    const t = i / context.sampleRate;
    d[i] = Math.sin(2 * Math.PI * 261.63 * t) * 0.025 + Math.sin(2 * Math.PI * 523.25 * t) * 0.01;
  }
  return buffer;
}

const BUFFER_GENERATORS = {
  'bird-song': createBirdSongBuffer,
  'morning-glow': createMorningGlowBuffer,
  'calm-melody': createCalmMelodyBuffer,
};

const AudioCtx = getAudioContextConstructor();

let audioContext = null;
let gainNode = null;
let sourceNode = null;
const bufferCache = new Map();
let currentTrack = null;
let isPlaying = false;
const listeners = new Set();
let defaultVolume = 0.4;

function ensureContext() {
  if (!AudioCtx) return null;
  if (!audioContext) {
    audioContext = new AudioCtx();
    gainNode = audioContext.createGain();
    gainNode.gain.value = defaultVolume;
    gainNode.connect(audioContext.destination);
  }
  return audioContext;
}

function notify() {
  listeners.forEach((cb) => {
    try {
      cb({ isPlaying, currentTrack, volume: gainNode ? gainNode.gain.value : defaultVolume });
    } catch (e) {}
  });
}

async function play(trackId) {
  const ctx = ensureContext();
  if (!ctx || !BUFFER_GENERATORS[trackId]) return false;
  if (ctx.state === 'suspended') {
    try { await ctx.resume(); } catch (e) {}
  }
  let buffer = bufferCache.get(trackId);
  if (!buffer) {
    buffer = BUFFER_GENERATORS[trackId](ctx);
    bufferCache.set(trackId, buffer);
  }

  if (sourceNode) {
    try { sourceNode.stop(); } catch (e) {}
    sourceNode.disconnect();
    sourceNode = null;
  }

  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.loop = true;
  src.connect(gainNode);
  src.start(0);
  sourceNode = src;
  currentTrack = trackId;
  isPlaying = true;
  notify();
  return true;
}

function stop() {
  if (sourceNode) {
    try { sourceNode.stop(); } catch (e) {}
    sourceNode.disconnect();
    sourceNode = null;
  }
  currentTrack = null;
  isPlaying = false;
  notify();
}

function setVolume(v) {
  const ctx = ensureContext();
  if (!ctx || !gainNode) return;
  const clamped = Math.max(0, Math.min(1, v));
  gainNode.gain.cancelScheduledValues(ctx.currentTime);
  gainNode.gain.setTargetAtTime(clamped, ctx.currentTime, 0.01);
  notify();
}

function subscribe(cb) {
  listeners.add(cb);
  try { cb({ isPlaying, currentTrack, volume: gainNode ? gainNode.gain.value : defaultVolume }); } catch (e) {}
  return () => listeners.delete(cb);
}

export default {
  AMBIENT_TRACKS,
  isSupported: Boolean(AudioCtx),
  play,
  stop,
  setVolume,
  subscribe,
  getState: () => ({ isPlaying, currentTrack, volume: gainNode ? gainNode.gain.value : defaultVolume }),
};
