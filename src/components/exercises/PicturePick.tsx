import { motion } from 'framer-motion';
import { useState } from 'react';
import type { Word } from '../../content/types';
import { Pic } from '../ui/Pic';
import { useKeys } from '../ui/useKeys';
import { Instruction } from './Instruction';
import { optionClass } from './ListenPick';
import type { ExerciseProps } from './types';

export function PicturePick({ ex, onDone }: ExerciseProps<'picturePick'>) {
  const [chosen, setChosen] = useState<string | null>(null);

  const choose = (w: Word) => {
    if (chosen) return;
    setChosen(w.id);
    const ok = w.id === ex.target.id;
    onDone({ correct: ok, mistakes: ok ? 0 : 1 });
  };

  useKeys((e) => {
    const n = Number(e.key);
    if (n >= 1 && n <= ex.options.length) choose(ex.options[n - 1]);
  });

  return (
    <div className="col center gap-24">
      <Instruction>Как это по-английски?</Instruction>
      <motion.div
        className="card center pic-card"
        initial={{ rotate: -10, scale: 0.5 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 12 }}
      >
        <Pic pic={ex.target.pic} size={96} />
      </motion.div>
      <div className="grid-words">
        {ex.options.map((o, i) => (
          <motion.button
            key={o.id}
            className={optionClass(o, ex.target, chosen)}
            disabled={!!chosen}
            onClick={() => choose(o)}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.06 }}
          >
            <span className="key">{i + 1}</span>
            {o.en}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
