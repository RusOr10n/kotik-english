import { AnimatePresence, motion } from 'framer-motion';
import { Coin } from './Icon';

export function Coins({ value }: { value: number }) {
  return (
    <span className="pill">
      <Coin size={24} />
      <AnimatePresence mode="popLayout">
        <motion.span key={value} initial={{ y: -14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 14, opacity: 0 }}>
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
