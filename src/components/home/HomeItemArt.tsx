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
  if (item.art === 'fridge') {
    return (
      <div style={{ width: size * 0.56, height: size, borderRadius: 14, background: 'linear-gradient(90deg, #ffffff 0%, #e9eef5 100%)', border: '3px solid #c5d0dc', position: 'relative', boxShadow: '0 5px 0 rgba(0,0,0,0.08)' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: '36%', height: 3, background: '#c5d0dc' }} />
        <div style={{ position: 'absolute', right: '12%', top: '12%', width: 5, height: '16%', borderRadius: 3, background: '#9fb0c2' }} />
        <div style={{ position: 'absolute', right: '12%', top: '44%', width: 5, height: '22%', borderRadius: 3, background: '#9fb0c2' }} />
        <span className="pic" style={{ position: 'absolute', left: '14%', top: '50%', fontSize: size * 0.13 }}>🍓</span>
        <span className="pic" style={{ position: 'absolute', left: '18%', top: '10%', fontSize: size * 0.11 }}>⭐</span>
      </div>
    );
  }
  if (item.art === 'stove') {
    return (
      <div style={{ width: size * 0.9, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '100%', height: size * 0.16, background: '#3d4b55', borderRadius: '8px 8px 0 0', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: size * 0.16, height: size * 0.07, borderRadius: '50%', border: '3px solid #ff7043' }} />
          ))}
        </div>
        <div style={{ width: '100%', height: size * 0.64, background: '#eceff1', border: '3px solid #b0bec5', borderTop: 'none', borderRadius: '0 0 8px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: size * 0.05, paddingTop: size * 0.06, boxSizing: 'border-box' }}>
          <div style={{ width: '60%', height: 5, borderRadius: 3, background: '#90a4ae' }} />
          <div style={{ width: '74%', height: size * 0.34, borderRadius: 8, background: 'linear-gradient(180deg, #4e342e 0%, #ff8a50 140%)', border: '3px solid #90a4ae' }} />
        </div>
      </div>
    );
  }
  if (item.art === 'table') {
    return (
      <div style={{ width: size, height: size * 0.5, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: size * 0.09, borderRadius: 8, background: '#b07a50', boxShadow: '0 4px 0 #8d5b36' }} />
        <div style={{ position: 'absolute', left: '-4%', right: '-4%', top: size * 0.05, height: size * 0.1, background: 'repeating-linear-gradient(90deg, #ff8a8a 0 12px, #fff 12px 24px)', borderRadius: '0 0 10px 10px', opacity: 0.9 }} />
        <div style={{ position: 'absolute', left: '10%', top: size * 0.12, bottom: 0, width: size * 0.06, background: '#9c6b45', borderRadius: 4 }} />
        <div style={{ position: 'absolute', right: '10%', top: size * 0.12, bottom: 0, width: size * 0.06, background: '#9c6b45', borderRadius: 4 }} />
        <span className="pic" style={{ position: 'absolute', left: '40%', bottom: '86%', fontSize: size * 0.18 }}>🍽️</span>
      </div>
    );
  }
  if (item.art === 'discoball') {
    return (
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* верёвочка до потолка — уходит за край комнаты */}
        <div style={{ position: 'absolute', bottom: '92%', width: 2, height: 600, background: '#c9c2d8' }} />
        <motion.span className="pic" style={{ fontSize: size, display: 'block', lineHeight: 1 }} animate={{ rotate: [-6, 6, -6] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
          {item.pic}
        </motion.span>
      </div>
    );
  }
  if (item.art === 'speaker') {
    return (
      <div style={{ width: size * 0.58, height: size, borderRadius: 12, background: '#2d2a32', border: '3px solid #ff4fd8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly', boxShadow: '0 0 18px rgba(255,79,216,0.45)' }}>
        <motion.div style={{ width: size * 0.22, height: size * 0.22, borderRadius: '50%', background: 'radial-gradient(circle, #6d6a78 0%, #4a4752 60%, #1f1d24 62%)' }} animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 0.5, repeat: Infinity }} />
        <motion.div style={{ width: size * 0.38, height: size * 0.38, borderRadius: '50%', background: 'radial-gradient(circle, #6d6a78 0%, #4a4752 55%, #1f1d24 57%)' }} animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.5, repeat: Infinity }} />
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
