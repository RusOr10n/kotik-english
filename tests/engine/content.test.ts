import { describe, expect, it } from 'vitest';
import { WORDS, WORD_BY_ID } from '../../src/content/words';
import { ALL_LESSONS, WORLDS } from '../../src/content/worlds';
import { normalize } from '../../src/engine/text';

describe('content', () => {
  it('word ids, spellings and pictures are unique', () => {
    expect(new Set(WORDS.map((w) => w.id)).size).toBe(WORDS.length);
    expect(new Set(WORDS.map((w) => normalize(w.en))).size).toBe(WORDS.length);
    expect(new Set(WORDS.map((w) => w.pic)).size).toBe(WORDS.length);
  });

  it('every lesson references existing words and has phrases', () => {
    for (const { lesson } of ALL_LESSONS) {
      expect(lesson.words.length).toBeGreaterThanOrEqual(4);
      expect(lesson.phrases.length).toBeGreaterThanOrEqual(2);
      for (const id of lesson.words) expect(WORD_BY_ID[id], `${lesson.id}: ${id}`).toBeDefined();
    }
  });

  it('lesson ids are unique and there are 15 worlds', () => {
    expect(WORLDS).toHaveLength(15);
    const ids = ALL_LESSONS.map((x) => x.lesson.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
