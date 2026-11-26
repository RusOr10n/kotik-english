import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { sfx } from '../audio/sfx';
import { Coin } from '../components/ui/Icon';
import { MAX_GRANT, useGame } from '../state/store';

/** Родитель начисляет монетки — например, в награду за хорошую неделю */
export function GrantCoins() {
  const coins = useGame((s) => s.coins);
  const grantCoins = useGame((s) => s.grantCoins);
  const [value, setValue] = useState('');
  const [granted, setGranted] = useState<number | null>(null);

  const grant = (amount: number) => {
    const added = grantCoins(amount);
    if (!added) return;
    sfx.coin();
    setGranted(added);
    setValue('');
    setTimeout(() => setGranted(null), 2500);
  };

  const custom = Number(value);
  const customValid = Number.isInteger(custom) && custom > 0 && custom <= MAX_GRANT;

  return (
    <div className="card col gap-12" style={{ padding: 20 }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Coin size={28} /> Начислить монетки
      </h3>
      <div className="row gap-8" style={{ fontWeight: 800, fontSize: 18 }}>
        Сейчас у котика: <Coin size={22} /> {coins}
        <AnimatePresence>
          {granted !== null && (
            <motion.span
              key={granted + coins}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ color: 'var(--good-dark)' }}
            >
              +{granted}!
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <div className="row gap-8" style={{ flexWrap: 'wrap' }}>
        {[10, 50, 100].map((n) => (
          <button key={n} className="btn white small" onClick={() => grant(n)}>
            +{n}
          </button>
        ))}
        <input
          value={value}
          inputMode="numeric"
          placeholder="Своё число"
          onChange={(e) => setValue(e.target.value.replace(/\D/g, '').slice(0, 4))}
          onKeyDown={(e) => e.key === 'Enter' && customValid && grant(custom)}
          style={{ fontSize: 17, padding: '8px 12px', borderRadius: 10, border: '2px solid #e3dced', width: 140 }}
        />
        <button className="btn good small" disabled={!customValid} onClick={() => grant(custom)}>
          Начислить
        </button>
      </div>
      <span className="muted" style={{ fontWeight: 600 }}>
        За один раз — до {MAX_GRANT} монеток. Монетки тратятся в магазине на наряды, мебель и игрушки.
      </span>
    </div>
  );
}
