
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { User, WorkoutSession, SetLog, ExerciseLog, ProgramDay, MasterExercise, WeightEntry, SetType, RestCategory, SubSetLog } from '../types.ts';
import { useAuth } from './AuthContext.tsx';
import { TRAINING_PROGRAM, MASTER_EXERCISE_LIST, getPresetRest } from '../constants.ts';

export interface AchievementMeta {
  id: string;
  sessionId: string;
  createdAt: number;
}

interface WeightStats {
  current: number;
  avg7d: number;
  prevAvg7d: number;
  diff7d: number;
  count: number;
  advice: {
    text: string;
    type: 'NEUTRAL' | 'ACTION' | 'SUCCESS';
    direction: 'UP' | 'DOWN' | 'STABLE';
  };
}

interface DataContextType {
  sessions: WorkoutSession[];
  achievements: AchievementMeta[];
  draftSession: WorkoutSession | null;
  startSession: (dayId: string) => void;
  updateDraft: (session: WorkoutSession) => void;
  saveSession: () => void;
  discardSession: () => void;
  deleteSession: (sessionId: string) => void;
  saveAchievement: (sessionId: string) => void;
  advancedMode: boolean;
  toggleAdvancedMode: () => void;
  getLastSessionExerciseData: (exerciseId: string) => { weight: number, reps: number, rir: number, date: number } | null;
  getAIProgressAdvice: (exerciseId: string, targetReps?: string) => { analysis: string, recommendation: string, reason: string };
  updateExerciseNote: (exerciseId: string, note: string) => void;
  updateSessionNotes: (notes: string) => void;
  removeSet: (exerciseId: string, setId: string) => void;
  addSubSet: (exerciseId: string, setId: string) => void;
  removeSubSet: (exerciseId: string, setId: string, subSetId: string) => void;
  getExerciseHistory: (exerciseId: string) => any[];
  customPrograms: ProgramDay[];
  saveCustomProgram: (program: ProgramDay) => void;
  deleteCustomProgram: (programId: string) => void;
  customExercises: MasterExercise[];
  addCustomExercise: (exercise: Omit<MasterExercise, 'id'>) => MasterExercise;
  getAllExercises: () => MasterExercise[];
  weightLogs: Record<string, WeightEntry>;
  saveWeight: (weight: number, date: string, note?: string) => void;
  deleteWeight: (date: string) => void;
  getWeightStats: () => WeightStats;
  isDataLoaded: boolean;
}

