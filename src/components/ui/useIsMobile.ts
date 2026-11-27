import { useEffect, useState } from 'react';

function useMedia(query: string): boolean {
  const get = () => typeof window !== 'undefined' && !!window.matchMedia?.(query).matches;
  const [matches, setMatches] = useState(get);
  useEffect(() => {
    const mq = window.matchMedia?.(query);
    if (!mq) return;
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [query]);
  return matches;
}

/** Узкий экран (телефон в портретной ориентации) */
export function useIsMobile(): boolean {
  return useMedia('(max-width: 700px)');
}

/** Невысокий экран (телефон в альбомной ориентации) — то же значение, что в styles.css */
export function useIsShort(): boolean {
  return useMedia('(max-height: 520px) and (orientation: landscape)');
}
