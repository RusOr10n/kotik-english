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
