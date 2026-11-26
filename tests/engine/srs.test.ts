import { describe, expect, it } from 'vitest';
import { INTERVALS, learnedCount, recordAnswer, wordsForReview } from '../../src/engine/srs';
import { coinsFor, dailyBonusFor, starsFor } from '../../src/engine/scoring';

describe('srs', () => {
  it('moves word up on correct and back to box 1 on wrong', () => {
    let s = recordAnswer({}, 'cat', true, 100);
    expect(s.cat).toMatchObject({ box: 1, due: 100 + INTERVALS[1], seen: 1, wrong: 0 });
    s = recordAnswer(s, 'cat', true, 101);
    expect(s.cat.box).toBe(2);
    s = recordAnswer(s, 'cat', false, 102);
    expect(s.cat).toMatchObject({ box: 1, due: 102 + INTERVALS[1], seen: 3, wrong: 1 });
  });

  it('caps box at 5 and counts learned words', () => {
    let s = {};
    for (let i = 0; i < 10; i++) s = recordAnswer(s, 'dog', true, 100);
    expect((s as any).dog.box).toBe(5);
    expect(learnedCount(s)).toBe(1);
  });

  it('returns due words first, weakest first', () => {
    const state = {
      a: { box: 3, due: 90, seen: 3, wrong: 0 },
      b: { box: 1, due: 95, seen: 1, wrong: 1 },
      c: { box: 1, due: 200, seen: 1, wrong: 0 },
    };
    expect(wordsForReview(state, 100)).toEqual(['b', 'a', 'c']);
    expect(wordsForReview(state, 100, 2)).toEqual(['b', 'a']);
  });
});

describe('scoring', () => {
  it('gives stars by mistakes and coins', () => {
    expect(starsFor(0)).toBe(3);
    expect(starsFor(1)).toBe(3); // одна ошибка звезду не снимает
    expect(starsFor(2)).toBe(2);
    expect(starsFor(3)).toBe(2);
    expect(starsFor(5)).toBe(1);
    expect(coinsFor(3, true)).toBe(25);
    expect(coinsFor(3, false)).toBe(13);
  });

  it('daily bonus grows with streak up to a week', () => {
    expect(dailyBonusFor(1)).toBe(10);
    expect(dailyBonusFor(2)).toBe(15);
    expect(dailyBonusFor(7)).toBe(40);
    expect(dailyBonusFor(30)).toBe(40);
  });
});
