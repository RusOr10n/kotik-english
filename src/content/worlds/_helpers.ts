import type { Phrase } from '../types';

/** Фраза с грамматическим пропуском: g('She is happy.', 'Она весёлая.', 'is', ['am', 'is', 'are']) */
export const g = (en: string, ru: string, gap: string, choices: string[]): Phrase => ({ en, ru, gap, choices });

/** Обычная фраза (для сборки из плиток) */
export const p = (en: string, ru: string): Phrase => ({ en, ru });
