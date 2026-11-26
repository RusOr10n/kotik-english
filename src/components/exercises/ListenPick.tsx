import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { speak } from '../../audio/speech';
import type { Word } from '../../content/types';
import { Pic } from '../ui/Pic';
import { Speaker } from '../ui/Speaker';
import { useKeys } from '../ui/useKeys';
import { Instruction } from './Instruction';
import type { ExerciseProps } from './types';

export function optionClass(option: Word, target: Word, chosen: string | null) {
  if (!chosen) return 'option';
  if (option.id === target.id) return 'option correct';
  if (option.id === chosen) return 'option wrong';
  return 'option dim';
}

export function ListenPick({ ex, onDone }: ExerciseProps<'listenPick'>) {
  const [chosen, setChosen] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => speak(ex.target.en), 350);
    return () => clearTimeout(t);
  }, [ex.target.en]);

  const choose = (w: Word) => {
    if (chosen) return;
    setChosen(w.id);
    const ok = w.id === ex.target.id;
    onDone({ correct: ok, mistakes: ok ? 0 : 1 });
  };

  useKeys((e) => {
    const n = Number(e.key);
    if (n >= 1 && n <= ex.options.length) choose(ex.options[n - 1]);
    if (e.key === ' ') speak(ex.target.en);
  });

  return (
    <div className="col center gap-24">
      <Instruction>Послушай и выбери картинку</Instruction>
      <Speaker text={ex.target.en} big />
      <div className="grid-pics">
        {ex.options.map((o, i) => (
          <motion.button
            key={o.id}
            className={optionClass(o, ex.target, chosen)}
            disabled={!!chosen}
            onClick={() => choose(o)}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={chosen === o.id && o.id !== ex.target.id ? { x: [0, -10, 10, -6, 6, 0], scale: 1, opacity: 1 } : { scale: 1, opacity: 1 }}
            transition={{ delay: chosen ? 0 : i * 0.07 }}
            whileHover={chosen ? {} : { y: -6 }}
          >
            <span className="key">{i + 1}</span>
            <Pic pic={o.pic} size={70} />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
