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
    {
      id: 'continuous-4',
      title: 'Что делает семья?',
      words: ['cooking', 'reading', 'painting', 'cleaning'],
      rule: [
        'he / she is + …ing, they / we are + …ing',
        'Mum is cooking. — Мама готовит.',
        'We are cleaning the room. — Мы убираем комнату.',
      ],
      phrases: [
        g('Mum is cooking.', 'Мама готовит.', 'is', BE),
        g('Grandpa is reading.', 'Дедушка читает.', 'reading', ['read', 'reading']),
        g('We are cleaning the room.', 'Мы убираем комнату.', 'are', BE),
        g('My sister is painting.', 'Моя сестра рисует красками.', 'painting', ['paint', 'painting']),
        p('What is Dad doing?', 'Что делает папа?'),
      ],
    },
    {
      id: 'continuous-5',
      title: 'Смотри, прямо сейчас!',
      words: ['laughing', 'waving', 'digging', 'smiling'],
      review: true,
      rule: ['Слова Look! и now подсказывают: это происходит прямо сейчас.', 'Look! The baby is laughing. — Смотри! Малыш смеётся.'],
      phrases: [
        g('Look! The baby is laughing.', 'Смотри! Малыш смеётся.', 'laughing', ['laugh', 'laughing']),
        g('They are digging now.', 'Они сейчас копают.', 'are', BE),
        g('Why are you smiling?', 'Почему ты улыбаешься?', 'smiling', ['smile', 'smiling']),
        g("I'm waving to you!", 'Я машу тебе!', 'waving', ['wave', 'waving']),
        p('The dog is digging in the garden.', 'Собака копает в саду.'),
      ],
      minigame: true,
    },
    {
      id: 'continuous-6',
      title: 'Повторяем: что ты делаешь?',
      words: ['hiding', 'singing', 'washing', 'crying'],
      review: true,
      rule: ["Да: She is singing. Нет: She isn't singing. Вопрос: Is she singing?"],
      phrases: [
        g('Is the cat hiding?', 'Кошка прячется?', 'Is', ['Is', 'Are']),
        g("No, it isn't. It's sleeping.", 'Нет. Она спит.', "isn't", ["isn't", "aren't"]),
        g('Are you singing?', 'Ты поёшь?', 'Are', ['Am', 'Is', 'Are']),
        g("We aren't crying.", 'Мы не плачем.', "aren't", ["isn't", "aren't"]),
        p('Dad is washing the dishes.', 'Папа моет посуду.'),
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
