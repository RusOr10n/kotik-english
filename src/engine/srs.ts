/** Интервальное повторение по Лейтнеру: коробка 1..5, интервалы в днях */
export type WordProgress = { box: number; due: number; seen: number; wrong: number };
export type SrsState = Record<string, WordProgress>;

export const INTERVALS = [0, 1, 2, 4, 7, 14];
export const MAX_BOX = 5;
export const LEARNED_BOX = 3;

export function dayNumber(date: Date = new Date()): number {
  return Math.floor((date.getTime() - date.getTimezoneOffset() * 60000) / 86400000);
}

export function recordAnswer(state: SrsState, wordId: string, correct: boolean, today: number): SrsState {
  const prev = state[wordId] ?? { box: 0, due: today, seen: 0, wrong: 0 };
  const box = correct ? Math.min(prev.box + 1, MAX_BOX) : 1;
  return {
    ...state,
    [wordId]: {
      box,
      due: today + INTERVALS[box],
      seen: prev.seen + 1,
      wrong: prev.wrong + (correct ? 0 : 1),
    },
  };
}

/** Слова для повторения: сначала просроченные, затем из младших коробок */
export function wordsForReview(state: SrsState, today: number, limit = 8): string[] {
  const entries = Object.entries(state);
  const due = entries.filter(([, p]) => p.due <= today).sort((a, b) => a[1].box - b[1].box || a[1].due - b[1].due);
  const notDue = entries.filter(([, p]) => p.due > today).sort((a, b) => a[1].box - b[1].box);
  return [...due, ...notDue].slice(0, limit).map(([id]) => id);
}

export function learnedCount(state: SrsState): number {
  return Object.values(state).filter((p) => p.box >= LEARNED_BOX).length;
}
