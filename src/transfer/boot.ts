/**
 * Выполняется ДО загрузки хранилища игры (импортируется первым в main.tsx):
 * если в файле вшито сохранение — кладёт его в localStorage.
 */
import { STORAGE_KEY } from '../state/storageKey';
import { APPLIED_KEY, TRANSFER_ELEMENT_ID, type TransferPayload, decideImport } from './transfer';

let pristineHtml = '';

function readApplied(): string[] {
  try {
    return JSON.parse(localStorage.getItem(APPLIED_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function boot() {
  const el = document.getElementById(TRANSFER_ELEMENT_ID);
  let payload: TransferPayload | null = null;
  try {
    payload = el?.textContent ? JSON.parse(el.textContent) : null;
  } catch {
    payload = null;
  }
  // убираем сохранение из DOM, чтобы копия страницы была «чистой» игрой
  el?.remove();
  pristineHtml = '<!doctype html>\n' + document.documentElement.outerHTML;

  if (!payload) return;
  try {
    const applied = readApplied();
    const decision = decideImport(payload, localStorage.getItem(STORAGE_KEY), applied);
    if (decision === 'skip') return;
    const replace =
      decision === 'apply' ||
      window.confirm(
        payload.withProgress
          ? 'В этом файле есть сохранённый прогресс с другого компьютера.\nЗаменить им прогресс, который уже есть на этом компьютере?'
          : 'Этот файл начинает игру с чистого листа.\nСбросить прогресс, который уже есть на этом компьютере?',
      );
    if (replace) localStorage.setItem(STORAGE_KEY, payload.save);
    localStorage.setItem(APPLIED_KEY, JSON.stringify([...applied, payload.id]));
  } catch {
    // localStorage недоступен — просто играем без переноса
  }
}

if (typeof document !== "undefined") boot();

/** HTML игры без вшитого сохранения (есть только в собранной версии) */
export function getPristineHtml(): string {
  return pristineHtml;
}
