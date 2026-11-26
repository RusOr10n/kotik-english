import { AnimatePresence, type TargetAndTransition, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { speak, stopSpeech } from '../audio/speech';
import { sfx } from '../audio/sfx';
import type { CatMood } from '../components/cat/Cat';
import { MyCat } from '../components/cat/MyCat';
import { HomeItemArt } from '../components/home/HomeItemArt';
import { HomeWindow } from '../components/home/HomeWindow';
import { Coins } from '../components/ui/Coins';
import { Icon, WithIcon } from '../components/ui/Icon';
import { useIsMobile } from '../components/ui/useIsMobile';
import { HOME_ITEMS, ROOMS, ROOM_BY_ID, roomOf, type HomeItem, type RoomId } from '../content/home';
import { randomCatPhrase } from '../content/catPhrases';
import type { Phrase } from '../content/types';
import { isRoomUnlocked, passedWorldsCount } from '../state/progress';
import { useGame } from '../state/store';
import type { Nav } from '../App';
import type { ShopTab } from './ShopScreen';

type Pos = { x: number; y: number };
type Fx = { id: string; kind: 'wiggle' | 'spin' | 'bounce'; n: number };

const HOME: Pos = { x: 50, y: 90 };
const ROOM_WIDTH_MOBILE = 860;
const FLOOR_FRONT = 91;
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const clampX = (x: number) => Math.max(5, Math.min(95, x));

/** Домик котика: комнаты с купленными вещами, с которыми котик играет */
export function HomeScreen({ nav, initialRoom }: { nav: Nav; initialRoom?: RoomId }) {
  const owned = useGame((s) => s.owned);
  const coins = useGame((s) => s.coins);
  const catName = useGame((s) => s.profile?.catName ?? 'Котик');
  const bossDefeated = useGame((s) => s.bossDefeated);
  const settings = useGame((s) => s.settings);
  const unlocked = (id: RoomId) => isRoomUnlocked({ bossDefeated, settings, lessonStars: {} }, ROOM_BY_ID[id]);
  const [roomId, setRoomId] = useState<RoomId>(() => (initialRoom && unlocked(initialRoom) ? initialRoom : 'living'));
  const room = ROOM_BY_ID[roomId];
  const items = HOME_ITEMS.filter((i) => roomOf(i) === roomId && owned.includes(i.id));
  const shopTab: ShopTab = roomId === 'living' ? 'interior' : roomId;
  const [notice, setNotice] = useState<string | null>(null);

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

  // на телефоне комната едет за котиком, чтобы он и его фраза оставались на экране
  useEffect(() => {
    const el = scroller.current;
    if (!mobile || !el) return;
    const catX = (cat.x / 100) * el.scrollWidth;
    el.scrollTo({ left: catX - el.clientWidth / 2, behavior: 'smooth' });
  }, [mobile, cat.x]);

  // у края комнаты облачко с фразой прижимается к краю, а не торчит за экран
  const bubbleAlign: 'left' | 'center' | 'right' = cat.x < 30 ? 'left' : cat.x > 70 ? 'right' : 'center';

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      stopSpeech();
    };
  }, []);

  const posOf = (item: HomeItem): Pos => toyPos[item.id] ?? { x: item.x, y: item.y };

  /** Переход в другую комнату; закрытая комната подсказывает, сколько уровней осталось */
  const goToRoom = (id: RoomId) => {
    if (busy || id === roomId) return;
    sfx.click();
    if (!unlocked(id)) {
      const left = ROOM_BY_ID[id].unlockAt - passedWorldsCount({ bossDefeated });
      setHint(false);
      setNotice(`🔒 ${ROOM_BY_ID[id].name} откроется, когда пройдёшь ${ROOM_BY_ID[id].unlockAt} уровней. Осталось: ${left}.`);
      return;
    }
    setNotice(null);
    setRoomId(id);
    setToyPos({});
    setDot(null);
    setCatFx({ scale: 1, opacity: 1, rotate: 0 });
    setDur(0);
    setCat(HOME);
    setMood('happy');
    say(ROOM_BY_ID[id].phrase);
    setTimeout(() => {
      if (!alive.current) return;
      setBubble(null);
      setMood('idle');
    }, 2200);
  };

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
    clearTimeout(tapBubbleTimer.current);
    setBubble(phrase);
    void speak(phrase.en);
  };

  /** Фраза на тап по котику: облачко живёт 2.5 с от последнего тапа, а не от первого */
  const tapBubbleTimer = useRef<ReturnType<typeof setTimeout>>();
  const lastTapPhrase = useRef<Phrase | null>(null);
  const sayOnTap = (phrase: Phrase, { voice = true } = {}) => {
    if (voice) say(phrase);
    else {
      clearTimeout(tapBubbleTimer.current);
      setBubble(phrase);
    }
    tapBubbleTimer.current = setTimeout(() => alive.current && setBubble(null), 2500);
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
          float(item.floats ?? ['💤', '💤'], p);
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
          float(item.floats ?? ['😋', '❤️'], p);
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
          float(item.floats ?? ['✨', '👀'], p);
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
          float(item.floats ?? ['🎵', '🎶', '🎵'], p);
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
          if (item.floats) float(item.floats, p);
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
          float(item.floats ?? ['❤️', '⭐'], p);
          await wait(3000);
          break;
        }
        case 'bubbles': {
          await walkTo({ x: clampX(p.x - 8), y: FLOOR_FRONT });
          setMood('happy');
          say(item.phrase);
          float(item.floats ?? ['🫧', '🫧', '🫧', '🫧', '🫧', '🫧'], { x: p.x - 6, y: p.y });
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
        <h1 style={{ fontSize: mobile ? 20 : 28 }}>
          <WithIcon icon="home" size={mobile ? 24 : 30}>{mobile ? 'Домик' : `Домик: ${catName}`}</WithIcon>
        </h1>
        <div className="grow" />
        <Coins value={coins} />
        <button className="btn white small menu-btn" title="Купить вещи" onClick={() => nav({ name: 'shop', tab: shopTab })}>
          <Icon name="shop" />
          <span className="hide-mobile">Купить вещи</span>
        </button>
        <button className="btn white small menu-btn" title="Подсказка" onClick={() => { setNotice(null); setHint((h) => !h); }}>
          <Icon name="hint" />
        </button>
      </div>

      {/* комнаты домика: новые открываются после 5, 10 и 15 уровней */}
      <div className="row gap-8" style={{ padding: mobile ? '0 10px 8px' : '0 24px 10px', overflowX: 'auto', flexShrink: 0 }}>
        {ROOMS.map((r) => {
          const open = unlocked(r.id);
          return (
            <button
              key={r.id}
              className={`btn small ${r.id === roomId ? '' : 'white'}`}
              style={{ whiteSpace: 'nowrap', flexShrink: 0, opacity: open ? 1 : 0.7 }}
              onClick={() => goToRoom(r.id)}
            >
              <span className="pic">{open ? r.pic : '🔒'}</span> {r.name}
            </button>
          );
        })}
      </div>

      <div ref={scroller} className="grow" style={{ position: 'relative', overflowX: mobile ? 'auto' : 'hidden', overflowY: 'hidden' }}>
      {/* на телефоне комната шире экрана и листается пальцем */}
      <div style={{ position: 'relative', height: '100%', width: mobile ? ROOM_WIDTH_MOBILE : '100%', overflow: 'hidden' }}>
        {/* стена */}
        <div style={{ position: 'absolute', inset: 0, bottom: '30%', background: room.wall }} />
        {/* плинтус и пол */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: '70%', height: 10, background: room.baseboard }} />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 'calc(70% + 10px)', background: room.floor }} />
        {/* окно с погодой: window, sun, cloud, rain, snow, wind — всё озвучивается по нажатию */}
        {roomId === 'living' && <HomeWindow scale={mobile ? 0.75 : 1} />}
        {/* с диско-шаром по комнате бегают цветные огоньки */}
        {roomId === 'disco' && owned.includes('disco-ball') && <DiscoLights />}

        {items.length === 0 && (
          <div className="card col center gap-12" style={{ position: 'absolute', left: '50%', top: '42%', transform: 'translate(-50%, -50%)', padding: 24, zIndex: 50, width: 'min(420px, 90vw)' }}>
            <b style={{ fontSize: 22 }}>{roomId === 'living' ? 'Домик пока пустой' : `${room.name} пока пустая`}</b>
            <span className="muted" style={{ fontWeight: 700, textAlign: 'center', maxWidth: 360 }}>
              {roomId === 'living'
                ? 'Купи в магазине мебель и игрушки — котик будет с ними играть и говорить по-английски!'
                : 'Купи в магазине вещи для этой комнаты — котик будет с ними играть и говорить по-английски!'}
            </span>
            <button className="btn good" onClick={() => nav({ name: 'shop', tab: shopTab })}>
              <WithIcon icon="shop" size={22} color="#fff">В магазин</WithIcon>
            </button>
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
              style={{ position: 'absolute', pointerEvents: 'none', width: 14, height: 14, borderRadius: '50%', background: '#ff1744', boxShadow: '0 0 12px 4px rgba(255,23,68,0.6)', zIndex: 99, x: '-50%', y: '-50%' }}
            />
          )}
        </AnimatePresence>

        {/* всплывающие значки */}
        {floaters.map((f, i) => (
          <motion.span
            key={f.id}
            className="pic"
            style={{ position: 'absolute', left: `${f.x}%`, top: `${f.y}%`, fontSize: 30, zIndex: 120, pointerEvents: 'none' }}
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
                className={`bubble tail-${bubbleAlign}`}
                style={{
                  position: 'absolute', bottom: '100%', marginBottom: 6, zIndex: 130,
                  width: 'max-content', maxWidth: 'min(280px, 78vw)', overflowWrap: 'anywhere',
                  ...(bubbleAlign === 'left' ? { left: 0 } : bubbleAlign === 'right' ? { right: 0 } : { left: '50%', x: '-50%' }),
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                <div style={{ fontSize: mobile ? 19 : 22 }}>{bubble.en}</div>
                <div className="muted" style={{ fontSize: 15 }}>{bubble.ru}</div>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div animate={catFx} transition={{ duration: 0.8 }}>
            <div style={{ transform: facingLeft ? 'scaleX(-1)' : 'none' }}>
              <MyCat
                mood={mood}
                size={mobile ? 92 : 120}
                mirrored={facingLeft}
                onTap={() => {
                  if (busy) return;
                  sfx.meow();
                  lastTapPhrase.current = randomCatPhrase(lastTapPhrase.current);
                  sayOnTap(lastTapPhrase.current);
                }}
                // вслух «six seven» говорит сам котик, здесь только облачко
                onSixSeven={() => sayOnTap({ en: 'Six seven!', ru: 'Шесть-семь!' }, { voice: false })}
              />
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
              <div style={{ marginTop: 6 }}>🚪 Новые комнаты открываются после 5, 10 и 15 пройденных уровней.</div>
              <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>Нажми, чтобы закрыть</div>
            </motion.div>
          )}
          {notice && (
            <motion.div
              className="bubble"
              style={{ position: 'absolute', right: 12, top: 8, zIndex: 150, maxWidth: 'min(340px, calc(100% - 24px))' }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={() => setNotice(null)}
            >
              {notice}
              <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>Нажми, чтобы закрыть</div>
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  );
}

/** Точки пути со сдвигом на shift и с возвратом в начало — чтобы повтор шёл без рывка */
const loop = (points: string[], shift: number) => {
  const p = points.map((_, k) => points[(k + shift) % points.length]);
  return [...p, p[0]];
};

const DISCO_COLORS =['rgba(255,79,216,0.45)', 'rgba(79,195,247,0.45)', 'rgba(255,210,63,0.4)', 'rgba(124,255,160,0.35)'];

/** Цветные пятна света от диско-шара */
function DiscoLights() {
  return (
    <>
      {DISCO_COLORS.map((color, i) => (
        <motion.div
          key={color}
          style={{
            position: 'absolute', width: 180, height: 180, borderRadius: '50%', pointerEvents: 'none', zIndex: 2,
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`, x: '-50%', y: '-50%',
          }}
          animate={{ left: loop(['15%', '80%', '45%', '20%'], i), top: loop(['30%', '75%', '55%', '85%'], i * 2) }}
          transition={{ duration: 7 + i * 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </>
  );
}
