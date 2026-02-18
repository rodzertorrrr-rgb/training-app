
import { MuscleGroup, Equipment, MovementType, RestCategory } from './types';

export interface ExerciseBiomechanics {
  lengthDominance: 'LONG' | 'MID' | 'SHORT';
  axialStress: 1 | 2 | 3 | 4 | 5;
  stability: 'LOW' | 'MED' | 'HIGH';
}

export interface CustomExerciseDB {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  equipment: Equipment;
  movementType: MovementType;
  unilateral: boolean;
  restCategory: RestCategory;
  defaultRepRange: string;
  notes: string;
  biomechanics: ExerciseBiomechanics;
}

export const CUSTOM_EXERCISES_DB: CustomExerciseDB[] = [
  { 
    id: "bb-bench-press", name: "Barbell Bench Press", muscleGroup: "Piept", equipment: "barbell", movementType: "compound", unilateral: false, restCategory: 'compound_barbell', defaultRepRange: "6-10", notes: "",
    biomechanics: { lengthDominance: 'MID', axialStress: 4, stability: 'MED' }
  },
  { 
    id: "hack-squat", name: "Hack Squat", muscleGroup: "Cvadriceps", equipment: "machine", movementType: "compound", unilateral: false, restCategory: 'compound_machine', defaultRepRange: "8-12", notes: "",
    biomechanics: { lengthDominance: 'LONG', axialStress: 3, stability: 'HIGH' }
  },
  { 
    id: "rdl", name: "Romanian Deadlift", muscleGroup: "Femurali", equipment: "barbell", movementType: "compound", unilateral: false, restCategory: 'compound_barbell', defaultRepRange: "6-10", notes: "",
    biomechanics: { lengthDominance: 'LONG', axialStress: 5, stability: 'MED' }
  },
  { 
    id: "db-lat-raise", name: "Dumbbell Lateral Raise", muscleGroup: "Umeri", equipment: "dumbbell", movementType: "isolation", unilateral: true, restCategory: 'isolation', defaultRepRange: "12-20", notes: "",
    biomechanics: { lengthDominance: 'SHORT', axialStress: 1, stability: 'LOW' }
  }
  // ... restul vor fi populate similar
];
