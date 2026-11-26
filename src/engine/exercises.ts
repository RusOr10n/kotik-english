import type { Phrase, Word } from '../content/types';

type Base = { id: string; wordIds: string[] };

export type Exercise =
  | (Base & { kind: 'listenPick'; target: Word; options: Word[] })
  | (Base & { kind: 'picturePick'; target: Word; options: Word[] })
  | (Base & { kind: 'memory'; pairs: Word[] })
  | (Base & { kind: 'spell'; target: Word; letters: string[] })
  | (Base & { kind: 'type'; target: Word })
  | (Base & { kind: 'sentence'; phrase: Phrase; tiles: string[] })
  | (Base & { kind: 'fillGap'; phrase: Phrase; tokens: string[]; gapIndex: number; options: string[] })
  | (Base & { kind: 'catchFish'; rounds: { target: Word; options: Word[] }[] })
  | (Base & { kind: 'balloons'; rounds: GapRound[] });

/** Раунд грамматической игры: фраза с пропуском и варианты */
export type GapRound = { phrase: Phrase; tokens: string[]; gapIndex: number; options: string[] };

export type ExerciseKind = Exercise['kind'];

/** Упражнения, где ребёнок сам исправляет ошибки по ходу — их не повторяем в конце урока */
export const SELF_CORRECTING: ExerciseKind[] = ['memory', 'spell', 'catchFish', 'balloons'];

export type ExerciseResult = { correct: boolean; mistakes: number };
