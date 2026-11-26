import type { Lesson, Phrase, Word } from '../content/types';
import { getWord } from '../content/words';
import type { Exercise } from './exercises';
import { type Rng, shuffle } from './random';
import { isSpellable, normalize, tokenize } from './text';

let counter = 0;
const nextId = () => `ex${++counter}`;

/** Берёт отвлекающие слова по порядку: не совпадают с целью и друг с другом ни по написанию, ни по картинке */
function pickInOrder(target: Word, ordered: Word[], count: number): Word[] {
  const result: Word[] = [];
  const usedEn = new Set([normalize(target.en)]);
  const usedPic = new Set([target.pic]);
  for (const candidate of ordered) {
    if (result.length >= count) break;
    const en = normalize(candidate.en);
    if (usedEn.has(en) || usedPic.has(candidate.pic)) continue;
    usedEn.add(en);
    usedPic.add(candidate.pic);
    result.push(candidate);
  }
  return result;
}

export function pickDistractors(target: Word, pool: Word[], count: number, rng: Rng): Word[] {
  return pickInOrder(target, shuffle(pool, rng), count);
}

/** 4 варианта ответа: отвлекающие сначала из слов урока, потом из общего пула */
function optionsFor(target: Word, lessonWords: Word[], pool: Word[], rng: Rng): Word[] {
  const ordered = [...shuffle(lessonWords, rng), ...shuffle(pool, rng)];
  return shuffle([target, ...pickInOrder(target, ordered, 3)], rng);
}

export function makeListenPick(target: Word, lessonWords: Word[], pool: Word[], rng: Rng): Exercise {
  return { id: nextId(), kind: 'listenPick', wordIds: [target.id], target, options: optionsFor(target, lessonWords, pool, rng) };
}

export function makePicturePick(target: Word, lessonWords: Word[], pool: Word[], rng: Rng): Exercise {
  return { id: nextId(), kind: 'picturePick', wordIds: [target.id], target, options: optionsFor(target, lessonWords, pool, rng) };
}

export function makeSpell(target: Word, rng: Rng): Exercise {
  let letters = shuffle(target.en.toLowerCase().split(''), rng);
  // чтобы буквы не остались в исходном порядке
  for (let i = 0; i < 5 && letters.join('') === target.en.toLowerCase(); i++) letters = shuffle(letters, rng);
  return { id: nextId(), kind: 'spell', wordIds: [target.id], target, letters };
}

export function makeType(target: Word): Exercise {
  return { id: nextId(), kind: 'type', wordIds: [target.id], target };
}

export function makeSentence(phrase: Phrase, rng: Rng): Exercise {
  const tokens = tokenize(phrase.en);
  let tiles = shuffle(tokens, rng);
  for (let i = 0; i < 5 && tokens.length > 1 && tiles.join(' ') === tokens.join(' '); i++) tiles = shuffle(tokens, rng);
  return { id: nextId(), kind: 'sentence', wordIds: [], phrase, tiles };
}

/**
 * Пропуск во фразе. Пропускаем слово, которое есть в словаре (или его множественное число),
 * а варианты — другие слова из словаря.
 */
export function makeFillGap(phrase: Phrase, localWords: Word[], pool: Word[], rng: Rng): Exercise | null {
  const vocab = dedupe([...localWords, ...pool]);
  const tokens = tokenize(phrase.en);
  const vocabByEn = new Map(vocab.map((w) => [normalize(w.en), w]));
  const candidates = tokens
    .map((t, i) => ({ i, word: vocabByEn.get(normalize(t)) }))
    .filter((c): c is { i: number; word: Word } => !!c.word);
  if (!candidates.length) return null;
  const chosen = shuffle(candidates, rng)[0];
  const ordered = [...shuffle(localWords, rng), ...shuffle(pool, rng)];
  const distractors = pickInOrder(chosen.word, ordered, 2).map((w) => w.en);
  if (distractors.length < 2) return null;
  return {
    id: nextId(),
    kind: 'fillGap',
    wordIds: [chosen.word.id],
    phrase,
    tokens,
    gapIndex: chosen.i,
    options: shuffle([tokens[chosen.i], ...distractors], rng),
  };
}

/** Грамматический пропуск: выбрать правильную форму (am/is/are, a/an/the…) */
export function makeGrammarGap(phrase: Phrase, rng: Rng): Exercise | null {
  if (!phrase.gap || !phrase.choices?.length) return null;
  const tokens = tokenize(phrase.en);
  const gapIndex = tokens.findIndex((t) => normalize(t) === normalize(phrase.gap!));
  if (gapIndex < 0) return null;
  const seen = new Set<string>();
  const options = [tokens[gapIndex], ...phrase.choices].filter((o) => {
    const key = normalize(o);
    return seen.has(key) ? false : (seen.add(key), true);
  });
  if (options.length < 2) return null;
  return { id: nextId(), kind: 'fillGap', wordIds: [], phrase, tokens, gapIndex, options: shuffle(options, rng) };
}

