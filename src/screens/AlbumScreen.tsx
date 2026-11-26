import { motion } from 'framer-motion';
import { useState } from 'react';
import { speak } from '../audio/speech';
import { Cat } from '../components/cat/Cat';
import { Pic } from '../components/ui/Pic';
import { WithIcon } from '../components/ui/Icon';
import { useIsMobile } from '../components/ui/useIsMobile';
import { getWord } from '../content/words';
import { WORLDS } from '../content/worlds';
import { LEARNED_BOX, learnedCount } from '../engine/srs';
import { useGame } from '../state/store';
import type { Nav } from '../App';

export function AlbumScreen({ nav }: { nav: Nav }) {
  const { bossDefeated, srs } = useGame();
  const [tab, setTab] = useState<'friends' | 'words'>('friends');
  const seen = Object.keys(srs).length;
  const mobile = useIsMobile();

  return (
    <div className="screen" style={{ background: 'linear-gradient(160deg, #fffbe6 0%, #e6f6ff 100%)' }}>
      <div className="topbar">
        <button className="btn white small" onClick={() => nav({ name: 'map' })}>← Карта</button>
        <h1 style={{ fontSize: mobile ? 20 : 30 }}>
          <WithIcon icon="album" size={mobile ? 24 : 32}>Альбом</WithIcon>
        </h1>
        <div className="grow" />
        <button className={`btn small ${tab === 'friends' ? '' : 'white'}`} onClick={() => setTab('friends')}>
          <WithIcon icon="cat" size={20} color={tab === 'friends' ? '#fff' : undefined}>Друзья</WithIcon>
        </button>
        <button className={`btn small ${tab === 'words' ? '' : 'white'}`} onClick={() => setTab('words')}>
          <WithIcon icon="abc" size={20} color={tab === 'words' ? '#fff' : undefined}>Словарик</WithIcon>
        </button>
      </div>

      {tab === 'friends' ? (
        <div className="grow scroll" style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? 'repeat(2, 1fr)' : 'repeat(3, 260px)', gap: mobile ? 10 : 24, alignContent: 'start', padding: mobile ? '0 10px' : 0, width: mobile ? '100%' : undefined }}>
            {WORLDS.map((w, i) => {
              const has = !!bossDefeated[w.id];
              return (
                <motion.div key={w.id} className="card col center" style={{ padding: 16, gap: 6 }} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.08 }}>
                  <div style={{ filter: has ? 'none' : 'brightness(0) opacity(0.15)' }}>
                    <Cat fur={w.friend.fur} accessories={w.friend.accessories} size={mobile ? 80 : 120} mood={has ? 'idle' : 'sleep'} />
                  </div>
                  <b style={{ fontSize: 22 }}>{has ? w.friend.name : '???'}</b>
                  <span className="muted" style={{ fontWeight: 700 }}>
                    {has ? `Из мира «${w.name}»` : `Победи босса: ${w.boss.name}`}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="scroll grow" style={{ padding: mobile ? '0 10px 24px' : '0 32px 32px' }}>
          <div className="subtitle" style={{ marginBottom: 12 }}>
            Встречено слов: {seen}. Хорошо выучено: {learnedCount(srs)} ⭐. Нажми на слово, чтобы послушать.
          </div>
          {seen === 0 && <div className="subtitle">Пока пусто — пройди первый урок!</div>}
          {WORLDS.map((w) => {
            const ids = w.lessons.flatMap((l) => l.words).filter((id) => srs[id]);
            if (!ids.length) return null;
            return (
              <div key={w.id} style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 22, marginBottom: 8 }}>
                  <span className="pic">{w.pic}</span> {w.name}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${mobile ? 150 : 190}px, 1fr))`, gap: 10 }}>
                  {ids.map((id) => {
                    const word = getWord(id);
                    const p = srs[id];
                    return (
                      <motion.button key={id} className="card row gap-12" style={{ padding: '10px 14px', border: 'none', cursor: 'pointer', textAlign: 'left' }} whileHover={{ scale: 1.04 }} onClick={() => speak(word.en)}>
                        <Pic pic={word.pic} size={38} />
                        <div className="col">
                          <b style={{ fontSize: 20 }}>{word.en}</b>
                          <span className="muted" style={{ fontWeight: 700 }}>{word.ru}</span>
                        </div>
                        <div className="grow" />
                        <span title="Насколько хорошо выучено" style={{ fontSize: 13 }}>{p.box >= LEARNED_BOX ? '⭐' : '🐾'.repeat(Math.max(1, p.box))}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
