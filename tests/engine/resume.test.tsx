import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { findLesson, wordsUpToWorld } from '../../src/content/worlds';
import { buildLesson } from '../../src/engine/lessonBuilder';
import { seededRng } from '../../src/engine/random';
import { useGame } from '../../src/state/store';
import { LessonPlay } from '../../src/screens/LessonPlay';

describe('resume unfinished lesson', () => {
  it('saves and clears a session', () => {
    useGame.getState().reset();
    const { lesson, world } = findLesson('home-1');
    const queue = buildLesson(lesson, wordsUpToWorld(world.id), seededRng(1));
    useGame.getState().saveSession('home-1', { queue, index: 5, mistakes: 1, requeued: [], phase: 'play', introIndex: 4, elapsedMs: 60000 });
    expect(useGame.getState().savedSessions['home-1'].index).toBe(5);
    useGame.getState().clearSession('home-1');
    expect(useGame.getState().savedSessions['home-1']).toBeUndefined();
  });

  it('opens the lesson on the saved exercise instead of the intro', () => {
    useGame.getState().reset();
    useGame.getState().createProfile({ catName: 'Мурзик', fur: 'gray' });
    const { lesson, world } = findLesson('home-1');
    const queue = buildLesson(lesson, wordsUpToWorld(world.id), seededRng(1));
    const typeIdx = queue.findIndex((e) => e.kind === 'sentence');
    useGame.getState().saveSession('home-1', { queue, index: typeIdx, mistakes: 0, requeued: [], phase: 'play', introIndex: 4, elapsedMs: 0 });
    const html = renderToString(<LessonPlay lessonId="home-1" nav={() => {}} />);
    expect(html).toContain('Собери фразу');
    expect(html).not.toContain('Новое слово');
  });
});
