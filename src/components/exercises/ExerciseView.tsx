import type { Exercise, ExerciseResult } from '../../engine/exercises';
import { BalloonPop } from './BalloonPop';
import { CatchFish } from './CatchFish';
import { FillGap } from './FillGap';
import { ListenPick } from './ListenPick';
import { MemoryMatch } from './MemoryMatch';
import { PicturePick } from './PicturePick';
import { SentenceBuilder } from './SentenceBuilder';
import { SpellLetters } from './SpellLetters';
import { TypeWord } from './TypeWord';

export function ExerciseView({ ex, onDone }: { ex: Exercise; onDone: (r: ExerciseResult) => void }) {
  switch (ex.kind) {
    case 'listenPick':
      return <ListenPick ex={ex} onDone={onDone} />;
    case 'picturePick':
      return <PicturePick ex={ex} onDone={onDone} />;
    case 'memory':
      return <MemoryMatch ex={ex} onDone={onDone} />;
    case 'spell':
      return <SpellLetters ex={ex} onDone={onDone} />;
    case 'type':
      return <TypeWord ex={ex} onDone={onDone} />;
    case 'sentence':
      return <SentenceBuilder ex={ex} onDone={onDone} />;
    case 'fillGap':
      return <FillGap ex={ex} onDone={onDone} />;
    case 'catchFish':
      return <CatchFish ex={ex} onDone={onDone} />;
    case 'balloons':
      return <BalloonPop ex={ex} onDone={onDone} />;
  }
}

/** Что показать и озвучить после ответа */
export function answerOf(ex: Exercise): { en: string; ru: string } | null {
  switch (ex.kind) {
    case 'listenPick':
    case 'picturePick':
    case 'spell':
    case 'type':
      return { en: ex.target.en, ru: ex.target.ru };
    case 'sentence':
    case 'fillGap':
      return { en: ex.phrase.en, ru: ex.phrase.ru };
    default:
      return null;
  }
}
