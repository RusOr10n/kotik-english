import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { speak } from '../../audio/speech';
import { sfx } from '../../audio/sfx';

/** Погода за окном домика: меняется сама, всё озвучивается по нажатию */
export type Weather = 'sunny' | 'rainy' | 'snowy' | 'windy';

const WEATHERS: Weather[] = ['sunny', 'rainy', 'snowy', 'windy'];
const CHANGE_EVERY_MS = 25_000;

const SKY: Record<Weather, string> = {
  sunny: 'linear-gradient(180deg, #8fd3ff 0%, #d6f1ff 100%)',
  rainy: 'linear-gradient(180deg, #8d9fb3 0%, #c3cfdc 100%)',
  snowy: 'linear-gradient(180deg, #b7c7dd 0%, #eef3fa 100%)',
  windy: 'linear-gradient(180deg, #a3d5ee 0%, #dff1fa 100%)',
};

/** Что говорим, если нажали на небо: в ясную погоду — само окно, иначе — погоду */
const SKY_WORD: Record<Weather, string> = { sunny: 'window', rainy: 'rain', snowy: 'snow', windy: 'wind' };

export function pickNextWeather(current: Weather, rnd: number = Math.random()): Weather {
  const others = WEATHERS.filter((w) => w !== current);
  return others[Math.min(others.length - 1, Math.floor(rnd * others.length))];
}

const say = (word: string) => (e: React.MouseEvent) => {
  e.stopPropagation();
  sfx.click();
  void speak(word);
};

export function HomeWindow({ scale = 1 }: { scale?: number }) {
  const [weather, setWeather] = useState<Weather>(() => WEATHERS[Math.floor(Math.random() * WEATHERS.length)]);

  useEffect(() => {
    const t = setInterval(() => setWeather((w) => pickNextWeather(w)), CHANGE_EVERY_MS);
    return () => clearInterval(t);
  }, []);

  const cloudy = weather === 'rainy' || weather === 'snowy';

  return (
    <div
      title="window"
      onClick={say('window')}
      style={{
        position: 'absolute', left: '50%', top: '6%', transform: `translateX(-50%) scale(${scale})`, transformOrigin: 'top center',
        width: 240, height: 160, cursor: 'pointer', zIndex: 2,
      }}
    >
      {/* рама: нажатие на неё — window */}
      {/* isolation: облака, дождь и перекладина живут в своём слое внутри рамки и не вылезают на шторки */}
      <div style={{ position: 'absolute', inset: 0, border: '10px solid #fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 6px 0 rgba(0,0,0,0.08)', isolation: 'isolate', zIndex: 0 }}>
        {/* небо: нажатие — погода (rain / snow / wind), в ясную погоду — window */}
        <motion.div
          onClick={say(SKY_WORD[weather])}
          title={SKY_WORD[weather]}
          style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}
          animate={{ background: SKY[weather] }}
          transition={{ duration: 1.5 }}
        >
          <AnimatePresence>
            {!cloudy && (
              <motion.span
                key="sun"
                className="pic"
                title="sun"
                onClick={say('sun')}
                style={{ position: 'absolute', right: 18, top: 10, fontSize: 36, cursor: 'pointer' }}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1, rotate: [0, 15, 0] }}
                exit={{ y: 40, opacity: 0 }}
                transition={{ rotate: { duration: 6, repeat: Infinity }, default: { duration: 1 } }}
              >
                ☀️
              </motion.span>
            )}
          </AnimatePresence>

          {/* облака: при ветре летят быстрее, в дождь и снег их больше и они темнее */}
          {[0, 1, ...(cloudy ? [2] : [])].map((i) => (
            <motion.span
              key={`cloud-${i}`}
              className="pic"
              title="cloud"
              onClick={say('cloud')}
              style={{
                position: 'absolute', top: 8 + i * 22, fontSize: 30 + (i % 2) * 6, cursor: 'pointer',
                filter: cloudy ? 'grayscale(0.6) brightness(0.85)' : 'none', zIndex: 2,
              }}
              animate={{ left: [-60, 260] }}
              transition={{ duration: weather === 'windy' ? 5 + i : 16 + i * 5, repeat: Infinity, ease: 'linear', delay: -i * 6 }}
            >
              ☁️
            </motion.span>
          ))}

          {/* дождь */}
          {weather === 'rainy' &&
            Array.from({ length: 16 }, (_, i) => (
              <motion.div
                key={`rain-${i}`}
                style={{ position: 'absolute', left: `${(i * 37) % 100}%`, width: 2, height: 12, borderRadius: 2, background: '#4a7fc0', pointerEvents: 'none' }}
                initial={{ top: '-10%' }}
                animate={{ top: '110%' }}
                transition={{ duration: 0.7 + (i % 4) * 0.12, repeat: Infinity, ease: 'linear', delay: (i % 7) * 0.13 }}
              />
            ))}

          {/* снег */}
          {weather === 'snowy' &&
            Array.from({ length: 14 }, (_, i) => (
              <motion.span
                key={`snow-${i}`}
                style={{ position: 'absolute', left: `${(i * 29) % 100}%`, color: '#fff', fontSize: 10 + (i % 3) * 4, pointerEvents: 'none', textShadow: '0 0 2px #9fb4cf' }}
                initial={{ top: '-10%' }}
                animate={{ top: '110%', x: [0, 8, -6, 0] }}
                transition={{ top: { duration: 3.5 + (i % 4) * 0.6, repeat: Infinity, ease: 'linear', delay: (i % 6) * 0.5 }, x: { duration: 2.5, repeat: Infinity } }}
              >
                ❄
              </motion.span>
            ))}

          {/* ветер: летят листики и полоски */}
          {weather === 'windy' && (
            <>
              {Array.from({ length: 5 }, (_, i) => (
                <motion.div
                  key={`gust-${i}`}
                  style={{ position: 'absolute', top: 30 + i * 22, height: 3, width: 40, borderRadius: 3, background: 'rgba(255,255,255,0.8)', pointerEvents: 'none' }}
                  initial={{ left: -50 }}
                  animate={{ left: 260 }}
                  transition={{ duration: 1.2 + (i % 3) * 0.3, repeat: Infinity, ease: 'easeIn', delay: i * 0.35 }}
                />
              ))}
              {Array.from({ length: 4 }, (_, i) => (
                <motion.span
                  key={`leaf-${i}`}
                  className="pic"
                  style={{ position: 'absolute', fontSize: 18, pointerEvents: 'none' }}
                  initial={{ left: -30, top: 40 + i * 20 }}
                  animate={{ left: 260, top: [40 + i * 20, 20 + i * 20, 60 + i * 15], rotate: 360 }}
                  transition={{ duration: 2.4 + i * 0.4, repeat: Infinity, ease: 'linear', delay: i * 0.6 }}
                >
                  🍃
                </motion.span>
              ))}
            </>
          )}
        </motion.div>
        {/* перекладина рамы */}
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 8, marginLeft: -4, background: '#fff', zIndex: 3 }} />
      </div>
      {/* шторки */}
      <div style={{ position: 'absolute', left: -22, top: -8, width: 40, height: 180, background: '#ff9ec4', borderRadius: '0 0 20px 20px', zIndex: 1 }} />
      <div style={{ position: 'absolute', right: -22, top: -8, width: 40, height: 180, background: '#ff9ec4', borderRadius: '0 0 20px 20px', zIndex: 1 }} />
    </div>
  );
}
