import { motion } from 'framer-motion';
import { useMemo, useRef, useState } from 'react';
import { speak } from '../../audio/speech';
import { sfx } from '../../audio/sfx';
import { shuffle } from '../../engine/random';
import { Pic } from '../ui/Pic';
import { Instruction } from './Instruction';
import type { ExerciseProps } from './types';

type Card = { key: string; wordId: string; face: 'pic' | 'word'; content: string };

export function MemoryMatch({ ex, onDone }: ExerciseProps<'memory'>) {
  const cards = useMemo<Card[]>(
    () =>
      shuffle(
        ex.pairs.flatMap((w) => [
          { key: `${w.id}-p`, wordId: w.id, face: 'pic' as const, content: w.pic },
          { key: `${w.id}-w`, wordId: w.id, face: 'word' as const, content: w.en },
        ]),
      ),
    [ex],
  );
  const [open, setOpen] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const mistakes = useRef(0);
  const busy = useRef(false);

  const flip = (card: Card) => {
    if (busy.current || open.includes(card.key) || matched.includes(card.wordId)) return;
    sfx.flip();
    if (card.face === 'word') speak(card.content);
    const next = [...open, card.key];
    setOpen(next);
    if (next.length < 2) return;
    busy.current = true;
    const [a, b] = next.map((k) => cards.find((c) => c.key === k)!);
    if (a.wordId === b.wordId) {
      setTimeout(() => {
        sfx.correct();
        const m = [...matched, a.wordId];
        setMatched(m);
        setOpen([]);
        busy.current = false;
        if (m.length === ex.pairs.length) setTimeout(() => onDone({ correct: true, mistakes: mistakes.current }), 500);
      }, 400);
    } else {
      mistakes.current += 1;
      setTimeout(() => {
        setOpen([]);
        busy.current = false;
      }, 1000);
    }
  };

  return (
    <div className="col center gap-24">
      <Instruction>Найди пары: картинка + слово</Instruction>
      <div className="memory-grid">
        {cards.map((c, i) => {
          const isMatched = matched.includes(c.wordId);
          const shown = isMatched || open.includes(c.key);
          return (
            <motion.button
              key={c.key}
              onClick={() => flip(c)}
              initial={{ scale: 0 }}
              animate={{ scale: isMatched ? [1, 1.12, 1] : 1, rotateY: shown ? 180 : 0 }}
              transition={{ delay: open.length || matched.length ? 0 : i * 0.04, duration: 0.4 }}
              className="memory-card"
              style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer', transformStyle: 'preserve-3d', position: 'relative' }}
            >
              <div
                className="center"
                style={{
                  position: 'absolute', inset: 0, borderRadius: 20, backfaceVisibility: 'hidden',
                  background: 'linear-gradient(135deg, #b39dff, #ff9ec4)', boxShadow: '0 6px 0 #9278e6',
                  fontSize: 46,
                }}
              >
                <span className="pic">🐾</span>
              </div>
              <div
                style={{
                  position: 'absolute', inset: 0, borderRadius: 20, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)',
                  background: isMatched ? '#e8fbf0' : '#fff', border: `4px solid ${isMatched ? 'var(--good)' : '#eee6f6'}`,
                  boxShadow: '0 6px 0 #e3dced', fontWeight: 900, padding: 4, overflowWrap: 'anywhere',
                }}
                className="center memory-face"
              >
                {c.face === 'pic' ? <Pic pic={c.content} size={52} /> : c.content}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
