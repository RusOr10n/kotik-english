import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { speak, stopSpeech } from '../audio/speech';
import { sfx } from '../audio/sfx';
import { Cat, type CatMood } from '../components/cat/Cat';
import { ExerciseView, answerOf } from '../components/exercises/ExerciseView';
import { celebrate } from '../components/ui/confetti';
import { Coin, WithIcon } from '../components/ui/Icon';
import { Pic } from '../components/ui/Pic';
import { comfort, praise } from '../components/ui/praise';
import { useIsMobile, useIsShort } from '../components/ui/useIsMobile';
import { useKeys } from '../components/ui/useKeys';
import { WORLDS, findWorld, wordsUpToWorld, worldWords } from '../content/worlds';
import type { ExerciseResult } from '../engine/exercises';
import { buildBossQuestions } from '../engine/lessonBuilder';
import type { Room } from '../content/home';
import { passedWorldsCount, roomOpenedAt } from '../state/progress';
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
  const [reward, setReward] = useState<{ coins: number; bonus: number; streak: number; newRoom?: Room }>({ coins: 0, bonus: 0, streak: 1 });
  const bossAnim = useAnimation();
  const mobile = useIsMobile();
  const short = useIsShort();
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
    (document.activeElement as HTMLElement | null)?.blur?.();
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
      const earned = defeatBoss(world.id, Math.max(1, Math.round((Date.now() - startedAt.current) / 60000)));
      // 5-й, 10-й и 15-й пройденный уровень открывает новую комнату в домике
      const opened = earned.firstTime && !world.custom ? roomOpenedAt(passedWorldsCount(useGame.getState())) : undefined;
      setReward({ ...earned, newRoom: opened });
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
        {/* в альбомной ориентации котик с боссом слева, текст и кнопки справа */}
        <div className={short ? 'row center' : 'col center gap-24'} style={{ color: '#fff', padding: '0 16px', textAlign: 'center', gap: short ? 20 : undefined }}>
          <div className="row" style={{ alignItems: 'flex-end', gap: short ? 8 : 24, flexShrink: 0 }}>
            <Cat fur={fur} accessories={equipped} mood={phase === 'lose' ? 'sad' : 'think'} size={short ? 100 : mobile ? 120 : 170} />
            <motion.div animate={{ y: [0, short ? -10 : -20, 0], rotate: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 1.2 }}>
              <Pic pic={boss.pic} size={short ? 84 : mobile ? 100 : 150} />
            </motion.div>
          </div>
          <div className="col center" style={{ display: short ? 'flex' : 'contents', gap: 10, maxWidth: short ? 440 : undefined }}>
          <h1 className="title">{phase === 'lose' ? 'Не сдавайся! 💪' : boss.name}</h1>
          <div className="subtitle" style={{ color: '#f1e6ff', maxWidth: 560, textAlign: 'center', fontSize: short ? 16 : undefined }}>
            {phase === 'lose' ? `${boss.name} оказался хитрым. Попробуй ещё раз — у тебя обязательно получится!` : boss.story}
          </div>
          <div className="subtitle" style={{ color: '#d7c6ff', fontSize: short ? 14 : 17 }}>
            Правильный ответ — удар по боссу. Ошибка — котик теряет сердечко. У тебя {MAX_HEARTS} ❤️
          </div>
          <div className="row gap-16" style={{ marginTop: short ? 4 : 0 }}>
            <button className="btn white" onClick={() => nav({ name: 'map' })}>На карту</button>
            <button className="btn" onClick={phase === 'lose' ? restart : () => setPhase('fight')}>
              {phase === 'lose' ? (
                <WithIcon icon="review" size={22} color="#fff">Ещё раз</WithIcon>
              ) : (
                <WithIcon icon="swords" size={22} color="#fff">В бой!</WithIcon>
              )}
            </button>
          </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'win') {
    return (
      <div className="screen center" style={{ background: 'radial-gradient(circle at 50% 40%, #fff6d6 0%, #ffd6e6 60%, #e8d9ff 100%)' }}>
        {/* в альбомной ориентации котики слева, текст и награда справа */}
        <div className={short ? 'row center' : 'col center gap-16'} style={{ padding: '0 16px', textAlign: 'center', gap: short ? 20 : undefined }}>
          <div className="row" style={{ alignItems: 'flex-end', gap: short ? 8 : 24, flexShrink: 0, order: short ? -1 : 1 }}>
            <Cat fur={fur} accessories={equipped} mood="happy" size={short ? 100 : mobile ? 110 : 170} />
            <motion.div className="col center gap-8" initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.8, type: 'spring' }}>
              <div className="bubble">Новый друг: {world.friend.name}!</div>
              <Cat fur={world.friend.fur} accessories={world.friend.accessories} mood="happy" size={short ? 90 : mobile ? 100 : 150} />
            </motion.div>
          </div>
          <div className="col center" style={{ display: short ? 'flex' : 'contents', gap: 10, maxWidth: short ? 400 : undefined }}>
          <motion.h1 className="title" style={{ order: short ? 0 : -2 }} initial={{ scale: 0 }} animate={{ scale: 1 }}>Победа! 🎉</motion.h1>
          <div className="subtitle" style={{ order: short ? 0 : -1, fontSize: short ? 16 : undefined }}>{boss.winText}</div>
          <div className="pill" style={{ fontSize: short ? 22 : 30, order: 2 }}>
            <Coin size={short ? 26 : 34} /> +{reward.coins}
          </div>
          {reward.bonus > 0 && (
            <div className="pill" style={{ fontSize: short ? 15 : 20, background: '#fff4c4', order: 3 }}>
              🎁 Ежедневный бонус: +{reward.bonus} <Coin size={short ? 16 : 20} /> {reward.streak > 1 ? `(${reward.streak} дн. подряд)` : ''}
            </div>
          )}
          {reward.newRoom && (
            <motion.button
              className={`btn white ${short ? 'small' : ''}`}
              style={{ order: 3 }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.4, type: 'spring' }}
              onClick={() => nav({ name: 'home', room: reward.newRoom!.id })}
            >
              <span className="pic">{reward.newRoom.pic}</span> В домике открылась новая комната: {reward.newRoom.name}!
            </motion.button>
          )}
          <button
            className="btn good"
            style={{ order: 3 }}
            // после основного мира — на следующий мир, после темы родителя — обратно в неё
            onClick={() => nav({ name: 'map', worldIndex: world.custom ? WORLDS.indexOf(world) : undefined })}
          >
            На карту 🗺️
          </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen" style={{ background: `linear-gradient(180deg, #3b2e5a 0px, #6b3f7a ${short ? 128 : 230}px, #fff7ef ${short ? 128 : 230}px)` }}>
      <div className="topbar">
        <button className="btn white icon" onClick={() => nav({ name: 'map' })}>✕</button>
        <span style={{ color: '#fff', fontWeight: 900, fontSize: mobile ? 16 : 20 }}><WithIcon icon="swords" size={mobile ? 20 : 24}>{mobile ? boss.name : `Битва с боссом: ${boss.name}`}</WithIcon></span>
      </div>

      {/* арена */}
      {/* в альбомной ориентации арена ниже: кот и босс стоят по бокам, а не над заданием */}
      <div style={{ position: 'relative', height: short ? 76 : 160, margin: '0 clamp(12px, 5vw, 60px)' }}>
        <div className={short ? 'row' : 'col center'} style={{ position: 'absolute', left: 0, bottom: 0, gap: 6 }}>
          <Cat fur={fur} accessories={equipped} mood={catMood} size={short ? 62 : 105} />
          <div className="row" style={{ gap: 2, order: short ? 1 : -1 }}>
            {[...Array(MAX_HEARTS)].map((_, i) => (
              <motion.span key={i} className="pic" style={{ fontSize: short ? 20 : 26 }} animate={i >= hearts ? { scale: [1.5, 0.8], opacity: 0.3 } : {}}>
                {i < hearts ? '❤️' : '🤍'}
              </motion.span>
            ))}
          </div>
        </div>

        <div className={short ? 'row' : 'col center'} style={{ position: 'absolute', right: 0, bottom: short ? 4 : 8, gap: 10 }}>
          <div style={{ width: short ? 'min(140px, 20vw)' : 'min(170px, 34vw)', height: short ? 14 : 18, background: 'rgba(255,255,255,0.3)', borderRadius: 9, overflow: 'hidden', marginBottom: short ? 0 : 6 }}>
            <motion.div style={{ height: '100%', background: 'linear-gradient(90deg,#ff6a88,#ff9a8b)' }} animate={{ width: `${(Math.max(0, hp) / boss.hp) * 100}%` }} />
          </div>
          <motion.div animate={bossAnim}>
            <motion.div animate={{ y: [0, short ? -4 : -8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              <Pic pic={boss.pic} size={short ? 56 : 100} />
            </motion.div>
          </motion.div>
        </div>

        <AnimatePresence>
          {projectile && (
            <motion.span
              key={projectile}
              className="pic"
              style={{ position: 'absolute', top: short ? 14 : 40, fontSize: short ? 32 : 44 }}
              initial={{ left: projectile === 'toBoss' ? '10%' : '85%', rotate: 0 }}
              animate={{ left: projectile === 'toBoss' ? '85%' : '10%', rotate: 720, top: short ? [14, -10, 14] : [40, -10, 40] }}
              exit={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.55, ease: 'easeIn' }}
            >
              {projectile === 'toBoss' ? '🧶' : '💥'}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="grow scroll" style={{ display: 'flex', flexDirection: 'column', paddingBottom: short ? 6 : 16, zoom: mobile || short ? 1 : 0.86 }}>
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
