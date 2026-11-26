import type { World } from '../types';
import { g, p } from './_helpers';

export const grammarWhose: World = {
  id: 'whose',
  name: 'Бюро находок',
  pic: '🔍',
  story: 'Котик нашёл кучу потерянных вещей. Чьи они? Учимся спрашивать whose и отвечать: my, your, his, her, our, their.',
  bg: 'linear-gradient(160deg, #f6f3ea 0%, #e3d6b8 100%)',
  accent: '#9a7b3c',
  decor: ['🔍', '🧳', '🗃️', '🕰️', '🎒', '🧸'],
  lessons: [
    {
      id: 'whose-1',
      title: 'Whose? My, your',
      words: ['phone', 'watch', 'purse', 'ring'],
      rule: [
        'Whose? — Чей? Чья? Чьё?',
        'my — мой, your — твой (ваш)',
        'Whose phone is this? — Чей это телефон?',
        'It is my phone. — Это мой телефон.',
      ],
      phrases: [
        g('Whose phone is this?', 'Чей это телефон?', 'Whose', ['Who', 'Whose']),
        g('It is my phone.', 'Это мой телефон.', 'my', ['I', 'me', 'my']),
        g('Is this your watch?', 'Это твои часы?', 'your', ['you', 'your']),
        p('Yes, it is my ring.', 'Да, это моё кольцо.'),
      ],
    },
    {
      id: 'whose-2',
      title: 'His, her, its',
      words: ['guitar', 'skateboard', 'bone', 'cap'],
      rule: [
        'his — его (о мальчике), her — её (о девочке), its — его/её (о животном или предмете).',
        'This is his guitar. — Это его гитара.',
        'That is her skateboard. — Это её скейтборд.',
        'The dog has got its bone. — У собаки своя косточка.',
      ],
      phrases: [
        g('This is his guitar.', 'Это его гитара.', 'his', ['he', 'his', 'her']),
        g('That is her skateboard.', 'Это её скейтборд.', 'her', ['she', 'his', 'her']),
        g('The dog has got its bone.', 'У собаки есть её косточка.', 'its', ['it', 'its']),
        p('Whose cap is it?', 'Чья это кепка?'),
      ],
      minigame: true,
    },
    {
      id: 'whose-3',
      title: 'Our, their',
      words: ['kitten', 'puppy', 'toys', 'room'],
      rule: [
        'our — наш, their — их',
        'This is our kitten. — Это наш котёнок.',
        'That is their puppy. — Это их щенок.',
        'Запомни пары: I → my, you → your, he → his, she → her, it → its, we → our, they → their.',
      ],
      phrases: [
        g('This is our kitten.', 'Это наш котёнок.', 'our', ['we', 'our']),
        g('That is their puppy.', 'Это их щенок.', 'their', ['they', 'their']),
        g('Our room is big.', 'Наша комната большая.', 'Our', ['We', 'Our']),
        p('Whose toys are these?', 'Чьи это игрушки?'),
      ],
      minigame: true,
    },
  ],
  boss: {
    name: 'Бельчонок Прятун',
    pic: '🐿️',
    story: 'Бельчонок Прятун перепрятал все вещи в бюро! Узнай, чьи они, и верни хозяевам.',
    winText: 'Все вещи вернулись к хозяевам! Прятун подарил котику свой лучший орешек.',
    hp: 8,
  },
  friend: { name: 'Маркиз', fur: 'chocolate', accessories: { glasses: 'monocle', neck: 'tie' } },
};
