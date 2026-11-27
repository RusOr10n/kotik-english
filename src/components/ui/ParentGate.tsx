import { motion, useAnimation } from 'framer-motion';
import { useState } from 'react';
import { sfx } from '../../audio/sfx';
import { WithIcon } from './Icon';

const rnd = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));

/** Пример в два действия: «17 × 5 − 14» или «23 + 16 × 7» (нужно помнить порядок действий) */
export function makeGateTask(): { text: string; answer: number } {
  const a = rnd(13, 29);
  const b = rnd(4, 9);
  const c = rnd(11, 49);
  const product = a * b;
  switch (rnd(0, 2)) {
    case 0:
      return { text: `${a} × ${b} − ${c}`, answer: product - c };
    case 1:
      return { text: `${a} × ${b} + ${c}`, answer: product + c };
    default:
      return { text: `${c} + ${a} × ${b}`, answer: c + product };
  }
}

/** «Замок для взрослых»: пример в два действия, после ошибки — новый пример */
export function ParentGate({ onPass, onClose }: { onPass: () => void; onClose: () => void }) {
  const [task, setTask] = useState(makeGateTask);
  const [value, setValue] = useState('');
  const shake = useAnimation();

  const check = () => {
    if (Number(value) === task.answer) {
      sfx.click();
      onPass();
    } else {
      sfx.wrong();
      setValue('');
      // новый пример, чтобы ответ нельзя было подобрать перебором
      setTask(makeGateTask());
      void shake.start({ x: [0, -10, 10, -6, 6, 0], transition: { duration: 0.35 } });
    }
  };

  return (
    <motion.div
      className="center"
      style={{ position: 'fixed', inset: 0, background: 'rgba(58,51,80,0.4)', zIndex: 40, padding: 16 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClose}
    >
      <motion.div
        className="card col center gap-16"
        style={{ padding: 'clamp(18px, 5vw, 32px)', width: 420, maxWidth: '100%' }}
        initial={{ scale: 0.7 }}
        animate={{ scale: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ fontSize: 26 }}>
          <WithIcon icon="settings" size={28}>Вход для родителей</WithIcon>
        </h2>
        <div className="subtitle" style={{ fontSize: 18, textAlign: 'center' }}>Решите пример, чтобы открыть настройки</div>
        <motion.div className="row gap-12" animate={shake} style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
          <b style={{ fontSize: 'clamp(26px, 7vw, 34px)', whiteSpace: 'nowrap' }}>{task.text} =</b>
          <input
            className="text-input"
            style={{ width: 120, fontSize: 30, padding: '8px 12px' }}
            autoFocus
            inputMode="numeric"
            value={value}
            onChange={(e) => setValue(e.target.value.replace(/\D/g, ''))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') check();
              if (e.key === 'Escape') onClose();
            }}
          />
        </motion.div>
        <div className="row gap-12">
          <button className="btn white small" onClick={onClose}>Отмена</button>
          <button className="btn good small" onClick={check} disabled={!value}>Открыть</button>
        </div>
      </motion.div>
    </motion.div>
  );
}
