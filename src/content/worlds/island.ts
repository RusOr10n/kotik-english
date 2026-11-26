import type { World } from '../types';

export const island: World = {
  id: 'island',
  name: 'Остров приключений',
  pic: '🏝️',
  story: 'Котик отправляется в плавание на таинственный остров. Здесь нужно бегать, прыгать и плавать!',
  bg: 'linear-gradient(160deg, #d4f7f5 0%, #9fdcf5 100%)',
  accent: '#00897b',
  decor: ['🌴', '⛵', '🐠', '🌺', '🥥', '🐬'],
  lessons: [
    {
      id: 'island-1',
      title: 'Движение',
      words: ['run', 'jump', 'swim', 'fly', 'dance'],
      phrases: [
        { en: 'I can swim.', ru: 'Я умею плавать.' },
        { en: "I can't fly.", ru: 'Я не умею летать.' },
      ],
    },
    {
      id: 'island-2',
      title: 'Что я делаю?',
      words: ['sing', 'read', 'sleep', 'eat', 'draw'],
      phrases: [
        { en: 'I am reading.', ru: 'Я читаю.' },
        { en: 'The cat is sleeping.', ru: 'Кошка спит.' },
      ],
      minigame: true,
    },
    {
      id: 'island-3',
      title: 'Весёлые дела',
      words: ['climb', 'play', 'ride', 'cook', 'walk'],
      phrases: [
        { en: 'Cats can climb.', ru: 'Кошки умеют лазать.' },
        { en: 'She is playing.', ru: 'Она играет.' },
      ],
    },
    {
      id: 'island-4',
      title: 'У моря',
      words: ['sea', 'ship', 'island', 'crab', 'shell'],
      phrases: [
        { en: 'I can see the sea.', ru: 'Я вижу море.' },
        { en: 'The crab is running.', ru: 'Краб бежит.' },
      ],
      minigame: true,
    },
  ],
  boss: {
    name: 'Осьминог Чернильный',
    pic: '🐙',
    story: 'Осьминог Чернильный спрятал сундук с сокровищами! Это финальная битва — ты справишься!',
    winText: 'Сундук найден! Котик — настоящий знаток английского!',
    hp: 9,
  },
  friend: { name: 'Луна', fur: 'lilac', accessories: { hat: 'crown', back: 'cape' } },
};