/** Мини-игра «Лопни шарик»: раунды из грамматических пропусков урока */
export function makeBalloons(phrases: Phrase[], rng: Rng, roundsCount = 5): Exercise | null {
  const gaps = shuffle(phrases, rng)
    .map((p) => makeGrammarGap(p, rng))
    .filter((e): e is Extract<Exercise, { kind: 'fillGap' }> => !!e && e.kind === 'fillGap');
  if (gaps.length < 2) return null;
  const rounds = Array.from({ length: Math.max(roundsCount, gaps.length) }, (_, i) => {
    const e = gaps[i % gaps.length];
    return { phrase: e.phrase, tokens: e.tokens, gapIndex: e.gapIndex, options: shuffle(e.options, rng) };
  }).slice(0, Math.max(roundsCount, Math.min(gaps.length, 6)));
  return { id: nextId(), kind: 'balloons', wordIds: [], rounds };
}

/** Задание по фразе: грамматический пропуск, если он задан, иначе — пропуск слова из словаря или сборка фразы */
function phraseExercise(p: Phrase, preferGap: boolean, words: Word[], pool: Word[], rng: Rng): Exercise {
  if (p.gap) return makeGrammarGap(p, rng) ?? makeSentence(p, rng);
  return preferGap ? (makeFillGap(p, words, pool, rng) ?? makeSentence(p, rng)) : makeSentence(p, rng);
}

export function makeMemory(words: Word[], rng: Rng): Exercise {
  const pairs = shuffle(words, rng).slice(0, 4);
  return { id: nextId(), kind: 'memory', wordIds: pairs.map((w) => w.id), pairs };
}

export function makeCatchFish(words: Word[], pool: Word[], rng: Rng, roundsCount = 5): Exercise {
  const targets = shuffle(words, rng);
  const rounds = Array.from({ length: roundsCount }, (_, i) => {
    const target = targets[i % targets.length];
    return { target, options: optionsFor(target, words, pool, rng) };
  });
  return { id: nextId(), kind: 'catchFish', wordIds: words.map((w) => w.id), rounds };
}

/**
 * Собирает урок: сначала узнавание на слух, потом память, потом активное воспроизведение,
 * затем фразы и (опционально) мини-игра.
 */
export function buildLesson(lesson: Lesson, poolIds: string[], rng: Rng = Math.random): Exercise[] {
  const words = lesson.words.map(getWord);
  const pool = poolIds.map(getWord);
  const recognition = shuffle(words, rng).map((w) => makeListenPick(w, words, pool, rng));
  const memory = makeMemory(words, rng);
  const production = shuffle(words, rng).map((w, i) => {
    if (i % 3 === 0) return makePicturePick(w, words, pool, rng);
    if (i % 3 === 1 && isSpellable(w.en)) return makeSpell(w, rng);
    return makeType(w);
  });
  const phrases = lesson.phrases.map((p, i) => phraseExercise(p, i % 2 === 1, words, pool, rng));

  return [
    ...recognition.slice(0, 3),
    memory,
    ...shuffle([...recognition.slice(3), ...production], rng),
    ...phrases,
    ...(lesson.minigame ? [makeCatchFish(words, pool, rng)] : []),
    // в грамматических уроках — своя игра с шариками
    ...[makeBalloons(lesson.phrases, rng)].filter((e): e is Exercise => !!e),
  ];
}

/** Повторение: смешанные задания по словам, которые пора повторить */
export function buildReview(wordIds: string[], poolIds: string[], rng: Rng = Math.random): Exercise[] {
  const words = wordIds.map(getWord);
  const pool = poolIds.map(getWord);
  return shuffle(words, rng).map((w, i) => {
    const variant = i % 3;
    if (variant === 0) return makeListenPick(w, words, pool, rng);
    if (variant === 1) return makePicturePick(w, words, pool, rng);
    return isSpellable(w.en) && rng() < 0.5 ? makeSpell(w, rng) : makeType(w);
  });
}

/** Битва с боссом: бесконечный поток вопросов по словам и фразам мира */
export function buildBossQuestions(wordIds: string[], phrases: Phrase[], poolIds: string[], count: number, rng: Rng = Math.random): Exercise[] {
  const words = wordIds.map(getWord);
  const pool = poolIds.map(getWord);
  const result: Exercise[] = [];
  const shuffledWords = shuffle(words, rng);
  const shuffledPhrases = shuffle(phrases, rng);
  for (let i = 0; i < count; i++) {
    const w = shuffledWords[i % shuffledWords.length];
    // без фраз задаём только вопросы по словам
    const kind = shuffledPhrases.length ? i % 5 : i % 3;
    if (kind === 0) result.push(makeListenPick(w, words, pool, rng));
    else if (kind === 1) result.push(makePicturePick(w, words, pool, rng));
    else if (kind === 2) result.push(makeType(w));
    else {
      const p = shuffledPhrases[i % shuffledPhrases.length];
      result.push(kind === 3 ? phraseExercise(p, true, words, pool, rng) : makeSentence(p, rng));
    }
  }
  return result;
}

function dedupe(words: Word[]): Word[] {
  const seen = new Set<string>();
  return words.filter((w) => (seen.has(w.id) ? false : (seen.add(w.id), true)));
}
