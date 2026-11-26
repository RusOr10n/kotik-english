import type { World } from '../types';
import { g, p } from './_helpers';

export const grammarPlurals: World = {
  id: 'plurals',
  name: 'Город Много-Много',
  pic: '👯',
  story: 'Здесь всего много: одна кошка — две кошки, одна мышка — две мышки! Учимся говорить о многих предметах.',
  bg: 'linear-gradient(160deg, #e9fff6 0%, #bff0dc 100%)',
  accent: '#1f9d74',
  decor: ['🎈', '🎈', '🌼', '🌼', '⭐', '⭐'],
  lessons: [
    {
      id: 'plurals-1',
      title: 'Добавь -s',
      words: ['cats', 'dogs', 'apples', 'books'],
      rule: [
        'Чтобы предметов стало много, обычно добавляем -s.',
        'a cat — two cats',
        'a book — five books',
        'I have two cats. — У меня две кошки.',
      ],
      phrases: [
        g('I have two cats.', 'У меня две кошки.', 'cats', ['cat', 'cats']),
        p('One dog, three dogs.', 'Одна собака, три собаки.'),
        g('I see five books.', 'Я вижу пять книг.', 'books', ['book', 'books']),
        g('I want four apples.', 'Я хочу четыре яблока.', 'apples', ['apple', 'apples']),
      ],
    },
    {
      id: 'plurals-2',
      title: 'Добавь -es',
      words: ['boxes', 'buses', 'foxes', 'dresses'],
      rule: [
        'Если слово кончается на -s, -x, -sh, -ch, добавляем -es — так легче произнести.',
        'a box — two boxes',
        'a bus — three buses',
        'a dress — dresses',
      ],
      phrases: [
        g('I have two boxes.', 'У меня две коробки.', 'boxes', ['boxs', 'boxes']),
        g('Three buses are red.', 'Три автобуса красные.', 'buses', ['buss', 'buses']),
        p('The foxes are small.', 'Лисы маленькие.'),
        g('My dresses are pink.', 'Мои платья розовые.', 'dresses', ['dresss', 'dresses']),
      ],
      minigame: true,
    },
    {
      id: 'plurals-3',
      title: 'Особые слова',
      words: ['mice', 'children', 'feet', 'teeth'],
      rule: [
        'Некоторые слова — хитрецы: они меняются целиком. Их нужно просто запомнить.',
        'a mouse — two mice',
        'a child — children',
        'a foot — feet, a tooth — teeth',
        'a sheep — two sheep (не меняется!)',
      ],
      phrases: [
        g('One mouse, two mice.', 'Одна мышка, две мышки.', 'mice', ['mouses', 'mice']),
        g('The children are happy.', 'Дети весёлые.', 'children', ['childs', 'children']),
        g('I have two feet.', 'У меня две ступни.', 'feet', ['foots', 'feet']),
        g('Cats have white teeth.', 'У кошек белые зубы.', 'teeth', ['tooths', 'teeth']),
        p('The sheep are white.', 'Овечки белые.'),
      ],
      minigame: true,
    },
  ],
  boss: {
    name: 'Кролик Размножайка',
    pic: '🐇',
    story: 'Кролик Размножайка наколдовал кучу всего, но перепутал названия! Помоги ему.',
    winText: 'Размножайка сказал: «Two thumbs up!» и подарил котику две морковки.',
    hp: 7,
  },
  friend: { name: 'Двойняшки Пип и Поп', fur: 'mint', accessories: { neck: 'bowtie' } },
};
