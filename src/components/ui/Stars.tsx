import { motion } from 'framer-motion';

export function Stars({ count, size = 22, animate = false }: { count: number; size?: number; animate?: boolean }) {
  return (
    <span className="row" style={{ gap: 2 }}>
      {[1, 2, 3].map((i) => (
        <motion.span
          key={i}
          className="pic"
          style={{ fontSize: size, filter: i <= count ? 'none' : 'grayscale(1) opacity(0.35)' }}
          initial={animate ? { scale: 0, rotate: -90 } : false}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: animate ? 0.4 + i * 0.35 : 0, type: 'spring', stiffness: 260, damping: 12 }}
        >
          ⭐
        </motion.span>
      ))}
    </span>
  );
}
