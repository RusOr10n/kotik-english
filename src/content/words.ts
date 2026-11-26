import type { Word } from './types';

const w = (id: string, en: string, ru: string, pic: string): Word => ({ id, en, ru, pic });

export const WORDS: Word[] = [
  // Мир 1 — Кошкин дом
  w('cat', 'cat', 'кошка', '🐱'),
  w('mouse', 'mouse', 'мышка', '🐭'),
  w('fish', 'fish', 'рыбка', '🐟'),
  w('milk', 'milk', 'молоко', '🥛'),
  w('ball', 'ball', 'мяч', '⚽'),
  w('one', 'one', 'один', '1️⃣'),
  w('two', 'two', 'два', '2️⃣'),
  w('three', 'three', 'три', '3️⃣'),
  w('four', 'four', 'четыре', '4️⃣'),
  w('five', 'five', 'пять', '5️⃣'),
  w('six', 'six', 'шесть', '6️⃣'),
  w('seven', 'seven', 'семь', '7️⃣'),
  w('eight', 'eight', 'восемь', '8️⃣'),
  w('nine', 'nine', 'девять', '9️⃣'),
  w('ten', 'ten', 'десять', '🔟'),
  w('red', 'red', 'красный', '🔴'),
  w('blue', 'blue', 'синий', '🔵'),
  w('green', 'green', 'зелёный', '🟢'),
  w('yellow', 'yellow', 'жёлтый', '🟡'),
  w('orange', 'orange', 'оранжевый', '🟠'),
  w('pink', 'pink', 'розовый', '🩷'),
  w('black', 'black', 'чёрный', '⚫'),
  w('white', 'white', 'белый', '⚪'),
  w('purple', 'purple', 'фиолетовый', '🟣'),
  w('brown', 'brown', 'коричневый', '🟤'),

  // Мир 2 — Сад
  w('dog', 'dog', 'собака', '🐶'),
  w('bird', 'bird', 'птица', '🐦'),
  w('frog', 'frog', 'лягушка', '🐸'),
  w('rabbit', 'rabbit', 'кролик', '🐰'),
  w('duck', 'duck', 'утка', '🦆'),
  w('cow', 'cow', 'корова', '🐮'),
  w('pig', 'pig', 'свинка', '🐷'),
  w('horse', 'horse', 'лошадь', '🐴'),
  w('sheep', 'sheep', 'овечка', '🐑'),
  w('hen', 'hen', 'курица', '🐔'),
  w('big', 'big', 'большой', '🐘'),
  w('small', 'small', 'маленький', '🐜'),
  w('happy', 'happy', 'весёлый', '😊'),
  w('sad', 'sad', 'грустный', '😢'),
  w('sleepy', 'sleepy', 'сонный', '😴'),
  w('tree', 'tree', 'дерево', '🌳'),
  w('flower', 'flower', 'цветок', '🌸'),
  w('sun', 'sun', 'солнце', '☀️'),
  w('rain', 'rain', 'дождь', '🌧️'),
  w('butterfly', 'butterfly', 'бабочка', '🦋'),

  // Мир 3 — Рынок
  w('apple', 'apple', 'яблоко', '🍎'),
  w('banana', 'banana', 'банан', '🍌'),
  w('pear', 'pear', 'груша', '🍐'),
  w('grapes', 'grapes', 'виноград', '🍇'),
  w('strawberry', 'strawberry', 'клубника', '🍓'),
  w('bread', 'bread', 'хлеб', '🍞'),
  w('cheese', 'cheese', 'сыр', '🧀'),
  w('egg', 'egg', 'яйцо', '🥚'),
  w('cake', 'cake', 'торт', '🍰'),
  w('juice', 'juice', 'сок', '🧃'),
  w('eleven', 'eleven', 'одиннадцать', '11'),
  w('twelve', 'twelve', 'двенадцать', '12'),
  w('thirteen', 'thirteen', 'тринадцать', '13'),
  w('fourteen', 'fourteen', 'четырнадцать', '14'),
  w('fifteen', 'fifteen', 'пятнадцать', '15'),
  w('sixteen', 'sixteen', 'шестнадцать', '16'),
  w('seventeen', 'seventeen', 'семнадцать', '17'),
  w('eighteen', 'eighteen', 'восемнадцать', '18'),
  w('nineteen', 'nineteen', 'девятнадцать', '19'),
  w('twenty', 'twenty', 'двадцать', '20'),
  w('icecream', 'ice cream', 'мороженое', '🍦'),
  w('pizza', 'pizza', 'пицца', '🍕'),
  w('soup', 'soup', 'суп', '🍲'),
  w('sweets', 'sweets', 'конфеты', '🍬'),
  w('water', 'water', 'вода', '💧'),

  // Мир 4 — Школа
  w('pen', 'pen', 'ручка', '🖊️'),
  w('pencil', 'pencil', 'карандаш', '✏️'),
  w('book', 'book', 'книга', '📕'),
  w('bag', 'bag', 'рюкзак', '🎒'),
  w('ruler', 'ruler', 'линейка', '📏'),
  w('teacher', 'teacher', 'учитель', '👩‍🏫'),
  w('school', 'school', 'школа', '🏫'),
  w('paint', 'paint', 'краски', '🎨'),
  w('scissors', 'scissors', 'ножницы', '✂️'),
  w('chair', 'chair', 'стул', '🪑'),
  w('clock', 'clock', 'часы', '🕰️'),
  w('computer', 'computer', 'компьютер', '💻'),
  w('umbrella', 'umbrella', 'зонтик', '☂️'),
  w('box', 'box', 'коробка', '📦'),
  w('crayon', 'crayon', 'мелок', '🖍️'),
  w('door', 'door', 'дверь', '🚪'),
  w('window', 'window', 'окно', '🪟'),
  w('lamp', 'lamp', 'лампа', '💡'),
  w('picture', 'picture', 'картина', '🖼️'),
  w('map', 'map', 'карта', '🗺️'),

  // Мир 5 — Город
  w('mum', 'mum', 'мама', '👩'),
  w('dad', 'dad', 'папа', '👨'),
  w('sister', 'sister', 'сестра', '👧'),
  w('brother', 'brother', 'брат', '👦'),
  w('baby', 'baby', 'малыш', '👶'),
  w('hat', 'hat', 'шляпа', '👒'),
  w('dress', 'dress', 'платье', '👗'),
  w('shoes', 'shoes', 'туфли', '👟'),
  w('tshirt', 'T-shirt', 'футболка', '👕'),
  w('socks', 'socks', 'носки', '🧦'),
  w('eyes', 'eyes', 'глаза', '👀'),
  w('nose', 'nose', 'нос', '👃'),
  w('ear', 'ear', 'ухо', '👂'),
  w('hand', 'hand', 'рука', '✋'),
  w('mouth', 'mouth', 'рот', '👄'),
  w('car', 'car', 'машина', '🚗'),
  w('bus', 'bus', 'автобус', '🚌'),
  w('shop', 'shop', 'магазин', '🏪'),
  w('park', 'park', 'парк', '🏞️'),
  w('house', 'house', 'дом', '🏠'),

  // Мир 6 — Остров
  w('run', 'run', 'бегать', '🏃'),
  w('jump', 'jump', 'прыгать', '🤸'),
  w('swim', 'swim', 'плавать', '🏊'),
  w('fly', 'fly', 'летать', '🪁'),
  w('dance', 'dance', 'танцевать', '💃'),
  w('sing', 'sing', 'петь', '🎤'),
  w('read', 'read', 'читать', '📖'),
  w('sleep', 'sleep', 'спать', '🛌'),
  w('eat', 'eat', 'есть', '🍽️'),
  w('draw', 'draw', 'рисовать', '🖌️'),
  w('climb', 'climb', 'лазать', '🧗'),
  w('play', 'play', 'играть', '🎮'),
  w('ride', 'ride', 'кататься', '🚲'),
  w('cook', 'cook', 'готовить', '🍳'),
  w('walk', 'walk', 'гулять', '🚶'),
  w('sea', 'sea', 'море', '🌊'),
  w('ship', 'ship', 'корабль', '🚢'),
  w('island', 'island', 'остров', '🏝️'),
  w('crab', 'crab', 'краб', '🦀'),
  w('shell', 'shell', 'ракушка', '🐚'),

  // Грамматика: to be
  w('tired', 'tired', 'уставший', '😫'),
  w('hungry', 'hungry', 'голодный', '🤤'),
  w('angry', 'angry', 'сердитый', '😠'),
  w('scared', 'scared', 'испуганный', '😱'),
  w('ill', 'ill', 'больной', '🤒'),
  w('hot', 'hot', 'жарко', '🥵'),
  w('cold', 'cold', 'холодно', '🥶'),
  w('wet', 'wet', 'мокрый', '💦'),
  w('friends', 'friends', 'друзья', '🤝'),
  w('kind', 'kind', 'добрый', '🤗'),
  w('clever', 'clever', 'умный', '🧠'),
  w('strong', 'strong', 'сильный', '💪'),

  // Грамматика: like
  w('carrot', 'carrot', 'морковка', '🥕'),
  w('tomato', 'tomato', 'помидор', '🍅'),
  w('honey', 'honey', 'мёд', '🍯'),
  w('chocolate', 'chocolate', 'шоколад', '🍫'),
  w('popcorn', 'popcorn', 'попкорн', '🍿'),
  w('cookie', 'cookie', 'печенье', '🍪'),
  w('lemon', 'lemon', 'лимон', '🍋'),
  w('nuts', 'nuts', 'орехи', '🥜'),
  w('music', 'music', 'музыка', '🎶'),
  w('cartoons', 'cartoons', 'мультики', '📺'),
  w('snow', 'snow', 'снег', '❄️'),
  w('spiders', 'spiders', 'пауки', '🕷️'),

  // Грамматика: множественное число
  w('cats', 'cats', 'кошки', '🐱🐱'),
  w('dogs', 'dogs', 'собаки', '🐶🐶'),
  w('apples', 'apples', 'яблоки', '🍎🍎'),
  w('books', 'books', 'книги', '📕📕'),
  w('boxes', 'boxes', 'коробки', '📦📦'),
  w('buses', 'buses', 'автобусы', '🚌🚌'),
  w('foxes', 'foxes', 'лисы', '🦊🦊'),
  w('dresses', 'dresses', 'платья', '👗👗'),
  w('mice', 'mice', 'мышки', '🐭🐭'),
  w('children', 'children', 'дети', '🧒🧒'),
  w('feet', 'feet', 'ступни', '🦶🦶'),
  w('teeth', 'teeth', 'зубы', '🦷🦷'),

  // Грамматика: a / an / the
  w('owl', 'owl', 'сова', '🦉'),
  w('octopus', 'octopus', 'осьминог', '🐙'),
  w('lion', 'lion', 'лев', '🦁'),
  w('unicorn', 'unicorn', 'единорог', '🦄'),
  w('moon', 'moon', 'луна', '🌙'),
  w('star', 'star', 'звезда', '⭐'),
  w('planet', 'planet', 'планета', '🪐'),
  w('rocket', 'rocket', 'ракета', '🚀'),
  w('present', 'present', 'подарок', '🎁'),
  w('letter', 'letter', 'письмо', '✉️'),
  w('card', 'card', 'открытка', '💌'),
  w('key', 'key', 'ключ', '🔑'),

  // Грамматика: this / that / these / those
  w('telescope', 'telescope', 'телескоп', '🔭'),
  w('castle', 'castle', 'замок', '🏰'),
  w('boat', 'boat', 'лодка', '⛵'),
  w('bridge', 'bridge', 'мост', '🌉'),
  w('balloons', 'balloons', 'шарики', '🎈'),
  w('clouds', 'clouds', 'облака', '☁️'),
  w('flowers', 'flowers', 'цветы', '🌸🌸'),
  w('leaves', 'leaves', 'листья', '🍂'),
  w('glasses', 'glasses', 'очки', '👓'),
  w('gloves', 'gloves', 'перчатки', '🧤'),
  w('scarf', 'scarf', 'шарф', '🧣'),
  w('boots', 'boots', 'сапоги', '👢'),

  // Грамматика: have got / has got
  w('clown', 'clown', 'клоун', '🤡'),
  w('drum', 'drum', 'барабан', '🥁'),
  w('wand', 'wand', 'волшебная палочка', '🪄'),
  w('ticket', 'ticket', 'билет', '🎟️'),
  w('tiger', 'tiger', 'тигр', '🐯'),
  w('monkey', 'monkey', 'обезьянка', '🐒'),
  w('juggler', 'juggler', 'жонглёр', '🤹'),
  w('tent', 'tent', 'шатёр', '🎪'),
  w('lollipop', 'lollipop', 'леденец', '🍭'),
  w('mask', 'mask', 'маска', '🎭'),
  w('crown', 'crown', 'корона', '👑'),
  w('magician', 'magician', 'фокусник', '🧙'),

  // Грамматика: whose + my/your/his/her/its/our/their
  w('phone', 'phone', 'телефон', '📱'),
  w('watch', 'watch', 'наручные часы', '⌚'),
  w('purse', 'purse', 'кошелёк', '👛'),
  w('ring', 'ring', 'кольцо', '💍'),
  w('guitar', 'guitar', 'гитара', '🎸'),
  w('skateboard', 'skateboard', 'скейтборд', '🛹'),
  w('bone', 'bone', 'косточка', '🦴'),
  w('cap', 'cap', 'кепка', '🧢'),
  w('kitten', 'kitten', 'котёнок', '🐈'),
  w('puppy', 'puppy', 'щенок', '🐕'),
  w('toys', 'toys', 'игрушки', '🧸'),
  w('room', 'room', 'комната', '🛏️'),

  // Грамматика: can
  w('skate', 'skate', 'кататься на коньках', '⛸️'),
  w('ski', 'ski', 'кататься на лыжах', '🎿'),
  w('surf', 'surf', 'сёрфить', '🏄'),
  w('row', 'row', 'грести', '🚣'),
  w('dive', 'dive', 'нырять', '🤿'),
  w('kick', 'kick', 'пинать', '🦵'),
  w('write', 'write', 'писать', '✍️'),
  w('count', 'count', 'считать', '🧮'),
  w('build', 'build', 'строить', '🏗️'),
  w('sew', 'sew', 'шить', '🧵'),
  w('knit', 'knit', 'вязать', '🧶'),
  w('bake', 'bake', 'печь', '🧁'),

  // Грамматика: Present Continuous
  w('laughing', 'laughing', 'смеётся', '😂'),
  w('crying', 'crying', 'плачет', '😭'),
  w('waving', 'waving', 'машет', '👋'),
  w('sleeping', 'sleeping', 'спит', '💤'),
  w('brushing', 'brushing', 'чистит', '🪥'),
  w('washing', 'washing', 'моет', '🧼'),
  w('digging', 'digging', 'копает', '⛏️'),
  w('shopping', 'shopping', 'ходит по магазинам', '🛒'),
  w('hiding', 'hiding', 'прячется', '🫣'),
  w('smiling', 'smiling', 'улыбается', '😃'),
  w('jumping', 'jumping', 'прыгает', '🦘'),
  w('singing', 'singing', 'поёт', '🎙️'),
];

export const WORD_BY_ID: Record<string, Word> = Object.fromEntries(WORDS.map((x) => [x.id, x]));

let customIds: string[] = [];

/** Регистрирует слова из тем родителя (старые пользовательские слова удаляются) */
export function setCustomWords(words: Word[]) {
  customIds.forEach((id) => delete WORD_BY_ID[id]);
  words.forEach((w) => (WORD_BY_ID[w.id] = w));
  customIds = words.map((w) => w.id);
}

export function hasWord(id: string): boolean {
  return id in WORD_BY_ID;
}

export function findBuiltinByEn(en: string): Word | undefined {
  const key = en.trim().toLowerCase();
  return WORDS.find((w) => w.en.toLowerCase() === key);
}

export function getWord(id: string): Word {
  const word = WORD_BY_ID[id];
  if (!word) throw new Error(`Unknown word id: ${id}`);
  return word;
}
