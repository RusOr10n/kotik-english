import type { World } from '../content/types';
import { BUILTIN_WORLDS, WORLDS } from '../content/worlds';
import type { GameState } from './store';

type ProgressView = Pick<GameState, 'lessonStars' | 'bossDefeated' | 'settings'>;

export function isWorldUnlocked(state: ProgressView, worldIndex: number): boolean {
  if (state.settings.unlockAll || worldIndex === 0) return true;
  const world = WORLDS[worldIndex];
  // темы родителя открыты сразу
  if (world?.custom) return true;
  // мир, в котором уже есть прогресс, не закрываем (важно, когда между мирами добавились новые)
  if (world && (state.bossDefeated[world.id] || world.lessons.some((l) => state.lessonStars[l.id]))) return true;
  return !!state.bossDefeated[WORLDS[worldIndex - 1].id];
}

export function isLessonUnlocked(state: ProgressView, world: World, lessonIndex: number): boolean {
  if (state.settings.unlockAll) return true;
  const worldIndex = WORLDS.indexOf(world);
  if (!isWorldUnlocked(state, worldIndex)) return false;
  if (lessonIndex === 0) return true;
  return !!state.lessonStars[world.lessons[lessonIndex - 1].id];
}

export function isBossUnlocked(state: ProgressView, world: World): boolean {
  if (state.settings.unlockAll) return true;
  return world.lessons.every((l) => !!state.lessonStars[l.id]);
}

/** Индекс «текущей» точки на тропинке мира: первый непройденный урок, иначе босс, иначе конец */
export function currentNodeIndex(state: ProgressView, world: World): number {
  const idx = world.lessons.findIndex((l) => !state.lessonStars[l.id]);
  if (idx >= 0) return idx;
  return world.lessons.length; // босс (пройден или нет)
}

/** Самый дальний открытый мир основного сюжета — открываем карту на нём */
export function latestWorldIndex(state: ProgressView): number {
  let last = 0;
  BUILTIN_WORLDS.forEach((_, i) => {
    if (isWorldUnlocked({ ...state, settings: { ...state.settings, unlockAll: false } }, i)) last = i;
  });
  return last;
}
