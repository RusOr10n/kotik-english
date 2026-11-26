import type { ReactNode } from 'react';

/** Нарисованные иконки для кнопок меню (вместо эмодзи): линия цвета иконки + мягкая заливка */
export type IconName =
  | 'review' | 'home' | 'shop' | 'album' | 'install' | 'settings' | 'hint'
  | 'cat' | 'abc' | 'rules' | 'themes' | 'transfer' | 'import' | 'check' | 'swords' | 'paw'
  | 'hat' | 'glasses' | 'bow' | 'cape' | 'palette' | 'sofa' | 'toy';

/** Цвет каждой иконки — свой, чтобы кнопки различались с первого взгляда */
export const ICON_COLORS: Record<IconName, string> = {
  review: '#8a63e6',
  home: '#f08a3c',
  shop: '#e9558f',
  album: '#2f95d8',
  install: '#2fa86a',
  settings: '#6f6885',
  hint: '#e0a100',
  cat: '#f08a3c',
  abc: '#2f95d8',
  rules: '#8a63e6',
  themes: '#e9558f',
  transfer: '#2f95d8',
  import: '#2fa86a',
  check: '#2fa86a',
  swords: '#f2b200',
  paw: '#e9558f',
  hat: '#8a63e6',
  glasses: '#2f95d8',
  bow: '#e9558f',
  cape: '#e0503c',
  palette: '#f08a3c',
  sofa: '#b07a3a',
  toy: '#e9558f',
};

const gearTeeth = Array.from({ length: 8 }, (_, i) => i * 45);

