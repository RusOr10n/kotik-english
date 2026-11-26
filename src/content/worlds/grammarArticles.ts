import type { World } from '../types';
import { g, p } from './_helpers';

export const grammarArticles: World = {
  id: 'articles',
  name: 'Почта A-An-The',
  pic: '📮',
  story: 'Котик работает почтальоном. Каждой посылке нужен свой маленький помощник — артикль a, an или the.',
  bg: 'linear-gradient(160deg, #eef6ff 0%, #cfe2ff 100%)',
  accent: '#3f6fd8',
  decor: ['📮', '✉️', '📦', '🏷️', '📬', '🚲'],
  lessons: [
    {
      id: 'articles-1',
      title: 'A или an?',
      words: ['owl', 'octopus', 'lion', 'unicorn'],
      rule: [
        'A и an значат «один, какой-то». Ставим перед одним предметом.',
        'Перед гласным звуком — an: an owl, an apple, an octopus.',
        'Перед согласным звуком — a: a lion, a cat.',
        'Хитрость: a unicorn — слово звучит как «юникорн», начинается со звука «й».',
      ],
      phrases: [
        g('It is an owl.', 'Это сова.', 'an', ['a', 'an']),
        g('It is a lion.', 'Это лев.', 'a', ['a', 'an']),
        g('I have an apple.', 'У меня есть яблоко.', 'an', ['a', 'an']),
        g('This is a unicorn.', 'Это единорог.', 'a', ['a', 'an']),
        p('An octopus is in the sea.', 'Осьминог в море.'),
      ],
    },
    {
      id: 'articles-2',
      title: 'The — тот самый',
      words: ['moon', 'star', 'planet', 'rocket'],
      rule: [
        'The ставим, когда понятно, о каком именно предмете речь, или он единственный.',
        'The sun is hot. — Солнце жаркое. (солнце одно)',
        'Look at the moon! — Посмотри на луну!',
        'I see a star. The star is big. — Сначала «какая-то звезда», потом «та самая».',
      ],
      phrases: [
        g('Look at the moon!', 'Посмотри на луну!', 'the', ['a', 'an', 'the']),
        g('The sun is hot.', 'Солнце жаркое.', 'The', ['A', 'An', 'The']),
        g('I see a rocket. The rocket is big.', 'Я вижу ракету. Ракета большая.', 'The', ['A', 'The']),
        p('Open the door, please.', 'Открой дверь, пожалуйста.'),
      ],
      minigame: true,
    },
    {
      id: 'articles-3',
      title: 'A или the?',
      words: ['present', 'letter', 'card', 'key'],
      rule: [
        'Первый раз говорим a, второй раз — the.',
        'I have a present. The present is for you. — У меня есть подарок. Этот подарок для тебя.',
        'Where is the key? — Где ключ? (мы знаем, какой именно)',
      ],
      phrases: [
        g('I have a present. The present is for you.', 'У меня есть подарок. Подарок для тебя.', 'The', ['A', 'The']),
        g('This is a key.', 'Это ключ.', 'a', ['a', 'an', 'the']),
        g('Where is the letter?', 'Где письмо?', 'the', ['a', 'the']),
        p('I have a card for Mum.', 'У меня есть открытка для мамы.'),
      ],
      minigame: true,
    },
  ],
  boss: {
    name: 'Лебедь Посылкин',
    pic: '🦢',
    story: 'Лебедь Посылкин перепутал все адреса на посылках! Расставь артикли правильно.',
    winText: 'Все посылки доставлены! Посылкин вручил котику медаль лучшего почтальона.',
    hp: 7,
  },
  friend: { name: 'Марка', fur: 'sky', accessories: { hat: 'cap' } },
};
