import { sfx } from '../../audio/sfx';
import { useGame } from '../../state/store';
import { Cat, type CatMood } from './Cat';

type Props = {
  mood?: CatMood;
  size?: number;
  meow?: boolean;
  /** Свой обработчик тапа вместо обычного «мяу» */
  onTap?: () => void;
  onSixSeven?: () => void;
  mirrored?: boolean;
};

/** Котик игрока с его окраской и аксессуарами */
export function MyCat({ mood, size, meow = true, onTap, onSixSeven, mirrored }: Props) {
  const profile = useGame((s) => s.profile);
  const equipped = useGame((s) => s.equipped);
  return (
    <Cat
      fur={profile?.fur ?? 'ginger'}
      accessories={equipped}
      mood={mood}
      size={size}
      onClick={onTap ?? (meow ? () => sfx.meow() : undefined)}
      onSixSeven={onSixSeven}
      mirrored={mirrored}
    />
  );
}
