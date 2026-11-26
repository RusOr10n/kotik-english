import { describe, expect, it } from 'vitest';
import { BUILTIN_WORLDS, wordsUpToWorld, worldWords } from '../../src/content/worlds';
import { buildBossQuestions, buildLesson, makeBalloons, makeGrammarGap } from '../../src/engine/lessonBuilder';
import { seededRng } from '../../src/engine/random';
import { normalize, tokenize } from '../../src/engine/text';
import { isWorldUnlocked } from '../../src/state/progress';

const GRAMMAR = ['be', 'likes', 'plurals', 'articles', 'thisthat', 'havegot', 'whose', 'can', 'continuous'];

describe('grammar worlds', () => {
  it('are placed between themed worlds by difficulty, never first', () => {
    const ids = BUILTIN_WORLDS.map((w) => w.id);
    expect(ids[0]).toBe('home');
    expect(ids.at(-1)).toBe('island');
    expect(ids).toEqual([
      'home', 'be', 'garden', 'likes', 'plurals', 'market', 'articles', 'school',
      'thisthat', 'town', 'havegot', 'whose', 'can', 'continuous', 'island',
    ]);
  });

  it('every grammar gap is in its phrase and among the choices', () => {
    for (const w of BUILTIN_WORLDS) {
      for (const l of w.lessons) {
        for (const p of l.phrases.filter((x) => x.gap)) {
          const tokens = tokenize(p.en).map(normalize);
          expect(tokens, `${l.id}: «${p.en}»`).toContain(normalize(p.gap!));
          expect(p.choices!.map(normalize), `${l.id}: «${p.en}»`).toContain(normalize(p.gap!));
          expect(new Set(p.choices!.map(normalize)).size).toBeGreaterThanOrEqual(2);
          const ex = makeGrammarGap(p, seededRng(1));
          expect(ex && ex.kind === 'fillGap' && ex.options.length).toBeGreaterThanOrEqual(2);
        }
      }
    }
  });

  it('each grammar lesson has a rule, grammar gaps and ends with the balloon game', () => {
    for (const id of GRAMMAR) {
      const w = BUILTIN_WORLDS.find((x) => x.id === id)!;
      for (const l of w.lessons) {
        expect(l.rule?.length, l.id).toBeGreaterThan(0);
        expect(l.phrases.filter((p) => p.gap).length, l.id).toBeGreaterThanOrEqual(2);
        const exs = buildLesson(l, wordsUpToWorld(w.id), seededRng(3));
        expect(exs.at(-1)!.kind, l.id).toBe('balloons');
        expect(exs.some((e) => e.kind === 'fillGap'), l.id).toBe(true);
      }
      const phrases = w.lessons.flatMap((l) => l.phrases);
      expect(buildBossQuestions(worldWords(w), phrases, wordsUpToWorld(w.id), 20, seededRng(2))).toHaveLength(20);
    }
  });

  it('balloon rounds always contain the right answer', () => {
    const w = BUILTIN_WORLDS.find((x) => x.id === 'be')!;
    const ex = makeBalloons(w.lessons[0].phrases, seededRng(5))!;
    expect(ex.kind).toBe('balloons');
    if (ex.kind !== 'balloons') return;
    expect(ex.rounds.length).toBeGreaterThanOrEqual(5);
    for (const r of ex.rounds) expect(r.options.map(normalize)).toContain(normalize(r.tokens[r.gapIndex]));
  });

  it('themed worlds without grammar gaps get no balloon game', () => {
    const home = BUILTIN_WORLDS[0];
    expect(buildLesson(home.lessons[0], wordsUpToWorld('home'), seededRng(1)).some((e) => e.kind === 'balloons')).toBe(false);
  });
});

describe('unlocking after new worlds were inserted', () => {
  const settings = { rate: 1, voiceName: null, muted: false, unlockAll: false };
  it('keeps a world with progress open even if the world before it is new', () => {
    const idx = (id: string) => BUILTIN_WORLDS.findIndex((w) => w.id === id);
    // игрок раньше прошёл дом и начал сад, а мир «to be» появился между ними
    const state = { lessonStars: { 'home-1': 3, 'garden-1': 2 }, bossDefeated: { home: true }, settings };
    expect(isWorldUnlocked(state, idx('be'))).toBe(true);
    expect(isWorldUnlocked(state, idx('garden'))).toBe(true);
    expect(isWorldUnlocked(state, idx('likes'))).toBe(false);
  });
});
