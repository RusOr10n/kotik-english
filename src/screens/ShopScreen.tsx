import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { sfx } from '../audio/sfx';
import { Cat, type CatMood } from '../components/cat/Cat';
import { Coins } from '../components/ui/Coins';
import { useIsMobile } from '../components/ui/useIsMobile';
import { pawBurst } from '../components/ui/confetti';
import { HomeItemArt } from '../components/home/HomeItemArt';
import { HOME_ITEMS } from '../content/home';
import { FURS, ITEMS, SLOT_NAMES, type Slot } from '../content/shop';
import { useGame } from '../state/store';
import type { Nav } from '../App';

export type ShopTab = Slot | 'fur' | 'interior' | 'toy';
type Tab = ShopTab;
const TABS: { id: Tab; label: string }[] = [
  { id: 'interior', label: '🛋️ Интерьер' },
  { id: 'toy', label: '🧸 Игрушки' },
  { id: 'hat', label: '🎩 ' + SLOT_NAMES.hat },
  { id: 'glasses', label: '👓 ' + SLOT_NAMES.glasses },
  { id: 'neck', label: '🎀 ' + SLOT_NAMES.neck },
  { id: 'back', label: '🦸 ' + SLOT_NAMES.back },
  { id: 'fur', label: '🎨 Окраска' },
];

