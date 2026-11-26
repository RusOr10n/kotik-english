import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { App } from '../../src/App';
import { ExerciseView } from '../../src/components/exercises/ExerciseView';
import { ALL_LESSONS, WORLDS, wordsUpToWorld } from '../../src/content/worlds';
import { buildLesson } from '../../src/engine/lessonBuilder';
import { seededRng } from '../../src/engine/random';
import { useGame } from '../../src/state/store';
import { AlbumScreen } from '../../src/screens/AlbumScreen';
import { BossScreen } from '../../src/screens/BossScreen';
import { LessonPlay } from '../../src/screens/LessonPlay';
import { MapScreen } from '../../src/screens/MapScreen';
import { ParentScreen } from '../../src/screens/ParentScreen';
import { RewardScreen } from '../../src/screens/RewardScreen';
import { ShopScreen } from '../../src/screens/ShopScreen';

const nav = () => {};

describe('smoke render', () => {
  it('renders onboarding when there is no profile', () => {
    useGame.getState().reset();
    expect(renderToString(<App />)).toContain('Котик и английский');
  });

  it('renders every screen with a profile', () => {
    useGame.getState().createProfile({ catName: 'Мурзик', fur: 'gray' });
    useGame.getState().recordWord('cat', false);
    useGame.getState().finishLesson('home-1', 2, 3);
    WORLDS.forEach((_, i) => expect(renderToString(<MapScreen nav={nav} worldIndex={i} />)).toContain(WORLDS[i].name));
    expect(renderToString(<LessonPlay lessonId="home-2" nav={nav} />)).toContain('Новое слово');
    WORLDS.forEach((w) => expect(renderToString(<BossScreen worldId={w.id} nav={nav} />)).toContain(w.boss.name));
    expect(renderToString(<ShopScreen nav={nav} />)).toContain('Магазин');
    expect(renderToString(<AlbumScreen nav={nav} />)).toContain('Альбом');
    expect(renderToString(<ParentScreen nav={nav} />)).toContain('Для родителей');
    expect(renderToString(<RewardScreen title="Ура" stars={3} coins={25} onMap={nav} />)).toMatch(/\+(<!-- -->)?25/);
  });

  it('renders every exercise of every lesson', () => {
    for (const { lesson, world } of ALL_LESSONS) {
      for (const ex of buildLesson(lesson, wordsUpToWorld(world.id), seededRng(3))) {
        expect(renderToString(<ExerciseView ex={ex} onDone={() => {}} />).length).toBeGreaterThan(100);
      }
    }
  });
});

describe('smoke render: new screens', () => {
  it('renders home, shop tabs and parent themes panel', async () => {
    const { HomeScreen } = await import('../../src/screens/HomeScreen');
    expect(renderToString(<HomeScreen nav={nav} />)).toContain('Домик');
    expect(renderToString(<ShopScreen nav={nav} initialTab="interior" />)).toContain('Гостиная');
    expect(renderToString(<ShopScreen nav={nav} initialTab="toy" />)).toContain('Клубок');
    // закрытая комната: товары видны, но купить пока нельзя
    const kitchen = renderToString(<ShopScreen nav={nav} initialTab="kitchen" />);
    expect(kitchen).toContain('Холодильник');
    expect(kitchen).toContain('пока закрыта');
    expect(renderToString(<HomeScreen nav={nav} initialRoom="disco" />)).toContain('Диско-комната');
    expect(renderToString(<ParentScreen nav={nav} />)).toContain('Свои темы');
  });
});

describe('smoke render: grammar', () => {
  it('grammar lesson starts with the rule card', () => {
    const html = renderToString(<LessonPlay lessonId="be-1" nav={nav} />);
    expect(html).toContain('Правило');
    expect(html).toContain('I am hungry.');
  });
});
