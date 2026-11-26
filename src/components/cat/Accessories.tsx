import type { ReactNode } from 'react';

/** Аксессуары рисуются в системе координат котика (viewBox 0 0 200 220) */

export const HATS: Record<string, ReactNode> = {
  party: (
    <g transform="rotate(-12 100 45)">
      <polygon points="100,-4 78,48 122,48" fill="#ff6fa5" />
      <polygon points="100,-4 89,22 111,22" fill="#ffd84d" />
      <polygon points="84,36 116,36 120,46 80,46" fill="#7bd3ff" />
      <circle cx="100" cy="-6" r="7" fill="#ffd84d" />
    </g>
  ),
  crown: (
    <g>
      <polygon points="72,50 70,20 86,36 100,12 114,36 130,20 128,50" fill="#ffd23f" stroke="#e0a800" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="100" cy="40" r="5" fill="#ff4f7b" />
      <circle cx="83" cy="43" r="3.5" fill="#4fc3f7" />
      <circle cx="117" cy="43" r="3.5" fill="#66bb6a" />
    </g>
  ),
  wizard: (
    <g transform="rotate(8 100 45)">
      <ellipse cx="100" cy="47" rx="46" ry="9" fill="#5e35b1" />
      <path d="M72 46 L104 -14 Q112 -18 110 -6 L128 46 Z" fill="#7e57c2" />
      <text x="90" y="30" fontSize="14" fill="#ffeb3b">★</text>
      <text x="104" y="12" fontSize="10" fill="#ffeb3b">★</text>
    </g>
  ),
  beret: (
    <g transform="rotate(-10 100 45)">
      <ellipse cx="102" cy="42" rx="40" ry="13" fill="#e53935" />
      <ellipse cx="102" cy="48" rx="34" ry="4" fill="#b71c1c" />
      <rect x="99" y="25" width="5" height="8" rx="2" fill="#b71c1c" />
    </g>
  ),
  cap: (
    <g>
      <path d="M62 52 Q64 12 100 12 Q136 12 138 52 Z" fill="#42a5f5" />
      <path d="M128 48 Q160 42 172 54 Q150 60 128 54 Z" fill="#1e88e5" />
      <circle cx="100" cy="13" r="5" fill="#1565c0" />
      <path d="M100 14 V50" stroke="#1e88e5" strokeWidth="2" />
    </g>
  ),
  cowboy: (
    <g>
      <ellipse cx="100" cy="48" rx="66" ry="11" fill="#8d5a2b" />
      <path d="M72 48 Q68 12 86 14 Q100 24 114 14 Q132 12 128 48 Z" fill="#a0693a" />
      <rect x="72" y="38" width="56" height="7" fill="#5d3a1a" />
    </g>
  ),
  bunny: (
    <g>
      <path d="M62 56 Q100 30 138 56" stroke="#ff8fc7" strokeWidth="6" fill="none" strokeLinecap="round" />
      <g transform="rotate(-14 84 30)">
        <ellipse cx="84" cy="8" rx="12" ry="32" fill="#fff" stroke="#f3d6e4" strokeWidth="2" />
        <ellipse cx="84" cy="10" rx="6" ry="22" fill="#ffc1dc" />
      </g>
      <g transform="rotate(14 116 30)">
        <ellipse cx="116" cy="8" rx="12" ry="32" fill="#fff" stroke="#f3d6e4" strokeWidth="2" />
        <ellipse cx="116" cy="10" rx="6" ry="22" fill="#ffc1dc" />
      </g>
    </g>
  ),
  chef: (
    <g>
      <circle cx="82" cy="22" r="16" fill="#fff" stroke="#e5e0ea" strokeWidth="2" />
      <circle cx="118" cy="22" r="16" fill="#fff" stroke="#e5e0ea" strokeWidth="2" />
      <circle cx="100" cy="12" r="18" fill="#fff" stroke="#e5e0ea" strokeWidth="2" />
      <rect x="72" y="26" width="56" height="24" rx="4" fill="#fff" stroke="#e5e0ea" strokeWidth="2" />
    </g>
  ),
  pirate: (
    <g>
      <path d="M44 52 Q100 -8 156 52 Q100 38 44 52 Z" fill="#2d2a32" />
      <circle cx="100" cy="30" r="8" fill="#fff" />
      <path d="M92 42 L108 46 M108 42 L92 46" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <circle cx="97" cy="29" r="2" fill="#2d2a32" />
      <circle cx="103" cy="29" r="2" fill="#2d2a32" />
    </g>
  ),
  santa: (
    <g>
      <path d="M66 50 Q86 -6 146 4 Q132 26 136 50 Z" fill="#e53935" />
      <rect x="60" y="42" width="82" height="14" rx="7" fill="#fff" />
      <circle cx="148" cy="6" r="9" fill="#fff" />
    </g>
  ),
  halo: (
    <g>
      <ellipse cx="100" cy="4" rx="34" ry="9" fill="none" stroke="#ffd23f" strokeWidth="6" />
      <ellipse cx="100" cy="4" rx="34" ry="9" fill="none" stroke="#fff6c4" strokeWidth="2" />
    </g>
  ),
  headphones: (
    <g>
      <path d="M46 96 Q44 14 100 14 Q156 14 154 96" stroke="#7e57c2" strokeWidth="8" fill="none" strokeLinecap="round" />
      <rect x="32" y="78" width="22" height="36" rx="10" fill="#9575cd" />
      <rect x="146" y="78" width="22" height="36" rx="10" fill="#9575cd" />
      <rect x="36" y="84" width="10" height="24" rx="5" fill="#ff8fc7" />
      <rect x="154" y="84" width="10" height="24" rx="5" fill="#ff8fc7" />
    </g>
  ),
  unicorn: (
    <g>
      <polygon points="90,50 100,0 110,50" fill="#ffd23f" stroke="#e0a800" strokeWidth="2" strokeLinejoin="round" />
      <path d="M93 38 L107 33 M95 26 L105 22 M97 14 L103 11" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <circle cx="74" cy="46" r="6" fill="#ff8fc7" />
      <circle cx="126" cy="46" r="6" fill="#8fd3ff" />
    </g>
  ),
  flower: (
    <g transform="translate(132 46)">
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="0" cy="-10" rx="7" ry="10" fill="#ff8fc7" transform={`rotate(${a})`} />
      ))}
      <circle r="6" fill="#ffd84d" />
    </g>
  ),
};

