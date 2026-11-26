import type { World } from '../types';
import { g, p } from './_helpers';

const CAN = ['can', "can't"];

export const grammarCan: World = {
  id: 'can',
  name: 'Стадион «I can»',
  pic: '🏟️',
  story: 'На стадионе все показывают, что умеют. Учимся говорить can — умею, can’t — не умею, и спрашивать Can you…?',
  bg: 'linear-gradient(160deg, #eafbe7 0%, #b9eab0 100%)',
  accent: '#3b9a2f',
  decor: ['🏟️', '🏅', '🥇', '🏆', '⚽', '🏀'],
  lessons: [
    {
      id: 'can-1',
      title: 'I can',
      words: ['skate', 'ski', 'surf', 'row'],
      rule: [
        'Can — «умею, могу». Одинаково для всех: I can, he can, they can.',
        'После can глагол без изменений: she can ski (не skis!).',
        'I can skate. — Я умею кататься на коньках.',
      ],
      phrases: [
        g('I can skate.', 'Я умею кататься на коньках.', 'can', CAN),
        p('She can ski.', 'Она умеет кататься на лыжах.'),
        g('We can surf.', 'Мы умеем сёрфить.', 'can', CAN),
        p('They can row a boat.', 'Они умеют грести на лодке.'),
      ],
    },
    {
      id: 'can-2',
      title: "I can't",
      words: ['dive', 'kick', 'write', 'count'],
      rule: [
        "Can't — «не умею, не могу» (can't = cannot).",
        "Fish can't walk. — Рыбы не умеют ходить.",
        "I can't dive. — Я не умею нырять.",
      ],
      phrases: [
        g("Fish can't walk.", 'Рыбы не умеют ходить.', "can't", CAN),
        g("I can't dive.", 'Я не умею нырять.', "can't", CAN),
        p("Babies can't write.", 'Малыши не умеют писать.'),
        g('He can kick the ball.', 'Он умеет пинать мяч.', 'can', CAN),
      ],
      minigame: true,
    },
    {
      id: 'can-3',
      title: 'Can you…?',
      words: ['build', 'sew', 'knit', 'bake'],
      rule: [
        'В вопросе can идёт первым: Can you knit? — Ты умеешь вязать?',
        "Ответ: Yes, I can. / No, I can't.",
        "Can he bake a cake? — No, he can't.",
      ],
      phrases: [
        g('Can you knit?', 'Ты умеешь вязать?', 'Can', ['Can', 'Do']),
        g('Yes, I can.', 'Да.', 'can', CAN),
        p('Can he bake a cake?', 'Он умеет печь торт?'),
        g("No, he can't.", 'Нет.', "can't", CAN),
        p('Can cats build houses?', 'Кошки умеют строить дома?'),
      ],
      minigame: true,
    },
  ],
  boss: {
    name: 'Горилла Силач',
    pic: '🦍',
    story: 'Горилла Силач говорит, что котик ничего не умеет! Докажи обратное.',
    winText: 'Силач признал: «You can do it!» и вручил котику кубок чемпиона.',
    hp: 8,
  },
  friend: { name: 'Феликс', fur: 'gold', accessories: { neck: 'medal' } },
};
