import { motion } from 'framer-motion';

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="progress grow">
      <motion.div initial={false} animate={{ width: `${Math.max(4, Math.min(1, value) * 100)}%` }} transition={{ type: 'spring', stiffness: 120, damping: 18 }} />
    </div>
  );
}
