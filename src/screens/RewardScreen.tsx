import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { speak } from '../audio/speech';
import { sfx } from '../audio/sfx';
import { MyCat } from '../components/cat/MyCat';
import { celebrate } from '../components/ui/confetti';
import { praiseEn } from '../components/ui/praise';
import { Stars } from '../components/ui/Stars';
import { useIsMobile } from '../components/ui/useIsMobile';
import { useKeys } from '../components/ui/useKeys';

type Props = {
  title: string;
  stars?: number;
  coins: number;
  /** ежедневный бонус (0 — уже получен сегодня) */
  bonus?: number;
  streak?: number;
  message?: string;
  onMap: () => void;
  onRetry?: () => void;
};

export function RewardScreen({ title, stars, coins, bonus = 0, streak = 1, message, onMap, onRetry }: Props) {
  const mobile = useIsMobile();
  useEffect(() => {
    sfx.fanfare();
    celebrate(stars === 3);
    const t1 = setTimeout(() => speak(praiseEn()), 600);
    const t2 = setTimeout(() => sfx.coin(), 1600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [stars]);

  useKeys((e) => e.key === 'Enter' && onMap());

  return (
    <div className="screen center" style={{ background: 'radial-gradient(circle at 50% 40%, #fff6d6 0%, #ffd6e6 60%, #e8d9ff 100%)' }}>
      {/* лучики */}
      <motion.div
        style={{ position: 'absolute', pointerEvents: 'none', width: 900, height: 900, background: 'repeating-conic-gradient(rgba(255,255,255,0.35) 0deg 10deg, transparent 10deg 20deg)', borderRadius: '50%' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      />
      <div className="col center gap-16" style={{ position: 'relative', zIndex: 1, padding: '0 16px', textAlign: 'center' }}>
        <motion.h1 className="title" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 10 }}>
          {title}
        </motion.h1>
        {stars !== undefined && <Stars count={stars} size={52} animate />}
        <MyCat mood="happy" size={mobile ? 140 : 200} />
        {message && <div className="subtitle" style={{ maxWidth: 520, textAlign: 'center' }}>{message}</div>}
        <motion.div className="pill" style={{ fontSize: 30, padding: '10px 26px' }} initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }} transition={{ delay: 1.5 }}>
          <span className="pic">🪙</span> +{coins}
        </motion.div>
        {bonus > 0 && (
          <motion.div
            className="card row gap-12"
            style={{ padding: '10px 20px', background: '#fff4c4' }}
            initial={{ scale: 0, rotate: -8 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 2.2, type: 'spring' }}
            onAnimationStart={() => setTimeout(() => sfx.coin(), 2300)}
          >
            <span className="pic" style={{ fontSize: 34 }}>🎁</span>
            <div className="col">
              <b style={{ fontSize: 20 }}>Ежедневный бонус: +{bonus} 🪙</b>
              <span className="muted" style={{ fontWeight: 700 }}>
                {streak > 1 ? `${streak} дн. подряд! Завтра бонус будет ещё больше` : 'Приходи завтра — бонус вырастет!'}
              </span>
            </div>
          </motion.div>
        )}
        <div className="row gap-16" style={{ marginTop: 10 }}>
          {onRetry && (
            <button className="btn white" onClick={onRetry}>
              🔁 Ещё раз
            </button>
          )}
          <button className="btn good" onClick={onMap}>
            На карту 🗺️
          </button>
        </div>
      </div>
    </div>
  );
}
