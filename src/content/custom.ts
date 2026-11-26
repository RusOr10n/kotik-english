import type { Lesson, Phrase, Word, World } from './types';
import { findBuiltinByEn, setCustomWords } from './words';
import { setExtraWorlds } from './worlds';

/** Тема, которую загрузил родитель (хранится в localStorage) */
export type CustomWord = { en: string; ru: string; pic?: string };
export type CustomTheme = {
  id: string;
  name: string;
  pic: string;
  words: CustomWord[];
  phrases: Phrase[];
  createdAt: number;
};

export const MIN_WORDS = 4;
export const MAX_WORDS = 40;
export const THEME_ICONS = ['⭐', '🎒', '🦄', '🚀', '🎃', '🎄', '🏰', '🌙', '🍀', '🎵', '⚽', '🐾', '🧁', '🦖', '🌈', '🐉'];

const PALETTE = [
  { bg: 'linear-gradient(160deg, #fff0f6 0%, #ffd6ec 100%)', accent: '#e05597' },
  { bg: 'linear-gradient(160deg, #e8f5ff 0%, #c9e4ff 100%)', accent: '#2f7fd8' },
  { bg: 'linear-gradient(160deg, #f0ffe8 0%, #cff3c0 100%)', accent: '#3d9a3d' },
  { bg: 'linear-gradient(160deg, #fff8e1 0%, #ffe2a8 100%)', accent: '#e08a00' },
  { bg: 'linear-gradient(160deg, #f3ecff 0%, #dccbff 100%)', accent: '#7c4dce' },
];

const BOSSES = [
  { name: 'Ёжик Колючка', pic: '🦔' },
  { name: 'Крокодил Клац', pic: '🐊' },
  { name: 'Медведь Топтыжка', pic: '🐻' },
  { name: 'Змей Шипун', pic: '🐍' },
  { name: 'Летучая мышь Шмыг', pic: '🦇' },
];

const FRIENDS = [
  { name: 'Ириска', fur: 'peach', accessories: { hat: 'bunny' } },
  { name: 'Звёздочка', fur: 'night', accessories: { hat: 'halo' } },
  { name: 'Шоколадка', fur: 'chocolate', accessories: { neck: 'bowtie' } },
  { name: 'Мятик', fur: 'mint', accessories: { glasses: 'sun' } },
  { name: 'Лимонка', fur: 'lemon', accessories: { hat: 'unicorn' } },
];

const DEFAULT_DECOR = ['⭐', '🎈', '🌈', '✨', '🍀', '🎵'];

const isEmoji = (s: string) => /\p{Extended_Pictographic}|⃣/u.test(s);
const hasLatin = (s: string) => /[a-z]/i.test(s);
const hasCyrillic = (s: string) => /[а-яё]/i.test(s);

/** Делит слова на уроки по 4–6 слов */
export function splitIntoLessons<T>(items: T[]): T[][] {
  const count = Math.max(1, Math.min(Math.floor(items.length / 4), Math.ceil(items.length / 5)));
  const result: T[][] = Array.from({ length: count }, () => []);
  items.forEach((item, i) => result[Math.floor((i * count) / items.length)].push(item));
  return result;
}

/** Превращает тему родителя в мир игры */
export function themeToWorld(theme: CustomTheme, index: number): { world: World; words: Word[] } {
  const usedPics = new Set<string>();
  const words: Word[] = theme.words.map((w, i) => {
    let pic = w.pic?.trim() || findBuiltinByEn(w.en)?.pic || w.ru;
    // одинаковые картинки путают в заданиях — повторы заменяем переводом
    if (usedPics.has(pic)) pic = w.ru;
    usedPics.add(pic);
    return { id: `${theme.id}-w${i}`, en: w.en.trim(), ru: w.ru.trim(), pic };
  });

  const groups = splitIntoLessons(words);
  const lessons: Lesson[] = groups.map((group, i) => ({
    id: `${theme.id}-l${i + 1}`,
    title: groups.length > 1 ? `Часть ${i + 1}` : theme.name,
    words: group.map((w) => w.id),
    phrases: theme.phrases.filter((_, pi) => pi % groups.length === i),
    minigame: i % 2 === 1 || i === groups.length - 1,
  }));

  const colors = PALETTE[index % PALETTE.length];
  const boss = BOSSES[index % BOSSES.length];
  const emojiPics = words.map((w) => w.pic).filter(isEmoji);
  const decor = [...emojiPics, ...DEFAULT_DECOR].slice(0, 6);

  const world: World = {
    id: theme.id,
    name: theme.name,
    pic: theme.pic,
    story: `Тема от родителей: ${words.length} ${plural(words.length, 'слово', 'слова', 'слов')}${theme.phrases.length ? ` и ${theme.phrases.length} ${plural(theme.phrases.length, 'фраза', 'фразы', 'фраз')}` : ''}. Вперёд!`,
    bg: colors.bg,
    accent: colors.accent,
    decor,
    lessons,
    boss: {
      name: boss.name,
      pic: boss.pic,
      story: `${boss.name} проверит, как ты выучила тему «${theme.name}». Покажи, на что способна!`,
      winText: `${boss.name} признал поражение! Тема «${theme.name}» пройдена.`,
      hp: Math.min(9, 4 + lessons.length),
    },
    friend: FRIENDS[index % FRIENDS.length],
    custom: true,
  };
  return { world, words };
}

