import type { World } from '../types';

export const school: World = {
  id: 'school',
  name: 'Кошачья школа',
  pic: '🏫',
  story: 'В городе открылась школа для котиков. Котик собирает рюкзак и идёт учиться!',
  bg: 'linear-gradient(160deg, #dff1ff 0%, #c5d8ff 100%)',
  accent: '#3f6fd8',
  decor: ['📐', '📚', '🔔', '🧮', '🌍', '📝'],
  lessons: [
    {
      id: 'school-1',
      title: 'Мой рюкзак',
      words: ['pen', 'pencil', 'book', 'bag', 'ruler'],
      phrases: [
        { en: 'This is a pen.', ru: 'Это ручка.' },
        { en: 'These are books.', ru: 'Это книги.' },
      ],
    },
    {
      id: 'school-2',
      title: 'В школе',
      words: ['teacher', 'school', 'paint', 'scissors', 'chair'],
      phrases: [
        { en: 'This is my teacher.', ru: 'Это мой учитель.' },
        { en: 'I like my school.', ru: 'Я люблю свою школу.' },
      ],
      minigame: true,
    },
    {
      id: 'school-3',
      title: 'A или an?',
      words: ['clock', 'computer', 'umbrella', 'box', 'crayon'],
      phrases: [
        { en: 'This is an umbrella.', ru: 'Это зонтик.' },
        { en: 'This is a box.', ru: 'Это коробка.' },
        { en: 'This is an egg.', ru: 'Это яйцо.' },
      ],
    },
    {
      id: 'school-4',
      title: 'Наш класс',
      words: ['door', 'window', 'lamp', 'picture', 'map'],
      phrases: [
        { en: 'Open the door, please.', ru: 'Открой дверь, пожалуйста.' },
        { en: 'These are pictures.', ru: 'Это картины.' },
      ],
      minigame: true,
    },
  ],
  boss: {
    name: 'Сова Всезнайка',
    pic: '🦉',
    story: 'Сова Всезнайка устроила котику экзамен! Ответь на её вопросы, чтобы получить диплом.',
    winText: 'Сова вручила котику диплом отличника!',
    hp: 8,
  },
  friend: { name: 'Уголёк', fur: 'black', accessories: { glasses: 'round' } },
};
