import { useMemo, useRef, useState } from 'react';
import { Pic } from '../components/ui/Pic';
import {
  type CustomTheme,
  EXAMPLE_DRAFT,
  MAX_WORDS,
  MIN_WORDS,
  THEME_ICONS,
  type ThemeDraft,
  parsePhrases,
  parseThemeFile,
  parseWords,
  splitIntoLessons,
} from '../content/custom';
import { findBuiltinByEn } from '../content/words';
import { WORLDS } from '../content/worlds';
import { useGame } from '../state/store';
import type { Nav } from '../App';

const EMPTY: ThemeDraft = { name: '', pic: '⭐', wordsText: '', phrasesText: '' };

const textareaStyle: React.CSSProperties = {
  width: '100%',
  minHeight: 150,
  fontFamily: 'ui-monospace, Menlo, monospace',
  fontSize: 15,
  padding: 10,
  borderRadius: 12,
  border: '2px solid #e3dced',
  resize: 'vertical',
};

/** Загрузка своей темы и словаря: из неё получается новый уровень на карте */
export function CustomThemesPanel({ nav }: { nav: Nav }) {
  const themes = useGame((s) => s.customThemes);
  const addCustomTheme = useGame((s) => s.addCustomTheme);
  const removeCustomTheme = useGame((s) => s.removeCustomTheme);
  const [draft, setDraft] = useState<ThemeDraft>(EMPTY);
  const [fileError, setFileError] = useState<string | null>(null);
  const [created, setCreated] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const words = useMemo(() => parseWords(draft.wordsText), [draft.wordsText]);
  const phrases = useMemo(() => parsePhrases(draft.phrasesText), [draft.phrasesText]);
  const lessonsCount = words.items.length >= MIN_WORDS ? splitIntoLessons(words.items).length : 0;

  const problems = [
    !draft.name.trim() && 'Введите название темы',
    words.items.length < MIN_WORDS && `Нужно хотя бы ${MIN_WORDS} слова (сейчас ${words.items.length})`,
    words.items.length > MAX_WORDS && `Не больше ${MAX_WORDS} слов (сейчас ${words.items.length}) — разбейте на несколько тем`,
  ].filter(Boolean) as string[];

  const update = (patch: Partial<ThemeDraft>) => {
    setCreated(null);
    setDraft((d) => ({ ...d, ...patch }));
  };

  const loadFile = async (file: File) => {
    setFileError(null);
    try {
      update(parseThemeFile(file.name, await file.text()));
    } catch {
      setFileError('Не получилось прочитать файл. Подойдёт .txt, .csv или .json в формате, описанном ниже.');
    }
  };

  const create = () => {
    if (problems.length) return;
    const theme: CustomTheme = {
      id: `custom-${Date.now().toString(36)}`,
      name: draft.name.trim(),
      pic: draft.pic,
      words: words.items,
      phrases: phrases.items,
      createdAt: Date.now(),
    };
    addCustomTheme(theme);
    setCreated(theme.id);
    setDraft(EMPTY);
  };

  return (
    <div className="card col gap-16" style={{ padding: 20 }}>
      <h3>📚 Свои темы и словари</h3>
      <span className="muted" style={{ fontWeight: 700 }}>
        Добавьте слова, которые дочь проходит в школе. Из них получится новый уровень на карте с уроками, мини-играми и боссом. Такие уровни открыты сразу.
      </span>

      {themes.length > 0 && (
        <div className="col gap-8">
          {themes.map((t) => (
            <div key={t.id} className="row gap-12" style={{ background: '#f7f4fb', borderRadius: 12, padding: '8px 14px', flexWrap: 'wrap' }}>
              <span className="pic" style={{ fontSize: 28 }}>{t.pic}</span>
              <b style={{ fontSize: 18 }}>{t.name}</b>
              <span className="muted" style={{ fontWeight: 700 }}>
                {t.words.length} слов, {t.phrases.length} фраз
              </span>
              <div className="grow" />
              {confirmDelete === t.id ? (
                <>
                  <span style={{ fontWeight: 700 }}>Удалить тему и её прогресс?</span>
                  <button className="btn white small" onClick={() => setConfirmDelete(null)}>Нет</button>
                  <button
                    className="btn small"
                    style={{ background: 'var(--bad)', boxShadow: '0 6px 0 var(--bad-dark)' }}
                    onClick={() => {
                      removeCustomTheme(t.id);
                      setConfirmDelete(null);
                    }}
                  >
                    Да, удалить
                  </button>
                </>
              ) : (
                <>
                  <button className="btn white small" onClick={() => nav({ name: 'map', worldIndex: WORLDS.findIndex((w) => w.id === t.id) })}>
                    🗺️ На карту
                  </button>
                  <button className="btn white small" onClick={() => setConfirmDelete(t.id)}>🗑️</button>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {created && (
        <div className="row gap-12" style={{ background: '#d9f8e6', borderRadius: 12, padding: '12px 16px', fontWeight: 800 }}>
          🎉 Новый уровень появился на карте!
          <div className="grow" />
          <button className="btn good small" onClick={() => nav({ name: 'map', worldIndex: WORLDS.findIndex((w) => w.id === created) })}>
            Открыть уровень
          </button>
        </div>
      )}

      <div className="col gap-12" style={{ borderTop: '2px dashed #e3dced', paddingTop: 16 }}>
        <div className="row gap-12" style={{ flexWrap: 'wrap' }}>
          <b>Новая тема:</b>
          <input
            value={draft.name}
            maxLength={30}
            placeholder="Название, например «Погода»"
            onChange={(e) => update({ name: e.target.value })}
            style={{ fontSize: 17, padding: '8px 12px', borderRadius: 10, border: '2px solid #e3dced', width: 280, maxWidth: '100%' }}
          />
          <input
            ref={fileInput}
            type="file"
            accept=".txt,.csv,.json,text/plain,application/json"
            style={{ display: 'none' }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void loadFile(f);
              e.target.value = '';
            }}
          />
          <button className="btn white small" onClick={() => fileInput.current?.click()}>📂 Загрузить из файла</button>
          <button className="btn white small" onClick={() => update(EXAMPLE_DRAFT)}>✨ Вставить пример</button>
        </div>
        {fileError && <span style={{ color: 'var(--bad-dark)', fontWeight: 700 }}>{fileError}</span>}

        <div className="row gap-8" style={{ flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 700 }}>Значок:</span>
          {THEME_ICONS.map((icon) => (
            <button
              key={icon}
              onClick={() => update({ pic: icon })}
              style={{
                fontSize: 24, width: 44, height: 44, borderRadius: 10, cursor: 'pointer', background: '#fff',
                border: draft.pic === icon ? '3px solid var(--primary)' : '2px solid #e3dced',
              }}
            >
              <span className="pic">{icon}</span>
            </button>
          ))}
        </div>

        <div className="row gap-16 stack-mobile" style={{ alignItems: 'stretch' }}>
          <label className="col gap-8 grow">
            <b>Слова — по одному на строку: английское - русское - эмодзи (необязательно)</b>
            <textarea
              style={textareaStyle}
              value={draft.wordsText}
              placeholder={'snow - снег - ❄️\nwind - ветер\ncloud - облако - ☁️\nrainbow - радуга'}
              onChange={(e) => update({ wordsText: e.target.value })}
            />
          </label>
          <label className="col gap-8 grow">
            <b>Фразы (необязательно): английская - русская</b>
            <textarea
              style={textareaStyle}
              value={draft.phrasesText}
              placeholder={'It is cold today - Сегодня холодно\nI like snow - Я люблю снег'}
              onChange={(e) => update({ phrasesText: e.target.value })}
            />
          </label>
        </div>

        {/* предпросмотр */}
        {words.items.length > 0 && (
          <div className="row gap-8" style={{ flexWrap: 'wrap' }}>
            {words.items.map((w) => {
              const pic = w.pic || findBuiltinByEn(w.en)?.pic;
              return (
                <span key={w.en} className="pill" style={{ fontSize: 16, background: '#f7f4fb' }}>
                  {pic ? <Pic pic={pic} size={20} /> : '🔤'} {w.en} — {w.ru}
                </span>
              );
            })}
          </div>
        )}
        {[...words.errors, ...phrases.errors].map((e) => (
          <span key={e} style={{ color: 'var(--bad-dark)', fontWeight: 700 }}>⚠️ {e}</span>
        ))}

        <div className="row gap-16 stack-mobile">
          <span className="muted grow" style={{ fontWeight: 700 }}>
            {problems.length
              ? problems.join('. ')
              : `Получится уровень: ${lessonsCount} ${lessonsCount === 1 ? 'урок' : lessonsCount < 5 ? 'урока' : 'уроков'} + босс. Слова без эмодзи будут показаны переводом.`}
          </span>
          <button className="btn good" disabled={problems.length > 0} onClick={create}>
            ➕ Создать уровень
          </button>
        </div>

        <details>
          <summary style={{ cursor: 'pointer', fontWeight: 800 }}>Какие файлы можно загрузить?</summary>
          <div className="muted" style={{ fontWeight: 600, lineHeight: 1.6, marginTop: 8 }}>
            <b>.txt или .csv</b> — слово на каждой строке: <code>cat - кошка - 🐱</code>, <code>cat;кошка</code> или <code>cat,кошка,🐱</code>. Фразы — после строки <code>Фразы:</code>. Строки с <code>#</code> пропускаются.
            <br />
            <b>.json</b> —{' '}
            <code>{'{"name": "Погода", "pic": "🌈", "words": [{"en": "snow", "ru": "снег", "pic": "❄️"}], "phrases": [{"en": "I like snow", "ru": "Я люблю снег"}]}'}</code>
            <br />
            Эмодзи можно не указывать: для знакомых игре слов картинка подставится сама, для остальных вместо картинки будет перевод.
          </div>
        </details>
      </div>
    </div>
  );
}
