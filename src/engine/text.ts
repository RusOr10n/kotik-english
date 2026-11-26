/** Разбивает фразу на слова-плитки (без знаков препинания, кроме апострофа) */
export function tokenize(sentence: string): string[] {
  return sentence
    .replace(/[.,!?]/g, '')
    .split(/\s+/)
    .filter(Boolean);
}

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[’`]/g, "'")
    .replace(/[.,!?]/g, '')
    .replace(/[-\s]+/g, ' ')
    .trim();
}

export function sameText(a: string, b: string): boolean {
  return normalize(a) === normalize(b);
}

/** Слово подходит для упражнения «собери из букв» */
export function isSpellable(en: string): boolean {
  return /^[a-z]+$/i.test(en) && en.length >= 3 && en.length <= 8;
}
