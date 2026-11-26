import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { speak, stopSpeech } from '../audio/speech';
import { sfx } from '../audio/sfx';
import { Cat, type CatMood } from '../components/cat/Cat';
import { ExerciseView, answerOf } from '../components/exercises/ExerciseView';
import { celebrate } from '../components/ui/confetti';
import { Pic } from '../components/ui/Pic';
import { comfort, praise } from '../components/ui/praise';
import { useIsMobile } from '../components/ui/useIsMobile';
import { useKeys } from '../components/ui/useKeys';
import { WORLDS, findWorld, wordsUpToWorld, worldWords } from '../content/worlds';
import type { ExerciseResult } from '../engine/exercises';
import { buildBossQuestions } from '../engine/lessonBuilder';
import { useGame } from '../state/store';
import type { Nav } from '../App';

const MAX_HEARTS = 3;

export function BossScreen({ worldId, nav }: { worldId: string; nav: Nav }) {
  const world = findWorld(worldId);
  const boss = world.boss;
  const { profile, equipped, recordWord, defeatBoss } = useGame();
  const [attempt, setAttempt] = useState(0);
  const questions = useMemo(
    () => buildBossQuestions(worldWords(world), world.lessons.flatMap((l) => l.phrases), wordsUpToWorld(world.id), 40),
    // новая подборка при каждой попытке
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [world, attempt],
  );
  const [phase, setPhase] = useState<'intro' | 'fight' | 'win' | 'lose'>('intro');
  const [q, setQ] = useState(0);
  const [hp, setHp] = useState(boss.hp);
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [feedback, setFeedback] = useState<{ correct: boolean; text: string } | null>(null);
  const [projectile, setProjectile] = useState<'toBoss' | 'toCat' | null>(null);
  const [catMood, setCatMood] = useState<CatMood>('idle');
  const [reward, setReward] = useState({ coins: 0, bonus: 0, streak: 1 });
  const bossAnim = useAnimation();
  const mobile = useIsMobile();
  const startedAt = useRef(Date.now());

  useEffect(() => () => stopSpeech(), []);

  const ex = questions[q % questions.length];

  const restart = () => {
    setAttempt((a) => a + 1);
    setQ(0);
    setHp(boss.hp);
    setHearts(MAX_HEARTS);
    setFeedback(null);
    setCatMood('idle');
    setPhase('fight');
  };

  const handleDone = (result: ExerciseResult) => {
    ex.wordIds.forEach((id) => recordWord(id, result.correct));
    const answer = answerOf(ex);
    if (result.correct) {
      setCatMood('happy');
      setProjectile('toBoss');
      setHp((h) => h - 1);
      sfx.correct();
      if (answer) setTimeout(() => speak(answer.en), 200);
      setTimeout(() => {
        sfx.hit();
        setProjectile(null);
        void bossAnim.start({ x: [0, 18, -14, 10, 0], rotate: [0, 12, -8, 0], transition: { duration: 0.5 } });
      }, 550);
    } else {
      setCatMood('sad');
      setProjectile('toCat');
      setHearts((h) => h - 1);
      sfx.wrong();
      if (answer) setTimeout(() => speak(answer.en, { slow: true }), 600);
      setTimeout(() => setProjectile(null), 550);
    }
    setFeedback({ correct: result.correct, text: result.correct ? praise() : comfort() });
  };

  const next = () => {
    if (!feedback) return;
    setFeedback(null);
    setCatMood('idle');
    if (hp <= 0) {
      setReward(defeatBoss(world.id, Math.max(1, Math.round((Date.now() - startedAt.current) / 60000))));
      setPhase('win');
      sfx.fanfare();
      celebrate(true);
      setTimeout(() => speak('You win! Hooray!'), 500);
    } else if (hearts <= 0) {
      setPhase('lose');
    } else {
      setQ(q + 1);
    }
  };

  useEffect(() => {
    if (!feedback?.correct) return;
    const t = setTimeout(next, 1400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedback]);

  useKeys((e) => {
    if (e.key !== 'Enter') return;
    if (phase === 'intro') setPhase('fight');
    else if (feedback) next();
  }, phase === 'intro' || !!feedback);

  const fur = profile?.fur ?? 'ginger';
  const answer = feedback ? answerOf(ex) : null;

  if (phase === 'intro' || phase === 'lose') {
    return (
      <div className="screen center" style={{ background: 'linear-gradient(160deg, #3b2e5a, #6b3f7a)' }}>
        <div className="col center gap-24" style={{ color: '#fff', padding: '0 16px', textAlign: 'center' }}>
          <div className="row gap-24" style={{ alignItems: 'flex-end' }}>
            <Cat fur={fur} accessories={equipped} mood={phase === 'lose' ? 'sad' : 'think'} size={mobile ? 120 : 170} />
            <motion.div animate={{ y: [0, -20, 0], rotate: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 1.2 }}>
              <Pic pic={boss.pic} size={mobile ? 100 : 150} />
            </motion.div>
          </div>
          <h1 className="title">{phase === 'lose' ? 'Не сдавайся! 💪' : boss.name}</h1>
          <div className="subtitle" style={{ color: '#f1e6ff', maxWidth: 560, textAlign: 'center' }}>
            {phase === 'lose' ? `${boss.name} оказался хитрым. Попробуй ещё раз — у тебя обязательно получится!` : boss.story}
          </div>
          <div className="subtitle" style={{ color: '#d7c6ff', fontSize: 17 }}>
            Правильный ответ — удар по боссу. Ошибка — котик теряет сердечко. У тебя {MAX_HEARTS} ❤️
          </div>
          <div className="row gap-16">
            <button className="btn white" onClick={() => nav({ name: 'map' })}>На карту</button>
            <button className="btn" onClick={phase === 'lose' ? restart : () => setPhase('fight')}>
              {phase === 'lose' ? '🔁 Ещё раз' : '⚔️ В бой!'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'win') {
    return (
      <div className="screen center" style={{ background: 'radial-gradient(circle at 50% 40%, #fff6d6 0%, #ffd6e6 60%, #e8d9ff 100%)' }}>
        <div className="col center gap-16" style={{ padding: '0 16px', textAlign: 'center' }}>
          <motion.h1 className="title" initial={{ scale: 0 }} animate={{ scale: 1 }}>Победа! 🎉</motion.h1>
          <div className="subtitle">{boss.winText}</div>
          <div className="row gap-24" style={{ alignItems: 'flex-end' }}>
            <Cat fur={fur} accessories={equipped} mood="happy" size={mobile ? 110 : 170} />
            <motion.div className="col center gap-8" initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.8, type: 'spring' }}>
              <div className="bubble">Новый друг: {world.friend.name}!</div>
              <Cat fur={world.friend.fur} accessories={world.friend.accessories} mood="happy" size={mobile ? 100 : 150} />
            </motion.div>
          </div>
          <div className="pill" style={{ fontSize: 30 }}>🪙 +{reward.coins}</div>
          {reward.bonus > 0 && (
            <div className="pill" style={{ fontSize: 20, background: '#fff4c4' }}>
              🎁 Ежедневный бонус: +{reward.bonus} 🪙 {reward.streak > 1 ? `(${reward.streak} дн. подряд)` : ''}
            </div>
          )}
          <button
            className="btn good"
            // после основного мира — на следующий мир, после темы родителя — обратно в неё
            onClick={() => nav({ name: 'map', worldIndex: world.custom ? WORLDS.indexOf(world) : undefined })}
          >
            На карту 🗺️
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen" style={{ background: 'linear-gradient(180deg, #3b2e5a 0px, #6b3f7a 230px, #fff7ef 230px)' }}>
      <div className="topbar">
        <button className="btn white icon" onClick={() => nav({ name: 'map' })}>✕</button>
        <span style={{ color: '#fff', fontWeight: 900, fontSize: mobile ? 16 : 20 }}>⚔️ {mobile ? boss.name : `Битва с боссом: ${boss.name}`}</span>
      </div>

      {/* арена */}
      <div style={{ position: 'relative', height: 160, margin: '0 clamp(12px, 5vw, 60px)' }}>
        <div className="col center" style={{ position: 'absolute', left: 0, bottom: 0 }}>
          <div className="row" style={{ gap: 2 }}>
            {[...Array(MAX_HEARTS)].map((_, i) => (
              <motion.span key={i} className="pic" style={{ fontSize: 26 }} animate={i >= hearts ? { scale: [1.5, 0.8], opacity: 0.3 } : {}}>
                {i < hearts ? '❤️' : '🤍'}
              </motion.span>
            ))}
          </div>
          <Cat fur={fur} accessories={equipped} mood={catMood} size={105} />
        </div>

        <div className="col center" style={{ position: 'absolute', right: 0, bottom: 8 }}>
          <div style={{ width: 'min(170px, 34vw)', height: 18, background: 'rgba(255,255,255,0.3)', borderRadius: 9, overflow: 'hidden', marginBottom: 6 }}>
            <motion.div style={{ height: '100%', background: 'linear-gradient(90deg,#ff6a88,#ff9a8b)' }} animate={{ width: `${(Math.max(0, hp) / boss.hp) * 100}%` }} />
          </div>
          <motion.div animate={bossAnim}>
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              <Pic pic={boss.pic} size={100} />
            </motion.div>
          </motion.div>
        </div>

        <AnimatePresence>
          {projectile && (
            <motion.span
              key={projectile}
              className="pic"
              style={{ position: 'absolute', top: 40, fontSize: 44 }}
              initial={{ left: projectile === 'toBoss' ? '10%' : '85%', rotate: 0 }}
              animate={{ left: projectile === 'toBoss' ? '85%' : '10%', rotate: 720, top: [40, -10, 40] }}
              exit={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.55, ease: 'easeIn' }}
            >
              {projectile === 'toBoss' ? '🧶' : '💥'}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="grow scroll" style={{ display: 'flex', flexDirection: 'column', paddingBottom: 100, zoom: mobile ? 1 : 0.86 }}>
        <AnimatePresence mode="wait">
          <motion.div key={`${attempt}-${q}`} className="exercise-wrap" style={{ margin: 'auto 0' }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}>
            <ExerciseView ex={ex} onDone={handleDone} />
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div className={`feedback ${feedback.correct ? 'good' : 'bad'}`} initial={{ y: 140 }} animate={{ y: 0 }} exit={{ y: 140 }}>
            <div className="col grow">
              <span>{feedback.correct ? `${feedback.text} Бам! 💥` : feedback.text}</span>
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