/** Подключает темы родителя к игре: регистрирует слова и добавляет миры */
export function applyCustomThemes(themes: CustomTheme[]) {
  const converted = themes.map((t, i) => themeToWorld(t, i));
  setCustomWords(converted.flatMap((c) => c.words));
  setExtraWorlds(converted.map((c) => c.world));
}

// ---------- Разбор ввода ----------

export type ParseResult<T> = { items: T[]; errors: string[] };

const WORD_SEP = /\t|;|,|\s+[-–—=]\s+/;
const PHRASE_SEP = /\t|;|\s+[-–—=]\s+/;
const HEADER = /^(en|eng|english|word|слово|английский)$/i;

/** Строки вида «cat - кошка - 🐱» (разделители: « - », «;», «,», табуляция, « = ») */
export function parseWords(text: string): ParseResult<CustomWord> {
  const items: CustomWord[] = [];
  const errors: string[] = [];
  const seen = new Set<string>();
  text.split('\n').forEach((raw, i) => {
    const line = raw.trim();
    if (!line || line.startsWith('#')) return;
    const parts = line.split(WORD_SEP).map((p) => p.trim()).filter(Boolean);
    const pic = parts.find(isEmoji);
    const texts = parts.filter((p) => !isEmoji(p));
    if (texts.length && HEADER.test(texts[0])) return;
    let en = texts.find((t) => hasLatin(t) && !hasCyrillic(t));
    let ru = texts.find((t) => t !== en);
    if (!en && texts.length >= 2) [en, ru] = texts;
    if (!en || !ru) {
      errors.push(`Строка ${i + 1}: нужно английское слово и перевод («${line}»)`);
      return;
    }
    if (!hasLatin(en)) {
      errors.push(`Строка ${i + 1}: «${en}» — не похоже на английское слово`);
      return;
    }
    if (en.length > 30) {
      errors.push(`Строка ${i + 1}: слишком длинное слово (до 30 символов)`);
      return;
    }
    const key = en.toLowerCase();
    if (seen.has(key)) {
      errors.push(`Строка ${i + 1}: слово «${en}» уже есть в списке`);
      return;
    }
    seen.add(key);
    items.push({ en, ru, pic });
  });
  return { items, errors };
}

/** Строки вида «I like cats - Я люблю кошек» */
export function parsePhrases(text: string): ParseResult<Phrase> {
  const items: Phrase[] = [];
  const errors: string[] = [];
  text.split('\n').forEach((raw, i) => {
    const line = raw.trim();
    if (!line || line.startsWith('#')) return;
    const parts = line.split(PHRASE_SEP).map((p) => p.trim()).filter(Boolean);
    let [en, ru] = parts;
    if (en && ru && hasCyrillic(en) && !hasCyrillic(ru)) [en, ru] = [ru, en];
    if (!en || !ru || !hasLatin(en)) {
      errors.push(`Фраза ${i + 1}: нужна фраза на английском и перевод («${line}»)`);
      return;
    }
    if (en.split(/\s+/).length < 2) {
      errors.push(`Фраза ${i + 1}: во фразе должно быть хотя бы 2 слова`);
      return;
    }
    items.push({ en, ru });
  });
  return { items, errors };
}

export type ThemeDraft = { name: string; pic: string; wordsText: string; phrasesText: string };

/** Читает файл: .json или текст (.txt/.csv), где фразы идут после строки «Фразы:» */
export function parseThemeFile(fileName: string, content: string): ThemeDraft {
  const baseName = fileName.replace(/\.[^.]+$/, '');
  if (fileName.toLowerCase().endsWith('.json')) {
    const data = JSON.parse(content);
    const rawWords: unknown[] = Array.isArray(data) ? data : (data.words ?? []);
    const wordLines = rawWords.map((w) => {
      if (Array.isArray(w)) return w.join(' - ');
      const o = w as Record<string, string>;
      return [o.en ?? o.english, o.ru ?? o.russian, o.pic ?? o.emoji].filter(Boolean).join(' - ');
    });
    const rawPhrases: unknown[] = Array.isArray(data) ? [] : (data.phrases ?? []);
    const phraseLines = rawPhrases.map((p) => {
      if (Array.isArray(p)) return p.join(' - ');
      const o = p as Record<string, string>;
      return [o.en ?? o.english, o.ru ?? o.russian].filter(Boolean).join(' - ');
    });
    return {
      name: (Array.isArray(data) ? '' : data.name) || baseName,
      pic: (!Array.isArray(data) && data.pic) || '⭐',
      wordsText: wordLines.join('\n'),
      phrasesText: phraseLines.join('\n'),
    };
  }
  const lines = content.replace(/\r/g, '').split('\n');
  const marker = lines.findIndex((l) => /^\s*(фразы|phrases)\s*:?\s*$/i.test(l));
  return {
    name: baseName,
    pic: '⭐',
    wordsText: (marker >= 0 ? lines.slice(0, marker) : lines).join('\n').trim(),
    phrasesText: marker >= 0 ? lines.slice(marker + 1).join('\n').trim() : '',
  };
}

export const EXAMPLE_DRAFT: ThemeDraft = {
  name: 'Погода',
  pic: '🌈',
  wordsText: ['snow - снег - ❄️', 'wind - ветер - 🌬️', 'cloud - облако - ☁️', 'rainbow - радуга', 'cold - холодно - 🥶', 'hot - жарко - 🥵'].join('\n'),
  phrasesText: ['It is cold today - Сегодня холодно', 'I like snow - Я люблю снег'].join('\n'),
};

function plural(n: number, one: string, few: string, many: string) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}
