import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { speak } from '../audio/speech';
import { sfx } from '../audio/sfx';
import { MyCat } from '../components/cat/MyCat';
import type { CatMood } from '../components/cat/Cat';
import { Coins } from '../components/ui/Coins';
import { ParentGate } from '../components/ui/ParentGate';
import { InstallButton } from '../components/ui/InstallButton';
import { Pic } from '../components/ui/Pic';
import { RuleCard } from './RuleCard';
import { useIsMobile } from '../components/ui/useIsMobile';
import { Stars } from '../components/ui/Stars';
import { getWord } from '../content/words';
import { BUILTIN_WORLDS, WORLDS } from '../content/worlds';
import { pick } from '../engine/random';
import { dayNumber, wordsForReview } from '../engine/srs';
import { currentNodeIndex, isBossUnlocked, isLessonUnlocked, isWorldUnlocked } from '../state/progress';
import { useGame } from '../state/store';
import type { Nav } from '../App';

type Props = {
  nav: Nav;
  worldIndex: number;
  /** id только что пройденного урока — котик пройдёт от него к следующей точке */
  justCompleted?: string;
};

const CAT_LINES = ['Meow! Hello!', 'I love English!', "Let's play!", 'You are my best friend!', 'Purr-purr!', 'I am a happy cat!'];

/** Позиции точек на тропинке (в процентах): на компьютере — змейкой слева направо, на телефоне — сверху вниз */
function nodePositions(count: number, vertical: boolean) {
  return Array.from({ length: count }, (_, i) =>
    vertical
      ? { x: i % 2 === 0 ? 28 : 72, y: 6 + (i * 88) / Math.max(1, count - 1) }
      : { x: 9 + (i * 82) / Math.max(1, count - 1), y: i % 2 === 0 ? 70 : 38 },
  );
}

function pathD(points: { x: number; y: number }[]) {
  return points.reduce((d, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = points[i - 1];
    const mx = (prev.x + p.x) / 2;
    return `${d} C ${mx} ${prev.y}, ${mx} ${p.y}, ${p.x} ${p.y}`;
  }, '');
}

