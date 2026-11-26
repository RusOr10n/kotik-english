import { motion } from 'framer-motion';
import { useState } from 'react';
import { speak } from '../../audio/speech';

export function Speaker({ text, big, slowOnRepeat = true }: { text: string; big?: boolean; slowOnRepeat?: boolean }) {
  const [count, setCount] = useState(0);
  const [playing, setPlaying] = useState(false);
  return (
    <motion.button
      className={`speaker ${big ? 'big' : ''}`}
      animate={playing ? { scale: [1, 1.12, 1] } : { scale: 1 }}
      transition={playing ? { repeat: Infinity, duration: 0.6 } : {}}
      onClick={async () => {
        setPlaying(true);
        // каждый второй повтор — медленно
        await speak(text, { slow: slowOnRepeat && count % 2 === 1 });
        setCount((c) => c + 1);
        setPlaying(false);
      }}
      title="Послушать"
    >
      🔊
    </motion.button>
  );
}
