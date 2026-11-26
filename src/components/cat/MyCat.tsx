import { sfx } from '../../audio/sfx';
import { useGame } from '../../state/store';
import { Cat, type CatMood } from './Cat';

/** Котик игрока с его окраской и аксессуарами */
export function MyCat({ mood, size, meow = true }: { mood?: CatMood; size?: number; meow?: boolean }) {
  const profile = useGame((s) => s.profile);
  const equipped = useGame((s) => s.equipped);
  return <Cat fur={profile?.fur ?? 'ginger'} accessories={equipped} mood={mood} size={size} onClick={meow ? () => sfx.meow() : undefined} />;
}
