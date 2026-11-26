import { useMemo } from 'react';
import { getWord } from '../content/words';
import { findLesson, WORLDS, wordsUpToWorld } from '../content/worlds';
import { buildLesson } from '../engine/lessonBuilder';
import { starsFor } from '../engine/scoring';
import { useGame } from '../state/store';
import type { Nav } from '../App';
import { ExerciseRunner } from './ExerciseRunner';

export function LessonPlay({ lessonId, nav }: { lessonId: string; nav: Nav }) {
  const { lesson, world } = findLesson(lessonId);
  const finishLesson = useGame((s) => s.finishLesson);
  const alreadyDone = useGame((s) => !!s.lessonStars[lessonId]);
  // читаем один раз при входе: дальше сессию обновляет сам ExerciseRunner
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const resume = useMemo(() => useGame.getState().savedSessions[lessonId], [lessonId]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const exercises = useMemo(() => buildLesson(lesson, wordsUpToWorld(world.id)), [lessonId]);
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
