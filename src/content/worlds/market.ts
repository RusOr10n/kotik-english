import type { World } from '../types';

export const market: World = {
  id: 'market',
  name: 'Весёлый рынок',
  pic: '🧺',
  story: 'Котик проголодался и идёт на рынок. Нужно научиться просить вкусняшки по-английски!',
  bg: 'linear-gradient(160deg, #fff6c9 0%, #ffd59e 100%)',
  accent: '#f57c00',
  decor: ['🥕', '🍉', '🥐', '🧁', '🍯', '🥨'],
  lessons: [
    {
      id: 'market-1',
      title: 'Фрукты',
      words: ['apple', 'banana', 'pear', 'grapes', 'strawberry'],
      phrases: [
        { en: 'I want an apple.', ru: 'Я хочу яблоко.' },
        { en: 'I like bananas.', ru: 'Я люблю бананы.' },
      ],
    },
    {
      id: 'market-2',
      title: 'Завтрак',
      words: ['bread', 'cheese', 'egg', 'cake', 'juice'],
      phrases: [
        { en: 'Can I have a cake, please?', ru: 'Можно мне торт, пожалуйста?' },
        { en: 'Here you are!', ru: 'Вот, пожалуйста!' },
        { en: 'Thank you!', ru: 'Спасибо!' },
      ],
    },
    {
      id: 'market-3',
      title: 'Числа 11–15',
      words: ['eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen'],
      phrases: [
        { en: 'I have twelve apples.', ru: 'У меня двенадцать яблок.' },
        { en: 'I want eleven sweets.', ru: 'Я хочу одиннадцать конфет.' },
      ],
      minigame: true,
    },
    {
      id: 'market-4',
      title: 'Числа 16–20',
      words: ['sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'],
      phrases: [
        { en: 'I have twenty fish.', ru: 'У меня двадцать рыбок.' },
        { en: 'How old are you?', ru: 'Сколько тебе лет?' },
      ],
    },
    {
      id: 'market-5',
      title: 'Вкусняшки',
      words: ['icecream', 'pizza', 'soup', 'sweets', 'water'],
      phrases: [
        { en: 'I want pizza.', ru: 'Я хочу пиццу.' },
        { en: 'Can I have water, please?', ru: 'Можно мне воды, пожалуйста?' },
      ],
      minigame: true,
    },
  ],
  boss: {
    name: 'Лис Хитрюга',
    pic: '🦊',
    story: 'Лис Хитрюга стащил корзинку с продуктами! Только знаток английского его перехитрит.',
    winText: 'Хитрюга вернул корзинку и даже добавил туда пирожок!',
    hp: 7,
  },
  friend: { name: 'Персик', fur: 'ginger', accessories: { hat: 'party' } },
};
