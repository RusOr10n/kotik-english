import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { speak } from '../audio/speech';
import { sfx } from '../audio/sfx';
import type { Word } from '../content/types';
import { MyCat } from '../components/cat/MyCat';
import { Pic, needsCaption } from '../components/ui/Pic';
import { Speaker } from '../components/ui/Speaker';
import { useKeys } from '../components/ui/useKeys';
import { RuleCard } from './RuleCard';

/** Знакомство перед упражнениями: сначала правило (если есть), потом новые слова */
type Props = { words: Word[]; rule?: string[]; startIndex?: number; onIndexChange?: (i: number) => void; onDone: () => void };

type Card = { type: 'rule' } | { type: 'word'; word: Word };

export function IntroCards({ words, rule, startIndex = 0, onIndexChange, onDone }: Props) {
  const cards: Card[] = [...(rule?.length ? [{ type: 'rule' as const }] : []), ...words.map((word) => ({ type: 'word' as const, word }))];
  const [i, setI] = useState(Math.min(startIndex, cards.length - 1));
  const card = cards[i];
  const word = card.type === 'word' ? card.word : null;

  useEffect(() => {
    if (!word) return;
    const t = setTimeout(() => speak(word.en), 450);
    return () => clearTimeout(t);
  }, [word]);

  const next = () => {
    sfx.click();
    if (i + 1 >= cards.length) onDone();
    else {
      setI(i + 1);
      onIndexChange?.(i + 1);
    }
  };

  useKeys((e) => {
    if (e.key === 'Enter' || e.key === 'ArrowRight') next();
    if (e.key === ' ' && word) speak(word.en);
  });

  return (
    <div className="col center gap-24 grow scroll" style={{ padding: '8px 12px 16px' }}>
      <div className="row gap-8">
        {cards.map((c, idx) => (
          <motion.div
            key={c.type === 'rule' ? 'rule' : c.word.id}
            style={{ width: 16, height: 16, borderRadius: 8, background: idx <= i ? 'var(--primary)' : '#e3dced' }}
            animate={idx === i ? { scale: [1, 1.4, 1] } : {}}
          />
        ))}
      </div>
      <div className="row gap-24" style={{ alignItems: 'flex-end', width: '100%', justifyContent: 'center' }}>
        <div className="col center gap-8 hide-mobile">
          <div className="bubble">{word ? 'Новое слово! Послушай и повтори вслух 🗣️' : 'Сначала правило — оно короткое!'}</div>
          <MyCat mood={word ? 'happy' : 'think'} size={150} />
        </div>
        <AnimatePresence mode="wait">
          {card.type === 'rule' ? (
            <motion.div key="rule" style={{ width: 'min(520px, 100%)', minWidth: 0 }} initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ x: -200, opacity: 0 }}>
              <RuleCard lines={rule!} />
            </motion.div>
          ) : (
            <motion.div
              key={card.word.id}
              className="card col center gap-16"
              style={{ width: 380, maxWidth: '100%', padding: 'clamp(18px, 5vw, 32px)' }}
              initial={{ x: 200, rotate: 10, opacity: 0 }}
              animate={{ x: 0, rotate: 0, opacity: 1 }}
              exit={{ x: -200, rotate: -10, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 160, damping: 16 }}
            >
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                <Pic pic={card.word.pic} size={110} />
              </motion.div>
              <div style={{ fontSize: 'clamp(36px, 10vw, 52px)', fontWeight: 900, textAlign: 'center' }}>{card.word.en}</div>
              {needsCaption(card.word.pic, card.word.ru) && <div className="ru">{card.word.ru}</div>}
              <Speaker text={card.word.en} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <button className="btn" onClick={next}>
        {i + 1 >= cards.length ? 'Начинаем! 🚀' : card.type === 'rule' ? 'Понятно! →' : 'Дальше →'}
      </button>
    </div>
  );
}
