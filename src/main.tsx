// перенос сохранения должен выполниться до загрузки хранилища
import './transfer/boot';
import { registerServiceWorker } from './pwa/install';
import { startUpdateChecks } from './pwa/update';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles.css';

if (!import.meta.env.DEV) {
  registerServiceWorker();
  startUpdateChecks();
}

// Высота игры = видимая часть экрана: на телефоне её уменьшают панель браузера и клавиатура,
// иначе низ экрана (кнопка «Дальше» / «Понятно») может оказаться под ними
function updateAppHeight() {
  const h = window.visualViewport?.height ?? window.innerHeight;
  document.documentElement.style.setProperty('--app-h', `${Math.round(h)}px`);
}
updateAppHeight();
window.visualViewport?.addEventListener('resize', updateAppHeight);
window.addEventListener('resize', updateAppHeight);
window.addEventListener('orientationchange', updateAppHeight);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
