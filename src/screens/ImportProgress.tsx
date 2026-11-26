import { useRef, useState } from 'react';
import { STORAGE_KEY } from '../state/storageKey';
import { APPLIED_KEY, describeSave, extractPayload } from '../transfer/transfer';

/** Загрузка прогресса из файла переноса — например, на телефоне, где игра открыта по ссылке */
export function ImportProgress() {
  const input = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const load = async (file: File) => {
    setMessage(null);
    const payload = extractPayload(await file.text());
    if (!payload) {
      setMessage({ ok: false, text: 'В этом файле нет сохранения. Выберите файл kotik-english.html, созданный кнопкой «Подготовить перенос».' });
      return;
    }
    const info = describeSave(payload.save);
    const what = payload.withProgress
      ? `котик «${info.catName ?? '—'}», ${info.coins} 🪙, уроков пройдено: ${info.lessons}`
      : 'новая игра (без прогресса)';
    if (!window.confirm(`Загрузить из файла: ${what}?\nТекущий прогресс на этом устройстве будет заменён.`)) return;
    try {
      localStorage.setItem(STORAGE_KEY, payload.save);
      const applied: string[] = JSON.parse(localStorage.getItem(APPLIED_KEY) ?? '[]');
      localStorage.setItem(APPLIED_KEY, JSON.stringify([...applied, payload.id]));
      location.reload();
    } catch {
      setMessage({ ok: false, text: 'Браузер не дал сохранить прогресс. Проверьте, что сайт не открыт в режиме инкогнито.' });
    }
  };

  return (
    <div className="card col gap-12" style={{ padding: 20 }}>
      <h3>📥 Загрузить прогресс из файла</h3>
      <span className="muted" style={{ fontWeight: 700 }}>
        Выберите файл <b>kotik-english.html</b>, созданный кнопкой «Подготовить перенос» на другом устройстве. Удобно, чтобы перенести прогресс на телефон.
      </span>
      <input
        ref={input}
        type="file"
        accept=".html,text/html"
        style={{ display: 'none' }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void load(f);
          e.target.value = '';
        }}
      />
      <div>
        <button className="btn white small" onClick={() => input.current?.click()}>📂 Выбрать файл</button>
      </div>
      {message && <span style={{ fontWeight: 700, color: message.ok ? 'var(--good-dark)' : 'var(--bad-dark)' }}>{message.text}</span>}
    </div>
  );
}
