import { motion, useAnimation } from 'framer-motion';
import { useRef, useState } from 'react';
import { speak } from '../../audio/speech';
import { sfx } from '../../audio/sfx';
import { Pic, needsCaption } from '../ui/Pic';
import { Speaker } from '../ui/Speaker';
import { useKeys } from '../ui/useKeys';
import { Instruction } from './Instruction';
import type { ExerciseProps } from './types';

export function SpellLetters({ ex, onDone }: ExerciseProps<'spell'>) {
  const target = ex.target.en.toLowerCase();
  const [used, setUsed] = useState<number[]>([]);
  const [shakeIdx, setShakeIdx] = useState<number | null>(null);
  const mistakes = useRef(0);
  const slotsAnim = useAnimation();
  const done = used.length === target.length;

  const place = (tileIndex: number) => {
    if (done || used.includes(tileIndex)) return;
    const expected = target[used.length];
    if (ex.letters[tileIndex] === expected) {
      sfx.click();
      const next = [...used, tileIndex];
      setUsed(next);
      if (next.length === target.length) {
        speak(ex.target.en);
        setTimeout(() => onDone({ correct: mistakes.current === 0, mistakes: mistakes.current }), 500);
      }
    } else {
      mistakes.current += 1;
      sfx.wrong();
      setShakeIdx(tileIndex);
      void slotsAnim.start({ x: [0, -8, 8, -4, 4, 0], transition: { duration: 0.35 } });
      setTimeout(() => setShakeIdx(null), 400);
    }
  };

  useKeys((e) => {
    if (e.key.length !== 1) return;
    const letter = e.key.toLowerCase();
    const free = ex.letters.map((l, i) => ({ l, i })).filter((x) => !used.includes(x.i));
    const expected = target[used.length];
    const right = free.find((x) => x.l === letter && x.l === expected);
    const any = free.find((x) => x.l === letter);
    if (right) place(right.i);
    else if (any) place(any.i);
  });

  return (
    <div className="col center gap-24">
      <Instruction>Собери слово из букв</Instruction>
      <div className="row gap-24">
        <Pic pic={ex.target.pic} size={96} />
        <div className="col gap-8 center">
          <Speaker text={ex.target.en} />
          {needsCaption(ex.target.pic, ex.target.ru) && <span className="subtitle">{ex.target.ru}</span>}
        </div>
      </div>
      <motion.div className="row" style={{ gap: 6, flexWrap: 'wrap', justifyContent: 'center' }} animate={slotsAnim}>
        {target.split('').map((_, i) => (
          <motion.div key={i} className={`slot ${i < used.length ? 'filled' : ''}`} animate={i < used.length ? { scale: [1.2, 1] } : {}}>
            {i < used.length ? ex.letters[used[i]] : ''}
          </motion.div>
        ))}
      </motion.div>
      <div className="row" style={{ minHeight: 60, gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        {ex.letters.map((l, i) => (
          <motion.button
            key={i}
            className="tile letter"
            onClick={() => place(i)}
            initial={{ y: -30, opacity: 0 }}
            animate={
              used.includes(i)
                ? { scale: 0, opacity: 0 }
                : shakeIdx === i
                  ? { x: [0, -8, 8, -6, 6, 0], backgroundColor: ['#fff', '#ffdcdc', '#fff'], opacity: 1, y: 0 }
                  : { y: 0, opacity: 1, scale: 1 }
            }
            transition={{ delay: used.length || shakeIdx !== null ? 0 : i * 0.05 }}
          >
            {l}
          </motion.button>
        ))}
      </div>
      <div className="kbd-hint">Можно печатать буквы на клавиатуре</div>
    </div>
  );
}
