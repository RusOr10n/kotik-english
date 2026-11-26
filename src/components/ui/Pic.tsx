const isEmoji = (s: string) => /\p{Extended_Pictographic}|⃣/u.test(s);

/** Картинка слова: эмодзи, число или (для тем родителя без эмодзи) русское слово */
export function Pic({ pic, size = 64 }: { pic: string; size?: number }) {
  if (/^\d+$/.test(pic)) {
    return (
      <span className="pic num" style={{ fontSize: size * 0.85 }}>
        {pic}
      </span>
    );
  }
  if (!isEmoji(pic)) {
    const fontSize = Math.max(14, Math.min(size * 0.5, (size * 2.6) / Math.max(pic.length, 1)));
    return (
      <span className="pic-text" style={{ fontSize, maxWidth: size * 2.2 }}>
        {pic}
      </span>
    );
  }
  // «🐱🐱» — множественное число: два значка, каждый поменьше
  const count = graphemes(pic);
  return (
    <span className="pic" style={{ fontSize: count > 1 ? size * 0.62 : size, whiteSpace: 'nowrap' }}>
      {pic}
    </span>
  );
}

function graphemes(s: string): number {
  const Seg = (Intl as unknown as { Segmenter?: new (l?: string, o?: { granularity: string }) => { segment(s: string): Iterable<unknown> } }).Segmenter;
  if (Seg) return [...new Seg(undefined, { granularity: 'grapheme' }).segment(s)].length;
  return [...s.replace(/\uFE0F|\u200D/g, '')].length > 2 ? 2 : 1;
}

/** Нужно ли отдельно подписывать перевод (если картинка — уже перевод, то нет) */
export const needsCaption = (pic: string, ru: string) => pic !== ru;
