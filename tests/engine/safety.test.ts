import { describe, expect, it } from 'vitest';
import { makeGateTask } from '../../src/components/ui/ParentGate';
import { sanitizeThemes } from '../../src/content/custom';
import { sanitizeData } from '../../src/state/store';

describe('замок для родителей', () => {
  it('пример в два действия с положительным ответом, посчитанным по порядку действий', () => {
    for (let i = 0; i < 500; i++) {
      const { text, answer } = makeGateTask();
      expect(text).toMatch(/^\d+ [×+] \d+ [×+−] \d+$/);
      const js = text.replace(/×/g, '*').replace(/−/g, '-');
      expect(Function(`return ${js}`)()).toBe(answer);
      expect(answer).toBeGreaterThan(0);
    }
  });
});

describe('проверка сохранения из файла', () => {
  const goodTheme = {
    id: 'custom-1',
    name: 'Погода',
    pic: '🌈',
    words: ['snow', 'wind', 'cloud', 'rain'].map((en) => ({ en, ru: en + '-ру' })),
    phrases: [{ en: 'I like snow', ru: 'Я люблю снег' }],
    createdAt: 1,
  };

  it('нормальные темы проходят без изменений', () => {
    expect(sanitizeThemes([goodTheme])).toEqual([{ ...goodTheme, words: goodTheme.words.map((w) => ({ ...w, pic: undefined })) }]);
  });

  it('мусор вместо тем не ломает игру', () => {
    expect(sanitizeThemes('oops')).toEqual([]);
    expect(sanitizeThemes([null, 5, { id: 'x', words: 'nope' }, { ...goodTheme, words: [{ en: 1, ru: {} }] }])).toEqual([]);
    const [t] = sanitizeThemes([{ ...goodTheme, name: 'x'.repeat(10_000) }]);
    expect(t.name.length).toBeLessThanOrEqual(60);
  });

  it('поля неправильного типа отбрасываются', () => {
    const data = sanitizeData({
      profile: { catName: 'Мурзик', fur: 'gray' },
      coins: 'много',
      owned: ['a', 5, null],
      lessonStars: [],
      settings: { rate: 99, muted: 'yes' },
      customThemes: {},
    });
    expect(data.profile).toEqual({ catName: 'Мурзик', fur: 'gray' });
    expect(data.coins).toBeUndefined();
    expect(data.owned).toEqual(['a']);
    expect(data.lessonStars).toBeUndefined();
    expect(data.settings).toEqual({ rate: 1.2, voiceName: null, muted: false, unlockAll: false });
    expect(data.customThemes).toEqual([]);
    expect(sanitizeData(null)).toEqual({});
  });
});
