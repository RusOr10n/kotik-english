import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Pic, needsCaption } from '../ui/Pic';
import { Speaker } from '../ui/Speaker';
import { sameText } from '../../engine/text';
import { Instruction } from './Instruction';
import type { ExerciseProps } from './types';

export function TypeWord({ ex, onDone }: ExerciseProps<'type'>) {
  const [value, setValue] = useState('');
  const [answered, setAnswered] = useState<null | boolean>(null);
  const [hints, setHints] = useState(1);
  const input = useRef<HTMLInputElement>(null);
  const answer = ex.target.en;

  useEffect(() => input.current?.focus(), []);

  const check = () => {
    if (answered !== null || !value.trim()) return;
    const ok = sameText(value, answer);
    setAnswered(ok);
    onDone({ correct: ok, mistakes: ok ? 0 : 1 });
  };

  const hint = () => {
    const next = Math.min(hints + 1, answer.length);
    setHints(next);
    setValue(answer.slice(0, next));
    input.current?.focus();
  };

  const placeholder = answer
    .split('')
    .map((ch, i) => (i < hints || ch === ' ' || ch === '-' ? ch : '_'))
    .join(' ');

  return (
    <div className="col center gap-24">
      <Instruction>Напиши слово по-английски</Instruction>
      <div className="row gap-24">
        <motion.div initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 12 }}>
          <Pic pic={ex.target.pic} size={96} />
        </motion.div>
        <div className="col gap-8 center">
          <Speaker text={answer} />
          {needsCaption(ex.target.pic, ex.target.ru) && <span className="subtitle">{ex.target.ru}</span>}
        </div>
      </div>
      <motion.input
        ref={input}
        className="text-input"
        value={value}
        placeholder={placeholder}
        disabled={answered !== null}
        spellCheck={false}
        autoComplete="off"
        autoCapitalize="none"
        autoCorrect="off"
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.stopPropagation();
            check();
          }
        }}
        animate={answered === false ? { x: [0, -10, 10, -6, 6, 0] } : {}}
        style={answered === null ? {} : { borderColor: answered ? 'var(--good)' : 'var(--bad)' }}
      />
      {answered === null && (
        <div className="row gap-16">
          <button className="btn white small" onClick={hint} disabled={hints >= answer.length - 1}>
            💡 Подсказка
          </button>
          <button className="btn good" onClick={check} disabled={!value.trim()}>
            Проверить
          </button>
        </div>
      )}
    </div>
  );
}
