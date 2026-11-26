/** Короткие звуки, синтезированные через Web Audio — без файлов */

let ctx: AudioContext | null = null;
let muted = false;

export function setMuted(value: boolean) {
  muted = value;
}

function audio(): AudioContext | null {
  if (muted) return null;
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as any).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function tone(freq: number, start: number, duration: number, type: OscillatorType = 'sine', volume = 0.18) {
  const a = audio();
  if (!a) return;
  const t = a.currentTime + start;
  const osc = a.createOscillator();
  const gain = a.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(volume, t + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
  osc.connect(gain).connect(a.destination);
  osc.start(t);
  osc.stop(t + duration + 0.05);
}

export const sfx = {
  click() {
    tone(660, 0, 0.06, 'triangle', 0.08);
  },
  correct() {
    tone(784, 0, 0.12, 'triangle');
    tone(1047, 0.1, 0.22, 'triangle');
  },
  wrong() {
    tone(330, 0, 0.15, 'square', 0.06);
    tone(262, 0.12, 0.25, 'square', 0.06);
  },
  coin() {
    tone(988, 0, 0.08, 'square', 0.07);
    tone(1319, 0.07, 0.3, 'square', 0.07);
  },
  flip() {
    tone(520, 0, 0.05, 'sine', 0.1);
  },
  splash() {
    const a = audio();
    if (!a) return;
    const len = a.sampleRate * 0.3;
    const buffer = a.createBuffer(1, len, a.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
    const src = a.createBufferSource();
    const filter = a.createBiquadFilter();
    const gain = a.createGain();
    filter.type = 'bandpass';
    filter.frequency.value = 1200;
    gain.gain.value = 0.25;
    src.buffer = buffer;
    src.connect(filter).connect(gain).connect(a.destination);
    src.start();
  },
  /** «Мяу» — пила через фильтр с изменением частоты */
  meow() {
    const a = audio();
    if (!a) return;
    const t = a.currentTime;
    const osc = a.createOscillator();
    const filter = a.createBiquadFilter();
    const gain = a.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(520, t);
    osc.frequency.linearRampToValueAtTime(820, t + 0.15);
    osc.frequency.linearRampToValueAtTime(480, t + 0.45);
    filter.type = 'lowpass';
    filter.Q.value = 8;
    filter.frequency.setValueAtTime(900, t);
    filter.frequency.linearRampToValueAtTime(2200, t + 0.15);
    filter.frequency.linearRampToValueAtTime(700, t + 0.45);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.12, t + 0.05);
    gain.gain.linearRampToValueAtTime(0.1, t + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    osc.connect(filter).connect(gain).connect(a.destination);
    osc.start(t);
    osc.stop(t + 0.55);
  },
  fanfare() {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.3, 'triangle', 0.15));
    tone(1047, 0.5, 0.6, 'triangle', 0.15);
    tone(1319, 0.5, 0.6, 'sine', 0.08);
  },
  hit() {
    tone(200, 0, 0.1, 'square', 0.1);
    tone(120, 0.05, 0.2, 'sawtooth', 0.08);
  },
};
