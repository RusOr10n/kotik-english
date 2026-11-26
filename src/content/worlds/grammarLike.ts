import type { World } from '../types';
import { g, p } from './_helpers';

const DO_NOT = ["don't", "doesn't"];

export const grammarLike: World = {
  id: 'likes',
  name: 'Кафе «I like»',
  pic: '☕',
  story: 'Котик открыл кафе и спрашивает гостей, что они любят. Учимся говорить «люблю», «не люблю» и задавать вопросы.',
  bg: 'linear-gradient(160deg, #fff4e6 0%, #ffd8b8 100%)',
  accent: '#d9773a',
  decor: ['☕', '🧁', '🍩', '🥞', '🍰', '🫖'],
  lessons: [
    {
      id: 'likes-1',
      title: "I like, I don't like",
      words: ['carrot', 'tomato', 'honey', 'chocolate'],
      rule: [
        'I like … — я люблю … / мне нравится …',
        "I don't like … — я не люблю … (don't = do not)",
        'I like honey. — Я люблю мёд.',
        "We don't like tomatoes. — Мы не любим помидоры.",
      ],
      phrases: [
        g('I like honey.', 'Я люблю мёд.', 'like', ['like', 'likes']),
        g("I don't like tomatoes.", 'Я не люблю помидоры.', "don't", DO_NOT),
        p('We like chocolate.', 'Мы любим шоколад.'),
        g("They don't like carrots.", 'Они не любят морковку.', "don't", DO_NOT),
      ],
    },
    {
      id: 'likes-2',
      title: "He likes, she doesn't like",
      words: ['popcorn', 'cookie', 'lemon', 'nuts'],
      rule: [
        'С he, she, it к глаголу добавляется -s: he likes, she likes.',
        "А в отрицании — doesn't, и -s уже не нужна: she doesn't like.",
        'He likes popcorn. — Он любит попкорн.',
        "She doesn't like nuts. — Она не любит орехи.",
      ],
      phrases: [
        g('He likes popcorn.', 'Он любит попкорн.', 'likes', ['like', 'likes']),
        g("She doesn't like nuts.", 'Она не любит орехи.', "doesn't", DO_NOT),
        g('My cat likes fish.', 'Моя кошка любит рыбу.', 'likes', ['like', 'likes']),
        p("Tom doesn't like lemons.", 'Том не любит лимоны.'),
      ],
      minigame: true,
    },
    {
      id: 'likes-3',
      title: 'Do you like…?',
      words: ['music', 'cartoons', 'snow', 'spiders'],
      rule: [
        'Вопрос начинается с Do (для I, you, we, they) или Does (для he, she, it).',
        'Do you like music? — Ты любишь музыку?',
        "Yes, I do. / No, I don't. — Да. / Нет.",
        "Does she like spiders? — No, she doesn't.",
      ],
      phrases: [
        g('Do you like music?', 'Ты любишь музыку?', 'Do', ['Do', 'Does']),
        g('Yes, I do.', 'Да.', 'do', ['do', 'does']),
        g('Does she like spiders?', 'Она любит пауков?', 'Does', ['Do', 'Does']),
        g("No, she doesn't.", 'Нет.', "doesn't", DO_NOT),
        p('Do they like snow?', 'Они любят снег?'),
      ],
      minigame: true,
    },
  ],
  boss: {
    name: 'Попугай Привереда',
    pic: '🦜',
    story: 'Попугай Привереда ничего не любит и всех путает! Отвечай правильно — и он подобреет.',
    winText: 'Привереда сказал: «I like your cafe!» и заказал торт.',
    hp: 6,
  },
  friend: { name: 'Пломбир', fur: 'cream', accessories: { hat: 'chef' } },
};
