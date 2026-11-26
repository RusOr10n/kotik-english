import { useEffect, useRef } from 'react';

/** Подписка на клавиатуру; обработчик всегда актуальный */
export function useKeys(handler: (e: KeyboardEvent) => void, active = true) {
  const ref = useRef(handler);
  ref.current = handler;
  useEffect(() => {
    if (!active) return;
    const listener = (e: KeyboardEvent) => ref.current(e);
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [active]);
}
