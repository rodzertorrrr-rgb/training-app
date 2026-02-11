
export type SetType = 'RAMP_UP' | 'TOP_SET' | 'BACK_OFF';

export interface SetLog {
  id: string;
  type: SetType;
  weight: number | '';
  reps: number | '';
  rir: number | '';
  isCompleted: boolean;
}

export interface ExerciseLog {
  id: string;
  exerciseId: string;
  name: string;
  sets: SetLog[];
  startedAt?: number;
  finishedAt?: number;
  note?: string;
  settingsNote?: string; 
  // Custom context for this specific instance in a workout
  customContext?: {
    why?: string;
    scheme?: string;
    cue?: string;
    rest?: number;
  };
}

export interface WorkoutSession {
  id: string;
  userId: string;
  dayId: string;
  dayName: string;
  status: 'DRAFT' | 'COMPLETED';
  startedAt: number;
  completedAt?: number;
  exercises: ExerciseLog[];
}

export interface User {
  id: string;
  name: string;
}

export interface ProgramExercise {
  id: string; 
  masterId?: string; 
  name: string;
  defaultRampUpSets: number;
  defaultBackOffSets: number;
  hasTopSet: boolean; 
  targetReps: string;
  targetRir: number;
  note?: string;
  // New customization fields
  why?: string;
  scheme?: string;
  cue?: string;
  rest?: number;
}

export interface ProgramDay {
  id: string;
  name: string;
  exercises: ProgramExercise[];
  isCustom?: boolean; 
}

export interface MasterExercise {
  id: string;
  name: string;
  muscleGroup: string;
}

export type EduCategory = 'FOUNDATION' | 'EFFORT' | 'CLARITY' | 'STRUCTURE' | 'RECOVERY' | 'ADVANCED' | 'PHILOSOPHY';

export interface EducationalSection {
  id: string;
  category: EduCategory;
  title: string;
  content: string | string[]; 
  type: 'text' | 'list';
}
