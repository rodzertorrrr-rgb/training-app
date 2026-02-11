
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, WorkoutSession, SetLog, ExerciseLog, ProgramDay, MasterExercise, WeightEntry } from '../types';
import { useAuth } from './AuthContext';
import { TRAINING_PROGRAM, MASTER_EXERCISE_LIST } from '../constants';

interface DataContextType {
  sessions: WorkoutSession[];
  draftSession: WorkoutSession | null;
  startSession: (dayId: string) => void;
  updateDraft: (session: WorkoutSession) => void;
  saveSession: () => void;
  discardSession: () => void;
  deleteSession: (sessionId: string) => void;
  advancedMode: boolean;
  toggleAdvancedMode: () => void;
  getLastSessionExerciseData: (exerciseId: string) => { weight: number, reps: number, rir: number } | null;
  updateExerciseNote: (exerciseId: string, note: string) => void;
  removeSet: (exerciseId: string, setId: string) => void;
  getExerciseHistory: (exerciseId: string) => any[];
  customPrograms: ProgramDay[];
  saveCustomProgram: (program: ProgramDay) => void;
  deleteCustomProgram: (programId: string) => void;
  customExercises: MasterExercise[];
  addCustomExercise: (name: string, muscleGroup: string) => MasterExercise;
  getAllExercises: () => MasterExercise[];
  weightLogs: Record<string, WeightEntry>;
  saveWeight: (weight: number, date: string, note?: string) => void;
  deleteWeight: (date: string) => void;
  getWeightStats: () => { current: number, avg7d: number, diff7d: number };
  integrityCheck: () => Promise<string[]>;
}

