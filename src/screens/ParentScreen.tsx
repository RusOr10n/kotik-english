import { useEffect, useState } from 'react';
import { WithIcon } from '../components/ui/Icon';
import { englishVoices, speak } from '../audio/speech';
import { getWord, hasWord } from '../content/words';
import { CustomThemesPanel } from './CustomThemesPanel';
import { GrantCoins } from './GrantCoins';
import { ImportProgress } from './ImportProgress';
import { TransferPanel } from './TransferPanel';
import { ALL_LESSONS, WORLDS } from '../content/worlds';
import { learnedCount } from '../engine/srs';
import { useGame } from '../state/store';
import type { Nav } from '../App';

export function ParentScreen({ nav }: { nav: Nav }) {
  const state = useGame();
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    const load = () => setVoices(englishVoices());
    load();
    window.speechSynthesis?.addEventListener('voiceschanged', load);
    return () => window.speechSynthesis?.removeEventListener('voiceschanged', load);
  }, []);

  const lessonsDone = ALL_LESSONS.filter((x) => state.lessonStars[x.lesson.id]).length;
  const bossesDone = WORLDS.filter((w) => state.bossDefeated[w.id]).length;
  const hardest = Object.entries(state.srs)
    .filter(([id, p]) => p.wrong > 0 && hasWord(id))
    .sort((a, b) => b[1].wrong - a[1].wrong)
    .slice(0, 10);

  const stat = (label: string, value: string | number) => (
    <div className="card col center" style={{ padding: 16, minWidth: 'min(150px, 40vw)', flex: '1 1 130px' }}>
      <b style={{ fontSize: 34 }}>{value}</b>
      <span className="muted" style={{ fontWeight: 700, textAlign: 'center' }}>{label}</span>
    </div>
  );

  return (
    <div className="screen" style={{ background: '#f4f2f8', userSelect: 'text' }}>
      <div className="topbar">
        <button className="btn white small" onClick={() => nav({ name: 'map' })}>← Карта</button>
        <h1 style={{ fontSize: 28 }}>
          <WithIcon icon="settings" size={30}>Для родителей</WithIcon>
        </h1>
      </div>
      <div className="scroll grow col gap-24" style={{ padding: '0 clamp(10px, 3vw, 32px) 32px' }}>
        <div className="row gap-16" style={{ flexWrap: 'wrap' }}>
          {stat('уроков пройдено', `${lessonsDone} / ${ALL_LESSONS.length}`)}
          {stat('боссов побеждено', `${bossesDone} / ${WORLDS.length}`)}
          {stat('слов встречено', Object.keys(state.srs).length)}
          {stat('слов выучено', learnedCount(state.srs))}
          {stat('минут занятий', state.minutes)}
          {stat('занятий', state.sessions)}
          {stat('дней подряд', state.streak.count)}
        </div>

        <GrantCoins />

        <CustomThemesPanel nav={nav} />

        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ marginBottom: 10 }}>Слова с ошибками</h3>
          {hardest.length === 0 ? (
            <span className="muted">Пока ошибок нет.</span>
          ) : (
            <div className="row gap-8" style={{ flexWrap: 'wrap' }}>
              {hardest.map(([id, p]) => (
                <span key={id} className="pill" style={{ background: '#fff2f2' }}>
                  {getWord(id).pic} {getWord(id).en} — {getWord(id).ru} · ошибок: {p.wrong}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="card col gap-16" style={{ padding: 20 }}>
          <h3>Настройки</h3>
          <div className="col gap-8">
            <b>Голос озвучки</b>
            <div className="row gap-8" style={{ flexWrap: 'wrap' }}>
              <select
                value={state.settings.voiceName ?? ''}
                onChange={(e) => state.updateSettings({ voiceName: e.target.value || null })}
                style={{ flex: '1 1 220px', minWidth: 0, maxWidth: '100%', fontSize: 16, padding: '8px 10px', borderRadius: 10, border: '2px solid #e3dced', background: '#fff' }}
              >
                <option value="">Автоматически</option>
                {voices.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
              <button className="btn white small" onClick={() => speak('Hello! I am a cat. I like milk.')}>
                ▶ Проверить
              </button>
            </div>
            {voices.length === 0 && <span className="muted">Браузер не предоставил английских голосов. Лучше всего работает Chrome или Safari.</span>}
          </div>
          <div className="col gap-8">
            <b>Скорость речи: {state.settings.rate.toFixed(2)}</b>
            <input
              type="range"
              min={0.5}
              max={1.2}
              step={0.05}
              value={state.settings.rate}
              onChange={(e) => state.updateSettings({ rate: Number(e.target.value) })}
              style={{ width: '100%', maxWidth: 360 }}
            />
          </div>
          <label className="check-row">
            <input type="checkbox" checked={state.settings.muted} onChange={(e) => state.updateSettings({ muted: e.target.checked })} />
            <span>Выключить звуковые эффекты (озвучка слов останется)</span>
          </label>
          <label className="check-row">
            <input type="checkbox" checked={state.settings.unlockAll} onChange={(e) => state.updateSettings({ unlockAll: e.target.checked })} />
            <span>Открыть все уровни (для проверки)</span>
          </label>
        </div>

        <TransferPanel />
        <ImportProgress />

        <div className="card row gap-16" style={{ padding: 20, flexWrap: 'wrap' }}>
          <h3 className="grow">Сбросить весь прогресс</h3>
          {confirmReset ? (
            <>
              <span style={{ fontWeight: 700 }}>Точно? Это удалит котика, монеты и прогресс.</span>
              <button className="btn white small" onClick={() => setConfirmReset(false)}>Отмена</button>
              <button
                className="btn small"
                style={{ background: 'var(--bad)', boxShadow: '0 6px 0 var(--bad-dark)' }}
                onClick={() => {
                  state.reset();
                  nav({ name: 'onboarding' });
                }}
              >
                Да, сбросить
              </button>
            </>
          ) : (
            <button className="btn white small" onClick={() => setConfirmReset(true)}>Сбросить…</button>
          )}
        </div>
      </div>
    </div>
  );
}
