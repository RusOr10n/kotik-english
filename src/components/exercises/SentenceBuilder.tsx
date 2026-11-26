import { LayoutGroup, motion } from 'framer-motion';
import { useState } from 'react';
import { sfx } from '../../audio/sfx';
import { tokenize } from '../../engine/text';
import { Speaker } from '../ui/Speaker';
import { useKeys } from '../ui/useKeys';
import { Instruction } from './Instruction';
import type { ExerciseProps } from './types';

export function SentenceBuilder({ ex, onDone }: ExerciseProps<'sentence'>) {
  const [placed, setPlaced] = useState<number[]>([]);
  const [answered, setAnswered] = useState<null | boolean>(null);
  const correctTokens = tokenize(ex.phrase.en);

  const toggle = (i: number) => {
    if (answered !== null) return;
    sfx.click();
    setPlaced((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));
  };

  const check = () => {
    if (answered !== null || placed.length !== ex.tiles.length) return;
    const ok = placed.map((i) => ex.tiles[i]).join(' ') === correctTokens.join(' ');
    setAnswered(ok);
    onDone({ correct: ok, mistakes: ok ? 0 : 1 });
  };

  useKeys((e) => {
    if (e.key === 'Enter') check();
    if (e.key === 'Backspace' && placed.length && answered === null) setPlaced((p) => p.slice(0, -1));
  });

  const tile = (i: number) => (
    <motion.button
      key={i}
      layoutId={`tile-${ex.id}-${i}`}
      className="tile"
      onClick={() => toggle(i)}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      {ex.tiles[i]}
    </motion.button>
  );

  return (
    <div className="col center gap-24 sentence-box">
      <Instruction>Собери фразу по-английски</Instruction>
      <div className="row gap-16">
        <Speaker text={ex.phrase.en} />
        <div className="bubble" style={{ fontSize: 'clamp(17px, 4.5vw, 26px)', maxWidth: 560 }}>
          {ex.phrase.ru}
        </div>
      </div>
      <LayoutGroup>
        <div
          className="row gap-8"
          style={{
            minHeight: 78, width: '100%', flexWrap: 'wrap', justifyContent: 'center',
            borderBottom: `4px solid ${answered === null ? '#d9cfe8' : answered ? 'var(--good)' : 'var(--bad)'}`,
            padding: '10px 0',
          }}
        >
          {placed.map(tile)}
        </div>
        <div className="row gap-8" style={{ minHeight: 70, flexWrap: 'wrap', justifyContent: 'center' }}>
          {ex.tiles.map((_, i) => (placed.includes(i) ? null : tile(i)))}
        </div>
      </LayoutGroup>
      {answered === null && (
        <button className="btn good" onClick={check} disabled={placed.length !== ex.tiles.length}>
          Проверить
        </button>
      )}
    </div>
  );
}
