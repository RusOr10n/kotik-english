import type { Phrase } from './types';

/** Что котик делает с вещью */
export type HomeAction = 'sleep' | 'eat' | 'scratch' | 'climb' | 'watch' | 'jump' | 'dance' | 'chase' | 'laser' | 'hide' | 'play' | 'bubbles';

export type RoomId = 'living' | 'bathroom' | 'kitchen' | 'disco';

export type Room = {
  id: RoomId;
  name: string;
  pic: string;
  /** сколько уровней (миров основного сюжета) нужно пройти, чтобы комната открылась */
  unlockAt: number;
  /** что котик скажет, когда заходит в комнату */
  phrase: Phrase;
  wall: string;
  baseboard: string;
  floor: string;
};

export const ROOMS: Room[] = [
  {
    id: 'living', name: 'Гостиная', pic: '🛋️', unlockAt: 0,
    phrase: { en: 'This is the living room!', ru: 'Это гостиная!' },
    wall: 'radial-gradient(circle, rgba(255,255,255,0.5) 2px, transparent 2.5px) 0 0 / 28px 28px, linear-gradient(180deg, #ffe6ef 0%, #ffd9e6 100%)',
    baseboard: '#f3c1d3',
    floor: 'repeating-linear-gradient(90deg, #e9c79f 0px, #e9c79f 118px, #dcb68c 118px, #dcb68c 122px), #e9c79f',
  },
  {
    id: 'bathroom', name: 'Ванная', pic: '🛁', unlockAt: 5,
    phrase: { en: 'This is the bathroom!', ru: 'Это ванная!' },
    wall: 'linear-gradient(90deg, rgba(255,255,255,0.7) 2px, transparent 2px) 0 0 / 46px 46px, linear-gradient(0deg, rgba(255,255,255,0.7) 2px, transparent 2px) 0 0 / 46px 46px, linear-gradient(180deg, #c9eef8 0%, #b3e3f2 100%)',
    baseboard: '#7cc6e0',
    floor: 'repeating-conic-gradient(#ffffff 0% 25%, #d3edf7 0% 50%) 0 0 / 64px 64px',
  },
  {
    id: 'kitchen', name: 'Кухня', pic: '🍳', unlockAt: 10,
    phrase: { en: 'This is the kitchen!', ru: 'Это кухня!' },
    wall: 'repeating-linear-gradient(90deg, #fff4d2 0px, #fff4d2 40px, #ffecb8 40px, #ffecb8 80px)',
    baseboard: '#e8b96a',
    floor: 'repeating-conic-gradient(#fbf6ee 0% 25%, #ef8f8f 0% 50%) 0 0 / 60px 60px',
  },
  {
    id: 'disco', name: 'Диско-комната', pic: '🪩', unlockAt: 15,
    phrase: { en: 'This is the disco room!', ru: 'Это диско-комната!' },
    wall: 'radial-gradient(circle, rgba(255,255,255,0.75) 1.5px, transparent 2px) 0 0 / 36px 36px, linear-gradient(180deg, #24143f 0%, #45206b 100%)',
    baseboard: '#ff4fd8',
    floor: 'repeating-conic-gradient(#ff6fb5 0% 25%, #5b3cc4 0% 50%) 0 0 / 72px 72px',
  },
];

export const ROOM_BY_ID = Object.fromEntries(ROOMS.map((r) => [r.id, r])) as Record<RoomId, Room>;

