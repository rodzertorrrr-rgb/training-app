
import React, { createContext, useContext, useState, useEffect } from 'react';
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
  
  // Custom Program Logic
  customPrograms: ProgramDay[];
  saveCustomProgram: (program: ProgramDay) => void;
  deleteCustomProgram: (programId: string) => void;
  
  // Custom Exercise Logic
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
    } else {
      setSessions([]);
      setDraftSession(null);
      setCustomPrograms([]);
      setCustomExercises([]);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      if (draftSession) {
        localStorage.setItem(`${PREFIX}draft_${user.id}`, JSON.stringify(draftSession));
      } else {
        localStorage.removeItem(`${PREFIX}draft_${user.id}`);
      }
    }
  }, [draftSession, user]);

  const saveCustomProgram = (program: ProgramDay) => {
      if(!user) return;
      const existingIdx = customPrograms.findIndex(p => p.id === program.id);
      let newPrograms;
      if (existingIdx >= 0) {
          newPrograms = [...customPrograms];
          newPrograms[existingIdx] = program;
      } else {
          newPrograms = [...customPrograms, program];
      }
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
      const newEx: MasterExercise = {
          id: `custom_${generateId()}`,
          name,
          muscleGroup
      };
      if (user) {
        const newExercises = [...customExercises, newEx];
        setCustomExercises(newExercises);
        localStorage.setItem(`${PREFIX}custom_exercises_${user.id}`, JSON.stringify(newExercises));
      }
      return newEx;
  };

  const getAllExercises = () => {
      return [...MASTER_EXERCISE_LIST, ...customExercises];
  };

  const logInternalEvent = (event: string, details?: any) => {
    if (!user) return;
    const logsKey = `${PREFIX}internal_logs_${user.id}`;
    const logs = JSON.parse(localStorage.getItem(logsKey) || '[]');
    logs.push({
      timestamp: Date.now(),
      event,
      details
    });
    localStorage.setItem(logsKey, JSON.stringify(logs));
  };

  const getLastSessionExerciseData = (exerciseId: string) => {
      const relevantSession = sessions.find(s => 
          s.status === 'COMPLETED' && 
          s.exercises.some(e => e.exerciseId === exerciseId)
      );
      if (!relevantSession) return null;
      const exercise = relevantSession.exercises.find(e => e.exerciseId === exerciseId);
      if (!exercise) return null;
      const topSet = exercise.sets.find(s => s.type === 'TOP_SET');
      if (!topSet || topSet.weight === '' || topSet.reps === '') return null;
      return {
          weight: Number(topSet.weight),
          reps: Number(topSet.reps),
          rir: Number(topSet.rir || 0)
      };
  };

  const startSession = (dayId: string) => {
    if (!user) return;
    if (draftSession) return; 

    const allPrograms = [...TRAINING_PROGRAM, ...customPrograms];
    const programDay = allPrograms.find(d => d.id === dayId);
    
    if (!programDay) return;

    logInternalEvent('session_started', { dayId });

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

      let lastSettings = '';
      const lastSessionWithEx = sessions.find(s => s.exercises.some(e => e.exerciseId === ex.id && e.settingsNote && e.settingsNote.trim() !== ''));
      if (lastSessionWithEx) {
          const prevEx = lastSessionWithEx.exercises.find(e => e.exerciseId === ex.id);
          if (prevEx?.settingsNote) lastSettings = prevEx.settingsNote;
      }

      return {
        id: generateId(),
        exerciseId: ex.id,
        name: ex.name,
        sets: initialSets,
        settingsNote: lastSettings,
        // Pass custom context if this is a custom program exercise
        customContext: {
            why: ex.why,
            scheme: ex.scheme,
            cue: ex.cue,
            rest: ex.rest
        }
      };
    });

    const newSession: WorkoutSession = {
      id: generateId(),
      userId: user.id,
      dayId: dayId,
      dayName: programDay.name,
      status: 'DRAFT',
      startedAt: Date.now(),
      exercises: newExercises
    };

    setDraftSession(newSession);
  };

  const updateDraft = (updatedSession: WorkoutSession) => {
    setDraftSession(updatedSession);
  };

  const updateExerciseNote = (exerciseId: string, note: string) => {
      if (!draftSession) return;
      setDraftSession(prev => {
          if (!prev) return null;
          return {
              ...prev,
              exercises: prev.exercises.map(ex => 
                  ex.exerciseId === exerciseId ? { ...ex, settingsNote: note } : ex
              )
          };
      });
  };

  const saveSession = () => {
    if (!user || !draftSession) return;
    const cleanExercises = draftSession.exercises.map(ex => ({
        ...ex,
        sets: ex.sets.filter(s => s.weight !== '' && s.reps !== '' && Number(s.weight) > 0 && Number(s.reps) > 0)
    })).filter(ex => ex.sets.length > 0 || (ex.settingsNote && ex.settingsNote.trim() !== ''));
    const completedSession: WorkoutSession = { ...draftSession, status: 'COMPLETED', completedAt: Date.now(), exercises: cleanExercises };
    const newSessions = [completedSession, ...sessions];
    setSessions(newSessions);
    localStorage.setItem(`${PREFIX}sessions_${user.id}`, JSON.stringify(newSessions));
    setDraftSession(null);
  };

  const discardSession = () => {
    if (!user) return;
    setDraftSession(null);
  };

  const deleteSession = (sessionId: string) => {
    if (!user) return;
    const newSessions = sessions.filter(s => s.id !== sessionId);
    setSessions(newSessions);
    localStorage.setItem(`${PREFIX}sessions_${user.id}`, JSON.stringify(newSessions));
  };

  const integrityCheck = async (): Promise<string[]> => {
    if (!user) return [];
    const report: string[] = [];
    const storedDraft = localStorage.getItem(`${PREFIX}draft_${user.id}`);
    if (storedDraft && !draftSession) {
      report.push("Draft orfan reîncărcat.");
      setDraftSession(JSON.parse(storedDraft));
    }
    if (report.length === 0) report.push("Sistem optim. Nicio eroare.");
    return report;
  };

  const toggleAdvancedMode = () => {
    if(!user) return;
    const newVal = !advancedMode;
    setAdvancedMode(newVal);
    localStorage.setItem(`${PREFIX}adv_${user.id}`, String(newVal));
  };

  return (
    <DataContext.Provider value={{ 
      sessions, draftSession, startSession, updateDraft, saveSession, discardSession, deleteSession, logInternalEvent, integrityCheck, advancedMode, toggleAdvancedMode, getLastSessionExerciseData, updateExerciseNote, customPrograms, saveCustomProgram, deleteCustomProgram, customExercises, addCustomExercise, getAllExercises
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
