const AudioContextClass = window.AudioContext || window.webkitAudioContext;

const INSTRUMENTS = {
  piano: { type: "triangle", attack: 0.01, decay: 0.18, sustain: 0.35, release: 1.1, filter: 3600 },
  guitar: { type: "sawtooth", attack: 0.006, decay: 0.12, sustain: 0.22, release: 0.7, filter: 1800 },
  organ: { type: "sine", attack: 0.04, decay: 0.08, sustain: 0.75, release: 0.55, filter: 2600 },
  synth: { type: "square", attack: 0.025, decay: 0.15, sustain: 0.45, release: 0.85, filter: 5200 }
};

const drumFrequencies = {
  kick: 110,
  snare: 240,
  clap: 700
};

let context;
let masterGain;
let analyser;

function getContext() {
  if (!context) {
    context = new AudioContextClass();
    masterGain = context.createGain();
    analyser = context.createAnalyser();
    analyser.fftSize = 128;
    masterGain.connect(analyser);
    analyser.connect(context.destination);
  }

  if (context.state === "suspended") {
    context.resume();
  }

  return context;
}

function midiToFrequency(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export function getAnalyser() {
  getContext();
  return analyser;
}

export function setMasterVolume(volume) {
  getContext();
  masterGain.gain.setTargetAtTime(volume, context.currentTime, 0.02);
}

export function playNote(note, octave, instrument, volume, sustain = false, duration = 0.9) {
  const ctx = getContext();
  setMasterVolume(volume);

  const noteIndex = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"].indexOf(note);
  const midi = 12 * (octave + 1) + noteIndex;
  const frequency = midiToFrequency(midi);
  const preset = INSTRUMENTS[instrument];
  const now = ctx.currentTime;
  const releaseTime = sustain ? preset.release + 1.1 : preset.release;
  const noteLength = sustain ? duration + 0.9 : duration;

  const output = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  const mainOscillator = ctx.createOscillator();
  const shineOscillator = ctx.createOscillator();

  output.gain.setValueAtTime(0.0001, now);
  output.gain.exponentialRampToValueAtTime(Math.max(volume, 0.001), now + preset.attack);
  output.gain.exponentialRampToValueAtTime(Math.max(volume * preset.sustain, 0.001), now + preset.attack + preset.decay);
  output.gain.setTargetAtTime(0.0001, now + noteLength, releaseTime / 5);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(preset.filter, now);
  filter.frequency.exponentialRampToValueAtTime(preset.filter * 0.55, now + noteLength);

  mainOscillator.type = preset.type;
  mainOscillator.frequency.setValueAtTime(frequency, now);
  mainOscillator.detune.setValueAtTime(instrument === "synth" ? -5 : 0, now);

  shineOscillator.type = instrument === "organ" ? "sine" : "triangle";
  shineOscillator.frequency.setValueAtTime(frequency * 2, now);
  shineOscillator.detune.setValueAtTime(instrument === "guitar" ? 7 : 3, now);

  const shineGain = ctx.createGain();
  shineGain.gain.setValueAtTime(instrument === "organ" ? 0.18 : 0.1, now);

  mainOscillator.connect(filter);
  shineOscillator.connect(shineGain);
  shineGain.connect(filter);
  filter.connect(output);
  output.connect(masterGain);

  mainOscillator.start(now);
  shineOscillator.start(now);
  mainOscillator.stop(now + noteLength + releaseTime);
  shineOscillator.stop(now + noteLength + releaseTime);
}

export function playChord(notes, octave, instrument, volume, sustain) {
  notes.forEach((note, index) => {
    window.setTimeout(() => playNote(note, octave, instrument, volume, sustain, 1.15), index * 24);
  });
}

export function playDrum(type, volume) {
  const ctx = getContext();
  setMasterVolume(volume);
  const now = ctx.currentTime;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  const noiseGain = ctx.createGain();
  const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.25, ctx.sampleRate);
  const noiseData = noiseBuffer.getChannelData(0);

  for (let i = 0; i < noiseData.length; i += 1) {
    noiseData[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;

  oscillator.type = type === "kick" ? "sine" : "triangle";
  oscillator.frequency.setValueAtTime(drumFrequencies[type], now);
  oscillator.frequency.exponentialRampToValueAtTime(type === "kick" ? 42 : 120, now + 0.18);

  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + (type === "kick" ? 0.45 : 0.2));
  noiseGain.gain.setValueAtTime(type === "kick" ? 0.03 : volume * 0.55, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);

  oscillator.connect(gain);
  noise.connect(noiseGain);
  gain.connect(masterGain);
  noiseGain.connect(masterGain);

  oscillator.start(now);
  noise.start(now);
  oscillator.stop(now + 0.5);
  noise.stop(now + 0.25);
}
