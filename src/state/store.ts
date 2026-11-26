import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type CustomTheme, applyCustomThemes } from '../content/custom';
import type { Slot } from '../content/shop';
import type { Exercise } from '../engine/exercises';
import { BOSS_COINS, REVIEW_COINS, coinsFor, dailyBonusFor } from '../engine/scoring';
import { type SrsState, dayNumber, recordAnswer } from '../engine/srs';
import { STORAGE_KEY } from './storageKey';

export type Profile = { catName: string; fur: string };

/** Незаконченное задание — чтобы продолжить с того же места */
export type SavedSession = {
  queue: Exercise[];
  index: number;
  mistakes: number;
  requeued: string[];
  phase: 'intro' | 'play';
  introIndex: number;
  elapsedMs: number;
};

export type Settings = {
  rate: number;
  voiceName: string | null;
  muted: boolean;
  unlockAll: boolean;
};

type Data = {
  profile: Profile | null;
  coins: number;
  owned: string[];
  equipped: Partial<Record<Slot, string>>;
  lessonStars: Record<string, number>;
  bossDefeated: Record<string, boolean>;
  srs: SrsState;
  streak: { lastDay: number; count: number };
  reviewRewardDay: number;
  minutes: number;
  sessions: number;
  settings: Settings;
  /** ключ — id урока или 'review' */
  savedSessions: Record<string, SavedSession>;
  /** темы и словари, загруженные родителем */
  customThemes: CustomTheme[];
  /** день, за который уже выдан ежедневный бонус */
  dailyBonusDay: number;
};

/** Итог задания: монетки за задание + ежедневный бонус */
export type Earned = { coins: number; bonus: number; streak: number };

type Actions = {
  createProfile(profile: Profile): void;
  setFur(fur: string): void;
  recordWord(wordId: string, correct: boolean): void;
  finishLesson(lessonId: string, stars: number, minutes: number): Earned & { firstTime: boolean };
  defeatBoss(worldId: string, minutes: number): Earned & { firstTime: boolean };
  finishReview(minutes: number): Earned;
  addCustomTheme(theme: CustomTheme): void;
  removeCustomTheme(id: string): void;
  buy(id: string, price: number): boolean;
  /** родитель начисляет монетки (возвращает, сколько реально начислено) */
  grantCoins(amount: number): number;
  toggleEquip(slot: Slot, id: string): void;
  updateSettings(patch: Partial<Settings>): void;
  saveSession(key: string, session: SavedSession): void;
  clearSession(key: string): void;
  reset(): void;
};

export type GameState = Data & Actions;

/** Больше за один раз начислить нельзя — защита от опечатки «1000000» */
export const MAX_GRANT = 1000;

const initial: Data = {
  profile: null,
  coins: 0,
  owned: [],
  equipped: {},
  lessonStars: {},
  bossDefeated: {},
  srs: {},
  streak: { lastDay: 0, count: 0 },
  reviewRewardDay: 0,
  minutes: 0,
  sessions: 0,
  settings: { rate: 0.85, voiceName: null, muted: false, unlockAll: false },
  savedSessions: {},
  customThemes: [],
  dailyBonusDay: 0,
};

function bumpStreak(streak: Data['streak']): Data['streak'] {
  const today = dayNumber();
  if (streak.lastDay === today) return streak;
  return { lastDay: today, count: streak.lastDay === today - 1 ? streak.count + 1 : 1 };
}

/** Общая часть завершения любого задания: стрик, время и ежедневный бонус */
function completion(s: Data, coins: number, minutes: number) {
  const today = dayNumber();
  const streak = bumpStreak(s.streak);
  const bonus = s.dailyBonusDay === today ? 0 : dailyBonusFor(streak.count);
  return {
    patch: {
      coins: s.coins + coins + bonus,
      minutes: s.minutes + minutes,
      sessions: s.sessions + 1,
      streak,
      dailyBonusDay: today,
    },
    earned: { coins, bonus, streak: streak.count },
  };
}

export const useGame = create<GameState>()(
  persist(
    (set, get) => ({
      ...initial,

      createProfile(profile) {
        set({ profile, owned: [...get().owned, profile.fur] });
      },

      setFur(fur) {
        const { profile } = get();
        if (profile) set({ profile: { ...profile, fur } });
      },

      recordWord(wordId, correct) {
        set({ srs: recordAnswer(get().srs, wordId, correct, dayNumber()) });
      },

      finishLesson(lessonId, stars, minutes) {
        const s = get();
        const firstTime = !s.lessonStars[lessonId];
        const { patch, earned } = completion(s, coinsFor(stars, firstTime), minutes);
        set({ ...patch, lessonStars: { ...s.lessonStars, [lessonId]: Math.max(stars, s.lessonStars[lessonId] ?? 0) } });
        return { ...earned, firstTime };
      },

      defeatBoss(worldId, minutes) {
        const s = get();
        const firstTime = !s.bossDefeated[worldId];
        const { patch, earned } = completion(s, firstTime ? BOSS_COINS : Math.round(BOSS_COINS / 3), minutes);
        set({ ...patch, bossDefeated: { ...s.bossDefeated, [worldId]: true } });
        return { ...earned, firstTime };
      },

      finishReview(minutes) {
        const s = get();
        const today = dayNumber();
        const { patch, earned } = completion(s, s.reviewRewardDay === today ? 5 : REVIEW_COINS, minutes);
        set({ ...patch, reviewRewardDay: today });
        return earned;
      },

      buy(id, price) {
        const s = get();
        if (s.owned.includes(id) || s.coins < price) return false;
        set({ coins: s.coins - price, owned: [...s.owned, id] });
        return true;
      },

      grantCoins(amount) {
        const add = Math.max(0, Math.min(MAX_GRANT, Math.floor(Number(amount) || 0)));
        if (add > 0) set({ coins: get().coins + add });
        return add;
      },

      toggleEquip(slot, id) {
        const { equipped } = get();
        set({ equipped: { ...equipped, [slot]: equipped[slot] === id ? undefined : id } });
      },

      updateSettings(patch) {
        set({ settings: { ...get().settings, ...patch } });
      },

      addCustomTheme(theme) {
        const customThemes = [...get().customThemes, theme];
        applyCustomThemes(customThemes);
        set({ customThemes });
      },

      removeCustomTheme(id) {
        const s = get();
        const customThemes = s.customThemes.filter((t) => t.id !== id);
        applyCustomThemes(customThemes);
        // убираем всё, что ссылается на слова и уроки удалённой темы
        const notTheme = <T,>(obj: Record<string, T>) => Object.fromEntries(Object.entries(obj).filter(([k]) => !k.startsWith(id)));
        set({
          customThemes,
          srs: notTheme(s.srs),
          lessonStars: notTheme(s.lessonStars),
          bossDefeated: notTheme(s.bossDefeated),
          savedSessions: notTheme(s.savedSessions),
        });
      },

      saveSession(key, session) {
        set({ savedSessions: { ...get().savedSessions, [key]: session } });
      },

      clearSession(key) {
        const rest = { ...get().savedSessions };
        delete rest[key];
        set({ savedSessions: rest });
      },

      reset() {
        applyCustomThemes([]);
        set({ ...initial });
      },
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      // после загрузки из localStorage подключаем темы родителя к игре
      onRehydrateStorage: () => (state) => applyCustomThemes(state?.customThemes ?? []),
    },
  ),
);
