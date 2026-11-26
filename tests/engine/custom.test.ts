import { describe, expect, it } from 'vitest';
import { type CustomTheme, applyCustomThemes, parsePhrases, parseThemeFile, parseWords, splitIntoLessons, themeToWorld } from '../../src/content/custom';
import { HOME_ITEMS } from '../../src/content/home';
import { FUR_BY_ID, ITEMS } from '../../src/content/shop';
import { WORD_BY_ID, hasWord } from '../../src/content/words';
import { BUILTIN_WORLDS, WORLDS, findLesson, wordsUpToWorld, worldWords } from '../../src/content/worlds';
import { BACK, GLASSES, HATS, NECK } from '../../src/components/cat/Accessories';
import { buildBossQuestions, buildLesson } from '../../src/engine/lessonBuilder';
import { seededRng } from '../../src/engine/random';
import { isWorldUnlocked } from '../../src/state/progress';
import { useGame } from '../../src/state/store';

const theme = (id: string, n: number, phrases = 0): CustomTheme => ({
  id,
  name: 'Тест',
  pic: '⭐',
  words: Array.from({ length: n }, (_, i) => ({ en: `word${String.fromCharCode(97 + i)}`, ru: `слово${i}` })),
  phrases: Array.from({ length: phrases }, (_, i) => ({ en: `I like word${String.fromCharCode(97 + i)}`, ru: `Мне нравится слово${i}` })),
  createdAt: 0,
});

describe('parsing', () => {
  it('parses words with different separators, emoji and swapped columns', () => {
    const r = parseWords('english,russian\ncat - кошка - 🐱\nкнига; book\nsnow\tснег\n# комментарий\nice cream = мороженое\nCat - кот\nпривет');
    expect(r.items).toEqual([
      { en: 'cat', ru: 'кошка', pic: '🐱' },
      { en: 'book', ru: 'книга', pic: undefined },
      { en: 'snow', ru: 'снег', pic: undefined },
      { en: 'ice cream', ru: 'мороженое', pic: undefined },
    ]);
    expect(r.errors).toHaveLength(2); // дубликат Cat и строка без перевода
  });

  it('parses phrases and keeps commas inside', () => {
    const r = parsePhrases('One, two, three! - Раз, два, три!\nЯ люблю снег - I like snow\nHello - Привет');
    expect(r.items).toEqual([
      { en: 'One, two, three!', ru: 'Раз, два, три!' },
      { en: 'I like snow', ru: 'Я люблю снег' },
    ]);
    expect(r.errors).toHaveLength(1);
  });

  it('reads txt with phrases section and json', () => {
    const t = parseThemeFile('Погода.txt', 'snow - снег\nwind - ветер\nФразы:\nI like snow - Я люблю снег');
    expect(t).toMatchObject({ name: 'Погода', wordsText: 'snow - снег\nwind - ветер', phrasesText: 'I like snow - Я люблю снег' });
    const j = parseThemeFile('x.json', JSON.stringify({ name: 'Зима', pic: '❄️', words: [{ en: 'snow', ru: 'снег', pic: '❄️' }, ['ice', 'лёд']], phrases: [{ en: 'It is cold', ru: 'Холодно' }] }));
    expect(j).toEqual({ name: 'Зима', pic: '❄️', wordsText: 'snow - снег - ❄️\nice - лёд', phrasesText: 'It is cold - Холодно' });
  });
});

describe('custom theme → level', () => {
  it('splits words into lessons of 4–7', () => {
    for (let n = 4; n <= 40; n++) {
      const groups = splitIntoLessons(Array.from({ length: n }, (_, i) => i));
      expect(groups.flat()).toHaveLength(n);
      groups.forEach((g) => expect(g.length).toBeGreaterThanOrEqual(4));
      groups.forEach((g) => expect(g.length).toBeLessThanOrEqual(7));
    }
  });

  it('uses builtin emoji for known words and translation otherwise', () => {
    const { words } = themeToWorld({ ...theme('custom-a', 0), words: [{ en: 'cat', ru: 'котик' }, { en: 'rainbow', ru: 'радуга' }] }, 0);
    expect(words.map((w) => w.pic)).toEqual(['🐱', 'радуга']);
  });

  it('builds playable lessons and boss even without phrases', () => {
    applyCustomThemes([theme('custom-b', 13, 3), theme('custom-c', 4)]);
    expect(WORLDS).toHaveLength(BUILTIN_WORLDS.length + 2);
    for (const world of WORLDS.slice(BUILTIN_WORLDS.length)) {
      for (const lesson of world.lessons) {
        const exs = buildLesson(lesson, wordsUpToWorld(world.id), seededRng(4));
        expect(exs.length).toBeGreaterThan(5);
        expect(findLesson(lesson.id).world).toBe(world);
      }
      const phrases = world.lessons.flatMap((l) => l.phrases);
      expect(buildBossQuestions(worldWords(world), phrases, wordsUpToWorld(world.id), 15, seededRng(2))).toHaveLength(15);
    }
    applyCustomThemes([]);
    expect(WORLDS).toHaveLength(BUILTIN_WORLDS.length);
    expect(hasWord('custom-b-w0')).toBe(false);
  });

  it('store adds a level that is open right away and removes it with its progress', () => {
    const s = useGame.getState();
    s.reset();
    s.addCustomTheme(theme('custom-d', 6));
    const idx = WORLDS.findIndex((w) => w.id === 'custom-d');
    expect(idx).toBe(BUILTIN_WORLDS.length);
    expect(isWorldUnlocked(useGame.getState(), idx)).toBe(true);
    useGame.getState().recordWord('custom-d-w0', false);
    useGame.getState().finishLesson('custom-d-l1', 3, 1);
    useGame.getState().removeCustomTheme('custom-d');
    const after = useGame.getState();
    expect(after.customThemes).toHaveLength(0);
    expect(after.srs['custom-d-w0']).toBeUndefined();
    expect(after.lessonStars['custom-d-l1']).toBeUndefined();
    expect(WORD_BY_ID['custom-d-w0']).toBeUndefined();
  });
});

describe('daily bonus in store', () => {
  it('is given once per day on top of task coins', () => {
    useGame.getState().reset();
    const first = useGame.getState().finishLesson('home-1', 3, 1);
    expect(first.bonus).toBe(10);
    expect(useGame.getState().coins).toBe(first.coins + 10);
    const second = useGame.getState().finishReview(1);
    expect(second.bonus).toBe(0);
  });
});

describe('shop catalog', () => {
  it('every accessory has art and every friend fur exists', () => {
    const art = { hat: HATS, glasses: GLASSES, neck: NECK, back: BACK };
    for (const item of ITEMS) expect(art[item.slot][item.id], item.id).toBeDefined();
    expect(new Set(ITEMS.map((i) => i.id)).size).toBe(ITEMS.length);
    for (const w of BUILTIN_WORLDS) expect(FUR_BY_ID[w.friend.fur], w.friend.fur).toBeDefined();
    for (let i = 0; i < 5; i++) expect(FUR_BY_ID[themeToWorld(theme(`custom-f${i}`, 4), i).world.friend.fur]).toBeDefined();
  });

  it('home items have unique ids and positions inside the room', () => {
    expect(new Set(HOME_ITEMS.map((i) => i.id)).size).toBe(HOME_ITEMS.length);
    for (const i of HOME_ITEMS) {
      expect(i.x).toBeGreaterThan(0);
      expect(i.x).toBeLessThan(100);
      expect(i.phrase.en.length).toBeGreaterThan(3);
    }
  });
});
