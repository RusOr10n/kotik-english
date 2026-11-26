import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { speak } from '../audio/speech';
import { sfx } from '../audio/sfx';
import { Cat } from '../components/cat/Cat';
import { celebrate } from '../components/ui/confetti';
import { useIsMobile } from '../components/ui/useIsMobile';
import { FURS } from '../content/shop';
import { useGame } from '../state/store';
import type { Nav } from '../App';

const NAMES = ['Мурзик', 'Пушок', 'Снежинка', 'Котя', 'Тигра', 'Булочка'];

export function Onboarding({ nav }: { nav: Nav }) {
  const createProfile = useGame((s) => s.createProfile);
  const [step, setStep] = useState(0);
  const [fur, setFur] = useState('ginger');
  const [name, setName] = useState('');
  const freeFurs = FURS.filter((f) => f.price === 0);
  const mobile = useIsMobile();

  const finish = () => {
    createProfile({ catName: name.trim() || 'Котик', fur });
    sfx.fanfare();
    celebrate(true);
    nav({ name: 'map', worldIndex: 0 });
  };

  return (
    <div className="screen center" style={{ background: 'radial-gradient(circle at 50% 30%, #fff3e0 0%, #ffd9e8 55%, #e3d7ff 100%)' }}>
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="s0" className="col center gap-24" style={{ padding: '0 16px', maxWidth: '100%' }} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}>
              <Cat fur="ginger" mood="happy" size={mobile ? 160 : 220} onClick={() => sfx.meow()} />
            </motion.div>
            <h1 className="title" style={{ fontSize: 'clamp(30px, 8vw, 48px)', textAlign: 'center' }}>Котик и английский</h1>
            <div className="subtitle" style={{ maxWidth: 560, textAlign: 'center' }}>
              Отправляйся в путешествие по волшебным мирам вместе с котиком, учи английские слова, побеждай хитрых злодеев и собирай друзей!
            </div>
            <button
              className="btn"
              onClick={() => {
                sfx.meow();
                speak("Hello! Let's play!");
                setStep(1);
              }}
            >
              Начать приключение! ✨
            </button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="s1" className="col center gap-24" style={{ padding: '0 16px', maxWidth: '100%' }} initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -80 }}>
            <h1 className="title" style={{ textAlign: 'center' }}>Выбери своего котика</h1>
            <div className="row" style={{ gap: 'clamp(8px, 2vw, 16px)', flexWrap: 'wrap', justifyContent: 'center' }}>
              {freeFurs.map((f) => (
                <motion.button
                  key={f.id}
                  className="card col center"
                  style={{ border: fur === f.id ? '5px solid var(--primary)' : '5px solid transparent', padding: mobile ? 6 : 12, cursor: 'pointer' }}
                  whileHover={{ y: -8 }}
                  onClick={() => {
                    sfx.meow();
                    setFur(f.id);
                  }}
                >
                  <Cat fur={f.id} size={mobile ? 78 : 130} mood={fur === f.id ? 'happy' : 'idle'} />
                  <b style={{ fontSize: mobile ? 15 : 20 }}>{f.name}</b>
                </motion.button>
              ))}
            </div>
            <button className="btn" onClick={() => setStep(2)}>Дальше →</button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="s2" className="col center gap-24" style={{ padding: '0 16px', maxWidth: '100%' }} initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -80 }}>
            <Cat fur={fur} mood="think" size={mobile ? 120 : 180} />
            <h1 className="title" style={{ textAlign: 'center' }}>Как зовут твоего котика?</h1>
            <input
              className="text-input"
              autoFocus
              maxLength={16}
              value={name}
              placeholder="Имя котика"
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && name.trim() && finish()}
            />
            <div className="row gap-8" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
              {NAMES.map((n) => (
                <button key={n} className="btn white small" onClick={() => setName(n)}>{n}</button>
              ))}
            </div>
            <div className="row gap-16">
              <button className="btn white" onClick={() => setStep(1)}>← Назад</button>
              <button className="btn good" disabled={!name.trim()} onClick={finish}>Готово! 🐾</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