export function ShopScreen({ nav, initialTab = 'hat' }: { nav: Nav; initialTab?: ShopTab }) {
  const { profile, coins, owned, equipped, buy, toggleEquip, setFur } = useGame();
  const [tab, setTab] = useState<Tab>(initialTab);
  const [mood, setMood] = useState<CatMood>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const fur = profile?.fur ?? 'ginger';
  const mobile = useIsMobile();

  const flash = (text: string, m: CatMood) => {
    setMessage(text);
    setMood(m);
    setTimeout(() => {
      setMessage(null);
      setMood('idle');
    }, 1800);
  };

  const purchase = (id: string, price: number, after: () => void) => {
    if (owned.includes(id) || price === 0) {
      sfx.click();
      after();
      return;
    }
    if (coins < price) {
      sfx.wrong();
      flash(`Нужно ещё ${price - coins} 🪙. Пройди уроки!`, 'sad');
      return;
    }
    buy(id, price);
    sfx.coin();
    sfx.meow();
    pawBurst();
    after();
    flash('Ура, обновка! Мур-р-р!', 'happy');
  };

  return (
    <div className="screen" style={{ background: 'linear-gradient(160deg, #fff0f6 0%, #efe6ff 100%)' }}>
      <div className="topbar">
        <button className="btn white small" onClick={() => nav({ name: 'map' })}>← Карта</button>
        <h1 style={{ fontSize: mobile ? 20 : 30 }}>🛍️ Магазин{mobile ? '' : ' котика'}</h1>
        <div className="grow" />
        <Coins value={coins} />
      </div>
      <div
        className="row grow"
        style={{ alignItems: 'stretch', gap: mobile ? 10 : 24, padding: mobile ? '0 10px 10px' : '0 24px 24px', minHeight: 0, flexDirection: mobile ? 'column' : 'row' }}
      >
        <div
          className="card center"
          style={{ width: mobile ? 'auto' : 340, gap: 12, position: 'relative', flexDirection: mobile ? 'row' : 'column', padding: mobile ? '4px 12px' : 0, flexShrink: 0 }}
        >
          <AnimatePresence>
            {message && (
              <motion.div className="bubble" style={{ position: 'absolute', top: mobile ? 4 : 30, right: mobile ? 8 : undefined, zIndex: 5 }} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                {message}
              </motion.div>
            )}
          </AnimatePresence>
          <Cat fur={fur} accessories={equipped} mood={mood} size={mobile ? 96 : 240} onClick={() => sfx.meow()} />
          <h2>{profile?.catName}</h2>
        </div>
        <div className="col grow gap-16" style={{ minWidth: 0, minHeight: 0 }}>
          <div className="row gap-8" style={{ flexWrap: mobile ? 'nowrap' : 'wrap', overflowX: 'auto', paddingBottom: 6, flexShrink: 0 }}>
            {TABS.map((t) => (
              <button key={t.id} className={`btn small ${tab === t.id ? '' : 'white'}`} style={{ whiteSpace: 'nowrap', flexShrink: 0 }} onClick={() => setTab(t.id)}>
                {t.label}
              </button>
            ))}
          </div>
          <div className="scroll grow" style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${mobile ? 120 : 170}px, 1fr))`, gap: mobile ? 10 : 16, alignContent: 'start', padding: 4 }}>
            {tab === 'interior' || tab === 'toy'
              ? [...HOME_ITEMS.filter((i) => i.kind === tab)].sort((a, b) => a.price - b.price).map((item) => {
                  const has = owned.includes(item.id);
                  return (
                    <ShopCard
                      key={item.id}
                      name={item.name}
                      active={has}
                      price={has ? null : item.price}
                      canAfford={coins >= item.price}
                      actionLabel="✓ В домике"
                      onClick={() => (has ? nav({ name: 'home' }) : purchase(item.id, item.price, () => {}))}
                    >
                      <div className="center" style={{ height: 100, width: '100%', overflow: 'hidden' }}>
                        <HomeItemArt item={item} scale={Math.min(1, 90 / item.size)} />
                      </div>
                    </ShopCard>
                  );
                })
              : tab === 'fur'
              ? [...FURS].sort((a, b) => a.price - b.price).map((f) => {
                  const has = f.price === 0 || owned.includes(f.id);
                  const active = fur === f.id;
                  return (
                    <ShopCard key={f.id} name={f.name} active={active} price={has ? null : f.price} canAfford={coins >= f.price} actionLabel={active ? 'Сейчас' : 'Выбрать'} onClick={() => purchase(f.id, f.price, () => setFur(f.id))}>
                      <Cat fur={f.id} size={mobile ? 84 : 110} />
                    </ShopCard>
                  );
                })
              : ITEMS.filter((i) => i.slot === tab).sort((a, b) => a.price - b.price).map((item) => {
                  const has = owned.includes(item.id);
                  const active = equipped[item.slot] === item.id;
                  return (
                    <ShopCard
                      key={item.id}
                      name={item.name}
                      active={active}
                      price={has ? null : item.price}
                      canAfford={coins >= item.price}
                      actionLabel={active ? 'Снять' : 'Надеть'}
                      onClick={() => purchase(item.id, item.price, () => toggleEquip(item.slot, item.id))}
                    >
                      <Cat fur={fur} accessories={{ [item.slot]: item.id }} size={mobile ? 84 : 110} />
                    </ShopCard>
                  );
                })}
          </div>
        </div>
      </div>
    </div>
  );
}

function ShopCard(props: { name: string; active: boolean; price: number | null; canAfford: boolean; actionLabel: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <motion.button
      className="card col center"
      style={{ border: props.active ? '4px solid var(--good)' : '4px solid transparent', padding: 12, gap: 6, cursor: 'pointer' }}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.95 }}
      onClick={props.onClick}
    >
      {props.children}
      <b style={{ fontSize: 16, textAlign: 'center' }}>{props.name}</b>
      {props.price !== null ? (
        <span className="pill" style={{ fontSize: 17, background: props.canAfford ? '#fff4c4' : '#f1edf6', color: props.canAfford ? 'var(--ink)' : 'var(--ink-soft)' }}>
          🪙 {props.price}
        </span>
      ) : (
        <span className="pill" style={{ fontSize: 15, background: props.active ? '#d9f8e6' : '#f1edf6' }}>
          {props.active && props.actionLabel === 'Сейчас' ? '✓ Сейчас' : props.actionLabel}
        </span>
      )}
    </motion.button>
  );
}
