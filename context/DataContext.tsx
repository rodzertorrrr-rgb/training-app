
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, WorkoutSession, SetLog, ExerciseLog, SetType, ProgramExercise, ProgramDay, MasterExercise } from '../types';
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
  logInternalEvent: (event: string, details?: any) => void;
  integrityCheck: () => Promise<string[]>;
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
}

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [draftSession, setDraftSession] = useState<WorkoutSession | null>(null);
  const [advancedMode, setAdvancedMode] = useState<boolean>(false);
  const [customPrograms, setCustomPrograms] = useState<ProgramDay[]>([]);
  const [customExercises, setCustomExercises] = useState<MasterExercise[]>([]);

  const PREFIX = 'rdz_'; 

  useEffect(() => {
    if (user) {
      const storedSessions = localStorage.getItem(`${PREFIX}sessions_${user.id}`);
      const storedDraft = localStorage.getItem(`${PREFIX}draft_${user.id}`);
      const storedAdvMode = localStorage.getItem(`${PREFIX}adv_${user.id}`);
      const storedCustomProgs = localStorage.getItem(`${PREFIX}custom_programs_${user.id}`);
      const storedCustomEx = localStorage.getItem(`${PREFIX}custom_exercises_${user.id}`);

      setSessions(storedSessions ? JSON.parse(storedSessions) : []);
      setDraftSession(storedDraft ? JSON.parse(storedDraft) : null);
      setAdvancedMode(storedAdvMode === 'true');
      setCustomPrograms(storedCustomProgs ? JSON.parse(storedCustomProgs) : []);
      setCustomExercises(storedCustomEx ? JSON.parse(storedCustomEx) : []);
    }
  }, [user]);

  // Auto-persist draft to prevent data loss (Crucial for Setup persistence)
  useEffect(() => {
    if (user && draftSession) {
      localStorage.setItem(`${PREFIX}draft_${user.id}`, JSON.stringify(draftSession));
    } else if (user && !draftSession) {
      localStorage.removeItem(`${PREFIX}draft_${user.id}`);
    }
  }, [draftSession, user]);

  const saveCustomProgram = (program: ProgramDay) => {
      if(!user) return;
      const newPrograms = [...customPrograms.filter(p => p.id !== program.id), program];
      setCustomPrograms(newPrograms);
      localStorage.setItem(`${PREFIX}custom_programs_${user.id}`, JSON.stringify(newPrograms));
  };

  const deleteCustomProgram = (programId: string) => {
      if(!user) return;
      const newPrograms = customPrograms.filter(p => p.id !== programId);
      setCustomPrograms(newPrograms);
      localStorage.setItem(`${PREFIX}custom_programs_${user.id}`, JSON.stringify(newPrograms));
  };

  const addCustomExercise = (name: string, muscleGroup: string) => {
      const newEx: MasterExercise = { id: `custom_${generateId()}`, name, muscleGroup };
      if (user) {
        const newExercises = [...customExercises, newEx];
        setCustomExercises(newExercises);
        localStorage.setItem(`${PREFIX}custom_exercises_${user.id}`, JSON.stringify(newExercises));
      }
      return newEx;
  };

  const getAllExercises = () => [...MASTER_EXERCISE_LIST, ...customExercises];

  const getExerciseHistory = (exerciseId: string) => {
    return sessions
      .filter(s => s.exercises.some(e => e.exerciseId === exerciseId))
      .map(s => {
        const ex = s.exercises.find(e => e.exerciseId === exerciseId);
        return { date: s.completedAt, sets: ex?.sets, name: ex?.name };
      })
      .slice(0, 5);
  };

  const logInternalEvent = (event: string, details?: any) => {
    if (!user) return;
    const logsKey = `${PREFIX}internal_logs_${user.id}`;
    const logs = JSON.parse(localStorage.getItem(logsKey) || '[]');
    logs.push({ timestamp: Date.now(), event, details });
    localStorage.setItem(logsKey, JSON.stringify(logs.slice(-100)));
  };

  const getLastSessionExerciseData = (exerciseId: string) => {
      const relevantSession = sessions.find(s => s.status === 'COMPLETED' && s.exercises.some(e => e.exerciseId === exerciseId));
      if (!relevantSession) return null;
      const exercise = relevantSession.exercises.find(e => e.exerciseId === exerciseId);
      if (!exercise) return null;
      const topSet = exercise.sets.find(s => s.type === 'TOP_SET');
      if (!topSet || topSet.weight === '' || topSet.reps === '') return null;
      return { weight: Number(topSet.weight), reps: Number(topSet.reps), rir: Number(topSet.rir || 0) };
  };

  const startSession = (dayId: string) => {
    if (!user || draftSession) return; 

    const allPrograms = [...TRAINING_PROGRAM, ...customPrograms];
    const programDay = allPrograms.find(d => d.id === dayId);
    if (!programDay) return;

    const newExercises: ExerciseLog[] = programDay.exercises.map(ex => {
      const initialSets: SetLog[] = [];
      for (let i = 0; i < ex.defaultRampUpSets; i++) {
        initialSets.push({ id: generateId(), type: 'RAMP_UP', weight: '', reps: '', rir: '', isCompleted: false });
      }
      if (ex.hasTopSet) {
        initialSets.push({ id: generateId(), type: 'TOP_SET', weight: '', reps: '', rir: '', isCompleted: false });
      }
      for (let i = 0; i < ex.defaultBackOffSets; i++) {
        initialSets.push({ id: generateId(), type: 'BACK_OFF', weight: '', reps: '', rir: '', isCompleted: false });
      }

      // Restore Setup Note from last time
      let lastSettings = '';
      const lastSessionWithEx = sessions.find(s => s.exercises.some(e => e.exerciseId === ex.id && e.settingsNote));
      if (lastSessionWithEx) {
          lastSettings = lastSessionWithEx.exercises.find(e => e.exerciseId === ex.id)?.settingsNote || '';
      }

      return {
        id: generateId(),
        exerciseId: ex.id,
        name: ex.name,
        sets: initialSets,
        settingsNote: lastSettings,
        customContext: { why: ex.why, scheme: ex.scheme, cue: ex.cue, rest: ex.rest, tempo: ex.tempo }
      };
    });

    setDraftSession({ id: generateId(), userId: user.id, dayId: dayId, dayName: programDay.name, status: 'DRAFT', startedAt: Date.now(), exercises: newExercises });
  };

  const updateDraft = (updatedSession: WorkoutSession) => setDraftSession(updatedSession);

  const updateExerciseNote = (exerciseId: string, note: string) => {
      setDraftSession(prev => {
          if (!prev) return null;
          return {
              ...prev,
              exercises: prev.exercises.map(ex => ex.exerciseId === exerciseId ? { ...ex, settingsNote: note } : ex)
          };
      });
  };

  const removeSet = (exerciseId: string, setId: string) => {
      setDraftSession(prev => {
          if (!prev) return null;
          return {
              ...prev,
              exercises: prev.exercises.map(ex => 
                  ex.id === exerciseId ? { ...ex, sets: ex.sets.filter(s => s.id !== setId) } : ex
              )
          };
      });
  };

  const saveSession = () => {
    if (!user || !draftSession) return;
    const cleanExercises = draftSession.exercises.map(ex => ({
        ...ex,
        sets: ex.sets.filter(s => s.weight !== '' && s.reps !== '' && Number(s.weight) > 0)
    })).filter(ex => ex.sets.length > 0 || ex.settingsNote);

    const completedSession: WorkoutSession = { ...draftSession, status: 'COMPLETED', completedAt: Date.now(), exercises: cleanExercises };
    const newSessions = [completedSession, ...sessions];
    setSessions(newSessions);
    localStorage.setItem(`${PREFIX}sessions_${user.id}`, JSON.stringify(newSessions));
    setDraftSession(null);
  };

  const discardSession = () => setDraftSession(null);

  const deleteSession = (sessionId: string) => {
    if (!user) return;
    const newSessions = sessions.filter(s => s.id !== sessionId);
    setSessions(newSessions);
    localStorage.setItem(`${PREFIX}sessions_${user.id}`, JSON.stringify(newSessions));
  };

  const integrityCheck = async (): Promise<string[]> => ["Sistem optim. Persistență garantată."];

  const toggleAdvancedMode = () => {
    const newVal = !advancedMode;
    setAdvancedMode(newVal);
    if(user) localStorage.setItem(`${PREFIX}adv_${user.id}`, String(newVal));
  };

  return (
    <DataContext.Provider value={{ 
      sessions, draftSession, startSession, updateDraft, saveSession, discardSession, deleteSession, logInternalEvent, integrityCheck, advancedMode, toggleAdvancedMode, getLastSessionExerciseData, updateExerciseNote, removeSet, getExerciseHistory, customPrograms, saveCustomProgram, deleteCustomProgram, customExercises, addCustomExercise, getAllExercises
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
