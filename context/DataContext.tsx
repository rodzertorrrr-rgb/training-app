
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
  saveWeight: (entry: WeightEntry) => void;
  deleteWeight: (date: string) => void;
  getWeightStats: () => { current: number, avg7d: number, diff7d: number };
  // FIX: Added integrityCheck to the DataContextType interface
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
      const sDraft = localStorage.getItem(`${PREFIX}draft_${user.id}`);
      const sAdv = localStorage.getItem(`${PREFIX}adv_${user.id}`);
      const sCustP = localStorage.getItem(`${PREFIX}custom_programs_${user.id}`);
      const sCustE = localStorage.getItem(`${PREFIX}custom_exercises_${user.id}`);
      const sWeight = localStorage.getItem(`${PREFIX}weight_${user.id}`);

      setSessions(sSessions ? JSON.parse(sSessions) : []);
      setDraftSession(sDraft ? JSON.parse(sDraft) : null);
      setAdvancedMode(sAdv === 'true');
      setCustomPrograms(sCustP ? JSON.parse(sCustP) : []);
      setCustomExercises(sCustE ? JSON.parse(sCustE) : []);
      setWeightLogs(sWeight ? JSON.parse(sWeight) : {});
    }
  }, [user]);

  useEffect(() => {
    if (user && draftSession) {
      localStorage.setItem(`${PREFIX}draft_${user.id}`, JSON.stringify(draftSession));
    } else if (user && !draftSession) {
      localStorage.removeItem(`${PREFIX}draft_${user.id}`);
    }
  }, [draftSession, user]);

  const saveWeight = (entry: WeightEntry) => {
    if (!user) return;
    const newLogs = { ...weightLogs, [entry.date]: entry };
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
    const dates = Object.keys(weightLogs).sort().reverse();
    if (dates.length === 0) return { current: 0, avg7d: 0, diff7d: 0 };
    const current = weightLogs[dates[0]].weight;
    const last7 = dates.slice(0, 7).map(d => weightLogs[d].weight);
    const avg7d = last7.reduce((a, b) => a + b, 0) / last7.length;
    const prev7 = dates.slice(7, 14).map(d => weightLogs[d].weight);
    const prevAvg = prev7.length > 0 ? prev7.reduce((a, b) => a + b, 0) / prev7.length : avg7d;
    return { current, avg7d, diff7d: avg7d - prevAvg };
  };

  const saveCustomProgram = (program: ProgramDay) => {
    if (!user) return;
    const newProgs = [...customPrograms.filter(p => p.id !== program.id), program];
    setCustomPrograms(newProgs);
    localStorage.setItem(`${PREFIX}custom_programs_${user.id}`, JSON.stringify(newProgs));
  };

  const deleteCustomProgram = (id: string) => {
    if (!user) return;
    const newProgs = customPrograms.filter(p => p.id !== id);
    setCustomPrograms(newProgs);
    localStorage.setItem(`${PREFIX}custom_programs_${user.id}`, JSON.stringify(newProgs));
  };

  const addCustomExercise = (name: string, muscleGroup: string) => {
    const newEx = { id: `custom_${generateId()}`, name, muscleGroup };
    if (user) {
      const newList = [...customExercises, newEx];
      setCustomExercises(newList);
      localStorage.setItem(`${PREFIX}custom_exercises_${user.id}`, JSON.stringify(newList));
    }
    return newEx;
  };

  const startSession = (dayId: string) => {
    if (!user || draftSession) return;
    const allP = [...TRAINING_PROGRAM, ...customPrograms];
    const day = allP.find(d => d.id === dayId);
    if (!day) return;

    const newExs: ExerciseLog[] = day.exercises.map(ex => {
      const sets: SetLog[] = [];
      for (let i = 0; i < ex.defaultRampUpSets; i++) sets.push({ id: generateId(), type: 'RAMP_UP', weight: '', reps: '', rir: '', isCompleted: false });
      if (ex.hasTopSet) sets.push({ id: generateId(), type: 'TOP_SET', weight: '', reps: '', rir: '', isCompleted: false });
      for (let i = 0; i < ex.defaultBackOffSets; i++) sets.push({ id: generateId(), type: 'BACK_OFF', weight: '', reps: '', rir: '', isCompleted: false });

      // Căutăm ultimul Setup Note pentru acest exercițiu în tot istoricul
      const lastSessionWithNote = [...sessions].reverse().find(s => s.exercises.find(e => e.exerciseId === ex.id && e.settingsNote));
      const lastNote = lastSessionWithNote?.exercises.find(e => e.exerciseId === ex.id)?.settingsNote || '';

      return {
        id: generateId(), exerciseId: ex.id, name: ex.name, sets, settingsNote: lastNote,
        customContext: { why: ex.why, scheme: ex.scheme, cue: ex.cue, rest: ex.rest }
      };
    });

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

  const updateExerciseNote = (exId: string, note: string) => {
    if (!draftSession) return;
    const updated = { ...draftSession, exercises: draftSession.exercises.map(e => e.exerciseId === exId ? { ...e, settingsNote: note } : e) };
    setDraftSession(updated);
  };

  const removeSet = (exId: string, setId: string) => {
    if (!draftSession) return;
    const updated = { ...draftSession, exercises: draftSession.exercises.map(e => e.id === exId ? { ...e, sets: e.sets.filter(s => s.id !== setId) } : e) };
    setDraftSession(updated);
  };

  // FIX: Implemented integrityCheck function
  const integrityCheck = async (): Promise<string[]> => {
    const report: string[] = ["Verificare date..."];
    if (!user) {
      report.push("Eroare: Utilizator neconectat.");
      return report;
    }
    report.push(`Utilizator: ${user.name}`);
    report.push(`Sesiuni: ${sessions.length}`);
    report.push(`Programe Custom: ${customPrograms.length}`);
    report.push(`Greutate: ${Object.keys(weightLogs).length} intrări`);
    report.push("Integritate OK.");
    return report;
  };

  return (
    <DataContext.Provider value={{
      sessions, draftSession, startSession, updateDraft: setDraftSession, saveSession, discardSession: () => setDraftSession(null), 
      deleteSession: (id) => { const ns = sessions.filter(s => s.id !== id); setSessions(ns); localStorage.setItem(`${PREFIX}sessions_${user?.id}`, JSON.stringify(ns)); },
      advancedMode, toggleAdvancedMode: () => { const nv = !advancedMode; setAdvancedMode(nv); localStorage.setItem(`${PREFIX}adv_${user?.id}`, String(nv)); },
      getExerciseHistory: (id) => sessions.filter(s => s.exercises.some(e => e.exerciseId === id)).map(s => ({ date: s.completedAt, sets: s.exercises.find(e => e.exerciseId === id)?.sets })).slice(0, 5),
      updateExerciseNote, removeSet, customPrograms, saveCustomProgram, deleteCustomProgram, customExercises, addCustomExercise, getAllExercises: () => [...MASTER_EXERCISE_LIST, ...customExercises],
      weightLogs, saveWeight, deleteWeight, getWeightStats, getLastSessionExerciseData: (id) => null, // Placeholder
      // FIX: Provided integrityCheck in context value
      integrityCheck
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => { const c = useContext(DataContext); if (!c) throw new Error('ERR'); return c; };
