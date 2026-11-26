import { AnimatePresence, type TargetAndTransition, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { speak, stopSpeech } from '../audio/speech';
import { sfx } from '../audio/sfx';
import type { CatMood } from '../components/cat/Cat';
import { MyCat } from '../components/cat/MyCat';
import { HomeItemArt } from '../components/home/HomeItemArt';
import { Coins } from '../components/ui/Coins';
import { useIsMobile } from '../components/ui/useIsMobile';
import { HOME_ITEMS, type HomeItem } from '../content/home';
import type { Phrase } from '../content/types';
import { useGame } from '../state/store';
import type { Nav } from '../App';

type Pos = { x: number; y: number };
type Fx = { id: string; kind: 'wiggle' | 'spin' | 'bounce'; n: number };

const HOME: Pos = { x: 50, y: 90 };
const ROOM_WIDTH_MOBILE = 860;
const FLOOR_FRONT = 91;
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const clampX = (x: number) => Math.max(5, Math.min(95, x));

/** Комната котика: купленный интерьер и игрушки, с которыми он играет */
export function HomeScreen({ nav }: { nav: Nav }) {
  const owned = useGame((s) => s.owned);
  const coins = useGame((s) => s.coins);
  const catName = useGame((s) => s.profile?.catName ?? 'Котик');
  const items = HOME_ITEMS.filter((i) => owned.includes(i.id));

  const [cat, setCat] = useState<Pos>(HOME);
  const [dur, setDur] = useState(0.8);
  const [facingLeft, setFacingLeft] = useState(false);
  const [mood, setMood] = useState<CatMood>('idle');
  const [catFx, setCatFx] = useState<TargetAndTransition>({ scale: 1, opacity: 1, rotate: 0 });
  const [busy, setBusy] = useState(false);
  const [bubble, setBubble] = useState<Phrase | null>(null);
  const [fx, setFx] = useState<Fx | null>(null);
  const [toyPos, setToyPos] = useState<Record<string, Pos>>({});
  const [dot, setDot] = useState<Pos | null>(null);
  const [hint, setHint] = useState(false);
  const [floaters, setFloaters] = useState<{ id: number; pic: string; x: number; y: number }[]>([]);
  const alive = useRef(true);
  const mobile = useIsMobile();
  const scroller = useRef<HTMLDivElement>(null);

  // на телефоне сразу показываем середину комнаты, где сидит котик
  useEffect(() => {
    const el = scroller.current;
    if (mobile && el) el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
  }, [mobile]);
  const catRef = useRef(cat);
  catRef.current = cat;

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      stopSpeech();
    };
  }, []);

  const posOf = (item: HomeItem): Pos => toyPos[item.id] ?? { x: item.x, y: item.y };

  /** Котик идёт в точку; время пути зависит от расстояния */
  const walkTo = async (to: Pos, opts: { run?: boolean } = {}) => {
    const from = catRef.current;
    const distance = Math.hypot(to.x - from.x, (to.y - from.y) * 0.6);
    const d = Math.max(0.35, distance / (opts.run ? 55 : 32));
    if (Math.abs(to.x - from.x) > 1) setFacingLeft(to.x < from.x);
    setDur(d);
    setMood('walk');
    setCat(to);
    await wait(d * 1000);
  };

  const say = (phrase: Phrase) => {
    setBubble(phrase);
    void speak(phrase.en);
  };

  const effect = (id: string, kind: Fx['kind']) => setFx({ id, kind, n: Date.now() });

  const float = (pics: string[], at: Pos) => {
    const batch = pics.map((pic, i) => ({ id: Date.now() + i, pic, x: at.x + (i % 3) * 3 - 3, y: at.y - 10 }));
    setFloaters((f) => [...f, ...batch]);
    setTimeout(() => setFloaters((f) => f.filter((b) => !batch.includes(b))), 2600);
  };

  const interact = async (item: HomeItem) => {
    if (busy) return;
    setBusy(true);
    sfx.click();
    const p = posOf(item);
    try {
      switch (item.action) {
        case 'sleep': {
          await walkTo({ x: p.x, y: item.art === 'rug' ? p.y - 2 : p.y - 3 });
          setCatFx({ scale: 0.85, opacity: 1, rotate: 0 });
          setMood('sleep');
          say(item.phrase);
          float(['💤', '💤'], p);
          await wait(4000);
          setCatFx({ scale: 1, opacity: 1, rotate: 0 });
          break;
        }
        case 'eat': {
          await walkTo({ x: clampX(p.x + 7), y: FLOOR_FRONT });
          setFacingLeft(true);
          setMood('happy');
          effect(item.id, 'wiggle');
          say(item.phrase);
          float(['😋', '❤️'], p);
          await wait(3000);
          break;
        }
        case 'scratch': {
          await walkTo({ x: clampX(p.x + 6), y: p.y + 2 });
          setFacingLeft(true);
          setMood('happy');
          setCatFx({ scale: 1, opacity: 1, rotate: [0, -10, 8, -10, 8, -6, 0] });
          effect(item.id, 'wiggle');
          say(item.phrase);
          sfx.splash();
          await wait(2600);
          setCatFx({ scale: 1, opacity: 1, rotate: 0 });
          break;
        }
        case 'climb': {
          await walkTo({ x: clampX(p.x + 7), y: p.y + 4 });
          setDur(0.5);
          setMood('happy');
          setCat({ x: p.x + 1, y: p.y - 13 });
          sfx.flip();
          await wait(600);
          setDur(0.5);
          setCat({ x: p.x, y: p.y - 22 });
          sfx.flip();
          say(item.phrase);
          await wait(3000);
          setMood('walk');
          setDur(0.6);
          setFacingLeft(false);
          setCat({ x: clampX(p.x + 10), y: FLOOR_FRONT });
          await wait(600);
          break;
        }
        case 'watch': {
          await walkTo({ x: p.x, y: Math.min(FLOOR_FRONT, p.y + 18) });
          setMood('think');
          say(item.phrase);
          float(['✨', '👀'], p);
          await wait(3200);
          break;
        }
        case 'jump': {
          await walkTo({ x: clampX(p.x - 8), y: p.y + 14 });
          setDur(0.45);
          setFacingLeft(false);
          setMood('happy');
          setCat({ x: p.x, y: p.y - 6 });
          sfx.flip();
          effect(item.id, 'bounce');
          say(item.phrase);
          await wait(2800);
          setDur(0.45);
          setCat({ x: clampX(p.x - 8), y: FLOOR_FRONT });
          await wait(500);
          break;
        }
        case 'dance': {
          await walkTo({ x: clampX(p.x + (p.x > 50 ? -9 : 9)), y: FLOOR_FRONT });
          setMood('happy');
          effect(item.id, 'bounce');
          setCatFx({ scale: 1, opacity: 1, rotate: [0, -12, 12, -12, 12, -12, 12, 0] });
          say(item.phrase);
          float(['🎵', '🎶', '🎵'], p);
          sfx.fanfare();
          await wait(3200);
          setCatFx({ scale: 1, opacity: 1, rotate: 0 });
          break;
        }
        case 'chase': {
          say(item.phrase);
          for (let i = 0; i < 3; i++) {
            const target = { x: clampX(15 + Math.random() * 70), y: 84 + Math.random() * 10 };
            setToyPos((t) => ({ ...t, [item.id]: target }));
            effect(item.id, 'spin');
            await wait(250);
            await walkTo({ x: target.x, y: target.y + 1 }, { run: true });
          }
          setMood('happy');
          sfx.meow();
          await wait(1500);
          break;
        }
        case 'laser': {
          say(item.phrase);
          for (let i = 0; i < 5; i++) {
            const target = { x: clampX(10 + Math.random() * 80), y: 80 + Math.random() * 14 };
            setDot(target);
            await wait(300);
            await walkTo(target, { run: true });
            setMood('happy');
            setCatFx({ scale: [1, 1.15, 1], opacity: 1, rotate: 0 });
            await wait(250);
          }
          setDot(null);
          setCatFx({ scale: 1, opacity: 1, rotate: 0 });
          await wait(800);
          break;
        }
        case 'hide': {
          await walkTo({ x: p.x, y: p.y });
          setCatFx({ scale: 0.2, opacity: 0, rotate: 0 });
          sfx.flip();
          await wait(500);
          effect(item.id, 'wiggle');
          await wait(1400);
          effect(item.id, 'wiggle');
          await wait(900);
          setMood('happy');
          setCatFx({ scale: 1, opacity: 1, rotate: 0 });
          setCat({ x: p.x, y: p.y - 4 });
          sfx.meow();
          say(item.phrase);
          await wait(2400);
          setDur(0.4);
          setCat({ x: p.x, y: FLOOR_FRONT });
          break;
        }
        case 'play': {
          await walkTo({ x: clampX(p.x + (p.x > 50 ? -7 : 7)), y: Math.max(p.y, 86) });
          setFacingLeft(p.x < catRef.current.x);
          setMood('happy');
          effect(item.id, 'spin');
          say(item.phrase);
          float(['❤️', '⭐'], p);
          await wait(3000);
          break;
        }
        case 'bubbles': {
          await walkTo({ x: clampX(p.x - 8), y: FLOOR_FRONT });
          setMood('happy');
          say(item.phrase);
          float(['🫧', '🫧', '🫧', '🫧', '🫧', '🫧'], { x: p.x - 6, y: p.y });
          for (let i = 0; i < 4; i++) {
            await wait(600);
            sfx.click();
          }
          await wait(800);
          break;
        }
      }
    } finally {
      if (alive.current) {
        setMood('idle');
        setBusy(false);
        setTimeout(() => alive.current && setBubble(null), 1200);
      }
    }
  };

  const fxAnim = (id: string) => {
    if (fx?.id !== id) return {};
    if (fx.kind === 'wiggle') return { rotate: [0, -12, 12, -8, 8, 0] };
    if (fx.kind === 'spin') return { rotate: [0, 360] };
    return { y: [0, -14, 0, -8, 0] };
  };

  return (
    <div className="screen">
      <div className="topbar" style={{ background: 'rgba(255,255,255,0.6)' }}>
        <button className="btn white small" onClick={() => nav({ name: 'map' })}>← Карта</button>
        <h1 style={{ fontSize: mobile ? 20 : 28 }}>🏠 {mobile ? 'Домик' : `Домик: ${catName}`}</h1>
        <div className="grow" />
        <Coins value={coins} />
        <button className="btn white icon" title="Подсказка" onClick={() => setHint((h) => !h)}>💡</button>
        <button className="btn small" onClick={() => nav({ name: 'shop', tab: 'interior' })}>🛍️<span className="hide-mobile"> Купить вещи</span></button>
      </div>

      <div ref={scroller} className="grow" style={{ position: 'relative', overflowX: mobile ? 'auto' : 'hidden', overflowY: 'hidden' }}>
      {/* на телефоне комната шире экрана и листается пальцем */}
      <div style={{ position: 'relative', height: '100%', width: mobile ? ROOM_WIDTH_MOBILE : '100%', overflow: 'hidden' }}>
        {/* стена */}
        <div
          style={{
            position: 'absolute', inset: 0, bottom: '30%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.5) 2px, transparent 2.5px) 0 0 / 28px 28px, linear-gradient(180deg, #ffe6ef 0%, #ffd9e6 100%)',
          }}
        />
        {/* плинтус и пол */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: '70%', height: 10, background: '#f3c1d3' }} />
        <div
          style={{
            position: 'absolute', left: 0, right: 0, bottom: 0, top: 'calc(70% + 10px)',
            background: 'repeating-linear-gradient(90deg, #e9c79f 0px, #e9c79f 118px, #dcb68c 118px, #dcb68c 122px), #e9c79f',
          }}
        />
        {/* окно */}
        <div style={{ position: 'absolute', left: '50%', top: '6%', transform: `translateX(-50%) scale(${mobile ? 0.75 : 1})`, transformOrigin: 'top center', width: 240, height: 160 }}>
          <div
            style={{
              position: 'absolute', inset: 0, border: '10px solid #fff', borderRadius: 14, overflow: 'hidden',
              background: 'linear-gradient(180deg, #8fd3ff 0%, #d6f1ff 100%)', boxShadow: '0 6px 0 rgba(0,0,0,0.08)',
            }}
          >
            <span className="pic" style={{ position: 'absolute', right: 18, top: 10, fontSize: 36 }}>☀️</span>
            <motion.span className="pic" style={{ position: 'absolute', top: 40, fontSize: 34 }} animate={{ left: [-60, 260] }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}>
              ☁️
            </motion.span>
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 8, marginLeft: -4, background: '#fff' }} />
          </div>
          <div style={{ position: 'absolute', left: -22, top: -8, width: 40, height: 180, background: '#ff9ec4', borderRadius: '0 0 20px 20px' }} />
          <div style={{ position: 'absolute', right: -22, top: -8, width: 40, height: 180, background: '#ff9ec4', borderRadius: '0 0 20px 20px' }} />
        </div>

        {items.length === 0 && (
          <div className="card col center gap-12" style={{ position: 'absolute', left: '50%', top: '42%', transform: 'translate(-50%, -50%)', padding: 24, zIndex: 50, width: 'min(420px, 90vw)' }}>
            <b style={{ fontSize: 22 }}>Домик пока пустой</b>
            <span className="muted" style={{ fontWeight: 700, textAlign: 'center', maxWidth: 360 }}>
              Купи в магазине мебель и игрушки — котик будет с ними играть и говорить по-английски!
            </span>
            <button className="btn good" onClick={() => nav({ name: 'shop', tab: 'interior' })}>🛍️ В магазин</button>
          </div>
        )}

        {/* вещи */}
        {items.map((item) => {
          const p = posOf(item);
          return (
            <motion.div
              key={item.id}
              title={item.name}
              onClick={() => void interact(item)}
              initial={false}
              animate={{ left: `${p.x}%`, top: `${p.y}%` }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              style={{
                position: 'absolute', x: '-50%', y: '-100%', cursor: busy ? 'default' : 'pointer',
                zIndex: item.art === 'rug' ? 1 : Math.round(p.y),
              }}
              whileHover={busy ? {} : { scale: 1.08 }}
            >
              <motion.div key={fx?.id === item.id ? fx.n : 0} animate={fxAnim(item.id)} transition={{ duration: fx?.kind === 'spin' ? 0.5 : 0.6 }}>
                <HomeItemArt item={item} scale={mobile ? 0.78 : 1} />
              </motion.div>
            </motion.div>
          );
        })}

        {/* лазерная точка */}
        <AnimatePresence>
          {dot && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, left: `${dot.x}%`, top: `${dot.y}%` }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{ position: 'absolute', width: 14, height: 14, borderRadius: '50%', background: '#ff1744', boxShadow: '0 0 12px 4px rgba(255,23,68,0.6)', zIndex: 99, x: '-50%', y: '-50%' }}
            />
          )}
        </AnimatePresence>

        {/* всплывающие значки */}
        {floaters.map((f, i) => (
          <motion.span
            key={f.id}
            className="pic"
            style={{ position: 'absolute', left: `${f.x}%`, top: `${f.y}%`, fontSize: 30, zIndex: 120 }}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 1, 0], y: -120 - (i % 3) * 30, x: (i % 2 ? 1 : -1) * 20 }}
            transition={{ duration: 2.4, delay: (i % 6) * 0.2 }}
          >
            {f.pic}
          </motion.span>
        ))}

        {/* котик */}
        <motion.div
          initial={false}
          animate={{ left: `${cat.x}%`, top: `${cat.y}%` }}
          transition={{ duration: dur, ease: 'easeInOut' }}
          style={{ position: 'absolute', x: '-50%', y: '-100%', zIndex: Math.round(cat.y) + 1 }}
        >
          <AnimatePresence>
            {bubble && (
              <motion.div
                className="bubble"
                style={{ position: 'absolute', bottom: '100%', left: '50%', x: '-30%', whiteSpace: 'nowrap', marginBottom: 6, zIndex: 130 }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                <div style={{ fontSize: 22 }}>{bubble.en}</div>
                <div className="muted" style={{ fontSize: 15 }}>{bubble.ru}</div>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div animate={catFx} transition={{ duration: 0.8 }}>
            <div
              style={{ transform: facingLeft ? 'scaleX(-1)' : 'none', cursor: 'pointer' }}
              onClick={() => {
                if (busy) return;
                sfx.meow();
                say({ en: 'Meow! I love my home!', ru: 'Мяу! Я люблю свой домик!' });
                setTimeout(() => alive.current && setBubble(null), 2500);
              }}
            >
              <MyCat mood={mood} size={mobile ? 92 : 120} meow={false} />
            </div>
          </motion.div>
        </motion.div>

      </div>
      </div>
        <AnimatePresence>
          {hint && (
            <motion.div
              className="bubble"
              style={{ position: 'absolute', right: 12, top: 8, zIndex: 150, maxWidth: 'min(340px, calc(100% - 24px))' }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={() => setHint(false)}
            >
              👆 Нажимай на вещи — {catName} будет с ними играть и говорить по-английски!
              {mobile && <div style={{ marginTop: 6 }}>↔ Комнату можно листать пальцем.</div>}
              <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>Нажми, чтобы закрыть</div>
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  );
}
