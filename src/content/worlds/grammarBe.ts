import type { World } from '../types';
import { g, p } from './_helpers';

const BE = ['am', 'is', 'are'];
const BE_Q = ['Am', 'Is', 'Are'];
const BE_NOT = ["isn't", "aren't", 'am not'];

export const grammarBe: World = {
  id: 'be',
  name: 'Замок «To Be»',
  pic: '🏰',
  story: 'В замке живёт волшебный глагол to be. Он прячется в трёх формах: am, is, are. Научимся говорить, кто мы и какие мы!',
  bg: 'linear-gradient(160deg, #fdf1ff 0%, #e4d4ff 100%)',
  accent: '#8e5cd9',
  decor: ['🏰', '👑', '🗝️', '🕯️', '🦄', '✨'],
  lessons: [
    {
      id: 'be-1',
      title: 'I am, you are',
      words: ['tired', 'hungry', 'angry', 'scared'],
      rule: [
        'Глагол to be — это «быть, являться». По-русски его часто не говорят, а по-английски — всегда!',
        'I am hungry. — Я голодный.',
        'You are tired. — Ты устал.',
        'Запомни: I → am, you → are.',
      ],
      phrases: [
        g('I am hungry.', 'Я голодный.', 'am', BE),
        g('You are tired.', 'Ты устал.', 'are', BE),
        p('Are you scared?', 'Тебе страшно?'),
        g('Yes, I am.', 'Да.', 'am', BE),
        p('I am not angry.', 'Я не сержусь.'),
      ],
    },
    {
      id: 'be-2',
      title: 'He is, she is, it is',
      words: ['ill', 'hot', 'cold', 'wet'],
      rule: [
        'Для he (он), she (она), it (оно, предмет или животное) — форма is.',
        'He is ill. — Он болен.',
        "It isn't hot. — Не жарко. (isn't = is not)",
        'Is the cat wet? — Кошка мокрая? (в вопросе is идёт первым)',
      ],
      phrases: [
        g('He is ill.', 'Он болен.', 'is', BE),
        g('She is cold.', 'Ей холодно.', 'is', BE),
        g("It isn't hot.", 'Не жарко.', "isn't", BE_NOT),
        g('Is the cat wet?', 'Кошка мокрая?', 'Is', BE_Q),
        p("No, it isn't.", 'Нет.'),
      ],
      minigame: true,
    },
    {
      id: 'be-3',
      title: 'We are, they are',
      words: ['friends', 'kind', 'clever', 'strong'],
      rule: [
        'Для we (мы), you (вы) и they (они) — форма are.',
        'We are friends. — Мы друзья.',
        "They aren't angry. — Они не сердятся. (aren't = are not)",
        'Are we clever? — Мы умные?',
      ],
      phrases: [
        g('We are friends.', 'Мы друзья.', 'are', BE),
        g('They are strong.', 'Они сильные.', 'are', BE),
        g("They aren't angry.", 'Они не сердятся.', "aren't", BE_NOT),
        p('Are we clever?', 'Мы умные?'),
        g('Yes, we are!', 'Да!', 'are', BE),
      ],
      minigame: true,
    },
    {
      id: 'be-4',
      title: 'Am I? Is she? Are they?',
      words: ['brave', 'shy', 'busy', 'fast'],
      rule: [
        'В вопросе am / is / are выходит вперёд: She is brave. → Is she brave?',
        'Am I fast? — Я быстрый?',
        'Are they busy? — Они заняты?',
        "Короткий ответ: Yes, she is. / No, she isn't.",
      ],
      phrases: [
        g('Is she brave?', 'Она смелая?', 'Is', BE_Q),
        g('Are they busy?', 'Они заняты?', 'Are', BE_Q),
        g('Am I fast?', 'Я быстрый?', 'Am', BE_Q),
        g("No, she isn't.", 'Нет.', "isn't", BE_NOT),
        p('Is the cat shy?', 'Кошка стесняется?'),
      ],
    },
    {
      id: 'be-5',
      title: 'Все вместе',
      words: ['hungry', 'cold', 'friends', 'strong'],
      review: true,
      rule: [
        'I → am, he / she / it → is, you / we / they → are',
        "Коротко: I'm = I am, he's = he is, they're = they are",
        "They're my friends. — Они мои друзья.",
      ],
      phrases: [
        g('My mum is kind.', 'Моя мама добрая.', 'is', BE),
        g('We are hungry.', 'Мы голодные.', 'are', BE),
        g('I am cold.', 'Мне холодно.', 'am', BE),
        g('The dogs are strong.', 'Собаки сильные.', 'are', BE),
        p("They're my friends.", 'Они мои друзья.'),
      ],
      minigame: true,
    },
    {
      id: 'be-6',
      title: 'Повторяем to be',
      words: ['tired', 'ill', 'clever', 'scared'],
      review: true,
      rule: [
        'Да: He is tired. Нет: He isn\'t tired. Вопрос: Is he tired?',
        "Are you ill? — Ты болеешь?",
        "I am not scared! — Мне не страшно!",
      ],
      phrases: [
        g("He isn't tired.", 'Он не устал.', "isn't", BE_NOT),
        g('Are you ill?', 'Ты болеешь?', 'Are', BE_Q),
        g('I am not scared!', 'Мне не страшно!', 'am', BE),
        g('My sister is clever.', 'Моя сестра умная.', 'is', BE),
        p('Is it cold today?', 'Сегодня холодно?'),
      ],
      minigame: true,
    },
  ],
  boss: {
    name: 'Дракончик Ам-Ис-Ар',
    pic: '🐲',
    story: 'Дракончик перепутал все am, is и are в замке! Помоги расставить их по местам.',
    winText: 'Дракончик выучил to be и подарил котику ключ от замка!',
    hp: 6,
  },
  friend: { name: 'Зефирка', fur: 'pinky', accessories: { hat: 'crown' } },
};
