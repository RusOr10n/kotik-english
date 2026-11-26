import type { World } from '../types';

export const home: World = {
  id: 'home',
  name: 'Кошкин дом',
  pic: '🏡',
  story: 'Наш котик просыпается дома. Пора познакомиться с английским!',
  bg: 'linear-gradient(160deg, #ffe9d6 0%, #ffd1dc 100%)',
  accent: '#ff8a65',
  decor: ['🛋️', '🧶', '🪴', '🖼️', '🕯️', '🧸'],
  lessons: [
    {
      id: 'home-1',
      title: 'Привет, котик!',
      words: ['cat', 'mouse', 'fish', 'milk', 'ball'],
      phrases: [
        { en: 'Hello! I am a cat.', ru: 'Привет! Я кошка.' },
        { en: 'I like milk.', ru: 'Я люблю молоко.' },
      ],
    },
    {
      id: 'home-2',
      title: 'Числа 1–5',
      words: ['one', 'two', 'three', 'four', 'five'],
      phrases: [
        { en: 'One, two, three!', ru: 'Раз, два, три!' },
        { en: 'I have five fish.', ru: 'У меня пять рыбок.' },
      ],
    },
    {
      id: 'home-3',
      title: 'Числа 6–10',
      words: ['six', 'seven', 'eight', 'nine', 'ten'],
      phrases: [
        { en: 'I am nine.', ru: 'Мне девять лет.' },
        { en: 'My name is Kitty.', ru: 'Меня зовут Китти.' },
      ],
      minigame: true,
    },
    {
      id: 'home-4',
      title: 'Цвета радуги',
      words: ['red', 'blue', 'green', 'yellow', 'orange'],
      phrases: [
        { en: 'My ball is red.', ru: 'Мой мяч красный.' },
        { en: 'The fish is orange.', ru: 'Рыбка оранжевая.' },
      ],
    },
    {
      id: 'home-5',
      title: 'Ещё цвета',
      words: ['pink', 'black', 'white', 'purple', 'brown'],
      phrases: [
        { en: 'The cat is black.', ru: 'Кошка чёрная.' },
        { en: 'Goodbye! See you!', ru: 'Пока! Увидимся!' },
      ],
      minigame: true,
    },
  ],
  boss: {
    name: 'Мышонок Пик',
    pic: '🐭',
    story: 'Мышонок Пик утащил любимый клубок котика! Отвечай правильно, чтобы вернуть его.',
    winText: 'Пик вернул клубок и попросил прощения!',
    hp: 6,
  },
  friend: { name: 'Мурка', fur: 'cream', accessories: { neck: 'bow' } },
};
