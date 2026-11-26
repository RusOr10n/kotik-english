import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { platform, promptInstall, useInstallState } from '../../pwa/install';
import { Icon } from './Icon';
import { useIsMobile } from './useIsMobile';

/** Кнопка «Добавить на главный экран» — только на телефоне и если игра ещё не установлена */
export function InstallButton() {
  const mobile = useIsMobile();
  const { standalone } = useInstallState();
  const [help, setHelp] = useState(false);
  if (!mobile || standalone) return null;

  const onClick = async () => {
    const shown = await promptInstall();
    if (!shown) setHelp(true);
  };
  const os = platform();
  // скачанный файл на Android открывается как content://, на компьютере — file://
  const isFile = typeof location !== 'undefined' && !/^https?:$/.test(location.protocol);

  return (
    <>
      <button className="btn white small menu-btn" title="Добавить на главный экран" onClick={() => void onClick()}>
        <Icon name="install" />
      </button>
      <AnimatePresence>
        {help && (
          <motion.div
            className="center"
            style={{ position: 'fixed', inset: 0, background: 'rgba(58,51,80,0.45)', zIndex: 70, padding: 16 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setHelp(false)}
          >
            <motion.div className="card col gap-12" style={{ padding: 22, width: 420, maxWidth: '100%' }} initial={{ scale: 0.8 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()}>
              <h2 className="row gap-8" style={{ fontSize: 22 }}>
                <Icon name="install" size={28} /> Добавить игру на главный экран
              </h2>
              {isFile ? (
                <div className="col gap-8" style={{ fontWeight: 700 }}>
                  <span>Игра открыта из скачанного файла — для таких страниц Chrome не умеет добавлять значок на главный экран.</span>
                  <span>Попросите взрослого выложить игру в интернет (по https-ссылке) и открыть эту ссылку в Chrome — тогда кнопка «На главный экран» сработает.</span>
                  <span className="muted">Подробно — в файле README.md, раздел «Телефон (Android)».</span>
                </div>
              ) : os === 'ios' ? (
                <ol className="steps">
                  <li>Нажмите кнопку «Поделиться» <b>⬆️</b> внизу экрана Safari.</li>
                  <li>Выберите <b>«На экран Домой»</b>.</li>
                  <li>Нажмите <b>«Добавить»</b> — на экране появится котик 🐱.</li>
                </ol>
              ) : (
                <ol className="steps">
                  <li>
                    Нажмите <b>⋮</b> (три точки) в правом верхнем углу Chrome.
                  </li>
                  <li>
                    Выберите <b>«Добавить на главный экран»</b> или <b>«Установить приложение»</b>.
                  </li>
                  <li>
                    Нажмите <b>«Добавить»</b> — на экране появится значок с котиком 🐱.
                  </li>
                </ol>
              )}
              <span className="muted" style={{ fontWeight: 600 }}>Игра будет открываться во весь экран, как обычное приложение.</span>
              <button className="btn good small" style={{ alignSelf: 'flex-start' }} onClick={() => setHelp(false)}>
                Понятно
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