function paths(name: IconName, tint: string): ReactNode {
  switch (name) {
    case 'home':
      return (
        <>
          <path d="M5.5 10.2V19a1.5 1.5 0 0 0 1.5 1.5h10a1.5 1.5 0 0 0 1.5-1.5v-8.8" fill={tint} />
          <path d="M3 11.5 12 4l9 7.5" />
          <path d="M10 20.5v-4.5a2 2 0 0 1 4 0v4.5" />
        </>
      );
    case 'shop':
      return (
        <>
          <path d="M5 8h14l-1.1 11.2a1.6 1.6 0 0 1-1.6 1.4H7.7a1.6 1.6 0 0 1-1.6-1.4Z" fill={tint} />
          <path d="M9 10.5V7a3 3 0 0 1 6 0v3.5" />
          <path d="M9.5 15.5c1.3 1.2 3.7 1.2 5 0" />
        </>
      );
    case 'album':
      return (
        <>
          <path d="M12 6.5c-1.8-1.6-4.3-2.2-7.5-2v13.5c3.2-.2 5.7.4 7.5 2" fill={tint} />
          <path d="M12 6.5c1.8-1.6 4.3-2.2 7.5-2v13.5c-3.2-.2-5.7.4-7.5 2" fill={tint} />
          <path d="M12 6.5V20" />
          <path d="M7 9h2.5M7 12h2.5M14.5 9H17M14.5 12H17" />
        </>
      );
    case 'review':
      return (
        <>
          <circle cx="12" cy="12" r="8.5" fill={tint} stroke="none" />
          <path d="M18.5 9.5A7 7 0 0 0 6 8.2" />
          <path d="M6 4.5v3.7h3.7" />
          <path d="M5.5 14.5A7 7 0 0 0 18 15.8" />
          <path d="M18 19.5v-3.7h-3.7" />
        </>
      );
    case 'install':
      return (
        <>
          <rect x="6.5" y="2.5" width="11" height="19" rx="2.6" fill={tint} />
          <path d="M12 7v7" />
          <path d="m9.2 11.4 2.8 2.8 2.8-2.8" />
          <path d="M10.5 18.5h3" />
        </>
      );
    case 'settings':
      return (
        <>
          {gearTeeth.map((a) => (
            <rect key={a} x="10.4" y="2.4" width="3.2" height="4" rx="1" transform={`rotate(${a} 12 12)`} fill={tint} />
          ))}
          {/* белый круг прячет основания зубцов, затем мягкая заливка */}
          <circle cx="12" cy="12" r="6.3" fill="#fff" />
          <circle cx="12" cy="12" r="6.3" fill={tint} />
          <circle cx="12" cy="12" r="2.4" fill="#fff" />
        </>
      );
    case 'cat':
      return (
        <>
          <path d="M5 9.5 4.6 4 9 6.9Q12 6 15 6.9L19.4 4 19 9.5q1.6 2.6.6 5.6Q17.6 20 12 20t-7.6-4.9Q3.4 12.1 5 9.5Z" fill={tint} />
          <circle cx="9.2" cy="12.6" r="1.1" fill="currentColor" stroke="none" />
          <circle cx="14.8" cy="12.6" r="1.1" fill="currentColor" stroke="none" />
          <path d="M11 15.2h2l-1 1.1Z" fill="currentColor" />
        </>
      );
    case 'abc':
      return (
        <>
          <rect x="3" y="4" width="18" height="16" rx="3.5" fill={tint} />
          <text x="12" y="16.3" textAnchor="middle" fontSize="9.5" fontWeight="900" fontFamily="Nunito, sans-serif" fill="currentColor" stroke="none">
            Ab
          </text>
        </>
      );
    case 'rules':
      return (
        <>
          <path d="M5 4.5h11.5A2.5 2.5 0 0 1 19 7v12.5H7.5A2.5 2.5 0 0 1 5 17Z" fill={tint} />
          <path d="M5 17a2.5 2.5 0 0 1 2.5-2.5H19" />
          <path d="M10 4.5v6l2-1.5 2 1.5v-6" fill="currentColor" />
        </>
      );
    case 'themes':
      return (
        <>
          <rect x="3.5" y="14.5" width="17" height="5" rx="1.3" fill={tint} />
          <rect x="5.5" y="9.3" width="13" height="5.2" rx="1.3" fill={tint} />
          <rect x="4.5" y="4" width="11" height="5.3" rx="1.3" fill={tint} />
          <path d="M7 17h4M8.5 11.9h4M7 6.6h4" />
        </>
      );
    case 'transfer':
      return (
        <>
          <rect x="5" y="5" width="14" height="10" rx="1.6" fill={tint} />
          <path d="M3 19h18" />
          <path d="M9 10h5.5M12.5 8l2 2-2 2" />
        </>
      );
    case 'import':
      return (
        <>
          <rect x="4" y="14" width="16" height="6.5" rx="1.6" fill={tint} stroke="none" />
          <path d="M4 14v5a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 20 19v-5" />
          <path d="M12 3.5v10.5M8 10l4 4 4-4" />
        </>
      );
    case 'check':
      return (
        <>
          <circle cx="12" cy="12" r="9" fill={tint} />
          <path d="m8 12.5 2.8 2.8L16.5 9.5" />
        </>
      );
    case 'swords':
      return (
        <>
          <path d="M4.5 4.5 14 14M11.4 16.6l5.2-5.2M15.8 15.8l3.7 3.7" />
          <path d="M19.5 4.5 10 14M12.6 16.6 7.4 11.4M8.2 15.8l-3.7 3.7" />
        </>
      );
    case 'paw':
      return (
        <g fill="currentColor" stroke="none">
          <ellipse cx="12" cy="15.2" rx="4.4" ry="3.6" />
          <circle cx="6.6" cy="10.4" r="2" />
          <circle cx="9.9" cy="6.9" r="2" />
          <circle cx="14.1" cy="6.9" r="2" />
          <circle cx="17.4" cy="10.4" r="2" />
        </g>
      );
    case 'hat':
      return (
        <>
          <rect x="7" y="4.5" width="10" height="11" rx="1.6" fill={tint} />
          <path d="M3.5 16.5h17" />
          <path d="M7 12.5h10" />
        </>
      );
    case 'glasses':
      return (
        <>
          <circle cx="7.3" cy="13.5" r="3.8" fill={tint} />
          <circle cx="16.7" cy="13.5" r="3.8" fill={tint} />
          <path d="M11.1 13c.6-.6 1.2-.6 1.8 0M3.5 13 2.6 9M20.5 13l.9-4" />
        </>
      );
    case 'bow':
      return (
        <>
          <path d="M12 12 4 7.5v9Z" fill={tint} />
          <path d="m12 12 8-4.5v9Z" fill={tint} />
          <circle cx="12" cy="12" r="1.9" fill="currentColor" />
        </>
      );
    case 'cape':
      return (
        <>
          <path d="M8 4.5h8l1 3 3 12.5H4L7 7.5Z" fill={tint} />
          <path d="M9 4.5 12 8l3-3.5" />
        </>
      );
    case 'palette':
      return (
        <>
          <path d="M12 3.5a8.5 8.5 0 0 0 0 17c1.2 0 1.8-.7 1.8-1.6 0-1.3-1.2-1.4-1.2-2.6 0-1 .8-1.6 1.8-1.6h2.1a4 4 0 0 0 4-4c0-4.2-3.8-7.2-8.5-7.2Z" fill={tint} />
          <circle cx="7.8" cy="10.8" r="1.3" fill="#e9558f" stroke="none" />
          <circle cx="10.6" cy="7.2" r="1.3" fill="#2f95d8" stroke="none" />
          <circle cx="15" cy="7.6" r="1.3" fill="#2fa86a" stroke="none" />
        </>
      );
    case 'sofa':
      return (
        <>
          <path d="M5.5 11V8a2.5 2.5 0 0 1 2.5-2.5h8A2.5 2.5 0 0 1 18.5 8v3" />
          <path d="M3.5 12a2 2 0 0 1 4 0v1.5h9V12a2 2 0 0 1 4 0v5.5h-17Z" fill={tint} />
          <path d="M5.5 17.5v2M18.5 17.5v2" />
        </>
      );
    case 'toy':
      return (
        <>
          <circle cx="12" cy="11.5" r="7.5" fill={tint} />
          <path d="M6 9c3 1 6 4 7.5 9.4M9.5 4.4c3 2.5 5.5 6.4 6.2 11.6M4.8 13.2c2.2-.1 4.5 1 6 3.6" />
          <path d="M17.5 17c1.5 1 2.6 2.4 2.8 3.5" />
        </>
      );
    case 'hint':
      return (
        <>
          <path d="M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.1v.6h5v-.6c0-.8.4-1.6 1.1-2.1A6 6 0 0 0 12 3Z" fill={tint} />
          <path d="M9.8 19h4.4M10.6 21.5h2.8" />
          <path d="M12 7.2a2.8 2.8 0 0 0-2.6 2" />
        </>
      );
  }
}

