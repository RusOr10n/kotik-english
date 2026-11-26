/** Озвучка английских слов через встроенный синтезатор речи браузера */

// macOS, Chrome, затем голоса Windows / Edge
const PREFERRED = [
  'Samantha', 'Google US English', 'Karen', 'Moira', 'Daniel', 'Google UK English Female',
  'Microsoft Aria', 'Microsoft Jenny', 'Microsoft Ava', 'Microsoft Ana', 'Microsoft Zira', 'Microsoft Hazel', 'Microsoft Libby',
];

let cachedVoice: SpeechSynthesisVoice | null = null;
let preferredName: string | null = null;
let rate = 0.85;

function synth(): SpeechSynthesis | null {
  return typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;
}

export function englishVoices(): SpeechSynthesisVoice[] {
  const s = synth();
  if (!s) return [];
  return s.getVoices().filter((v) => v.lang.toLowerCase().startsWith('en'));
}

function chooseVoice(): SpeechSynthesisVoice | null {
  const voices = englishVoices();
  if (!voices.length) return null;
  if (preferredName) {
    const v = voices.find((x) => x.name === preferredName);
    if (v) return v;
  }
  for (const name of PREFERRED) {
    const v = voices.find((x) => x.name.startsWith(name));
    if (v) return v;
  }
  return voices.find((v) => v.lang === 'en-US') ?? voices[0];
}

export function configureSpeech(opts: { rate?: number; voiceName?: string | null }) {
  if (opts.rate) rate = opts.rate;
  if (opts.voiceName !== undefined) {
    preferredName = opts.voiceName;
    cachedVoice = null;
  }
}

/** Номер последней просьбы что-то сказать: устаревшие просьбы молча отбрасываются */
let speechToken = 0;

/**
 * Говорит фразу, обрывая то, что звучало до этого.
 * Safari и Chrome, если вызвать speak() сразу после cancel(), часто договаривают
 * старую фразу или теряют новую — поэтому, когда что-то уже звучит, новая фраза
 * стартует после короткой паузы. Если синтезатор молчит, говорим сразу: iOS
 * разрешает первую речь только прямо внутри тапа.
 */
export function speak(text: string, opts: { slow?: boolean } = {}): Promise<void> {
  const s = synth();
  if (!s) return Promise.resolve();
  if (!cachedVoice) cachedVoice = chooseVoice();
  const token = ++speechToken;
  const busy = s.speaking || s.pending;
  s.cancel();
  return new Promise((resolve) => {
    const start = () => {
      if (token !== speechToken) return resolve();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = cachedVoice?.lang ?? 'en-US';
      if (cachedVoice) u.voice = cachedVoice;
      u.rate = opts.slow ? rate * 0.7 : rate;
      u.pitch = 1.1;
      u.onend = () => resolve();
      u.onerror = () => resolve();
      s.speak(u);
      // страховка: некоторые браузеры не присылают onend
      setTimeout(resolve, 4000);
    };
    if (busy) setTimeout(start, 80);
    else start();
  });
}

export function stopSpeech() {
  speechToken++;
  synth()?.cancel();
}

// Голоса загружаются асинхронно
synth()?.addEventListener?.('voiceschanged', () => {
  cachedVoice = null;
});
