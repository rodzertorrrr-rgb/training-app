
import { ProgramDay, UserProfile, MuscleGroup } from '../types';

export interface ValidationFeedback {
  type: 'INFO' | 'WARNING' | 'CRITICAL';
  message: string;
  suggestion?: string;
}

export class HypertrophyEngine {
  private profile: UserProfile;

  constructor(profile: UserProfile) {
    this.profile = profile;
  }

  getOptimalWeeklyVolume(muscle: MuscleGroup): { min: number; max: number } {
    const isPriority = this.profile.priorities.includes(muscle);
    let base = 10;

    if (this.profile.level === 'BEGINNER') base = 8;
    if (this.profile.level === 'ADVANCED') base = 12;

    const isLowerBody = ['Cvadriceps', 'Femurali', 'Glutei', 'Gambe'].includes(muscle);
    const sexBonus = (this.profile.sex === 'FEMALE' && isLowerBody) ? 2 : 0;

    const multiplier = isPriority ? 1.3 : 1.0;
    return {
      min: Math.floor(base * multiplier) + sexBonus,
      max: Math.ceil((base + 4) * multiplier) + sexBonus
    };
  }

  validateSession(day: ProgramDay): ValidationFeedback[] {
    const feedback: ValidationFeedback[] = [];
    let totalAxialStress = 0;
    let compoundCount = 0;
    const muscleStats: Record<string, { sets: number; profiles: string[] }> = {};

    day.exercises.forEach(ex => {
      const meta = ex.metadata;
      if (!meta) return;

      // 1. Stres Axial
      totalAxialStress += meta.axialStress;
      if (meta.movementType === 'compound' && meta.axialStress >= 4) compoundCount++;

      // 2. Redundanță per grupă
      const mGroup = ex.name.includes('Bench') ? 'Piept' : 
                     ex.name.includes('Squat') ? 'Cvadriceps' : 
                     ex.name.includes('Row') ? 'Spate' : 'Altele';
      
      if (!muscleStats[mGroup]) muscleStats[mGroup] = { sets: 0, profiles: [] };
      
      // Estimăm seturi hard: 1 (top) + back-offs
      muscleStats[mGroup].sets += (ex.hasTopSet ? 1 : 0) + ex.defaultBackOffSets;
      muscleStats[mGroup].profiles.push(meta.tensionProfile);
    });

    if (compoundCount > 3) {
      feedback.push({
        type: 'WARNING',
        message: 'Prea multe mișcări compuse grele.',
        suggestion: 'SNC va fi epuizat prematur. Schimbă un exercițiu cu bară cu unul la mașină.'
      });
    }

    if (totalAxialStress > 12) {
      feedback.push({
        type: 'CRITICAL',
        message: 'Încărcare axială critică detectată.',
        suggestion: 'Risc mare de oboseală sistemică. Mută exerciții precum Squat sau RDL în zile diferite.'
      });
    }

    Object.entries(muscleStats).forEach(([muscle, stats]) => {
      const lengthenedCount = stats.profiles.filter(p => p === 'LENGTHENED').length;
      if (lengthenedCount > 2) {
        feedback.push({
          type: 'INFO',
          message: `Redundanță biomecanică la ${muscle}.`,
          suggestion: 'Toate exercițiile vizează poziția alungită. Adaugă o mișcare pentru poziție scurtată (peak contraction).'
        });
      }

      if (stats.sets > 7) {
        feedback.push({
          type: 'WARNING',
          message: `Volum excesiv (Junk Volume) la ${muscle}.`,
          suggestion: 'Peste 7 seturi hard per sesiune, stimulul se diluează. Distribuie volumul pe mai multe zile.'
        });
      }
    });

    return feedback;
  }
}