export const GLASSES: Record<string, ReactNode> = {
  sun: (
    <g>
      <rect x="62" y="78" width="34" height="22" rx="9" fill="#2d2a32" />
      <rect x="104" y="78" width="34" height="22" rx="9" fill="#2d2a32" />
      <path d="M96 84 L104 84" stroke="#2d2a32" strokeWidth="4" />
      <path d="M68 82 L76 82" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      <path d="M110 82 L118 82" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
    </g>
  ),
  monocle: (
    <g>
      <circle cx="120" cy="88" r="16" fill="rgba(255,255,255,0.25)" stroke="#c9a227" strokeWidth="4" />
      <path d="M134 98 Q146 130 128 150" stroke="#c9a227" strokeWidth="2" fill="none" strokeDasharray="3 3" />
    </g>
  ),
  nerd: (
    <g fill="rgba(255,255,255,0.2)" stroke="#5d4037" strokeWidth="5">
      <rect x="63" y="74" width="34" height="28" rx="4" />
      <rect x="103" y="74" width="34" height="28" rx="4" />
      <path d="M97 84 L103 84" fill="none" />
    </g>
  ),
  mask: (
    <path
      fillRule="evenodd"
      fill="#e53935"
      d="M52 80 Q100 62 148 80 Q150 104 128 104 Q112 104 100 96 Q88 104 72 104 Q50 104 52 80 Z M68 88 a12 10 0 1 0 24 0 a12 10 0 1 0 -24 0 Z M108 88 a12 10 0 1 0 24 0 a12 10 0 1 0 -24 0 Z"
    />
  ),
  round: (
    <g fill="rgba(255,255,255,0.25)" stroke="#3d3d4a" strokeWidth="3.5">
      <circle cx="80" cy="88" r="15" />
      <circle cx="120" cy="88" r="15" />
      <path d="M95 86 Q100 82 105 86" fill="none" />
    </g>
  ),
  heart: (
    <g fill="#ff4f7b" fillOpacity="0.85" stroke="#c2185b" strokeWidth="2">
      <path d="M80 104 L64 88 A8 8 0 0 1 80 78 A8 8 0 0 1 96 88 Z" />
      <path d="M120 104 L104 88 A8 8 0 0 1 120 78 A8 8 0 0 1 136 88 Z" />
      <path d="M96 86 L104 86" fill="none" />
    </g>
  ),
  star: (
    <g fill="#ffd23f" fillOpacity="0.92" stroke="#f57f17" strokeWidth="2" strokeLinejoin="round">
      <polygon points="80,70 85,82 98,83 88,91 91,104 80,97 69,104 72,91 62,83 75,82" />
      <polygon points="120,70 125,82 138,83 128,91 131,104 120,97 109,104 112,91 102,83 115,82" />
    </g>
  ),
};

