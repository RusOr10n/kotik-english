import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { speak, stopSpeech } from '../audio/speech';
import { sfx } from '../audio/sfx';
import type { Word } from '../content/types';
import { Cat, type CatMood } from '../components/cat/Cat';
import { ExerciseView, answerOf } from '../components/exercises/ExerciseView';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useIsMobile, useIsShort } from '../components/ui/useIsMobile';
import { comfort, praise } from '../components/ui/praise';
import { useKeys } from '../components/ui/useKeys';
import { type Exercise, type ExerciseResult, SELF_CORRECTING } from '../engine/exercises';
import { lessonMistakesFor } from '../engine/scoring';
import { type SavedSession, useGame } from '../state/store';
import { IntroCards } from './IntroCards';

type Props = {
  title: React.ReactNode;
  background: string;
  /** ключ для сохранения незаконченного задания */
  sessionKey: string;
  exercises: Exercise[];
  intro?: Word[];
  /** правило грамматики — показывается первой карточкой */
  rule?: string[];
  /** сохранённое состояние — продолжаем с того же места */
  resume?: SavedSession;
  onExit: () => void;
  onFinish: (mistakes: number, minutes: number) => void;
};

type Feedback = { correct: boolean; ex: Exercise; text: string };

/** Проходит список упражнений; ошибочные повторяются в конце */
export function ExerciseRunner({ title, background, sessionKey, exercises, intro, rule, resume, onExit, onFinish }: Props) {
  const recordWord = useGame((s) => s.recordWord);
  const saveSession = useGame((s) => s.saveSession);
  const clearSession = useGame((s) => s.clearSession);
  const profile = useGame((s) => s.profile);
  const equipped = useGame((s) => s.equipped);
  const [phase, setPhase] = useState<'intro' | 'play'>(resume?.phase ?? (intro?.length || rule?.length ? 'intro' : 'play'));
  const [introIndex, setIntroIndex] = useState(resume?.introIndex ?? 0);
  const [queue, setQueue] = useState(resume?.queue ?? exercises);
  const [index, setIndex] = useState(resume?.index ?? 0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [mood, setMood] = useState<CatMood>('idle');
  // на телефоне (в любой ориентации) котик сидит в верхней панели, а не внизу слева
  const narrow = useIsMobile();
  const short = useIsShort();
  const mobile = narrow || short;
  const mistakes = useRef(resume?.mistakes ?? 0);
  const requeued = useRef(new Set<string>(resume?.requeued ?? []));
  const startedAt = useRef(Date.now() - (resume?.elapsedMs ?? 0));

  useEffect(() => () => stopSpeech(), []);

  const snapshot = (atIndex: number): SavedSession => ({
    queue,
    index: atIndex,
    mistakes: mistakes.current,
    requeued: [...requeued.current],
    phase,
    introIndex,
    elapsedMs: Date.now() - startedAt.current,
  });

  // сохраняем прогресс после каждого шага
  useEffect(() => {
    saveSession(sessionKey, snapshot(index));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, introIndex, index, queue]);

  const finish = () => {
    clearSession(sessionKey);
    onFinish(mistakes.current, Math.max(1, Math.round((Date.now() - startedAt.current) / 60000)));
  };

  const exit = () => {
    if (feedback) {
      // ответ на текущее задание уже дан — при возвращении начнём со следующего
      if (index + 1 >= queue.length) {
        finish();
        return;
      }
      saveSession(sessionKey, snapshot(index + 1));
    } else {
      saveSession(sessionKey, snapshot(index));
    }
    onExit();
  };

  const ex = queue[index];

  const handleDone = (result: ExerciseResult) => {
    // закрываем клавиатуру телефона, чтобы она не закрыла кнопку «Понятно»
    (document.activeElement as HTMLElement | null)?.blur?.();
    const selfCorrecting = SELF_CORRECTING.includes(ex.kind);
    const correct = selfCorrecting || result.correct;
    if (ex.kind !== 'memory' && ex.kind !== 'catchFish' && ex.kind !== 'balloons') ex.wordIds.forEach((id) => recordWord(id, result.correct));
    mistakes.current += lessonMistakesFor(ex.kind, result);

    if (!correct && !requeued.current.has(ex.id)) {
      requeued.current.add(ex.id);
      setQueue((q) => [...q, { ...ex, id: `${ex.id}-again` }]);
    }

    const answer = answerOf(ex);
    if (correct) {
      sfx.correct();
      setMood('happy');
      if (answer && ex.kind !== 'spell') setTimeout(() => speak(answer.en), 250);
    } else {
      sfx.wrong();
      setMood('sad');
      if (answer) setTimeout(() => speak(answer.en, { slow: true }), 500);
    }
    setFeedback({ correct, ex, text: correct ? praise() : comfort() });
  };

  const next = () => {
    if (!feedback) return;
    setFeedback(null);
    setMood('idle');
    if (index + 1 >= queue.length) {
      finish();
    } else {
      setIndex(index + 1);
    }
  };

  // правильный ответ — автоматически дальше
  useEffect(() => {
    if (!feedback?.correct) return;
    const t = setTimeout(next, 1500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedback]);

  useKeys((e) => {
    if (e.key === 'Enter') next();
  }, !!feedback);

  const answer = feedback ? answerOf(feedback.ex) : null;

  return (
    <div className="screen" style={{ background }}>
      <div className="topbar">
        <button className="btn white icon" onClick={exit} title="Выйти на карту (прогресс сохранится)">
          ✕
        </button>
        <span className="hide-mobile" style={{ fontWeight: 900, fontSize: 20, whiteSpace: 'nowrap' }}>{title}</span>
        {phase === 'play' && <ProgressBar value={index / queue.length} />}
        {/* на телефоне котик сидит в верхней панели, чтобы не закрывать задание */}
        {phase === 'play' && mobile && (
          <div style={{ width: 46, height: 46, overflow: 'visible', flexShrink: 0, marginTop: -6 }}>
            <Cat fur={profile?.fur ?? 'ginger'} accessories={equipped} mood={mood} size={44} onClick={() => sfx.meow()} />
          </div>
        )}
      </div>

      {phase === 'intro' && (intro?.length || rule?.length) ? (
        <IntroCards words={intro ?? []} rule={rule} startIndex={introIndex} onIndexChange={setIntroIndex} onDone={() => setPhase('play')} />
      ) : (
        <div className="grow scroll" style={{ display: 'flex', flexDirection: 'column', paddingBottom: short ? 6 : mobile ? 12 : feedback ? 24 : 110 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={ex.id}
              className="exercise-wrap"
              style={{ margin: 'auto 0' }}
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -80 }}
              transition={{ duration: 0.25 }}
            >
              <ExerciseView ex={ex} onDone={handleDone} />
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {phase === 'play' && !mobile && (
        <div className="runner-cat" style={{ position: 'absolute', left: 12, bottom: feedback ? 96 : 10, transition: 'bottom 0.3s', zIndex: 21 }}>
          <Cat fur={profile?.fur ?? 'ginger'} accessories={equipped} mood={mood} size={110} onClick={() => sfx.meow()} />
        </div>
      )}

      <AnimatePresence>
        {feedback && (
          <motion.div
            className={`feedback ${feedback.correct ? 'good' : 'bad'}`}
            initial={{ y: 140 }}
            animate={{ y: 0 }}
            exit={{ y: 140 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            style={{ paddingLeft: mobile ? undefined : 150, paddingBottom: 'max(22px, env(safe-area-inset-bottom))' }}
          >
            <div className="col grow">
              <span>{feedback.text}</span>
              {answer && (
                <span className="ru-answer">
                  {feedback.correct ? '' : 'Правильно: '}
                  <b>{answer.en}</b> — {answer.ru}
                </span>
              )}
            </div>
            <button className={`btn ${feedback.correct ? 'good' : ''}`} onClick={next}>
              {feedback.correct ? 'Дальше' : 'Понятно'} ⏎
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
