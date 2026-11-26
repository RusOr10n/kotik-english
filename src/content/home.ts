import type { Phrase } from './types';

/** Что котик делает с вещью */
export type HomeAction = 'sleep' | 'eat' | 'scratch' | 'climb' | 'watch' | 'jump' | 'dance' | 'chase' | 'laser' | 'hide' | 'play' | 'bubbles';

export type HomeItem = {
  id: string;
  kind: 'interior' | 'toy';
  name: string;
  pic: string;
  /** особая отрисовка вместо эмодзи */
  art?: 'tree' | 'aquarium' | 'rug';
  price: number;
  /** позиция в комнате, % (x — центр, y — низ предмета) */
  x: number;
  y: number;
  size: number;
  action: HomeAction;
  /** что котик скажет — заодно учим фразы */
  phrase: Phrase;
};

export const HOME_ITEMS: HomeItem[] = [
  // Интерьер: задний ряд у стены
  { id: 'home-tree', kind: 'interior', name: 'Кошачье дерево', pic: '🌲', art: 'tree', price: 120, x: 7, y: 70, size: 150, action: 'climb', phrase: { en: 'I can climb!', ru: 'Я умею лазать!' } },
  { id: 'home-post', kind: 'interior', name: 'Когтеточка', pic: '🪵', price: 40, x: 20, y: 69, size: 70, action: 'scratch', phrase: { en: 'Scratch, scratch!', ru: 'Царап-царап!' } },
  { id: 'home-plant', kind: 'interior', name: 'Цветок в горшке', pic: '🪴', price: 30, x: 31, y: 68, size: 72, action: 'watch', phrase: { en: 'What a nice flower!', ru: 'Какой красивый цветок!' } },
  { id: 'home-tv', kind: 'interior', name: 'Телевизор', pic: '📺', price: 90, x: 47, y: 67, size: 80, action: 'watch', phrase: { en: 'I like cartoons!', ru: 'Я люблю мультики!' } },
  { id: 'home-aquarium', kind: 'interior', name: 'Аквариум', pic: '🐠', art: 'aquarium', price: 100, x: 63, y: 69, size: 110, action: 'watch', phrase: { en: 'Look! A fish!', ru: 'Смотри! Рыбка!' } },
  { id: 'home-radio', kind: 'interior', name: 'Радио', pic: '📻', price: 60, x: 77, y: 68, size: 66, action: 'dance', phrase: { en: 'I am dancing!', ru: 'Я танцую!' } },
  { id: 'home-sofa', kind: 'interior', name: 'Диванчик', pic: '🛋️', price: 80, x: 90, y: 71, size: 100, action: 'jump', phrase: { en: 'I am jumping!', ru: 'Я прыгаю!' } },
  { id: 'home-picture', kind: 'interior', name: 'Картина', pic: '🖼️', price: 35, x: 24, y: 34, size: 70, action: 'watch', phrase: { en: 'It is a beautiful picture!', ru: 'Какая красивая картина!' } },
  // Интерьер: передний ряд
  { id: 'home-bed', kind: 'interior', name: 'Корзинка-лежанка', pic: '🧺', price: 50, x: 10, y: 93, size: 90, action: 'sleep', phrase: { en: 'I am sleeping. Good night!', ru: 'Я сплю. Спокойной ночи!' } },
  { id: 'home-bowl', kind: 'interior', name: 'Миска', pic: '🥣', price: 25, x: 23, y: 95, size: 56, action: 'eat', phrase: { en: 'Yummy! I am eating.', ru: 'Вкусно! Я ем.' } },
  { id: 'home-rug', kind: 'interior', name: 'Коврик', pic: '🟣', art: 'rug', price: 30, x: 50, y: 96, size: 240, action: 'sleep', phrase: { en: 'My rug is soft.', ru: 'Мой коврик мягкий.' } },

  // Игрушки
  { id: 'toy-yarn', kind: 'toy', name: 'Клубок', pic: '🧶', price: 20, x: 36, y: 90, size: 46, action: 'chase', phrase: { en: 'I like my ball of yarn!', ru: 'Я люблю свой клубок!' } },
  { id: 'toy-mouse', kind: 'toy', name: 'Игрушечная мышка', pic: '🐁', price: 25, x: 70, y: 94, size: 44, action: 'chase', phrase: { en: 'I can catch the mouse!', ru: 'Я поймаю мышку!' } },
  { id: 'toy-ball', kind: 'toy', name: 'Мячик', pic: '🎾', price: 25, x: 60, y: 89, size: 40, action: 'chase', phrase: { en: 'Catch the ball!', ru: 'Лови мячик!' } },
  { id: 'toy-box', kind: 'toy', name: 'Коробка', pic: '📦', price: 15, x: 82, y: 93, size: 76, action: 'hide', phrase: { en: 'Where is the cat? Here I am!', ru: 'Где котик? А вот я!' } },
  { id: 'toy-feather', kind: 'toy', name: 'Пёрышко-дразнилка', pic: '🪶', price: 30, x: 31, y: 82, size: 42, action: 'play', phrase: { en: 'Jump, jump, jump!', ru: 'Прыг, прыг, прыг!' } },
  { id: 'toy-teddy', kind: 'toy', name: 'Плюшевый мишка', pic: '🧸', price: 45, x: 94, y: 94, size: 58, action: 'play', phrase: { en: 'I love my teddy bear!', ru: 'Я люблю своего мишку!' } },
  { id: 'toy-laser', kind: 'toy', name: 'Лазерная указка', pic: '🔦', price: 60, x: 42, y: 80, size: 36, action: 'laser', phrase: { en: 'A red dot! Catch it!', ru: 'Красная точка! Лови её!' } },
  { id: 'toy-drum', kind: 'toy', name: 'Барабан', pic: '🥁', price: 40, x: 4, y: 96, size: 48, action: 'dance', phrase: { en: 'Boom, boom! I like music!', ru: 'Бум-бум! Я люблю музыку!' } },
  { id: 'toy-bubbles', kind: 'toy', name: 'Мыльные пузыри', pic: '🫧', price: 35, x: 74, y: 82, size: 40, action: 'bubbles', phrase: { en: 'Bubbles! Pop, pop!', ru: 'Пузыри! Лоп, лоп!' } },
  { id: 'toy-fish', kind: 'toy', name: 'Плюшевая рыбка', pic: '🐡', price: 30, x: 52, y: 82, size: 40, action: 'play', phrase: { en: 'My fish is funny!', ru: 'Моя рыбка смешная!' } },
];

export const HOME_ITEM_BY_ID: Record<string, HomeItem> = Object.fromEntries(HOME_ITEMS.map((i) => [i.id, i]));
