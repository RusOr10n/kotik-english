import type { Lesson, World } from '../types';
import { home } from './home';
import { garden } from './garden';
import { market } from './market';
import { school } from './school';
import { town } from './town';
import { island } from './island';
import { grammarBe } from './grammarBe';
import { grammarLike } from './grammarLike';
import { grammarPlurals } from './grammarPlurals';
import { grammarArticles } from './grammarArticles';
import { grammarThisThat } from './grammarThisThat';
import { grammarHaveGot } from './grammarHaveGot';
import { grammarWhose } from './grammarWhose';
import { grammarCan } from './grammarCan';
import { grammarContinuous } from './grammarContinuous';

/** Встроенные миры (основной сюжет) — по возрастанию сложности; грамматика между тематическими мирами */
export const BUILTIN_WORLDS: World[] = [
  home,
  grammarBe,
  garden,
  grammarLike,
  grammarPlurals,
  market,
  grammarArticles,
  school,
  grammarThisThat,
  town,
  grammarHaveGot,
  grammarWhose,
  grammarCan,
  grammarContinuous,
  island,
];

/** Все миры: встроенные + темы, загруженные родителем (массив обновляется на месте) */
export const WORLDS: World[] = [...BUILTIN_WORLDS];

export const ALL_LESSONS: { lesson: Lesson; world: World; index: number }[] = [];

function rebuildLessons() {
  ALL_LESSONS.splice(0, ALL_LESSONS.length, ...WORLDS.flatMap((world) => world.lessons.map((lesson, index) => ({ lesson, world, index }))));
}
rebuildLessons();

/** Заменяет пользовательские миры (вызывается из custom.ts) */
export function setExtraWorlds(extra: World[]) {
  WORLDS.splice(BUILTIN_WORLDS.length, WORLDS.length, ...extra);
  rebuildLessons();
}

export function findLesson(lessonId: string) {
  const found = ALL_LESSONS.find((x) => x.lesson.id === lessonId);
  if (!found) throw new Error(`Unknown lesson ${lessonId}`);
  return found;
}

export function findWorld(worldId: string): World {
  const world = WORLDS.find((x) => x.id === worldId);
  if (!world) throw new Error(`Unknown world ${worldId}`);
  return world;
}

/** Все id слов из миров до указанного включительно */
export function wordsUpToWorld(worldId: string): string[] {
  const idx = WORLDS.findIndex((x) => x.id === worldId);
  return WORLDS.slice(0, idx + 1).flatMap((w) => w.lessons.flatMap((l) => l.words));
}

export function worldWords(world: World): string[] {
  return world.lessons.flatMap((l) => l.words);
}
