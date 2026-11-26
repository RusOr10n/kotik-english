import { useEffect, useMemo } from 'react';
import { hasWord } from '../content/words';
import { buildReview } from '../engine/lessonBuilder';
import { dayNumber, wordsForReview } from '../engine/srs';
import { useGame } from '../state/store';
import type { Nav } from '../App';
import { ExerciseRunner } from './ExerciseRunner';

export function ReviewPlay({ nav }: { nav: Nav }) {
  const finishReview = useGame((s) => s.finishReview);
  const resume = useMemo(() => useGame.getState().savedSessions.review, []);
  const exercises = useMemo(() => {
    if (resume) return resume.queue;
    const srs = useGame.getState().srs;
    const known = Object.keys(srs).filter(hasWord);
    return buildReview(wordsForReview(srs, dayNumber(), 8).filter(hasWord), known);
  }, []);

  useEffect(() => {
    if (!exercises.length) nav({ name: 'map' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!exercises.length) return null;

  return (
    <ExerciseRunner
      title="🔁 Повторение"
      background="linear-gradient(160deg, #e9f7ff 0%, #f3e8ff 100%)"
      sessionKey="review"
      exercises={exercises}
      resume={resume}
      onExit={() => nav({ name: 'map' })}
      onFinish={(_mistakes, minutes) => {
        const { coins, bonus, streak } = finishReview(minutes);
        nav({ name: 'reward', title: 'Повторение — мать учения!', coins, bonus, streak, message: 'Котик запомнил слова ещё лучше. Приходи завтра!', then: { name: 'map' } });
      }}
    />
  );
}
