import type { World } from '../types';

export const garden: World = {
  id: 'garden',
  name: 'Волшебный сад',
  pic: '🌳',
  story: 'За домом — огромный сад, полный зверей. Котик хочет со всеми подружиться!',
  bg: 'linear-gradient(160deg, #e3f9d8 0%, #b8eecb 100%)',
  accent: '#43a047',
  decor: ['🌼', '🍄', '🌷', '🐞', '🌿', '🐝'],
  lessons: [
    {
      id: 'garden-1',
      title: 'Друзья в саду',
      words: ['dog', 'bird', 'frog', 'rabbit', 'duck'],
      phrases: [
        { en: 'I like dogs.', ru: 'Я люблю собак.' },
        { en: "I don't like frogs.", ru: 'Я не люблю лягушек.' },
      ],
    },
    {
      id: 'garden-2',
      title: 'На ферме',
      words: ['cow', 'pig', 'horse', 'sheep', 'hen'],
      phrases: [
        { en: 'The cow is big.', ru: 'Корова большая.' },
        { en: 'I like the pig.', ru: 'Мне нравится свинка.' },
      ],
      minigame: true,
    },
    {
      id: 'garden-3',
      title: 'Какой он?',
      words: ['big', 'small', 'happy', 'sad', 'sleepy'],
      phrases: [
        { en: 'The cat is happy.', ru: 'Кошка весёлая.' },
        { en: 'The mouse is small.', ru: 'Мышка маленькая.' },
        { en: 'I am sleepy.', ru: 'Я сонный.' },
      ],
    },
    {
      id: 'garden-4',
      title: 'Природа',
      words: ['tree', 'flower', 'sun', 'rain', 'butterfly'],
      phrases: [
        { en: 'I like flowers.', ru: 'Я люблю цветы.' },
        { en: "I don't like rain.", ru: 'Я не люблю дождь.' },
      ],
      minigame: true,
    },
  ],
  boss: {
    name: 'Енот Шустрик',
    pic: '🦝',
    story: 'Енот Шустрик сорвал все цветы в саду! Победи его в английском поединке.',
    winText: 'Шустрик посадил новые цветы. Сад снова цветёт!',
    hp: 7,
  },
  friend: { name: 'Барсик', fur: 'gray', accessories: { hat: 'flower' } },
};
