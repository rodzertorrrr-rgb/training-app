
export type SetType = 'RAMP_UP' | 'TOP_SET' | 'BACK_OFF' | 'DROP_SET' | 'SUPER_SET' | 'WORKING';
export type RestCategory = 'compound_barbell' | 'compound_machine' | 'isolation' | 'calves';

export type MuscleGroup = 'Piept' | 'Spate' | 'Umeri' | 'Biceps' | 'Triceps' | 'Cvadriceps' | 'Femurali' | 'Glutei' | 'Adductori / Abductori' | 'Lower Back' | 'Gambe' | 'Core' | 'Altele';
export type Equipment = 'barbell' | 'dumbbell' | 'cable' | 'machine' | 'smith' | 'bodyweight' | 'other';
export type MovementType = 'compound' | 'isolation';

export type EduCategory = 'FOUNDATION' | 'EFFORT' | 'CLARITY' | 'STRUCTURE' | 'RECOVERY' | 'ADVANCED' | 'PHILOSOPHY' | 'EXERCISES';

export interface ExerciseInfoCard {
  name: string;
  whyExercise: string;
  whySets: string;
  executionCues: string[];
  recommendedRest: {
    time: string;
    label: string;
  };
}

export interface EducationSection {
  id: string;
  title: string;
  category: EduCategory;
  type: 'text' | 'list';
  content: string | string[];
}

export interface ExerciseMetadata {
  axialStress: number;
  movementType: MovementType;
  tensionProfile: 'LENGTHENED' | 'SHORTENED' | 'NEUTRAL';
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
  why?: string;
  whySets?: string;
  cue?: string;
  stimulus?: string;
  lengthDominance?: 'LUNG' | 'MEDIE' | 'SCURTĂ';
  defaultSetup?: string;
  metadata?: ExerciseMetadata;
}

export interface ProgramDay {
  id: string;
  name: string;
  exercises: ProgramExercise[];
  isCustom?: boolean;
}

export interface UserProfile {
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  sex: 'MALE' | 'FEMALE';
  goal: 'HYPERTROPHY' | 'STRENGTH' | 'SPECIFIC';
  priorities: MuscleGroup[];
  daysPerWeek: number;
  setPreference: 'TOP_BACKOFF' | 'STRAIGHT';
}

export interface User {
  id: string;
  name: string;
  profile?: UserProfile;
}

export interface MasterExercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  restCategory: RestCategory;
  equipment?: Equipment;
  movementType?: MovementType;
  unilateral?: boolean;
}

export interface SubSetLog {
  id: string;
  weight: string;
  reps: string;
  rir: number | string;
}

export interface SetLog {
  id: string;
  type: SetType;
  weight: string;
  reps: string;
  rir: number | string;
  restTime?: number;
  isCompleted: boolean;
  isFailure?: boolean;
  subSets?: SubSetLog[];
  supersetName?: string;    
  supersetWeight?: string; 
  supersetReps?: string;   
}

export interface ExerciseLog {
  id: string;
  exerciseId: string;
  name: string;
  sets: SetLog[];
  setupNotes?: string;
  notes_template?: string; 
  supersetGroupId?: string; 
  supersetOrder?: number;
  customContext?: any;
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
  notes?: string;
}

export interface WeightEntry {
  date: string;
  weight: number;
  note?: string;
  createdAt: number;
  updatedAt: number;
}
