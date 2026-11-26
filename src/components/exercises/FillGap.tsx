import { motion } from 'framer-motion';
import { useState } from 'react';
import { normalize } from '../../engine/text';
import { useKeys } from '../ui/useKeys';
import { Instruction } from './Instruction';
import type { ExerciseProps } from './types';

export function FillGap({ ex, onDone }: ExerciseProps<'fillGap'>) {
  const [chosen, setChosen] = useState<string | null>(null);
  const answer = ex.tokens[ex.gapIndex];
  const isRight = (o: string) => normalize(o) === normalize(answer);

  const choose = (o: string) => {
    if (chosen) return;
    setChosen(o);
    const ok = isRight(o);
    onDone({ correct: ok, mistakes: ok ? 0 : 1 });
  };

  useKeys((e) => {
    const n = Number(e.key);
    if (n >= 1 && n <= ex.options.length) choose(ex.options[n - 1]);
  });

  return (
    <div className="col center gap-24">
      <Instruction>Вставь пропущенное слово</Instruction>
      <div className="bubble ru">{ex.phrase.ru}</div>
      <div className="row gap-12" style={{ fontSize: 'clamp(22px, 6vw, 36px)', fontWeight: 900, flexWrap: 'wrap', justifyContent: 'center' }}>
        {ex.tokens.map((t, i) =>
          i === ex.gapIndex ? (
            <motion.span
              key={i}
              className="center"
              style={{
                minWidth: 100, height: 54, borderRadius: 14, padding: '0 14px',
                border: `4px dashed ${chosen ? (isRight(chosen) ? 'var(--good)' : 'var(--bad)') : '#cfc5e0'}`,
                background: '#fff', color: chosen ? 'var(--ink)' : '#cfc5e0',
              }}
              animate={chosen ? { scale: [1.2, 1] } : { scale: [1, 1.05, 1] }}
              transition={chosen ? {} : { repeat: Infinity, duration: 1.4 }}
            >
              {chosen ?? '?'}
            </motion.span>
          ) : (
            <span key={i}>{t}</span>
          ),
        )}
      </div>
      <div className="row gap-12" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
        {ex.options.map((o, i) => (
          <motion.button
            key={o}
            className={`option ${chosen ? (isRight(o) ? 'correct' : o === chosen ? 'wrong' : 'dim') : ''}`}
            style={{ minWidth: 'min(170px, 28vw)' }}
            disabled={!!chosen}
            onClick={() => choose(o)}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.07 }}
          >
            <span className="key">{i + 1}</span>
            {o}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