export function MapScreen({ nav, worldIndex, justCompleted }: Props) {
  const state = useGame();
  const mobile = useIsMobile();
  const world = WORLDS[worldIndex];
  const nodes = useMemo(() => nodePositions(world.lessons.length + 1, mobile), [world, mobile]);
  const target = currentNodeIndex(state, world);
  const completedIdx = justCompleted ? world.lessons.findIndex((l) => l.id === justCompleted) : -1;
  const [catNode, setCatNode] = useState(completedIdx >= 0 ? completedIdx : target);
  const [catMood, setCatMood] = useState<CatMood>('idle');
  const [bubble, setBubble] = useState<string | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [gate, setGate] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const strip = useRef<HTMLDivElement>(null);

  // текущий мир — в центр полоски миров
  useEffect(() => {
    const el = strip.current;
    const active = el?.querySelector<HTMLElement>('[data-active]');
    if (!el || !active) return;
    el.scrollTo({ left: active.offsetLeft - el.clientWidth / 2 + active.offsetWidth / 2, behavior: 'smooth' });
  }, [worldIndex]);
  const hasRules = world.lessons.some((l) => l.rule?.length);
  const reviewWords = wordsForReview(state.srs, dayNumber(), 8);
  const dueCount = Object.values(state.srs).filter((p) => p.due <= dayNumber()).length;
  const allDone = BUILTIN_WORLDS.every((w) => state.bossDefeated[w.id]);

  // анимированный переход котика к следующей точке
  useEffect(() => {
    setCatNode(completedIdx >= 0 ? completedIdx : target);
    if (completedIdx >= 0 && completedIdx !== target) {
      const t1 = setTimeout(() => {
        setCatMood('walk');
        setCatNode(target);
      }, 700);
      const t2 = setTimeout(() => {
        setCatMood('happy');
        sfx.meow();
      }, 2300);
      const t3 = setTimeout(() => setCatMood('idle'), 3600);
      return () => [t1, t2, t3].forEach(clearTimeout);
    }
  }, [worldIndex, completedIdx, target]);

  const catClick = () => {
    sfx.meow();
    const line = pick(CAT_LINES);
    setBubble(line);
    setCatMood('happy');
    setTimeout(() => speak(line), 300);
    setTimeout(() => {
      setBubble(null);
      setCatMood('idle');
    }, 2500);
  };

  const unlocked = (i: number) => (i < world.lessons.length ? isLessonUnlocked(state, world, i) : isBossUnlocked(state, world));
  const isDone = (i: number) => (i < world.lessons.length ? !!state.lessonStars[world.lessons[i].id] : !!state.bossDefeated[world.id]);

  const switchWorld = (delta: number) => {
    const next = worldIndex + delta;
    if (next < 0 || next >= WORLDS.length) return;
    sfx.click();
    setSelected(null);
    nav({ name: 'map', worldIndex: next });
  };

  const node = selected !== null ? nodes[selected] : null;

  return (
    <div className="screen" style={{ background: world.bg, overflowY: 'auto' }}>
      {/* декорации: отдельный нижний слой, не перехватывают нажатия */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        {world.decor.map((d, i) => (
          <motion.span
            key={`${world.id}-${i}`}
            className="pic"
            style={{ position: 'absolute', fontSize: 40 + (i % 3) * 10, left: `${[4, 30, 55, 80, 18, 68][i]}%`, top: `${[34, 88, 30, 90, 60, 66][i]}%`, opacity: 0.5 }}
            animate={{ y: [0, -10, 0], rotate: [-4, 4, -4] }}
            transition={{ duration: 3 + i * 0.4, repeat: Infinity }}
          >
            {d}
          </motion.span>
        ))}
      </div>

      <div className="topbar">
        <span className="pill" title="Дней подряд">🐾 {state.streak.count}<span className="hide-mobile"> {plural(state.streak.count, 'день', 'дня', 'дней')}</span></span>
        <Coins value={state.coins} />
        <div className="grow" />
        <button className="btn white small" onClick={() => nav({ name: 'review' })} disabled={!reviewWords.length && !state.savedSessions.review} style={{ position: 'relative' }}>
          🔁<span className="hide-mobile"> {state.savedSessions.review ? 'Продолжить повторение' : 'Повторение'}</span>
          {dueCount > 0 && (
            <span style={{ position: 'absolute', top: -8, right: -8, background: 'var(--bad)', color: '#fff', borderRadius: 12, padding: '2px 8px', fontSize: 14 }}>
              {dueCount}
            </span>
          )}
        </button>
        <button className="btn white small" onClick={() => nav({ name: 'home' })} title="Домик">🏠<span className="hide-mobile"> Домик</span></button>
        <button className="btn white small" onClick={() => nav({ name: 'shop' })} title="Магазин">🛍️<span className="hide-mobile"> Магазин</span></button>
        <button className="btn white small" onClick={() => nav({ name: 'album' })} title="Альбом">📖<span className="hide-mobile"> Альбом</span></button>
        <InstallButton />
        <button className="btn white icon" onClick={() => setGate(true)} title="Для родителей">⚙️</button>
      </div>

      {/* заголовок мира */}
      <div className="row center" style={{ marginTop: 4, gap: mobile ? 8 : 16, padding: '0 8px', position: 'relative', zIndex: 2 }}>
        <button className="btn white icon" onClick={() => switchWorld(-1)} disabled={worldIndex === 0}>◀</button>
        <AnimatePresence mode="wait">
          <motion.div key={world.id} className="col center" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} style={{ minWidth: mobile ? 0 : 480, flex: mobile ? 1 : undefined }}>
            <h1 className="title" style={{ textAlign: 'center' }}>
              <span className="pic">{world.pic}</span> {world.name}
            </h1>
            <div className="subtitle" style={{ fontSize: mobile ? 14 : 17, textAlign: 'center', maxWidth: 560 }}>
              {world.custom ? '' : `Мир ${worldIndex + 1} из ${BUILTIN_WORLDS.length}. `}
              {world.story}
            </div>
            {hasRules && (
              <button className="btn white small" style={{ marginTop: 6 }} onClick={() => setShowRules(true)}>
                📘 Правила
              </button>
            )}
          </motion.div>
        </AnimatePresence>
        <button
          className="btn white icon"
          onClick={() => switchWorld(1)}
          disabled={worldIndex === WORLDS.length - 1}
          title={isWorldUnlocked(state, worldIndex + 1) ? '' : 'Победи босса, чтобы открыть'}
        >
          {worldIndex < WORLDS.length - 1 && !isWorldUnlocked(state, worldIndex + 1) ? '🔒' : '▶'}
        </button>
      </div>

      {/* быстрый выбор мира */}
      <div ref={strip} className="world-strip" style={{ marginTop: 8 }}>
        {WORLDS.map((w, i) => {
          const open = isWorldUnlocked(state, i);
          const active = i === worldIndex;
          return (
            <motion.button
              key={w.id}
              data-active={active || undefined}
              title={open ? w.name : `${w.name} — пока закрыт`}
              onClick={() => {
                sfx.click();
                setSelected(null);
                nav({ name: 'map', worldIndex: i });
              }}
              whileHover={{ y: -3 }}
              style={{
                width: mobile ? 36 : 42, height: mobile ? 36 : 42, borderRadius: 12, cursor: 'pointer', fontSize: mobile ? 18 : 22, padding: 0,
                border: active ? '3px solid var(--primary)' : w.custom ? '2px dashed #b9a6e8' : '2px solid transparent',
                background: open ? '#fff' : 'rgba(255,255,255,0.5)', boxShadow: '0 3px 0 rgba(0,0,0,0.1)',
                filter: open ? 'none' : 'grayscale(1) opacity(0.6)',
                marginLeft: w.custom && !WORLDS[i - 1]?.custom ? 14 : undefined,
                flexShrink: 0,
              }}
            >
              <span className="pic">{w.pic}</span>
            </motion.button>
          );
        })}
      </div>

      {/* тропинка */}
      <div
        className={mobile ? '' : 'grow'}
        style={{
          position: 'relative', zIndex: 1, margin: mobile ? '8px 8px 28px' : '0 30px 20px', flexShrink: 0,
          // на телефоне — вертикальная тропинка нужной высоты, на компьютере — не меньше 440px, иначе прокрутка
          height: mobile ? nodes.length * 118 : undefined, minHeight: mobile ? undefined : 440,
        }}
      >
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <path d={pathD(nodes)} fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="28" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          <path d={pathD(nodes)} fill="none" stroke="rgba(58,51,80,0.18)" strokeWidth="5" strokeDasharray="4 14" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>

        {nodes.map((p, i) => {
          const isBoss = i === world.lessons.length;
          const open = unlocked(i);
          const done = isDone(i);
          const current = i === target && open && !done;
          const size = mobile ? (isBoss ? 86 : 66) : isBoss ? 120 : 92;
          return (
            <div key={`${world.id}-${i}`} className="col center" style={{ position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, transform: 'translate(-50%, -50%)', gap: 4 }}>
              <motion.button
                onClick={() => {
                  if (!open) {
                    sfx.wrong();
                    return;
                  }
                  sfx.click();
                  setSelected(i);
                }}
                initial={{ scale: 0 }}
                animate={current ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                transition={current ? { repeat: Infinity, duration: 1.4 } : { delay: i * 0.06, type: 'spring' }}
                whileHover={open ? { y: -5 } : {}}
                style={{
                  position: 'relative', width: size, height: size, borderRadius: '50%', border: '6px solid #fff', cursor: open ? 'pointer' : 'not-allowed',
                  background: !open ? '#d8d3e3' : done ? 'linear-gradient(135deg,#7ee0a5,#3cc47c)' : isBoss ? 'linear-gradient(135deg,#ff9a8b,#ff6a88)' : world.accent,
                  boxShadow: `0 8px 0 rgba(0,0,0,0.15)${current ? ', 0 0 0 10px rgba(255,255,255,0.5)' : ''}`,
                  fontSize: (isBoss ? 60 : 38) * (mobile ? 0.72 : 1), fontWeight: 900, color: '#fff',
                }}
              >
                {!open ? <span className="pic">🔒</span> : isBoss ? <span className="pic">{world.boss.pic}</span> : i + 1}
                {!isBoss && state.savedSessions[world.lessons[i].id] && (
                  <span className="pic" title="Урок начат — можно продолжить" style={{ position: 'absolute', top: -10, right: -10, fontSize: 22, background: '#fff', borderRadius: '50%', padding: 4, boxShadow: '0 3px 0 rgba(0,0,0,0.12)' }}>
                    ⏸️
                  </span>
                )}
              </motion.button>
              <div className="pill" style={{ fontSize: mobile ? 13 : 15, padding: '4px 12px', whiteSpace: 'nowrap' }}>
                {isBoss ? `Босс: ${world.boss.name}` : world.lessons[i].title}
              </div>
              {!isBoss && done && <Stars count={state.lessonStars[world.lessons[i].id]} size={20} />}
              {isBoss && done && <span className="pill" style={{ fontSize: 14, padding: '2px 10px' }}>✅ Побеждён</span>}
            </div>
          );
        })}

        {/* котик на тропинке */}
        <motion.div
          style={{ position: 'absolute', zIndex: 3, x: '-50%', y: mobile ? '-60%' : '-100%', marginTop: mobile ? 0 : -42 }}
          initial={false}
          animate={(() => {
            const n = nodes[Math.min(catNode, nodes.length - 1)];
            // на телефоне котик сидит сбоку от точки, на компьютере — над ней
            return { left: `${mobile ? (n.x < 50 ? n.x + 30 : n.x - 30) : n.x}%`, top: `${n.y}%` };
          })()}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        >
          <div onClick={catClick} style={{ position: 'relative' }}>
            <AnimatePresence>
              {bubble && (
                <motion.div className="bubble" style={{ position: 'absolute', bottom: '100%', left: -20, whiteSpace: 'nowrap' }} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  {bubble}
                </motion.div>
              )}
            </AnimatePresence>
            <MyCat mood={catMood} size={mobile ? 76 : 100} meow={false} />
          </div>
        </motion.div>

        {allDone && worldIndex === BUILTIN_WORLDS.length - 1 && (
          <motion.div className="card center col hide-mobile" style={{ position: 'absolute', right: 0, top: 0, padding: 16 }} animate={{ rotate: [-3, 3, -3] }} transition={{ repeat: Infinity, duration: 2 }}>
            <span className="pic" style={{ fontSize: 60 }}>🏆</span>
            <b>Все миры пройдены!</b>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showRules && (
          <motion.div
            className="center"
            style={{ position: 'fixed', inset: 0, background: 'rgba(58,51,80,0.35)', zIndex: 35, padding: 16 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowRules(false)}
          >
            <motion.div
              className="col gap-12 scroll"
              style={{ maxHeight: '100%', width: 'min(560px, 100%)', alignItems: 'stretch' }}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              {world.lessons
                .filter((l) => l.rule?.length)
                .map((l) => (
                  <RuleCard key={l.id} title={`📘 ${l.title}`} lines={l.rule!} />
                ))}
              <button className="btn good" onClick={() => setShowRules(false)} style={{ alignSelf: 'center', flexShrink: 0 }}>
                Понятно!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {gate && <ParentGate onClose={() => setGate(false)} onPass={() => nav({ name: 'parent' })} />}

      {/* карточка урока */}
      <AnimatePresence>
        {selected !== null && node && (
          <motion.div
            className="center"
            style={{ position: 'fixed', inset: 0, background: 'rgba(58,51,80,0.35)', zIndex: 30, padding: 16 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="card col center gap-16"
              style={{ padding: 'clamp(18px, 5vw, 32px)', width: 520, maxWidth: '100%', textAlign: 'center' }}
              initial={{ scale: 0.6, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.6, y: 40 }}
              onClick={(e) => e.stopPropagation()}
            >
              {selected < world.lessons.length ? (
                <>
                  <div className="subtitle">Урок {selected + 1}</div>
                  <h2 style={{ fontSize: 32 }}>{world.lessons[selected].title}</h2>
                  <div className="row gap-12" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
                    {world.lessons[selected].words.map((id) => (
                      <Pic key={id} pic={getWord(id).pic} size={46} />
                    ))}
                  </div>
                  {state.lessonStars[world.lessons[selected].id] ? <Stars count={state.lessonStars[world.lessons[selected].id]} size={32} /> : null}
                  <LessonActions lessonId={world.lessons[selected].id} nav={nav} />
                </>
              ) : (
                <>
                  <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 1 }}>
                    <Pic pic={world.boss.pic} size={100} />
                  </motion.div>
                  <h2 style={{ fontSize: 30 }}>{world.boss.name}</h2>
                  <div className="subtitle" style={{ textAlign: 'center' }}>{world.boss.story}</div>
                  <button className="btn" onClick={() => nav({ name: 'boss', worldId: world.id })}>
                    ⚔️ В бой!
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Кнопки в карточке урока: продолжить начатое или начать */
function LessonActions({ lessonId, nav }: { lessonId: string; nav: Nav }) {
  const saved = useGame((s) => s.savedSessions[lessonId]);
  const clearSession = useGame((s) => s.clearSession);
  if (!saved) {
    return (
      <button className="btn good" onClick={() => nav({ name: 'lesson', lessonId })}>
        Играть! ▶
      </button>
    );
  }
  const progress = saved.phase === 'intro' ? 'на знакомстве со словами' : `задание ${saved.index + 1} из ${saved.queue.length}`;
  return (
    <>
      <div className="subtitle" style={{ fontSize: 17 }}>Ты остановилась: {progress}</div>
      <div className="row gap-12" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          className="btn white small"
          onClick={() => {
            clearSession(lessonId);
            nav({ name: 'lesson', lessonId });
          }}
        >
          🔁 Начать заново
        </button>
        <button className="btn good" onClick={() => nav({ name: 'lesson', lessonId })}>
          Продолжить ▶
        </button>
      </div>
    </>
  );
}

function plural(n: number, one: string, few: string, many: string) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}
