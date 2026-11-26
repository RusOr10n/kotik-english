import type { World } from '../types';
import { g, p } from './_helpers';

export const grammarThisThat: World = {
  id: 'thisthat',
  name: 'Башня This-That',
  pic: '🔭',
  story: 'С высокой башни видно и то, что рядом, и то, что далеко. Учимся показывать: this, that, these, those.',
  bg: 'linear-gradient(160deg, #e8f7ff 0%, #b9e3f7 100%)',
  accent: '#1f86b8',
  decor: ['🔭', '🌄', '🏔️', '🛩️', '🌤️', '🗺️'],
  lessons: [
    {
      id: 'thisthat-1',
      title: 'This и that',
      words: ['telescope', 'castle', 'boat', 'bridge'],
      rule: [
        'This — этот (рядом, можно потрогать). That — тот (далеко, вон там).',
        'This is my telescope. — Это мой телескоп (у меня в руках).',
        'That is a castle. — Вон там замок.',
      ],
      phrases: [
        g('This is my telescope.', 'Это мой телескоп (он рядом).', 'This', ['This', 'That']),
        g('That is a castle.', 'Вон там замок (он далеко).', 'That', ['This', 'That']),
        g('Is this a boat?', 'Это лодка (рядом)?', 'this', ['this', 'these']),
        p('That bridge is long.', 'Тот мост длинный.'),
      ],
    },
    {
      id: 'thisthat-2',
      title: 'These и those',
      words: ['balloons', 'clouds', 'flowers', 'leaves'],
      rule: [
        'Для многих предметов: these — эти (рядом), those — те (далеко).',
        'These are my balloons. — Это мои шарики (рядом).',
        'Those are clouds. — Вон там облака.',
      ],
      phrases: [
        g('These are my balloons.', 'Это мои шарики (они рядом).', 'These', ['These', 'Those']),
        g('Those are clouds.', 'Вон там облака (они далеко).', 'Those', ['These', 'Those']),
        g('Are these flowers for me?', 'Эти цветы мне?', 'these', ['this', 'these']),
        p('Those leaves are yellow.', 'Те листья жёлтые.'),
      ],
      minigame: true,
    },
    {
      id: 'thisthat-3',
      title: 'Все четыре',
      words: ['glasses', 'gloves', 'scarf', 'boots'],
      rule: [
        'Один предмет: this (рядом), that (далеко).',
        'Много предметов: these (рядом), those (далеко).',
        'This scarf is red. These gloves are warm.',
        'That hat is funny. Those boots are big.',
      ],
      phrases: [
        g('This scarf is red.', 'Этот шарф красный.', 'This', ['This', 'These']),
        g('These gloves are warm.', 'Эти перчатки тёплые.', 'These', ['This', 'These']),
        g('That hat is funny.', 'Та шляпа смешная.', 'That', ['That', 'Those']),
        g('Those boots are big.', 'Те сапоги большие.', 'Those', ['That', 'Those']),
        p('Are these your glasses?', 'Это твои очки?'),
      ],
      minigame: true,
    },
  ],
  boss: {
    name: 'Орёл Дальнозор',
    pic: '🦅',
    story: 'Орёл Дальнозор путает, что близко, а что далеко! Помоги ему разобраться.',
    winText: 'Дальнозор теперь видит всё правильно и катает котика над облаками!',
    hp: 7,
  },
  friend: { name: 'Тучка', fur: 'silver', accessories: { glasses: 'round' } },
};
