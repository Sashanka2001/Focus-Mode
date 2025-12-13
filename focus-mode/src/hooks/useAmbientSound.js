import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const AMBIENT_TRACKS = [
  {
    id: "brown-noise",
    label: "Brown Noise",
    description: "Warm, low-frequency noise that masks distractions.",
  },
  {
    id: "pink-noise",
    label: "Pink Noise",
    description: "Balanced white noise with a softer timbre.",
  },
  {
    id: "focus-chime",
    label: "Focus Chime",
    description: "Gentle tonal loop that keeps sessions intentional.",
  },
];

const BUFFER_GENERATORS = {
  "brown-noise": createBrownNoiseBuffer,
  "pink-noise": createPinkNoiseBuffer,
  "focus-chime": createFocusChimeBuffer,
};

function getAudioContextConstructor() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.AudioContext || window.webkitAudioContext || null;
}

function createBrownNoiseBuffer(context) {
  const durationSeconds = 5;
  const frameCount = context.sampleRate * durationSeconds;
  const buffer = context.createBuffer(1, frameCount, context.sampleRate);
  const channelData = buffer.getChannelData(0);
  let lastOut = 0;

  for (let i = 0; i < frameCount; i += 1) {
    const white = Math.random() * 2 - 1;
    channelData[i] = (lastOut + 0.02 * white) / 1.02;
    lastOut = channelData[i];
    channelData[i] *= 3.5;
  }

  return buffer;
}

function createPinkNoiseBuffer(context) {
  const durationSeconds = 5;
  const frameCount = context.sampleRate * durationSeconds;
  const buffer = context.createBuffer(1, frameCount, context.sampleRate);
  const channelData = buffer.getChannelData(0);

  let b0 = 0;
  let b1 = 0;
  let b2 = 0;
  let b3 = 0;
  let b4 = 0;
  let b5 = 0;
  let b6 = 0;

  for (let i = 0; i < frameCount; i += 1) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.969 * b2 + white * 0.153852;
    b3 = 0.8665 * b3 + white * 0.3104856;
    b4 = 0.55 * b4 + white * 0.5329522;
    b5 = b5 * -0.7616 - white * 0.016898;
    const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
    b6 = white * 0.115926;

    channelData[i] = pink * 0.11;
  }

  return buffer;
}

function createFocusChimeBuffer(context) {
  const durationSeconds = 8;
  const frameCount = context.sampleRate * durationSeconds;
  const buffer = context.createBuffer(1, frameCount, context.sampleRate);
  const channelData = buffer.getChannelData(0);
  const frequencies = [261.63, 329.63, 392];

  for (let i = 0; i < frameCount; i += 1) {
    const time = i / context.sampleRate;
    const envelope = Math.pow(Math.sin(Math.PI * (time / durationSeconds)), 2);
    const pulse = 0.6 + 0.4 * Math.sin(2 * Math.PI * 0.25 * time);

    let sample = 0;
    for (const frequency of frequencies) {
      sample += Math.sin(2 * Math.PI * frequency * time);
    }

    channelData[i] = envelope * pulse * (sample / frequencies.length) * 0.4;
  }

  return buffer;
}

export function useAmbientSound(defaultVolume = 0.4) {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(defaultVolume);
  const audioContextRef = useRef(null);
  const gainNodeRef = useRef(null);
  const sourceRef = useRef(null);
  const bufferCacheRef = useRef(new Map());
  const AudioContextConstructor = useMemo(() => getAudioContextConstructor(), []);

  const ensureContext = useCallback(() => {
    if (!AudioContextConstructor) {
      return null;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextConstructor();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.gain.value = defaultVolume;
      gainNodeRef.current.connect(audioContextRef.current.destination);
    }

    return audioContextRef.current;
  }, [AudioContextConstructor, defaultVolume]);

  const stop = useCallback(() => {
    if (sourceRef.current) {
      try {
        sourceRef.current.stop();
      } catch (error) {
        // Ignored: stopping an already-stopped node can throw.
      }
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }

    setIsPlaying(false);
    setCurrentTrack(null);
  }, []);

  const play = useCallback(
    async (trackId) => {
      const context = ensureContext();
      if (!context) {
        return false;
      }

      if (!BUFFER_GENERATORS[trackId]) {
        return false;
      }

      if (context.state === "suspended") {
        await context.resume();
      }

      let buffer = bufferCacheRef.current.get(trackId);
      if (!buffer) {
        buffer = BUFFER_GENERATORS[trackId](context);
        bufferCacheRef.current.set(trackId, buffer);
      }

      if (sourceRef.current) {
        try {
          sourceRef.current.stop();
        } catch (error) {
          // Ignored: stopping an already-stopped node can throw.
        }
        sourceRef.current.disconnect();
        sourceRef.current = null;
      }

      const source = context.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(gainNodeRef.current);
      source.start(0);

      sourceRef.current = source;
      setCurrentTrack(trackId);
      setIsPlaying(true);

      return true;
    },
    [ensureContext],
  );

  const setVolume = useCallback(
    (value) => {
      const context = ensureContext();
      if (!context || !gainNodeRef.current) {
        return;
      }

      const clampedValue = Math.min(Math.max(value, 0), 1);
      gainNodeRef.current.gain.cancelScheduledValues(context.currentTime);
      gainNodeRef.current.gain.setTargetAtTime(clampedValue, context.currentTime, 0.01);
      setVolumeState(clampedValue);
    },
    [ensureContext],
  );

  useEffect(() => {
    return () => {
      if (sourceRef.current) {
        try {
          sourceRef.current.stop();
        } catch (error) {
          // Ignore cleanup errors.
        }
        sourceRef.current.disconnect();
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
    isSupported: Boolean(AudioContextConstructor),
    play,
    stop,
    setVolume,
    currentTrack,
    isPlaying,
    volume,
  };
}

export { AMBIENT_TRACKS };
