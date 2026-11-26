import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useRef, useState } from 'react';
import { speak } from '../../audio/speech';
import { sfx } from '../../audio/sfx';
import { normalize } from '../../engine/text';
import { Instruction } from './Instruction';
import type { ExerciseProps } from './types';

const COLORS = ['#ff6b9a', '#6ec6ff', '#ffc93c', '#9b7bff', '#3cc47c'];

/** Грамматическая мини-игра: лопни шарик с правильной формой слова */
export function BalloonPop({ ex, onDone }: ExerciseProps<'balloons'>) {
  const [round, setRound] = useState(0);
  const [popped, setPopped] = useState<string | null>(null);
  const [missed, setMissed] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const mistakes = useRef(0);
  const current = ex.rounds[Math.min(round, ex.rounds.length - 1)];
  const answer = current.tokens[current.gapIndex];

  // каждому шарику — своя дорожка, скорость и цвет
  const balloons = useMemo(
    () =>
      current.options.map((o, i) => ({
        text: o,
        left: ((i + 0.5) * 100) / current.options.length,
        duration: 6 + ((i * 3 + round) % 4),
        delay: i * 0.6,
        color: COLORS[(i + round) % COLORS.length],
      })),
    [current, round],
  );

  const pop = (text: string) => {
    if (popped || missed.includes(text)) return;
    if (normalize(text) === normalize(answer)) {
      sfx.splash();
      sfx.correct();
      setPopped(text);
      setScore((s) => s + 1);
      setTimeout(() => speak(current.phrase.en), 300);
      setTimeout(() => {
        setPopped(null);
        setMissed([]);
        if (round + 1 >= ex.rounds.length) onDone({ correct: true, mistakes: mistakes.current });
        else setRound((r) => r + 1);
      }, 1900);
    } else {
      mistakes.current += 1;
      sfx.wrong();
      setMissed((m) => [...m, text]);
    }
  };

  return (
    <div className="col center gap-16 fish-box">
      <Instruction>🎈 Мини-игра: лопни шарик с правильным словом!</Instruction>
      <div className="row gap-12" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
        <div className="bubble" style={{ fontSize: 'clamp(15px, 4vw, 20px)' }}>{current.phrase.ru}</div>
        <div className="pill" style={{ fontSize: 22 }}>
          🎈 {score} / {ex.rounds.length}
        </div>
      </div>
      {/* фраза с пропуском */}
      <div className="row" style={{ gap: 10, fontSize: 'clamp(22px, 6vw, 34px)', fontWeight: 900, flexWrap: 'wrap', justifyContent: 'center' }}>
        {current.tokens.map((t, i) =>
          i === current.gapIndex ? (
            <motion.span
              key={`${round}-${i}`}
              className="center"
              style={{
                minWidth: 90, height: 52, padding: '0 12px', borderRadius: 14, background: '#fff',
                border: `4px dashed ${popped ? 'var(--good)' : '#cfc5e0'}`, color: popped ? 'var(--good-dark)' : '#cfc5e0',
              }}
              animate={popped ? { scale: [1.4, 1] } : { scale: [1, 1.06, 1] }}
              transition={popped ? { type: 'spring' } : { repeat: Infinity, duration: 1.3 }}
            >
              {popped ?? '?'}
            </motion.span>
          ) : (
            <span key={`${round}-${i}`}>{t}</span>
          ),
        )}
      </div>

      <div
        style={{
          position: 'relative', width: '100%', height: 'min(300px, 45dvh)', borderRadius: 28, overflow: 'hidden',
          background: 'linear-gradient(180deg, #bfe8ff 0%, #e8f7ff 70%, #c8f0c0 70%, #a8e29b 100%)',
        }}
      >
        <motion.span className="pic" style={{ position: 'absolute', top: 16, fontSize: 40 }} animate={{ left: ['-10%', '110%'] }} transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}>
          ☁️
        </motion.span>
        <span className="pic" style={{ position: 'absolute', right: '6%', bottom: '4%', fontSize: 42 }}>🌳</span>

        <AnimatePresence>
          {balloons.map((b) => {
            const isPopped = popped === b.text;
            const isMissed = missed.includes(b.text);
            return (
              <motion.div
                key={`${round}-${b.text}`}
                onClick={() => pop(b.text)}
                style={{ position: 'absolute', left: `${b.left}%`, x: '-50%', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                initial={{ top: '105%' }}
                animate={
                  isPopped
                    ? { scale: [1, 1.5, 0], opacity: [1, 1, 0] }
                    : isMissed
                      ? { scale: 0.6, opacity: 0.35, top: '62%' }
                      : { top: ['105%', '8%'], rotate: [-4, 4, -4] }
                }
                exit={{ opacity: 0 }}
                transition={
                  isPopped || isMissed
                    ? { duration: 0.5 }
                    : { top: { duration: b.duration, repeat: Infinity, ease: 'linear', delay: b.delay }, rotate: { duration: 2, repeat: Infinity } }
                }
                whileHover={{ scale: 1.08 }}
              >
                <div
                  className="center"
                  style={{
                    width: 'clamp(84px, 22vw, 112px)', height: 'clamp(100px, 26vw, 130px)', borderRadius: '50% 50% 48% 48%',
                    background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.7) 0 12%, ${b.color} 13%)`,
                    color: '#fff', fontWeight: 900, fontSize: 'clamp(17px, 4.5vw, 22px)', textShadow: '0 2px 0 rgba(0,0,0,0.2)',
                    boxShadow: 'inset -8px -10px 0 rgba(0,0,0,0.08)',
                  }}
                >
                  {b.text}
                </div>
                <div style={{ width: 2, height: 40, background: '#9e9e9e' }} />
              </motion.div>
            );
          })}
        </AnimatePresence>

        <AnimatePresence>
          {popped && (
            <motion.span
              className="pic"
              style={{ position: 'absolute', left: '50%', top: '40%', fontSize: 60, x: '-50%' }}
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.6, 1.2], rotate: [0, 20, 0] }}
              exit={{ opacity: 0 }}
            >
              🎉
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
