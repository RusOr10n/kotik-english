import { motion } from 'framer-motion';
import type { HomeItem } from '../../content/home';

/** Отрисовка вещи для домика (и для карточки в магазине) */
export function HomeItemArt({ item, scale = 1 }: { item: HomeItem; scale?: number }) {
  const size = item.size * scale;
  if (item.art === 'tree') {
    return (
      <svg width={size * 0.75} height={size} viewBox="0 0 90 120">
        <rect x="40" y="20" width="10" height="96" fill="#c8a27a" />
        <rect x="40" y="20" width="10" height="96" fill="url(#rope)" opacity="0.5" />
        <rect x="8" y="112" width="74" height="8" rx="4" fill="#9c6b45" />
        <rect x="4" y="66" width="52" height="9" rx="4" fill="#b07a50" />
        <rect x="36" y="38" width="50" height="9" rx="4" fill="#b07a50" />
        <ellipse cx="45" cy="18" rx="30" ry="9" fill="#9c6b45" />
        <ellipse cx="45" cy="15" rx="24" ry="6" fill="#ffd6e6" />
        <circle cx="20" cy="80" r="5" fill="#ff8fc7" />
        <line x1="20" y1="75" x2="20" y2="70" stroke="#999" />
        <defs>
          <pattern id="rope" width="10" height="6" patternUnits="userSpaceOnUse">
            <path d="M0 0 L10 6" stroke="#8d6e4f" strokeWidth="1.5" />
          </pattern>
        </defs>
      </svg>
    );
  }
  if (item.art === 'aquarium') {
    return (
      <div style={{ width: size * 1.2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div
          style={{
            width: size * 1.2, height: size * 0.75, borderRadius: 10, position: 'relative', overflow: 'hidden',
            background: 'linear-gradient(180deg, #b3ecff 0%, #4fb3e8 100%)', border: '4px solid #cfe9f5',
          }}
        >
          <motion.span className="pic" style={{ position: 'absolute', top: '22%', fontSize: size * 0.22 }} animate={{ left: ['5%', '70%', '5%'], scaleX: [1, 1, -1, -1, 1] }} transition={{ duration: 6, repeat: Infinity }}>
            🐠
          </motion.span>
          <motion.span className="pic" style={{ position: 'absolute', top: '52%', fontSize: size * 0.18 }} animate={{ left: ['70%', '10%', '70%'] }} transition={{ duration: 8, repeat: Infinity }}>
            🐟
          </motion.span>
          <span className="pic" style={{ position: 'absolute', bottom: 0, left: '8%', fontSize: size * 0.2 }}>🪸</span>
        </div>
        <div style={{ width: size * 1.05, height: size * 0.22, background: '#8d6e63', borderRadius: '0 0 8px 8px' }} />
      </div>
    );
  }
  if (item.art === 'rug') {
    return (
      <div
        style={{
          width: size, height: size * 0.22, borderRadius: '50%',
          background: 'radial-gradient(ellipse, #d7b8ff 0%, #b892f0 55%, #9b72de 56%, #b892f0 70%)',
          boxShadow: '0 4px 0 rgba(0,0,0,0.08)',
        }}
      />
    );
  }
  return (
    <span className="pic" style={{ fontSize: size, display: 'block', lineHeight: 1 }}>
      {item.pic}
    </span>
  );
}
