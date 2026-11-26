import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { Coin, WithIcon } from '../components/ui/Icon';
import { STORAGE_KEY } from '../state/storageKey';
import { useGame } from '../state/store';
import { getPristineHtml } from '../transfer/boot';
import { TRANSFER_FILE_NAME, describeSave, embedPayload, makePayload, makeSave } from '../transfer/transfer';

type Step = 'closed' | 'ask' | 'working' | 'done' | 'error';

/** HTML игры одним файлом: в разработке — свежая сборка с dev-сервера, в собранной версии — сама страница */
async function loadGameHtml(): Promise<string> {
  if (import.meta.env.DEV) {
    const res = await fetch('/__standalone.html');
    if (!res.ok) throw new Error(await res.text());
    return res.text();
  }
  const html = getPristineHtml();
  if (!html.includes('</body>')) throw new Error('Не удалось получить код игры');
  return html;
}

function download(content: string, fileName: string) {
  const url = URL.createObjectURL(new Blob([content], { type: 'text/html;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

/** Перенос игры на другой компьютер (Windows) одним файлом */
export function TransferPanel() {
  const themesCount = useGame((s) => s.customThemes.length);
  const [step, setStep] = useState<Step>('closed');
  const [withProgress, setWithProgress] = useState(true);
  const [includeThemes, setIncludeThemes] = useState(true);
  const [error, setError] = useState('');

  const raw = (() => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  })();
  const info = describeSave(raw);

  const run = async (progress: boolean) => {
    setWithProgress(progress);
    setStep('working');
    try {
      const html = await loadGameHtml();
      const save = makeSave(raw, { withProgress: progress, includeThemes });
      download(embedPayload(html, makePayload(save, progress)), TRANSFER_FILE_NAME);
      setStep('done');
    } catch (e) {
      setError(String(e instanceof Error ? e.message : e).slice(0, 300));
      setStep('error');
    }
  };

  return (
    <div className="card col gap-12" style={{ padding: 20 }}>
      <h3>
        <WithIcon icon="transfer" size={26}>Перенос на другой компьютер</WithIcon>
      </h3>
      <span className="muted" style={{ fontWeight: 700 }}>
        Игра соберётся в один файл <b>{TRANSFER_FILE_NAME}</b>. На компьютере с Windows его достаточно открыть двойным щелчком — ничего устанавливать не нужно.
      </span>
      <div>
        <button className="btn small" onClick={() => setStep('ask')}>
          <WithIcon icon="transfer" size={22} color="#fff">Подготовить перенос</WithIcon>
        </button>
      </div>

      <AnimatePresence>
        {step !== 'closed' && (
          <motion.div
            className="center"
            style={{ position: 'fixed', inset: 0, background: 'rgba(58,51,80,0.45)', zIndex: 60, padding: 16 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => step !== 'working' && setStep('closed')}
          >
            <motion.div
              className="card col gap-16 modal"
              style={{ padding: 28, width: 620, maxWidth: '100%', maxHeight: '100%', overflowY: 'auto' }}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              {step === 'ask' && (
                <>
                  <h2 style={{ fontSize: 26 }}>Нужно ли сохранить прогресс?</h2>
                  <button className="choice" onClick={() => void run(true)}>
                    <span className="pic" style={{ fontSize: 36 }}>💾</span>
                    <span className="col">
                      <b>Да, перенести прогресс</b>
                      <span className="muted">
                        {info.catName ? `Котик «${info.catName}», ` : ''}
                        {info.coins} <Coin size={16} />, пройдено уроков: {info.lessons}, покупки, домик{info.themes ? `, свои темы: ${info.themes}` : ''}
                      </span>
                    </span>
                  </button>
                  <button className="choice" onClick={() => void run(false)}>
                    <span className="pic" style={{ fontSize: 36 }}>✨</span>
                    <span className="col">
                      <b>Нет, начать игру заново</b>
                      <span className="muted">На новом компьютере игра начнётся с выбора котика</span>
                    </span>
                  </button>
                  {themesCount > 0 && (
                    <label className="row gap-8" style={{ fontWeight: 700 }}>
                      <input type="checkbox" checked={includeThemes} onChange={(e) => setIncludeThemes(e.target.checked)} />
                      При новой игре взять с собой мои темы и словари ({themesCount})
                    </label>
                  )}
                  <span className="muted" style={{ fontWeight: 600 }}>
                    Прогресс на этом компьютере в любом случае останется. Дальше на двух компьютерах он будет вестись отдельно.
                  </span>
                  <div>
                    <button className="btn white small" onClick={() => setStep('closed')}>Отмена</button>
                  </div>
                </>
              )}

              {step === 'working' && (
                <div className="col center gap-12" style={{ padding: 30 }}>
                  <motion.span className="pic" style={{ fontSize: 50 }} animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}>
                    🧶
                  </motion.span>
                  <b>Собираю файл игры…</b>
                </div>
              )}

              {step === 'done' && (
                <>
                  <h2 style={{ fontSize: 26 }}>
                    <WithIcon icon="check" size={30}>Файл готов</WithIcon>
                  </h2>
                  <span style={{ fontWeight: 700 }}>
                    Файл <b>{TRANSFER_FILE_NAME}</b> скачан в папку «Загрузки» {withProgress ? '— прогресс уже внутри.' : '— игра начнётся заново.'}
                  </span>
                  <ol className="steps">
                    <li>Перенесите файл на компьютер с Windows: на флешке, через облако (Яндекс Диск, Google Drive) или письмом самому себе.</li>
                    <li>
                      Положите его в постоянное место, например в папку <b>«Документы»</b>, и запускайте всегда оттуда.
                    </li>
                    <li>
                      Дважды щёлкните по файлу — игра откроется в <b>Microsoft Edge</b> или <b>Google Chrome</b>.
                      {withProgress && ' При первом запуске прогресс загрузится сам.'}
                    </li>
                    <li>
                      Для удобства сделайте ярлык: правой кнопкой по файлу → <b>«Отправить» → «Рабочий стол (создать ярлык)»</b>.
                    </li>
                    <li>Интернет нужен только для шрифта и некоторых значков — без него игра тоже работает.</li>
                  </ol>
                  <div>
                    <button className="btn good small" onClick={() => setStep('closed')}>Готово</button>
                  </div>
                </>
              )}

              {step === 'error' && (
                <>
                  <h2 style={{ fontSize: 24 }}>Не получилось собрать файл</h2>
                  <code style={{ whiteSpace: 'pre-wrap', fontSize: 13, background: '#f7f4fb', padding: 10, borderRadius: 8 }}>{error}</code>
                  <span className="muted" style={{ fontWeight: 600 }}>
                    Попробуйте ещё раз. Если запускаете игру через <code>npm run dev</code>, проверьте, что сервер работает.
                  </span>
                  <div className="row gap-12">
                    <button className="btn white small" onClick={() => setStep('closed')}>Закрыть</button>
                    <button className="btn small" onClick={() => setStep('ask')}>Ещё раз</button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
