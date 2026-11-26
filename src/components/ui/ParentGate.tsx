import { motion, useAnimation } from 'framer-motion';
import { useMemo, useState } from 'react';
import { sfx } from '../../audio/sfx';

/** Простой «замок для взрослых»: пример на умножение двузначного числа */
export function ParentGate({ onPass, onClose }: { onPass: () => void; onClose: () => void }) {
  const [a, b] = useMemo(() => [12 + Math.floor(Math.random() * 8), 3 + Math.floor(Math.random() * 6)], []);
  const [value, setValue] = useState('');
  const shake = useAnimation();

  const check = () => {
    if (Number(value) === a * b) {
      sfx.click();
      onPass();
    } else {
      sfx.wrong();
      setValue('');
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
        <h2 style={{ fontSize: 26 }}>⚙️ Вход для родителей</h2>
        <div className="subtitle" style={{ fontSize: 18, textAlign: 'center' }}>Решите пример, чтобы открыть настройки</div>
        <motion.div className="row gap-12" animate={shake}>
          <b style={{ fontSize: 34 }}>
            {a} × {b} =
          </b>
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
