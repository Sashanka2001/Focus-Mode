import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const AMBIENT_TRACKS = [
  {
    id: "bird-song",
    label: "Bird Song",
    description: "Layered chirps with gentle wind for a calm garden vibe.",
  },
  {
    id: "morning-glow",
    label: "Morning Glow",
    description: "Soft wind chimes and hush tones that feel like sunrise.",
  },
  {
    id: "calm-melody",
    label: "Calm Melody",
    description: "Slow music pads and plucks for relaxed concentration.",
  },
];

const BUFFER_GENERATORS = {
  "bird-song": createBirdSongBuffer,
  "morning-glow": createMorningGlowBuffer,
  "calm-melody": createCalmMelodyBuffer,
};

function getAudioContextConstructor() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.AudioContext || window.webkitAudioContext || null;
}

function createBirdSongBuffer(context) {
  const durationSeconds = 16;
  const frameCount = context.sampleRate * durationSeconds;
  const buffer = context.createBuffer(1, frameCount, context.sampleRate);
  const channelData = buffer.getChannelData(0);
  let wind = 0;

  for (let i = 0; i < frameCount; i += 1) {
    const time = i / context.sampleRate;
    const random = Math.random() * 2 - 1;
    wind = wind * 0.965 + random * 0.035;

    const phrase = (time % 4) / 4;
    const phraseEnvelope = Math.pow(Math.max(Math.sin(Math.PI * phrase), 0), 4);

    const call = Math.sin(2 * Math.PI * (1100 + 70 * Math.sin(2 * Math.PI * 0.6 * time)) * time) * phraseEnvelope * 0.22;
    const replyPhase = ((time + 1.2) % 4) / 4;
    const replyEnvelope = Math.pow(Math.max(Math.sin(Math.PI * replyPhase), 0), 4);
    const reply = Math.sin(2 * Math.PI * (1500 + 90 * Math.sin(2 * Math.PI * 0.4 * time)) * time) * replyEnvelope * 0.15;

    const flutter = Math.sin(2 * Math.PI * (700 + 25 * Math.sin(2 * Math.PI * 0.3 * time)) * time) * 0.07;

    channelData[i] = wind * 0.22 + call + reply + flutter;
  }

  return buffer;
}

function createMorningGlowBuffer(context) {
  const durationSeconds = 20;
  const frameCount = context.sampleRate * durationSeconds;
  const buffer = context.createBuffer(1, frameCount, context.sampleRate);
  const channelData = buffer.getChannelData(0);

  for (let i = 0; i < frameCount; i += 1) {
    const time = i / context.sampleRate;

    const padFrequencies = [174.61, 207.65, 246.94, 293.66];
    let pad = 0;
    padFrequencies.forEach((frequency, index) => {
      const lfo = 0.45 + 0.25 * Math.sin(2 * Math.PI * (0.018 + index * 0.006) * time);
      pad += Math.sin(2 * Math.PI * frequency * time) * lfo;
    });
    pad /= padFrequencies.length;

    const bellWindow = (time % 7.5) / 7.5;
    const bellEnvelope = Math.pow(Math.max(Math.sin(Math.PI * bellWindow), 0), 6);
    const bell = Math.sin(2 * Math.PI * 987.77 * time) * bellEnvelope * 0.16;

    const overtone = Math.sin(2 * Math.PI * 659.25 * time) * bellEnvelope * 0.08;
    const air = (Math.random() * 2 - 1) * 0.04;

    channelData[i] = pad * 0.3 + bell + overtone + air;
  }

  return buffer;
}

function createCalmMelodyBuffer(context) {
  const loopLength = 16;
  const frameCount = context.sampleRate * loopLength;
  const buffer = context.createBuffer(1, frameCount, context.sampleRate);
  const channelData = buffer.getChannelData(0);

  const chordProgression = [
    { start: 0, duration: 4, frequencies: [261.63, 329.63, 392] },
    { start: 4, duration: 4, frequencies: [293.66, 369.99, 440] },
    { start: 8, duration: 4, frequencies: [246.94, 329.63, 392] },
    { start: 12, duration: 4, frequencies: [220, 293.66, 349.23] },
  ];

  for (let i = 0; i < frameCount; i += 1) {
    const time = i / context.sampleRate;
    const beat = time % loopLength;
    let pad = 0;

    chordProgression.forEach((chord, chordIndex) => {
      if (beat >= chord.start && beat < chord.start + chord.duration) {
        const chordTime = (beat - chord.start) / chord.duration;
        const envelope = Math.pow(1 - chordTime, 2.5) * (0.7 + 0.3 * Math.sin(2 * Math.PI * 0.04 * time + chordIndex));
        chord.frequencies.forEach((frequency, noteIndex) => {
          const detune = Math.sin(2 * Math.PI * (0.12 + noteIndex * 0.07) * time) * 1.2;
          pad += Math.sin(2 * Math.PI * (frequency + detune) * time) * envelope;
        });
      }
    });

    const pluckWindow = (time % 2.5) / 2.5;
    const pluckEnvelope = Math.exp(-6 * pluckWindow) * Math.max(Math.sin(Math.PI * pluckWindow), 0);
    const pluck = Math.sin(2 * Math.PI * 523.25 * time) * pluckEnvelope * 0.12;

    const shimmer = 0.04 * Math.sin(2 * Math.PI * 80 * time);

    channelData[i] = (pad / chordProgression.length) * 0.35 + pluck + shimmer;
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
