import type { World } from '../types';

export const town: World = {
  id: 'town',
  name: 'Большой город',
  pic: '🏙️',
  story: 'Котик едет в гости к семье в большой город. Сколько всего нового!',
  bg: 'linear-gradient(160deg, #f1e4ff 0%, #d6c8ff 100%)',
  accent: '#8e5cd9',
  decor: ['🚦', '🏢', '🎈', '🌇', '🚲', '⛲'],
  lessons: [
    {
      id: 'town-1',
      title: 'Моя семья',
      words: ['mum', 'dad', 'sister', 'brother', 'baby'],
      phrases: [
        { en: 'She is my mum.', ru: 'Она моя мама.' },
        { en: 'He is my brother.', ru: 'Он мой брат.' },
      ],
    },
    {
      id: 'town-2',
      title: 'Одежда',
      words: ['hat', 'dress', 'shoes', 'tshirt', 'socks'],
      phrases: [
        { en: 'I have got a red dress.', ru: 'У меня есть красное платье.' },
        { en: 'He has got blue socks.', ru: 'У него есть синие носки.' },
      ],
      minigame: true,
    },
    {
      id: 'town-3',
      title: 'Моё лицо',
      words: ['eyes', 'nose', 'ear', 'hand', 'mouth'],
      phrases: [
        { en: 'I have got green eyes.', ru: 'У меня зелёные глаза.' },
        { en: 'The cat has got a pink nose.', ru: 'У кошки розовый нос.' },
      ],
    },
    {
      id: 'town-4',
      title: 'По городу',
      words: ['car', 'bus', 'shop', 'park', 'house'],
      phrases: [
        { en: 'This is my house.', ru: 'Это мой дом.' },
        { en: 'She is in the park.', ru: 'Она в парке.' },
      ],
      minigame: true,
    },
  ],
  boss: {
    name: 'Пёс Гав-Гав',
    pic: '🐕',
    story: 'Пёс Гав-Гав не пускает котика в гости к бабушке! Докажи, что знаешь английский.',
    winText: 'Гав-Гав оказался добрым и проводил котика до дома бабушки!',
    hp: 8,
  },
  friend: { name: 'Снежок', fur: 'white', accessories: { neck: 'scarf' } },
};
