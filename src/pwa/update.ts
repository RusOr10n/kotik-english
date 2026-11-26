/**
 * Автообновление: игра, открытая со значка на телефоне, часто просто «просыпается» из памяти
 * со старой версией. Проверяем version.json и перезагружаемся, если вышла новая сборка.
 * Прогресс не теряется — он сохраняется после каждого шага.
 */

const RELOADED_KEY = 'kitty-reloaded-for';
const CHECK_EVERY_MS = 30 * 60 * 1000;

/** Нужно ли перезагрузиться: есть новая сборка и ради неё мы ещё не перезагружались (защита от зацикливания) */
export function needsReload(current: string, latest: string | null, alreadyReloadedFor: string | null): boolean {
  return !!latest && latest !== current && latest !== alreadyReloadedFor;
}

async function check() {
  try {
    const res = await fetch(`./version.json?t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return;
    const latest = String((await res.json()).build ?? '');
    let reloadedFor: string | null = null;
    try {
      reloadedFor = sessionStorage.getItem(RELOADED_KEY);
    } catch {
      // нет sessionStorage — просто не защищаемся от повторов
    }
    if (!needsReload(__BUILD_ID__, latest, reloadedFor)) return;
    try {
      sessionStorage.setItem(RELOADED_KEY, latest);
    } catch {
      // ничего страшного
    }
    // сначала обновляем service worker, чтобы после перезагрузки он отдал свежую страницу
    const reg = await navigator.serviceWorker?.getRegistration?.();
    await reg?.update().catch(() => undefined);
    location.reload();
  } catch {
    // нет сети — играем в текущей версии
  }
}

export function startUpdateChecks() {
  if (!/^https?:$/.test(location.protocol)) return; // файл с диска: обновлять неоткуда
  void check();
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') void check();
  });
  window.addEventListener('focus', () => void check());
  setInterval(() => void check(), CHECK_EVERY_MS);
}