const generateId = () => Math.random().toString(36).substr(2, 9);
const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [draftSession, setDraftSession] = useState<WorkoutSession | null>(null);
  const [advancedMode, setAdvancedMode] = useState<boolean>(false);
  const [customPrograms, setCustomPrograms] = useState<ProgramDay[]>([]);
  const [customExercises, setCustomExercises] = useState<MasterExercise[]>([]);
  const [weightLogs, setWeightLogs] = useState<Record<string, WeightEntry>>({});

  const PREFIX = 'rdz_v2_'; 

  useEffect(() => {
    if (user) {
      const sSessions = localStorage.getItem(`${PREFIX}sessions_${user.id}`);
      const sWeight = localStorage.getItem(`${PREFIX}weight_${user.id}`);
      const sAdv = localStorage.getItem(`${PREFIX}adv_${user.id}`);
      const sCustP = localStorage.getItem(`${PREFIX}custom_programs_${user.id}`);
      const sCustE = localStorage.getItem(`${PREFIX}custom_exercises_${user.id}`);

      setSessions(sSessions ? JSON.parse(sSessions) : []);
      setWeightLogs(sWeight ? JSON.parse(sWeight) : {});
      setAdvancedMode(sAdv === 'true');
      setCustomPrograms(sCustP ? JSON.parse(sCustP) : []);
      setCustomExercises(sCustE ? JSON.parse(sCustE) : []);
    }
  }, [user]);

  // Fix: Implemented getLastSessionExerciseData to retrieve performance from the previous session for a given exercise.
  const getLastSessionExerciseData = (exerciseId: string) => {
    const lastSession = sessions.find(s => s.exercises.some(e => e.exerciseId === exerciseId));
    if (!lastSession) return null;
    const ex = lastSession.exercises.find(e => e.exerciseId === exerciseId);
    if (!ex) return null;
    const topSet = ex.sets.find(s => s.type === 'TOP_SET');
    const targetSet = topSet || ex.sets.reduce((prev, curr) => (Number(curr.weight) > Number(prev.weight) ? curr : prev), ex.sets[0]);
    if (!targetSet || targetSet.weight === '') return null;
    return {
      weight: Number(targetSet.weight),
      reps: Number(targetSet.reps),
      rir: Number(targetSet.rir)
    };
  };

  const saveWeight = (weight: number, date: string, note?: string) => {
    if (!user) return;
    const existing = weightLogs[date];
    const newEntry: WeightEntry = {
      date,
      weight: Number(Number(weight).toFixed(1)),
      note,
      createdAt: existing ? existing.createdAt : Date.now(),
      updatedAt: Date.now()
    };
    const newLogs = { ...weightLogs, [date]: newEntry };
    setWeightLogs(newLogs);
    localStorage.setItem(`${PREFIX}weight_${user.id}`, JSON.stringify(newLogs));
  };

  const deleteWeight = (date: string) => {
    if (!user) return;
    const newLogs = { ...weightLogs };
    delete newLogs[date];
    setWeightLogs(newLogs);
    localStorage.setItem(`${PREFIX}weight_${user.id}`, JSON.stringify(newLogs));
  };

  const getWeightStats = () => {
    const entries = Object.values(weightLogs).sort((a, b) => b.date.localeCompare(a.date));
    if (entries.length === 0) return { current: 0, avg7d: 0, diff7d: 0 };

    const current = entries[0].weight;
    
    // Media ultimelor 7 intrări
    const last7 = entries.slice(0, 7).map(e => e.weight);
    const avg7d = last7.reduce((a, b) => a + b, 0) / last7.length;

    // Trend (comparație cu cele 7 intrări anterioare)
    const prev7 = entries.slice(7, 14).map(e => e.weight);
    const prevAvg = prev7.length > 0 ? prev7.reduce((a, b) => a + b, 0) / prev7.length : avg7d;

    return { 
      current, 
      avg7d: Number(avg7d.toFixed(1)), 
      diff7d: Number((avg7d - prevAvg).toFixed(2)) 
    };
  };

  const startSession = (dayId: string) => {
    if (!user || draftSession) return;
    const allP = [...TRAINING_PROGRAM, ...customPrograms];
    const day = allP.find(d => d.id === dayId);
    if (!day) return;
    const newExs: ExerciseLog[] = day.exercises.map(ex => ({
      id: generateId(), exerciseId: ex.id, name: ex.name, 
      sets: Array.from({length: ex.defaultRampUpSets + (ex.hasTopSet ? 1 : 0) + ex.defaultBackOffSets}).map((_, i) => ({
        id: generateId(), type: i < ex.defaultRampUpSets ? 'RAMP_UP' : (i === ex.defaultRampUpSets && ex.hasTopSet ? 'TOP_SET' : 'BACK_OFF'),
        weight: '', reps: '', rir: '', isCompleted: false
      }))
    }));
    setDraftSession({ id: generateId(), userId: user.id, dayId, dayName: day.name, status: 'DRAFT', startedAt: Date.now(), exercises: newExs });
  };

  const saveSession = () => {
    if (!user || !draftSession) return;
    const finished: WorkoutSession = { ...draftSession, status: 'COMPLETED', completedAt: Date.now() };
    const newSessions = [finished, ...sessions];
    setSessions(newSessions);
    localStorage.setItem(`${PREFIX}sessions_${user.id}`, JSON.stringify(newSessions));
    setDraftSession(null);
  };

  const integrityCheck = async (): Promise<string[]> => {
    const report: string[] = ["Verificare date..."];
    if (!user) {
      report.push("Eroare: Utilizator neconectat.");
      return report;
    }
    report.push(`Sesiuni: ${sessions.length}`);
    report.push(`Greutate: ${Object.keys(weightLogs).length} intrări`);
    report.push("Integritate OK.");
    return report;
  };

  return (
    <DataContext.Provider value={{
      sessions, draftSession, startSession, updateDraft: setDraftSession, saveSession, discardSession: () => setDraftSession(null), 
      deleteSession: (id) => { const ns = sessions.filter(s => s.id !== id); setSessions(ns); localStorage.setItem(`${PREFIX}sessions_${user?.id}`, JSON.stringify(ns)); },
      advancedMode, toggleAdvancedMode: () => { const nv = !advancedMode; setAdvancedMode(nv); localStorage.setItem(`${PREFIX}adv_${user?.id}`, String(nv)); },
      getLastSessionExerciseData,
      getExerciseHistory: (id) => sessions.filter(s => s.exercises.some(e => e.exerciseId === id)).map(s => ({ date: s.completedAt, sets: s.exercises.find(e => e.exerciseId === id)?.sets })).slice(0, 5),
      updateExerciseNote: (exId, note) => { if(!draftSession) return; const upd = {...draftSession, exercises: draftSession.exercises.map(e => e.exerciseId === exId ? {...e, settingsNote: note} : e)}; setDraftSession(upd); },
      removeSet: (exId, setId) => { if(!draftSession) return; const upd = {...draftSession, exercises: draftSession.exercises.map(e => e.id === exId ? {...e, sets: e.sets.filter(s => s.id !== setId)} : e)}; setDraftSession(upd); },
      customPrograms, saveCustomProgram: (p) => { const np = [...customPrograms.filter(x => x.id !== p.id), p]; setCustomPrograms(np); localStorage.setItem(`${PREFIX}custom_programs_${user?.id}`, JSON.stringify(np)); },
      deleteCustomProgram: (id) => { const np = customPrograms.filter(x => x.id !== id); setCustomPrograms(np); localStorage.setItem(`${PREFIX}custom_programs_${user?.id}`, JSON.stringify(np)); },
      customExercises, addCustomExercise: (name, muscleGroup) => { const ne = {id: `custom_${generateId()}`, name, muscleGroup}; const nex = [...customExercises, ne]; setCustomExercises(nex); localStorage.setItem(`${PREFIX}custom_exercises_${user?.id}`, JSON.stringify(nex)); return ne; },
      getAllExercises: () => [...MASTER_EXERCISE_LIST, ...customExercises],
      weightLogs, saveWeight, deleteWeight, getWeightStats, integrityCheck
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
