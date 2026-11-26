import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { speak } from '../../audio/speech';
import { sfx } from '../../audio/sfx';
import { Pic } from '../ui/Pic';
import { Speaker } from '../ui/Speaker';
import { Instruction } from './Instruction';
import type { ExerciseProps } from './types';

const LANES = [14, 36, 58, 80];

export function CatchFish({ ex, onDone }: ExerciseProps<'catchFish'>) {
  const [round, setRound] = useState(0);
  const [caught, setCaught] = useState<string | null>(null);
  const [missed, setMissed] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const mistakes = useRef(0);
  const current = ex.rounds[Math.min(round, ex.rounds.length - 1)];

  // у каждой рыбки своя скорость, направление и задержка
  const fishes = useMemo(
    () =>
      current.options.map((w, i) => ({
        word: w,
        lane: LANES[i],
        duration: 9 + ((i * 7 + round * 3) % 5),
        delay: i * 1.1,
        leftToRight: (i + round) % 2 === 0,
      })),
    [current, round],
  );

  useEffect(() => {
    const t = setTimeout(() => speak(current.target.en), 400);
    return () => clearTimeout(t);
  }, [current]);

  const click = (wordId: string) => {
    if (caught || missed.includes(wordId)) return;
    if (wordId === current.target.id) {
      sfx.splash();
      sfx.correct();
      setCaught(wordId);
      setScore((s) => s + 1);
      setTimeout(() => {
        setCaught(null);
        setMissed([]);
        if (round + 1 >= ex.rounds.length) onDone({ correct: true, mistakes: mistakes.current });
        else setRound((r) => r + 1);
      }, 900);
    } else {
      mistakes.current += 1;
      sfx.wrong();
      setMissed((m) => [...m, wordId]);
    }
  };

  return (
    <div className="col center gap-16 fish-box">
      <Instruction>🎣 Мини-игра: поймай рыбку с нужным словом!</Instruction>
      <div className="row gap-24">
        <div className="card row gap-12" style={{ padding: '10px 20px' }}>
          <Pic pic={current.target.pic} size={60} />
          <Speaker text={current.target.en} />
        </div>
        <div className="pill" style={{ fontSize: 24 }}>
          🐟 {score} / {ex.rounds.length}
        </div>
      </div>
      <div
        style={{
          position: 'relative', width: '100%', height: 'min(330px, 52dvh)', borderRadius: 28, overflow: 'hidden',
          background: 'linear-gradient(180deg, #8fdcff 0%, #4aa8e8 60%, #2d7fc9 100%)',
          boxShadow: 'inset 0 -10px 30px rgba(0,0,40,0.2)',
        }}
      >
        {/* пузырьки */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            style={{ position: 'absolute', left: `${(i * 37) % 100}%`, width: 10 + (i % 3) * 6, height: 10 + (i % 3) * 6, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.6)' }}
            animate={{ top: ['110%', '-10%'] }}
            transition={{ duration: 5 + (i % 4), repeat: Infinity, delay: i * 0.7, ease: 'linear' }}
          />
        ))}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 40, background: '#f5d68a', borderTop: '6px solid #e9c46a' }} />
        <span className="pic" style={{ position: 'absolute', bottom: 18, left: '8%', fontSize: 44 }}>🪸</span>
        <span className="pic" style={{ position: 'absolute', bottom: 18, right: '12%', fontSize: 40 }}>🌿</span>

        <AnimatePresence>
          {fishes.map((f) => {
            const isCaught = caught === f.word.id;
            const isMissed = missed.includes(f.word.id);
            return (
              <motion.div
                key={`${round}-${f.word.id}`}
                style={{ position: 'absolute', top: `${f.lane}%`, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                initial={{ left: f.leftToRight ? '-18%' : '105%' }}
                animate={
                  isCaught
                    ? { top: '-30%', rotate: 360, scale: 1.4 }
                    : isMissed
                      ? { opacity: 0.25 }
                      : { left: f.leftToRight ? ['-18%', '105%'] : ['105%', '-18%'] }
                }
                exit={{ opacity: 0 }}
                transition={
                  isCaught || isMissed
                    ? { duration: 0.8 }
                    : { duration: f.duration, repeat: Infinity, ease: 'linear', delay: f.delay }
                }
                onClick={() => click(f.word.id)}
                whileHover={{ scale: 1.12 }}
              >
                <span className="pill" style={{ fontSize: 'clamp(15px, 4vw, 22px)', padding: '4px 12px' }}>{f.word.en}</span>
                <span className="pic" style={{ fontSize: 'clamp(40px, 11vw, 60px)', transform: f.leftToRight ? 'scaleX(-1)' : 'none' }}>🐟</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
