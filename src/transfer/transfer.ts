/**
 * Перенос игры на другой компьютер: игра собирается в один HTML-файл,
 * внутрь которого (по желанию) вшивается сохранение.
 */

export const TRANSFER_ELEMENT_ID = 'kitty-transfer';
export const APPLIED_KEY = 'kitty-english-transfers';
export const TRANSFER_FILE_NAME = 'kotik-english.html';

export type TransferPayload = {
  /** уникальный id — чтобы сохранение применялось только один раз */
  id: string;
  createdAt: number;
  withProgress: boolean;
  /** строка для localStorage (формат zustand persist) */
  save: string;
};

type Persisted = { state: Record<string, unknown> & { settings?: Record<string, unknown> }; version: number };

/** Готовит сохранение для переноса */
export function makeSave(raw: string | null, opts: { withProgress: boolean; includeThemes: boolean }): string {
  const parsed: Persisted = raw ? JSON.parse(raw) : { state: {}, version: 1 };
  // голоса на другом компьютере другие — выберутся автоматически
  const settings = { ...(parsed.state.settings ?? {}), voiceName: null };
  if (opts.withProgress) {
    return JSON.stringify({ ...parsed, state: { ...parsed.state, settings } });
  }
  return JSON.stringify({
    version: parsed.version,
    state: {
      customThemes: opts.includeThemes ? (parsed.state.customThemes ?? []) : [],
      settings: { ...settings, unlockAll: false },
    },
  });
}

export function makePayload(save: string, withProgress: boolean): TransferPayload {
  return { id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`, createdAt: Date.now(), withProgress, save };
}

/** Вшивает сохранение в HTML игры (перед последним </body>) */
export function embedPayload(html: string, payload: TransferPayload): string {
  // «<» экранируем, чтобы содержимое не могло закрыть тег script
  const json = JSON.stringify(payload).replace(/</g, '\\u003c');
  const tag = `<script type="application/json" id="${TRANSFER_ELEMENT_ID}">${json}<` + `/script>`;
  const at = html.lastIndexOf('</body>');
  if (at < 0) throw new Error('В файле игры нет </body>');
  return html.slice(0, at) + tag + '\n' + html.slice(at);
}

/** Достаёт сохранение из файла переноса (kotik-english.html) */
export function extractPayload(html: string): TransferPayload | null {
  const marker = `id="${TRANSFER_ELEMENT_ID}">`;
  const start = html.lastIndexOf(marker);
  if (start < 0) return null;
  const end = html.indexOf('<' + '/script>', start);
  if (end < 0) return null;
  try {
    const payload = JSON.parse(html.slice(start + marker.length, end)) as TransferPayload;
    return typeof payload?.save === 'string' ? payload : null;
  } catch {
    return null;
  }
}

export type ImportDecision = 'skip' | 'apply' | 'ask';

/** Применять ли вшитое сохранение на этом компьютере */
export function decideImport(payload: TransferPayload, existingRaw: string | null, appliedIds: string[]): ImportDecision {
  if (appliedIds.includes(payload.id)) return 'skip';
  if (!hasProfile(existingRaw)) return 'apply';
  return 'ask';
}

export function hasProfile(raw: string | null): boolean {
  if (!raw) return false;
  try {
    return !!JSON.parse(raw)?.state?.profile;
  } catch {
    return false;
  }
}

/** Короткое описание сохранения для диалога */
export function describeSave(raw: string | null): { catName?: string; coins: number; lessons: number; themes: number } {
  try {
    const s = raw ? JSON.parse(raw).state : {};
    return {
      catName: s.profile?.catName,
      coins: s.coins ?? 0,
      lessons: Object.keys(s.lessonStars ?? {}).length,
      themes: (s.customThemes ?? []).length,
    };
  } catch {
    return { coins: 0, lessons: 0, themes: 0 };
  }
}