export type HomeItem = {
  id: string;
  kind: 'interior' | 'toy';
  /** комната, где стоит вещь; по умолчанию — гостиная */
  room?: RoomId;
  name: string;
  pic: string;
  /** особая отрисовка вместо эмодзи */
  art?: 'tree' | 'aquarium' | 'rug' | 'fridge' | 'stove' | 'table' | 'discoball' | 'speaker';
  /** значки, которые всплывают, когда котик играет с вещью (вместо обычных) */
  floats?: string[];
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
  { id: 'home-tree', kind: 'interior', name: 'Кошачье дерево', pic: '🌲', art: 'tree', price: 150, x: 7, y: 70, size: 150, action: 'climb', phrase: { en: 'I can climb!', ru: 'Я умею лазать!' } },
  { id: 'home-post', kind: 'interior', name: 'Когтеточка', pic: '🪵', price: 50, x: 20, y: 69, size: 70, action: 'scratch', phrase: { en: 'Scratch, scratch!', ru: 'Царап-царап!' } },
  { id: 'home-plant', kind: 'interior', name: 'Цветок в горшке', pic: '🪴', price: 40, x: 31, y: 68, size: 72, action: 'watch', phrase: { en: 'What a nice flower!', ru: 'Какой красивый цветок!' } },
  { id: 'home-tv', kind: 'interior', name: 'Телевизор', pic: '📺', price: 110, x: 47, y: 67, size: 80, action: 'watch', phrase: { en: 'I like cartoons!', ru: 'Я люблю мультики!' } },
  { id: 'home-aquarium', kind: 'interior', name: 'Аквариум', pic: '🐠', art: 'aquarium', price: 130, x: 63, y: 69, size: 110, action: 'watch', phrase: { en: 'Look! A fish!', ru: 'Смотри! Рыбка!' } },
  { id: 'home-radio', kind: 'interior', name: 'Радио', pic: '📻', price: 75, x: 77, y: 68, size: 66, action: 'dance', phrase: { en: 'I am dancing!', ru: 'Я танцую!' } },
  { id: 'home-sofa', kind: 'interior', name: 'Диванчик', pic: '🛋️', price: 100, x: 90, y: 71, size: 100, action: 'jump', phrase: { en: 'I am jumping!', ru: 'Я прыгаю!' } },
  { id: 'home-picture', kind: 'interior', name: 'Картина', pic: '🖼️', price: 45, x: 24, y: 34, size: 70, action: 'watch', phrase: { en: 'It is a beautiful picture!', ru: 'Какая красивая картина!' } },
  // Интерьер: передний ряд
  { id: 'home-bed', kind: 'interior', name: 'Корзинка-лежанка', pic: '🧺', price: 65, x: 10, y: 93, size: 90, action: 'sleep', phrase: { en: 'I am sleeping. Good night!', ru: 'Я сплю. Спокойной ночи!' } },
  { id: 'home-bowl', kind: 'interior', name: 'Миска', pic: '🥣', price: 30, x: 23, y: 95, size: 56, action: 'eat', phrase: { en: 'Yummy! I am eating.', ru: 'Вкусно! Я ем.' } },
  { id: 'home-rug', kind: 'interior', name: 'Коврик', pic: '🟣', art: 'rug', price: 40, x: 50, y: 96, size: 240, action: 'sleep', phrase: { en: 'My rug is soft.', ru: 'Мой коврик мягкий.' } },

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

  // Ванная — открывается после 5 уровней
  { id: 'bath-tub', kind: 'interior', room: 'bathroom', name: 'Ванна', pic: '🛁', price: 180, x: 24, y: 73, size: 130, action: 'hide', floats: ['🫧', '🫧', '🫧'], phrase: { en: 'I am taking a bath!', ru: 'Я принимаю ванну!' } },
  { id: 'bath-shower', kind: 'interior', room: 'bathroom', name: 'Душ', pic: '🚿', price: 100, x: 8, y: 48, size: 64, action: 'watch', floats: ['💧', '💧', '💧'], phrase: { en: 'I like the shower!', ru: 'Я люблю душ!' } },
  { id: 'bath-mirror', kind: 'interior', room: 'bathroom', name: 'Зеркало', pic: '🪞', price: 90, x: 48, y: 46, size: 70, action: 'watch', floats: ['✨', '😺'], phrase: { en: 'I see a pretty cat!', ru: 'Я вижу красивого котика!' } },
  { id: 'bath-sink', kind: 'interior', room: 'bathroom', name: 'Кран с водой', pic: '🚰', price: 80, x: 48, y: 70, size: 64, action: 'watch', floats: ['💧', '🫧'], phrase: { en: 'I wash my face.', ru: 'Я умываюсь.' } },
  { id: 'bath-shampoo', kind: 'interior', room: 'bathroom', name: 'Шампунь', pic: '🧴', price: 40, x: 64, y: 70, size: 46, action: 'bubbles', phrase: { en: 'This is my shampoo.', ru: 'Это мой шампунь.' } },
  { id: 'bath-toothbrush', kind: 'interior', room: 'bathroom', name: 'Зубная щётка', pic: '🪥', price: 30, x: 80, y: 70, size: 50, action: 'play', floats: ['🦷', '✨'], phrase: { en: 'I brush my teeth!', ru: 'Я чищу зубы!' } },
  { id: 'bath-duck', kind: 'interior', room: 'bathroom', name: 'Уточка', pic: '🦆', price: 35, x: 40, y: 93, size: 46, action: 'chase', phrase: { en: 'Quack, quack! Catch the duck!', ru: 'Кря-кря! Лови уточку!' } },
  { id: 'bath-soap', kind: 'interior', room: 'bathroom', name: 'Мыло', pic: '🧼', price: 25, x: 70, y: 93, size: 42, action: 'bubbles', phrase: { en: 'Soap makes bubbles!', ru: 'Мыло делает пузыри!' } },
  { id: 'bath-sponge', kind: 'interior', room: 'bathroom', name: 'Губка', pic: '🧽', price: 20, x: 88, y: 94, size: 40, action: 'bubbles', phrase: { en: 'I have a yellow sponge.', ru: 'У меня жёлтая губка.' } },

  // Кухня — открывается после 10 уровней
  { id: 'kitchen-fridge', kind: 'interior', room: 'kitchen', name: 'Холодильник', pic: '🧊', art: 'fridge', price: 200, x: 9, y: 72, size: 140, action: 'watch', floats: ['🥛', '🧀', '🐟'], phrase: { en: 'What is in the fridge?', ru: 'Что в холодильнике?' } },
  { id: 'kitchen-stove', kind: 'interior', room: 'kitchen', name: 'Плита', pic: '🍳', art: 'stove', price: 160, x: 27, y: 72, size: 100, action: 'watch', floats: ['🍳', '🔥', '😋'], phrase: { en: 'I can cook!', ru: 'Я умею готовить!' } },
  { id: 'kitchen-clock', kind: 'interior', room: 'kitchen', name: 'Часы', pic: '🕰️', price: 70, x: 50, y: 44, size: 60, action: 'watch', floats: ['⏰', '✨'], phrase: { en: 'What time is it?', ru: 'Который час?' } },
  { id: 'kitchen-table', kind: 'interior', room: 'kitchen', name: 'Стол', pic: '🍽️', art: 'table', price: 130, x: 68, y: 74, size: 150, action: 'jump', phrase: { en: 'I am on the table! Oops!', ru: 'Я на столе! Ой!' } },
  { id: 'kitchen-teapot', kind: 'interior', room: 'kitchen', name: 'Чайник', pic: '🫖', price: 50, x: 44, y: 93, size: 50, action: 'watch', floats: ['☕', '💨'], phrase: { en: 'Tea time!', ru: 'Время пить чай!' } },
  { id: 'kitchen-fish', kind: 'interior', room: 'kitchen', name: 'Рыбка', pic: '🐟', price: 40, x: 28, y: 95, size: 44, action: 'eat', phrase: { en: 'I love fish!', ru: 'Я люблю рыбу!' } },
  { id: 'kitchen-milk', kind: 'interior', room: 'kitchen', name: 'Молоко', pic: '🥛', price: 30, x: 58, y: 95, size: 44, action: 'eat', phrase: { en: 'I like milk!', ru: 'Я люблю молоко!' } },
  { id: 'kitchen-cookies', kind: 'interior', room: 'kitchen', name: 'Печенье', pic: '🍪', price: 35, x: 74, y: 95, size: 40, action: 'eat', phrase: { en: 'I like cookies!', ru: 'Я люблю печенье!' } },
  { id: 'kitchen-cake', kind: 'interior', room: 'kitchen', name: 'Торт', pic: '🎂', price: 90, x: 90, y: 94, size: 56, action: 'eat', floats: ['🎂', '❤️'], phrase: { en: 'Yummy cake!', ru: 'Вкусный торт!' } },

  // Диско-комната — открывается после 15 уровней
  { id: 'disco-ball', kind: 'interior', room: 'disco', name: 'Диско-шар', pic: '🪩', art: 'discoball', price: 300, x: 50, y: 30, size: 84, action: 'dance', floats: ['✨', '🌟', '✨'], phrase: { en: "Let's dance!", ru: 'Давай танцевать!' } },
  { id: 'disco-speaker', kind: 'interior', room: 'disco', name: 'Колонка', pic: '🔊', art: 'speaker', price: 160, x: 9, y: 72, size: 110, action: 'dance', phrase: { en: 'The music is loud!', ru: 'Музыка громкая!' } },
  { id: 'disco-piano', kind: 'interior', room: 'disco', name: 'Синтезатор', pic: '🎹', price: 180, x: 27, y: 72, size: 90, action: 'dance', floats: ['🎹', '🎵', '🎶'], phrase: { en: 'I play the piano!', ru: 'Я играю на пианино!' } },
  { id: 'disco-star', kind: 'interior', room: 'disco', name: 'Звезда', pic: '🌟', price: 70, x: 22, y: 42, size: 56, action: 'watch', floats: ['⭐', '✨'], phrase: { en: 'I am a superstar!', ru: 'Я суперзвезда!' } },
  { id: 'disco-guitar', kind: 'interior', room: 'disco', name: 'Гитара', pic: '🎸', price: 140, x: 72, y: 72, size: 80, action: 'dance', floats: ['🎸', '🎵'], phrase: { en: 'I play the guitar!', ru: 'Я играю на гитаре!' } },
  { id: 'disco-mic', kind: 'interior', room: 'disco', name: 'Микрофон', pic: '🎤', price: 100, x: 88, y: 72, size: 70, action: 'dance', floats: ['🎤', '🎵', '🎶'], phrase: { en: 'I can sing!', ru: 'Я умею петь!' } },
  { id: 'disco-balloons', kind: 'interior', room: 'disco', name: 'Шарики', pic: '🎈', price: 45, x: 80, y: 44, size: 56, action: 'play', floats: ['🎈', '🎉'], phrase: { en: 'Balloons for the party!', ru: 'Шарики для вечеринки!' } },
  { id: 'disco-confetti', kind: 'interior', room: 'disco', name: 'Хлопушка', pic: '🎉', price: 50, x: 40, y: 93, size: 46, action: 'play', floats: ['🎉', '🎊', '✨'], phrase: { en: 'It is a party!', ru: 'Это вечеринка!' } },
  { id: 'disco-trumpet', kind: 'interior', room: 'disco', name: 'Труба', pic: '🎺', price: 90, x: 62, y: 94, size: 46, action: 'dance', floats: ['🎺', '🎵'], phrase: { en: 'Toot, toot! I play the trumpet!', ru: 'Ту-ту! Я играю на трубе!' } },
];

export const roomOf = (item: HomeItem): RoomId => item.room ?? 'living';

export const HOME_ITEM_BY_ID: Record<string, HomeItem> = Object.fromEntries(HOME_ITEMS.map((i) => [i.id, i]));