const generateId = () => Math.random().toString(36).substr(2, 9);
const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [achievements, setAchievements] = useState<AchievementMeta[]>([]);
  const [draftSession, setDraftSession] = useState<WorkoutSession | null>(null);
  const [advancedMode, setAdvancedMode] = useState<boolean>(false);
  const [customPrograms, setCustomPrograms] = useState<ProgramDay[]>([]);
  const [customExercises, setCustomExercises] = useState<MasterExercise[]>([]);
  const [weightLogs, setWeightLogs] = useState<Record<string, WeightEntry>>({});
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const PREFIX = 'rdz_v2_';
  const loadingRef = useRef(true);

  const safeSave = useCallback((suffix: string, data: any) => {
    if (loadingRef.current || !user?.id) return;
    try {
      localStorage.setItem(`${PREFIX}${suffix}_${user.id}`, JSON.stringify(data));
    } catch (e) { console.error(e); }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      loadingRef.current = true;
      setIsDataLoaded(false);

      const restore = (suffix: string, def: any) => {
        const d = localStorage.getItem(`${PREFIX}${suffix}_${user.id}`);
        try { return d ? JSON.parse(d) : def; } catch { return def; }
      };

      setSessions(restore('sessions', []));
      setAchievements(restore('achievements', []));
      setWeightLogs(restore('weight', {}));
      setCustomPrograms(restore('custom_programs', []));
      setCustomExercises(restore('custom_exercises', []));
      
      const sAdv = localStorage.getItem(`${PREFIX}adv_${user.id}`);
      setAdvancedMode(sAdv === 'true');

      setTimeout(() => {
        loadingRef.current = false;
        setIsDataLoaded(true);
      }, 100);
    }
  }, [user?.id]);

  useEffect(() => { if (isDataLoaded) safeSave('sessions', sessions); }, [sessions, isDataLoaded, safeSave]);
  useEffect(() => { if (isDataLoaded) safeSave('achievements', achievements); }, [achievements, isDataLoaded, safeSave]);
  useEffect(() => { if (isDataLoaded) safeSave('custom_programs', customPrograms); }, [customPrograms, isDataLoaded, safeSave]);
  useEffect(() => { if (isDataLoaded) safeSave('custom_exercises', customExercises); }, [customExercises, isDataLoaded, safeSave]);
  useEffect(() => { if (isDataLoaded) safeSave('weight', weightLogs); }, [weightLogs, isDataLoaded, safeSave]);

  const saveAchievement = (sessionId: string) => {
    const newAchievement: AchievementMeta = {
      id: generateId(),
      sessionId,
      createdAt: Date.now()
    };
    setAchievements(prev => [newAchievement, ...prev]);
  };

  const getLastSessionExerciseData = (exId: string) => {
    const lastS = sessions.find(s => s.exercises.some(e => e.exerciseId === exId));
    if (!lastS) return null;
    const ex = lastS.exercises.find(e => e.exerciseId === exId);
    if (!ex) return null;
    const working = ex.sets.find(s => s.type === 'TOP_SET') || ex.sets[0];
    return { weight: Number(working.weight), reps: Number(working.reps), rir: Number(working.rir), date: lastS.completedAt || 0 };
  };

  const getAIProgressAdvice = (exId: string, target?: string) => {
    const last = getLastSessionExerciseData(exId);
    if (!last) return { analysis: "Prima sesiune.", recommendation: "Căutăm progresie pe setul TOP.", reason: "N/A" };
    return { analysis: `Ultima: ${last.weight}kg x ${last.reps}.`, recommendation: `Căutăm progresie pe setul TOP.`, reason: "Supraîncărcare." };
  };

  const startSession = (dayId: string) => {
    if (draftSession) return;
    const allP = [...TRAINING_PROGRAM, ...customPrograms];
    const day = allP.find(d => d.id === dayId);
    if (!day) return;
    
    const newExs: ExerciseLog[] = day.exercises.map(ex => {
      const master = MASTER_EXERCISE_LIST.find(m => m.name === ex.name);
      const cat = master?.restCategory || 'isolation';
      const sets: SetLog[] = [];
      
      for(let i=0; i < ex.defaultRampUpSets; i++) {
        sets.push({ id: generateId(), type: 'RAMP_UP', weight: '', reps: '', rir: 5, restTime: getPresetRest(cat, 'RAMP_UP'), isCompleted: false, subSets: [] });
      }
      if(ex.hasTopSet) {
        sets.push({ id: generateId(), type: 'TOP_SET', weight: '', reps: '', rir: 1, restTime: getPresetRest(cat, 'TOP_SET'), isCompleted: false, subSets: [] });
      }
      for(let i=0; i < ex.defaultBackOffSets; i++) {
        sets.push({ id: generateId(), type: 'BACK_OFF', weight: '', reps: '', rir: 2, restTime: getPresetRest(cat, 'BACK_OFF'), isCompleted: false, subSets: [] });
      }

      return {
        id: generateId(), 
        exerciseId: ex.id, 
        name: ex.name, 
        setupNotes: '',
        notes_template: ex.defaultSetup || '',
        customContext: { 
          why: ex.why, 
          whySets: ex.whySets,
          cue: ex.cue, 
          targetReps: ex.targetReps, 
          restCategory: cat,
          stimulus: ex.stimulus,
          lengthDominance: ex.lengthDominance
        },
        sets
      };
    });
    setDraftSession({ id: generateId(), userId: user!.id, dayId, dayName: day.name, status: 'DRAFT', startedAt: Date.now(), exercises: newExs });
  };

  const getWeightStats = (): WeightStats => {
    const sortedEntries = (Object.values(weightLogs) as WeightEntry[]).sort((a, b) => b.date.localeCompare(a.date));
    const count = sortedEntries.length;
    const current = count > 0 ? sortedEntries[0].weight : 0;
    const currentWindow = sortedEntries.slice(0, 7);
    const avg7d = currentWindow.length > 0 ? Number((currentWindow.reduce((acc, e) => acc + e.weight, 0) / currentWindow.length).toFixed(1)) : 0;
    const prevWindow = sortedEntries.slice(7, 14);
    const prevAvg7d = prevWindow.length > 0 ? Number((prevWindow.reduce((acc, e) => acc + e.weight, 0) / prevWindow.length).toFixed(1)) : 0;
    const diff7d = prevAvg7d > 0 ? Number((avg7d - prevAvg7d).toFixed(1)) : 0;
    return { current, avg7d, prevAvg7d, diff7d, count, advice: { text: "", type: 'NEUTRAL', direction: 'STABLE' } };
  };

  const addSubSet = (exId: string, setId: string) => {
    setDraftSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        exercises: prev.exercises.map(ex => {
          if (ex.id !== exId) return ex;
          return {
            ...ex,
            sets: ex.sets.map(set => {
              if (set.id !== setId) return set;
              const newSub: SubSetLog = { id: generateId(), weight: '', reps: '', rir: '' };
              return { ...set, subSets: [...(set.subSets || []), newSub] };
            })
          };
        })
      };
    });
  };

  const removeSubSet = (exId: string, setId: string, subId: string) => {
    setDraftSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        exercises: prev.exercises.map(ex => {
          if (ex.id !== exId) return ex;
          return {
            ...ex,
            sets: ex.sets.map(set => {
              if (set.id !== setId) return set;
              return { ...set, subSets: (set.subSets || []).filter(s => s.id !== subId) };
            })
          };
        })
      };
    });
  };

  const getExerciseHistory = (id: string) => {
    return sessions
      .filter(s => s.status === 'COMPLETED' && s.exercises.some(e => e.exerciseId === id))
      .map(s => ({
        date: s.completedAt,
        sets: s.exercises.find(e => e.exerciseId === id)?.sets
      }))
      .slice(0, 5);
  };

  return (
    <DataContext.Provider value={{
      sessions, achievements, draftSession, startSession, updateDraft: setDraftSession, 
      saveSession: () => { 
        if (!draftSession) return;
        const f = { ...draftSession, status: 'COMPLETED' as const, completedAt: Date.now() }; 
        setSessions([f, ...sessions]); 
        setDraftSession(null); 
      },
      discardSession: () => setDraftSession(null), 
      deleteSession: (id) => setSessions(sessions.filter(s => s.id !== id)),
      saveAchievement,
      advancedMode, toggleAdvancedMode: () => { setAdvancedMode(!advancedMode); localStorage.setItem(`${PREFIX}adv_${user?.id}`, String(!advancedMode)); },
      getLastSessionExerciseData, getAIProgressAdvice, 
      updateExerciseNote: (id, n) => {
        setDraftSession(prev => {
          if(!prev) return null;
          return { ...prev, exercises: prev.exercises.map(ex => ex.id === id ? { ...ex, setupNotes: n } : ex) };
        });
      },
      updateSessionNotes: (n) => setDraftSession(d => d ? {...d, notes: n} : null),
      removeSet: (exId, sId) => setDraftSession(d => d ? {...d, exercises: d.exercises.map(e => e.id === exId ? {...e, sets: e.sets.filter(s => s.id !== sId)} : e)} : null),
      addSubSet,
      removeSubSet,
      getExerciseHistory,
      customPrograms, saveCustomProgram: (p) => setCustomPrograms(v => [...v.filter(x => x.id !== p.id), p]),
      deleteCustomProgram: (id) => setCustomPrograms(v => v.filter(x => x.id !== id)),
      customExercises, addCustomExercise: (e) => { const n = { id: generateId(), ...e }; setCustomExercises(v => [...v, n]); return n; },
      getAllExercises: () => [...MASTER_EXERCISE_LIST, ...customExercises],
      weightLogs, saveWeight: (w, d, n) => setWeightLogs(v => ({ ...v, [d]: { date: d, weight: w, note: n, createdAt: Date.now(), updatedAt: Date.now() } })),
      deleteWeight: (d) => { const n = {...weightLogs}; delete n[d]; setWeightLogs(n); },
      getWeightStats,
      isDataLoaded
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('ERR');
  return context;
};