export function Icon({ name, size = 24, color }: { name: IconName; size?: number; color?: string }) {
  const c = color ?? ICON_COLORS[name];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={c}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={{ flexShrink: 0, display: 'block', color: c }}
    >
      {paths(name, `${c}33`)}
    </svg>
  );
}

/** Заголовок или подпись с нарисованной иконкой слева */
export function WithIcon({ icon, size = 26, color, children }: { icon: IconName; size?: number; color?: string; children: ReactNode }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4em' }}>
      <Icon name={icon} size={size} color={color} />
      <span>{children}</span>
    </span>
  );
}

/** Монетка игры: золотая монета с кошачьей лапкой (вместо эмодзи 🪙) */
export function Coin({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-label="монетки"
      role="img"
      style={{ flexShrink: 0, display: 'inline-block', verticalAlign: '-0.18em' }}
    >
      {/* ребро и лицевая сторона */}
      <circle cx="12" cy="12.6" r="10" fill="#e09a00" />
      <circle cx="12" cy="11.4" r="10" fill="#ffd23f" stroke="#e09a00" strokeWidth="1.4" />
      <circle cx="12" cy="11.4" r="7.2" fill="#ffe27a" stroke="#f2b200" strokeWidth="1.2" />
      {/* лапка */}
      <g fill="#e09a00">
        <ellipse cx="12" cy="13.3" rx="2.9" ry="2.3" />
        <circle cx="8.9" cy="10.4" r="1.25" />
        <circle cx="10.9" cy="8.6" r="1.25" />
        <circle cx="13.1" cy="8.6" r="1.25" />
        <circle cx="15.1" cy="10.4" r="1.25" />
      </g>
      {/* блик */}
      <path d="M6.2 8.2a6.8 6.8 0 0 1 3.6-3.4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.85" />
    </svg>
  );
}
