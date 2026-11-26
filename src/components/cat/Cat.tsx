import { motion } from 'framer-motion';
import { FUR_BY_ID } from '../../content/shop';
import type { Slot } from '../../content/shop';
import { BACK, GLASSES, HATS, NECK } from './Accessories';

export type CatMood = 'idle' | 'happy' | 'sad' | 'think' | 'walk' | 'sleep';

type Props = {
  fur: string;
  accessories?: Partial<Record<Slot, string | undefined>>;
  mood?: CatMood;
  size?: number;
  onClick?: () => void;
  className?: string;
};

const INK = '#2d2a32';

export function Cat({ fur, accessories = {}, mood = 'idle', size = 160, onClick, className }: Props) {
  const f = FUR_BY_ID[fur] ?? FUR_BY_ID.ginger;
  const happy = mood === 'happy';
  const sad = mood === 'sad';
  const sleeping = mood === 'sleep';

  const bodyAnim =
    happy ? { y: [0, -26, 0, -12, 0], transition: { duration: 0.9, repeat: Infinity, repeatDelay: 0.4 } }
    : mood === 'walk' ? { y: [0, -6, 0], rotate: [-3, 3, -3], transition: { duration: 0.45, repeat: Infinity } }
    : sleeping ? { scaleY: [1, 1.03, 1], transition: { duration: 2.4, repeat: Infinity } }
    : { y: 0, rotate: 0, scaleY: 1 };

  const tailAnim = happy
    ? { rotate: [-18, 22, -18], transition: { duration: 0.35, repeat: Infinity } }
    : sad
      ? { rotate: 38, transition: { duration: 0.4 } }
      : { rotate: [-8, 10, -8], transition: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' } };

  const headAnim =
    mood === 'think' ? { rotate: -12 } : sad ? { rotate: 0, y: 6 } : { rotate: [0, 0, 4, 0], y: 0, transition: { duration: 5, repeat: Infinity } };

  return (
    <motion.svg
      viewBox="-10 -25 220 250"
      width={size}
      height={(size * 250) / 220}
      className={className}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : undefined, overflow: 'visible' }}
      animate={bodyAnim}
    >
      {/* тень */}
      <ellipse cx="100" cy="214" rx="62" ry="8" fill="rgba(0,0,0,0.12)" />

      {/* хвост */}
      <motion.g style={{ originX: 0, originY: 1 }} animate={tailAnim}>
        <path d="M128 192 C 182 196, 196 140, 164 112" stroke={f.base} strokeWidth="17" fill="none" strokeLinecap="round" />
        {f.stripes && <path d="M178 150 l-12 4 M172 130 l-12 -2" stroke={f.dark} strokeWidth="5" strokeLinecap="round" />}
      </motion.g>

      {accessories.back && BACK[accessories.back]}

      {/* тело */}
      <ellipse cx="100" cy="166" rx="50" ry="46" fill={f.base} />
      <ellipse cx="100" cy="174" rx="29" ry="32" fill={f.belly} />
      {f.stripes && (
        <g stroke={f.dark} strokeWidth="5" strokeLinecap="round" fill="none">
          <path d="M54 160 q8 2 12 -4" />
          <path d="M52 178 q9 2 13 -4" />
          <path d="M146 160 q-8 2 -12 -4" />
          <path d="M148 178 q-9 2 -13 -4" />
        </g>
      )}
      {/* лапки */}
      <ellipse cx="80" cy="207" rx="15" ry="10" fill={f.base} />
      <ellipse cx="120" cy="207" rx="15" ry="10" fill={f.base} />
      <path d="M75 204 v5 M85 204 v5 M115 204 v5 M125 204 v5" stroke={f.dark} strokeWidth="2" strokeLinecap="round" />

      {accessories.neck && NECK[accessories.neck]}

      {/* голова */}
      <motion.g style={{ originX: 0.5, originY: 0.9 }} animate={headAnim}>
        {/* уши */}
        <motion.g style={{ originX: 1, originY: 1 }} animate={{ rotate: sad ? -28 : 0 }}>
          <polygon points="54,66 60,16 96,48" fill={f.base} strokeLinejoin="round" stroke={f.base} strokeWidth="6" />
          <polygon points="64,56 66,30 84,48" fill="#ffb3c7" />
        </motion.g>
        <motion.g style={{ originX: 0, originY: 1 }} animate={{ rotate: sad ? 28 : 0 }}>
          <polygon points="146,66 140,16 104,48" fill={f.base} strokeLinejoin="round" stroke={f.base} strokeWidth="6" />
          <polygon points="136,56 134,30 116,48" fill="#ffb3c7" />
        </motion.g>

        <ellipse cx="100" cy="90" rx="54" ry="47" fill={f.base} />
        {f.stripes && (
          <g stroke={f.dark} strokeWidth="5" strokeLinecap="round">
            <path d="M100 46 v12" />
            <path d="M88 48 l3 10" />
            <path d="M112 48 l-3 10" />
          </g>
        )}
        <ellipse cx="100" cy="110" rx="26" ry="18" fill={f.belly} />

        {/* глаза */}
        {happy ? (
          <g stroke={INK} strokeWidth="5" fill="none" strokeLinecap="round">
            <path d="M70 92 Q80 78 90 92" />
            <path d="M110 92 Q120 78 130 92" />
          </g>
        ) : sleeping ? (
          <g stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round">
            <path d="M70 88 Q80 96 90 88" />
            <path d="M110 88 Q120 96 130 88" />
          </g>
        ) : (
          <motion.g
            style={{ originX: 0.5, originY: 0.5 }}
            animate={{ scaleY: [1, 1, 0.1, 1] }}
            transition={{ duration: 0.25, times: [0, 0.5, 0.75, 1], repeat: Infinity, repeatDelay: 3.2 }}
          >
            <ellipse cx="80" cy={sad ? 92 : 88} rx="10" ry="12" fill={INK} />
            <ellipse cx="120" cy={sad ? 92 : 88} rx="10" ry="12" fill={INK} />
            <circle cx={mood === 'think' ? 84 : 83} cy={sad ? 90 : 83} r="4" fill="#fff" />
            <circle cx={mood === 'think' ? 124 : 123} cy={sad ? 90 : 83} r="4" fill="#fff" />
            <circle cx="77" cy="93" r="2" fill="#fff" opacity="0.7" />
            <circle cx="117" cy="93" r="2" fill="#fff" opacity="0.7" />
          </motion.g>
        )}
        {sad && (
          <g stroke={INK} strokeWidth="3" strokeLinecap="round">
            <path d="M68 72 L88 78" />
            <path d="M132 72 L112 78" />
          </g>
        )}

        {/* щёчки */}
        <circle cx="64" cy="106" r="8" fill="#ff8fab" opacity="0.45" />
        <circle cx="136" cy="106" r="8" fill="#ff8fab" opacity="0.45" />

        {/* нос и рот */}
        <path d="M94 102 L106 102 L100 109 Z" fill="#ff7aa2" strokeLinejoin="round" stroke="#ff7aa2" strokeWidth="2" />
        {happy ? (
          <path d="M88 112 Q100 130 112 112 Q100 117 88 112 Z" fill="#c2185b" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        ) : sad ? (
          <path d="M90 120 Q100 112 110 120" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
        ) : (
          <g stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round">
            <path d="M100 109 Q95 117 88 113" />
            <path d="M100 109 Q105 117 112 113" />
          </g>
        )}
        {sad && <motion.ellipse cx="72" cy="104" rx="3" ry="5" fill="#64b5f6" animate={{ cy: [100, 116], opacity: [1, 0] }} transition={{ duration: 1.2, repeat: Infinity }} />}

        {/* усы */}
        <g stroke={INK} strokeWidth="2" strokeLinecap="round" opacity="0.7">
          <path d="M60 104 L28 98" />
          <path d="M60 111 L28 114" />
          <path d="M140 104 L172 98" />
          <path d="M140 111 L172 114" />
        </g>

        {accessories.glasses && GLASSES[accessories.glasses]}
        {accessories.hat && HATS[accessories.hat]}
        {sleeping && (
          <motion.text x="150" y="40" fontSize="22" fill="#7e57c2" fontWeight="800" animate={{ y: [40, 20], opacity: [1, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            z
          </motion.text>
        )}
      </motion.g>
    </motion.svg>
  );
}
