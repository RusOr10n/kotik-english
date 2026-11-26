import { describe, expect, it } from 'vitest';
import { ALL_LESSONS, WORLDS, wordsUpToWorld, worldWords } from '../../src/content/worlds';
import { buildBossQuestions, buildLesson, buildReview } from '../../src/engine/lessonBuilder';
import { seededRng } from '../../src/engine/random';
import { normalize, tokenize } from '../../src/engine/text';
import type { Exercise } from '../../src/engine/exercises';

function checkExercise(ex: Exercise) {
  switch (ex.kind) {
    case 'listenPick':
    case 'picturePick': {
      expect(ex.options).toHaveLength(4);
      expect(ex.options.filter((o) => o.id === ex.target.id)).toHaveLength(1);
      expect(new Set(ex.options.map((o) => o.pic)).size).toBe(4);
      expect(new Set(ex.options.map((o) => normalize(o.en))).size).toBe(4);
      break;
    }
    case 'spell':
      expect([...ex.letters].sort().join('')).toBe([...ex.target.en.toLowerCase()].sort().join(''));
      break;
    case 'sentence':
      expect([...ex.tiles].sort()).toEqual([...tokenize(ex.phrase.en)].sort());
      break;
    case 'fillGap': {
      // словарные пропуски — 3 варианта, грамматические — от 2 (like / likes)
      expect(ex.options.length).toBeGreaterThanOrEqual(ex.phrase.gap ? 2 : 3);
      expect(ex.options.map(normalize)).toContain(normalize(ex.tokens[ex.gapIndex]));
      expect(new Set(ex.options.map(normalize)).size).toBe(ex.options.length);
      break;
    }
    case 'balloons':
      for (const r of ex.rounds) expect(r.options.map(normalize)).toContain(normalize(r.tokens[r.gapIndex]));
      break;
    case 'memory':
      expect(ex.pairs.length).toBe(4);
      break;
    case 'catchFish':
      for (const r of ex.rounds) {
        expect(r.options).toHaveLength(4);
        expect(r.options.some((o) => o.id === r.target.id)).toBe(true);
      }
      break;
    case 'type':
      break;
  }
}

describe('buildLesson', () => {
  it('builds valid exercises for every lesson with several seeds', () => {
    for (const { lesson, world } of ALL_LESSONS) {
      for (const seed of [1, 2, 3, 42]) {
        const exs = buildLesson(lesson, wordsUpToWorld(world.id), seededRng(seed));
        expect(exs.length).toBeGreaterThanOrEqual(10);
        exs.forEach(checkExercise);
        // каждое слово урока встречается хотя бы в двух заданиях
        for (const id of lesson.words) {
          expect(exs.filter((e) => e.wordIds.includes(id)).length, `${lesson.id}/${id}`).toBeGreaterThanOrEqual(2);
        }
        expect(exs.some((e) => e.kind === 'catchFish')).toBe(!!lesson.minigame);
      }
    }
  });

  it('starts with listening exercises', () => {
    const { lesson, world } = ALL_LESSONS[0];
    const exs = buildLesson(lesson, wordsUpToWorld(world.id), seededRng(7));
    expect(exs.slice(0, 3).every((e) => e.kind === 'listenPick')).toBe(true);
    expect(exs[3].kind).toBe('memory');
  });
});

describe('buildReview / boss', () => {
  it('review covers requested words', () => {
    const ids = ['cat', 'dog', 'apple', 'pen', 'mum', 'swim'];
    const exs = buildReview(ids, wordsUpToWorld('island'), seededRng(5));
    expect(exs).toHaveLength(ids.length);
    exs.forEach(checkExercise);
  });

  it('boss questions are valid for every world', () => {
    for (const world of WORLDS) {
      const phrases = world.lessons.flatMap((l) => l.phrases);
      const exs = buildBossQuestions(worldWords(world), phrases, wordsUpToWorld(world.id), 20, seededRng(9));
      expect(exs).toHaveLength(20);
      exs.forEach(checkExercise);
    }
  });
});
