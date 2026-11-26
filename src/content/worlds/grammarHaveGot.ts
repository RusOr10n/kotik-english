import type { World } from '../types';
import { g, p } from './_helpers';

const HAVE = ['have', 'has'];
const HAVE_NOT = ["haven't", "hasn't"];

export const grammarHaveGot: World = {
  id: 'havegot',
  name: 'Цирк Have Got',
  pic: '🎪',
  story: 'В цирке у каждого артиста что-то есть: у клоуна — нос, у фокусника — палочка. Учимся говорить «у меня есть».',
  bg: 'linear-gradient(160deg, #fff0f0 0%, #ffc9c9 100%)',
  accent: '#d93f3f',
  decor: ['🎪', '🎠', '🎡', '🎯', '🎊', '🥁'],
  lessons: [
    {
      id: 'havegot-1',
      title: 'I have got',
      words: ['clown', 'drum', 'wand', 'ticket'],
      rule: [
        'Have got — «у меня есть». Для I, you, we, they — have got.',
        'I have got a ticket. — У меня есть билет.',
        "I haven't got a wand. — У меня нет палочки. (haven't = have not)",
      ],
      phrases: [
        g('I have got a ticket.', 'У меня есть билет.', 'have', HAVE),
        g('We have got a drum.', 'У нас есть барабан.', 'have', HAVE),
        p('They have got red noses.', 'У них красные носы.'),
        g("I haven't got a wand.", 'У меня нет волшебной палочки.', "haven't", HAVE_NOT),
      ],
    },
    {
      id: 'havegot-2',
      title: 'He has got',
      words: ['tiger', 'monkey', 'juggler', 'tent'],
      rule: [
        'Для he, she, it — has got.',
        'The monkey has got a banana. — У обезьянки есть банан.',
        "She hasn't got a hat. — У неё нет шляпы. (hasn't = has not)",
      ],
      phrases: [
        g('The clown has got a big nose.', 'У клоуна большой нос.', 'has', HAVE),
        g('The monkey has got a banana.', 'У обезьянки есть банан.', 'has', HAVE),
        g("She hasn't got a hat.", 'У неё нет шляпы.', "hasn't", HAVE_NOT),
        p('The tiger has got stripes.', 'У тигра есть полоски.'),
      ],
      minigame: true,
    },
    {
      id: 'havegot-3',
      title: 'Have you got…?',
      words: ['lollipop', 'mask', 'crown', 'magician'],
      rule: [
        'В вопросе have или has идёт первым, а got остаётся.',
        'Have you got a crown? — У тебя есть корона?',
        "Yes, I have. / No, I haven't.",
        "Has he got a mask? — Yes, he has. / No, he hasn't.",
      ],
      phrases: [
        g('Have you got a crown?', 'У тебя есть корона?', 'Have', ['Have', 'Has']),
        g('Yes, I have.', 'Да.', 'have', HAVE),
        g('Has he got a mask?', 'У него есть маска?', 'Has', ['Have', 'Has']),
        g("No, he hasn't.", 'Нет.', "hasn't", HAVE_NOT),
        p('Has the magician got a lollipop?', 'У фокусника есть леденец?'),
      ],
      minigame: true,
    },
  ],
  boss: {
    name: 'Тюлень-Жонглёр',
    pic: '🦭',
    story: 'Тюлень-Жонглёр подбрасывает слова have и has и всё роняет! Поймай правильные.',
    winText: 'Тюлень поклонился и подарил котику билет в первый ряд!',
    hp: 8,
  },
  friend: { name: 'Кнопка', fur: 'peach', accessories: { neck: 'bow', hat: 'party' } },
};
