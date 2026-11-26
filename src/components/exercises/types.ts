import type { Exercise, ExerciseResult } from '../../engine/exercises';

export type ExerciseProps<K extends Exercise['kind']> = {
  ex: Extract<Exercise, { kind: K }>;
  onDone: (result: ExerciseResult) => void;
};
