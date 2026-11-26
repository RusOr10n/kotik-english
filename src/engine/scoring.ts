import type { ExerciseKind, ExerciseResult } from './exercises';

/**
 * Сколько ошибок засчитать уроку за одно задание: не больше одной на задание.
 * Промахи в мемори — не ошибки: это игра на угадывание, где ищут пары.
 */
export function lessonMistakesFor(kind: ExerciseKind, result: ExerciseResult): 0 | 1 {
  if (kind === 'memory') return 0;
  return !result.correct || result.mistakes > 0 ? 1 : 0;
}

/** Одна ошибка звезду не снимает */
export function starsFor(mistakes: number): 1 | 2 | 3 {
  if (mistakes <= 1) return 3;
  if (mistakes <= 3) return 2;
  return 1;
}

/** Ежедневный бонус за первое задание дня: растёт с серией дней подряд (до недели) */
export function dailyBonusFor(streakDays: number): number {
  return 10 + 5 * Math.min(Math.max(streakDays, 1) - 1, 6);
}

/** Монетки за урок: больше за первое прохождение и за звёзды */
export function coinsFor(stars: number, firstTime: boolean): number {
  const base = 10 + stars * 5;
  return firstTime ? base : Math.round(base / 2);
}

export const BOSS_COINS = 60;
export const REVIEW_COINS = 15;
