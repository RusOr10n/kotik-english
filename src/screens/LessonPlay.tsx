import { useMemo } from 'react';
import { getWord } from '../content/words';
import { findLesson, WORLDS, wordsUpToWorld } from '../content/worlds';
import { buildLesson } from '../engine/lessonBuilder';
import { starsFor } from '../engine/scoring';
import { useGame } from '../state/store';
import type { Nav } from '../App';
import { ExerciseRunner } from './ExerciseRunner';

/** startAt — открыть сразу задание с этим номером (для прямых ссылок #/lesson/<id>/<n>) */
export function LessonPlay({ lessonId, nav, startAt }: { lessonId: string; nav: Nav; startAt?: number }) {
  const { lesson, world } = findLesson(lessonId);
  const finishLesson = useGame((s) => s.finishLesson);
  const alreadyDone = useGame((s) => !!s.lessonStars[lessonId]);
  // читаем один раз при входе: дальше сессию обновляет сам ExerciseRunner
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const saved = useMemo(() => useGame.getState().savedSessions[lessonId], [lessonId]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const exercises = useMemo(() => buildLesson(lesson, wordsUpToWorld(world.id)), [lessonId]);
  const resume = useMemo(
    () =>
      startAt === undefined
        ? saved
        : { queue: exercises, index: Math.min(startAt, exercises.length - 1), mistakes: 0, requeued: [], phase: 'play' as const, introIndex: 0, elapsedMs: 0 },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lessonId],
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const intro = useMemo(() => (alreadyDone ? undefined : lesson.words.map(getWord)), [lessonId]);

  return (
    <ExerciseRunner
      title={`${world.pic} ${lesson.title}`}
      background={world.bg}
      sessionKey={lessonId}
      exercises={exercises}
      intro={intro ?? (resume?.phase === 'intro' ? lesson.words.map(getWord) : undefined)}
      rule={lesson.rule}
      resume={resume}
      onExit={() => nav({ name: 'map', worldIndex: WORLDS.indexOf(world) })}
      onFinish={(mistakes, minutes) => {
        const stars = starsFor(mistakes);
        const { coins, bonus, streak, firstTime } = finishLesson(lessonId, stars, minutes);
        nav({
          name: 'reward',
          title: stars === 3 ? 'Идеально! 🌟' : 'Урок пройден!',
          stars,
          coins,
          bonus,
          streak,
          message:
            mistakes === 0
              ? 'Ни одной ошибки! Ты супер!'
              : stars === 3
                ? 'Всего одна ошибка — всё равно три звезды!'
                : `Ошибок: ${mistakes}. Повтори урок, чтобы собрать все звёзды!`,
          then: { name: 'map', worldIndex: WORLDS.indexOf(world), justCompleted: firstTime ? lesson.id : undefined },
          retry: { name: 'lesson', lessonId },
        });
      }}
    />
  );
}
