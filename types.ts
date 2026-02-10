
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
  id: string; // For master list, this is the master ID. For program, this is unique instance ID? No, keeps ref to master.
  masterId?: string; // Reference to the library ID
  name: string;
  defaultRampUpSets: number;
  defaultBackOffSets: number;
  hasTopSet: boolean; 
  targetReps: string;
  targetRir: number;
  note?: string;
}

export interface ProgramDay {
  id: string;
  name: string;
  exercises: ProgramExercise[];
  isCustom?: boolean; // Flag to identify user created programs
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