export const NECK: Record<string, ReactNode> = {
  tie: (
    <g>
      <polygon points="92,124 108,124 104,134 96,134" fill="#c62828" />
      <polygon points="96,134 104,134 112,176 100,188 88,176" fill="#e53935" />
      <path d="M93 150 L107 144 M91 166 L109 158" stroke="#ffcdd2" strokeWidth="3" />
    </g>
  ),
  pearls: (
    <g fill="#fffaf0" stroke="#e8dcc8" strokeWidth="1.5">
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
        const t = i / 10;
        const x = 62 + t * 76;
        const y = 124 + Math.sin(t * Math.PI) * 18;
        return <circle key={i} cx={x} cy={y} r="5" />;
      })}
    </g>
  ),
  medal: (
    <g>
      <path d="M80 122 L96 152 M120 122 L104 152" stroke="#1e88e5" strokeWidth="8" strokeLinecap="round" />
      <circle cx="100" cy="160" r="14" fill="#ffd23f" stroke="#e0a800" strokeWidth="3" />
      <text x="100" y="166" fontSize="16" textAnchor="middle" fill="#e0a800" fontWeight="900">1</text>
    </g>
  ),
  bowtie: (
    <g transform="translate(100 130)">
      <polygon points="0,0 -20,-11 -20,11" fill="#1e88e5" />
      <polygon points="0,0 20,-11 20,11" fill="#1e88e5" />
      <circle r="5" fill="#1565c0" />
      <circle cx="-12" cy="-3" r="2" fill="#fff" />
      <circle cx="12" cy="3" r="2" fill="#fff" />
    </g>
  ),
  bandana: (
    <g>
      <path d="M60 122 Q100 138 140 122 L100 170 Z" fill="#e53935" />
      <circle cx="86" cy="136" r="3" fill="#fff" />
      <circle cx="104" cy="146" r="3" fill="#fff" />
      <circle cx="116" cy="132" r="3" fill="#fff" />
      <circle cx="98" cy="158" r="2.5" fill="#fff" />
    </g>
  ),
  bow: (
    <g transform="translate(100 128)">
      <polygon points="0,0 -22,-12 -22,12" fill="#ff6fa5" />
      <polygon points="0,0 22,-12 22,12" fill="#ff6fa5" />
      <circle r="6" fill="#e91e63" />
    </g>
  ),
  bell: (
    <g>
      <path d="M62 124 Q100 140 138 124" stroke="#e53935" strokeWidth="8" fill="none" strokeLinecap="round" />
      <circle cx="100" cy="140" r="9" fill="#ffd23f" stroke="#e0a800" strokeWidth="2" />
      <line x1="94" y1="140" x2="106" y2="140" stroke="#e0a800" strokeWidth="2" />
    </g>
  ),
  scarf: (
    <g>
      <path d="M58 122 Q100 145 142 122 L142 134 Q100 157 58 134 Z" fill="#42a5f5" />
      <path d="M118 136 L126 176 L110 176 L106 140 Z" fill="#1e88e5" />
      <path d="M70 130 L74 126 M84 136 L88 131 M100 139 L102 134 M114 136 L116 131" stroke="#bbdefb" strokeWidth="3" />
    </g>
  ),
};

export const BACK: Record<string, ReactNode> = {
  angel: (
    <g fill="#fff" stroke="#e3e8f0" strokeWidth="2">
      <path d="M58 140 Q10 100 18 150 Q22 180 62 168 Z" />
      <path d="M58 150 Q24 150 30 172 Q44 186 64 174 Z" />
      <path d="M142 140 Q190 100 182 150 Q178 180 138 168 Z" />
      <path d="M142 150 Q176 150 170 172 Q156 186 136 174 Z" />
    </g>
  ),
  butterfly: (
    <g>
      <path d="M60 150 Q10 90 22 150 Q30 176 62 160 Z" fill="#ff8fc7" />
      <path d="M62 160 Q26 186 40 200 Q58 204 66 172 Z" fill="#8fd3ff" />
      <path d="M140 150 Q190 90 178 150 Q170 176 138 160 Z" fill="#ff8fc7" />
      <path d="M138 160 Q174 186 160 200 Q142 204 134 172 Z" fill="#8fd3ff" />
      <circle cx="34" cy="138" r="6" fill="#fff" opacity="0.7" />
      <circle cx="166" cy="138" r="6" fill="#fff" opacity="0.7" />
    </g>
  ),
  balloon: (
    <g>
      <path d="M140 196 Q170 150 172 70" stroke="#9e9e9e" strokeWidth="2" fill="none" />
      <ellipse cx="174" cy="40" rx="26" ry="32" fill="#ff5c8a" />
      <ellipse cx="164" cy="28" rx="6" ry="10" fill="#fff" opacity="0.5" />
      <polygon points="170,71 178,71 174,64" fill="#ff5c8a" />
    </g>
  ),
  jetpack: (
    <g>
      <rect x="40" y="120" width="26" height="56" rx="12" fill="#90a4ae" stroke="#607d8b" strokeWidth="2" />
      <rect x="134" y="120" width="26" height="56" rx="12" fill="#90a4ae" stroke="#607d8b" strokeWidth="2" />
      <path d="M44 176 Q53 206 62 176 Z" fill="#ff9800" />
      <path d="M138 176 Q147 206 156 176 Z" fill="#ff9800" />
      <path d="M48 176 Q53 192 58 176 Z" fill="#ffeb3b" />
      <path d="M142 176 Q147 192 152 176 Z" fill="#ffeb3b" />
    </g>
  ),
  cape: <path d="M64 124 Q30 190 46 218 L154 218 Q170 190 136 124 Q100 140 64 124 Z" fill="#e53935" stroke="#b71c1c" strokeWidth="2" />,
};

/** Иконка для магазина: рисуем только аксессуар в той же системе координат */
export function itemArt(slot: string, id: string): ReactNode {
  if (slot === 'hat') return HATS[id];
  if (slot === 'glasses') return GLASSES[id];
  if (slot === 'neck') return NECK[id];
  return BACK[id];
}
