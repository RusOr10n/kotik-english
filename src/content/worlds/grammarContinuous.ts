import type { World } from '../types';
import { g, p } from './_helpers';

const BE = ['am', 'is', 'are'];

export const grammarContinuous: World = {
  id: 'continuous',
  name: 'Парк «Прямо сейчас»',
  pic: '⏰',
  story: 'Что все делают прямо сейчас? Учимся Present Continuous: am / is / are + глагол с -ing.',
  bg: 'linear-gradient(160deg, #fffbe3 0%, #ffe9a6 100%)',
  accent: '#d39a00',
  decor: ['⏰', '🌳', '🛝', '🎠', '🪁', '🌻'],
  lessons: [
    {
      id: 'continuous-1',
      title: 'Я делаю сейчас',
      words: ['laughing', 'crying', 'waving', 'sleeping'],
      rule: [
        'Когда что-то происходит прямо сейчас: am / is / are + глагол с окончанием -ing.',
        'I am laughing. — Я смеюсь (сейчас).',
        'The baby is crying. — Малыш плачет.',
        'We are waving. — Мы машем.',
      ],
      phrases: [
        g('I am laughing.', 'Я смеюсь.', 'am', BE),
        g('The baby is crying.', 'Малыш плачет.', 'is', BE),
        g('We are waving.', 'Мы машем.', 'are', BE),
        p('Dad is sleeping.', 'Папа спит.'),
      ],
    },
    {
      id: 'continuous-2',
      title: 'Добавь -ing',
      words: ['brushing', 'washing', 'digging', 'shopping'],
      rule: [
        'Обычно просто добавляем -ing: brush → brushing, wash → washing.',
        'Короткие слова удваивают последнюю букву: dig → digging, shop → shopping, swim → swimming.',
        'Буква -e убегает: dance → dancing, ride → riding.',
      ],
      phrases: [
        g('She is brushing her teeth.', 'Она чистит зубы.', 'brushing', ['brush', 'brushing']),
        g('He is washing the car.', 'Он моет машину.', 'washing', ['wash', 'washing']),
        p('They are digging.', 'Они копают.'),
        g('Mum is shopping.', 'Мама ходит по магазинам.', 'shopping', ['shoping', 'shopping']),
      ],
      minigame: true,
    },
    {
      id: 'continuous-3',
      title: 'Вопросы и «не»',
      words: ['hiding', 'smiling', 'jumping', 'singing'],
      rule: [
        'Вопрос: am / is / are идёт первым. Are you hiding? — Ты прячешься?',
        "Отрицание: добавляем not. I am not singing. He isn't jumping.",
        'What are you doing? — Что ты делаешь?',
      ],
      phrases: [
        g('Are you hiding?', 'Ты прячешься?', 'Are', ['Am', 'Is', 'Are']),
        g('Is she smiling?', 'Она улыбается?', 'Is', ['Is', 'Are']),
        p('I am not singing.', 'Я не пою.'),
        g("The kangaroo isn't jumping.", 'Кенгуру не прыгает.', "isn't", ["isn't", "aren't"]),
        p('What are you doing?', 'Что ты делаешь?'),
      ],
      minigame: true,
    },
  ],
  boss: {
    name: 'Ленивец Сплюш',
    pic: '🦥',
    story: 'Ленивец Сплюш всё время спит и не знает, что происходит вокруг! Расскажи ему, кто что делает.',
    winText: 'Сплюш проснулся и сказал: «I am dancing!» — и правда пустился в пляс!',
    hp: 9,
  },
  friend: { name: 'Солнышко', fur: 'lemon', accessories: { glasses: 'sun', hat: 'flower' } },
};
