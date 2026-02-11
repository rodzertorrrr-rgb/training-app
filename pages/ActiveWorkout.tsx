
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { TRAINING_PROGRAM, EXERCISE_CONTEXT } from '../constants';
import { SetLog, ExerciseLog } from '../types';
import { Save, Trash2, Plus, ArrowLeft, Clock, HelpCircle, AlertCircle, Check, Timer, StopCircle, X, Loader, CheckCircle2, ChevronRight, Play, Info, ChevronDown, ChevronUp, History, Settings2, Zap, Minus } from 'lucide-react';

const ActiveWorkout: React.FC = () => {
  const { dayId } = useParams<{ dayId: string }>();
  const navigate = useNavigate();
  const { draftSession, updateDraft, saveSession, discardSession, logInternalEvent, getLastSessionExerciseData, updateExerciseNote } = useData();
  
  const [showExitModal, setShowExitModal] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [expandedLegends, setExpandedLegends] = useState<Record<string, boolean>>({});
  const [expandedSetup, setExpandedSetup] = useState<Record<string, boolean>>({});

  const [restStart, setRestStart] = useState<number | null>(null);
  const [timerExerciseId, setTimerExerciseId] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [manualAdjustment, setManualAdjustment] = useState(0); 
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isSaving) return;
    if (!draftSession) { navigate('/'); return; }
    if (draftSession.dayId !== dayId) { navigate(`/workout/${draftSession.dayId}`); }
  }, [draftSession, dayId, navigate, isSaving]);

  useEffect(() => {
    if (restStart) {
        intervalRef.current = window.setInterval(() => {
            const now = Date.now();
            setElapsed(Math.floor((now - restStart) / 1000));
        }, 1000);
    } else {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setElapsed(0);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); }
  }, [restStart]);

  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  const toggleTimer = (exerciseId?: string) => {
      if (restStart) {
          setRestStart(null);
          setTimerExerciseId(null);
          setManualAdjustment(0);
      } else {
          setRestStart(Date.now());
          setManualAdjustment(0);
          if (exerciseId) setTimerExerciseId(exerciseId);
      }
  };

  const adjustTimer = (seconds: number) => {
      setManualAdjustment(prev => prev + seconds);
  };

  const toggleLegend = (exerciseId: string) => {
      setExpandedLegends(prev => ({ ...prev, [exerciseId]: !prev[exerciseId] }));
  };
  
  const toggleSetup = (exerciseId: string) => {
      setExpandedSetup(prev => ({ ...prev, [exerciseId]: !prev[exerciseId] }));
  };

  const formatTime = (totalSeconds: number) => {
    if (totalSeconds < 0) totalSeconds = 0;
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSetUpdate = (exerciseId: string, setId: string, field: keyof SetLog, value: string) => {
    if (!draftSession) return;
    const updatedExercises = draftSession.exercises.map(ex => {
      if (ex.id !== exerciseId) return ex;
      if (!ex.startedAt) ex.startedAt = Date.now();
      const updatedSets = ex.sets.map(set => {
        if (set.id !== setId) return set;
        let processedValue: number | '' = value === '' ? '' : Number(value);
        if (field === 'rir') {
            if (typeof processedValue === 'number') {
                if (processedValue < 0) processedValue = 0;
                if (processedValue > 5) processedValue = 5;
            }
        }
        return { ...set, [field]: processedValue };
      });
      ex.finishedAt = Date.now();
      return { ...ex, sets: updatedSets };
    });
    updateDraft({ ...draftSession, exercises: updatedExercises });
  };

  const addSet = (exerciseId: string, type: 'RAMP_UP' | 'BACK_OFF') => {
    if (!draftSession) return;
    const updatedExercises = draftSession.exercises.map(ex => {
      if (ex.id !== exerciseId) return ex;
      const newSet: SetLog = { id: Date.now().toString(), type, weight: '', reps: '', rir: '', isCompleted: false };
      let newSets = [...ex.sets];
      if (type === 'RAMP_UP') {
        const topSetIndex = newSets.findIndex(s => s.type === 'TOP_SET');
        if (topSetIndex !== -1) newSets.splice(topSetIndex, 0, newSet);
        else newSets.unshift(newSet);
      } else {
        newSets.push(newSet);
      }
      return { ...ex, sets: newSets };
    });
    updateDraft({ ...draftSession, exercises: updatedExercises });
  };

  const removeSet = (exerciseId: string, setId: string) => {
    if (!draftSession) return;
    const updatedExercises = draftSession.exercises.map(ex => {
      if (ex.id !== exerciseId) return ex;
      return { ...ex, sets: ex.sets.filter(s => s.id !== setId) };
    });
    updateDraft({ ...draftSession, exercises: updatedExercises });
  };

  const confirmSave = () => {
    setIsSaving(true);
    setTimeout(() => { saveSession(); navigate('/history'); }, 500); 
  };

  const completedExercisesCount = draftSession ? draftSession.exercises.filter(ex => 
    ex.sets.some(s => (s.type === 'TOP_SET' || s.type === 'BACK_OFF') && s.weight !== '' && s.reps !== '' && Number(s.weight) > 0)
  ).length : 0;

  const totalExercises = draftSession ? draftSession.exercises.length : 0;
  const durationMinutes = draftSession ? Math.floor((Date.now() - draftSession.startedAt) / 1000 / 60) : 0;

  const getRestTarget = (exerciseId: string) => {
      const exercise = draftSession?.exercises.find(e => e.exerciseId === exerciseId);
      // Priority: Custom context from program -> Standard context -> Default 90s
      let base = 90;
      if (exercise?.customContext?.rest) {
          base = exercise.customContext.rest;
      } else if (EXERCISE_CONTEXT[exerciseId]) {
          base = EXERCISE_CONTEXT[exerciseId].rest;
      }
      return base + manualAdjustment;
  };
  
  const restTarget = timerExerciseId ? getRestTarget(timerExerciseId) : 90 + manualAdjustment;
  const isRestComplete = elapsed >= restTarget;
  const timerProgress = Math.min((elapsed / restTarget) * 100, 100);

  useEffect(() => {
      if (restStart && isRestComplete && elapsed === restTarget) {
          if ('Notification' in window && Notification.permission === 'granted') {
              new Notification("Trained by RDZ", { body: "Pauză finalizată. Back to work." });
          }
      }
  }, [isRestComplete, restStart, elapsed, restTarget]);

  if (isSaving) {
      return (
          <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center z-[100] fixed inset-0 animate-fade-in">
              <div className="animate-spin text-primary mb-6"><Loader size={64} /></div>
              <h2 className="text-2xl font-black text-gold-gradient uppercase tracking-widest animate-pulse">Saving System...</h2>
          </div>
      );
  }

  if (!draftSession) return null;

  return (
    <div className="pb-40 animate-fade-in">
      <div className="sticky top-0 bg-black/80 backdrop-blur-xl z-30 pt-4 pb-4 border-b border-white/5 -mx-5 px-5 flex justify-between items-center mb-6 shadow-2xl transition-all duration-300">
        <button onClick={() => setShowExitModal(true)} className="w-10 h-10 flex items-center justify-center rounded-full bg-surface border border-white/10 text-zinc-400 hover:text-white active:scale-95"><ArrowLeft size={20} /></button>
        <div className="flex flex-col items-center">
             <span className="text-[10px] font-black text-gold-gradient uppercase tracking-[0.2em] mb-0.5">/// ACTIVE LOG</span>
             <span className="text-[10px] font-mono text-zinc-500 flex items-center bg-zinc-900/50 px-2 rounded-full border border-white/5"><Clock size={10} className="mr-1.5" />{durationMinutes} MIN</span>
        </div>
        <button onClick={() => setShowFinishModal(true)} className="h-10 px-4 flex items-center justify-center bg-primary/10 border border-primary/20 text-primary hover:bg-gold-gradient hover:text-black transition-all active:scale-95 shadow-glow"><span className="text-[10px] font-black uppercase tracking-widest mr-2">SALVEAZĂ</span><Check size={14} className="stroke-[3]" /></button>
      </div>

      {restStart && (
         <div className="fixed top-24 left-4 right-4 z-40 animate-slide-down">
             <div className={`glass-panel overflow-hidden transition-all duration-300 ${isRestComplete ? 'shadow-[0_0_30px_rgba(212,175,55,0.4)] border-primary' : 'shadow-2xl border-white/10'}`}>
                <div className="absolute top-0 bottom-0 left-0 bg-gold-gradient opacity-10 transition-all duration-1000 ease-linear" style={{ width: `${timerProgress}%` }}></div>
                <div className="p-4 flex items-center justify-between relative z-10">
                    <div className="flex items-center">
                        <div className="relative w-12 h-12 flex items-center justify-center mr-4">
                             <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                <path className="text-zinc-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                <path className={`${isRestComplete ? 'text-emerald-500' : 'text-primary'}`} strokeDasharray={`${timerProgress}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                             </svg>
                             <div className="absolute inset-0 flex items-center justify-center"><Clock size={16} className={isRestComplete ? 'text-emerald-500' : 'text-primary'} /></div>
                        </div>
                        <div>
                            <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mb-0.5">{isRestComplete ? 'RECOVERY COMPLETE' : 'RESTING'}</p>
                            <div className="flex items-baseline gap-2">
                                <p className={`text-3xl font-black font-mono leading-none ${isRestComplete ? 'text-emerald-500' : 'text-white'}`}>{formatTime(elapsed)}</p>
                                <span className="text-[10px] text-zinc-600 font-mono">/ {formatTime(restTarget)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                         <div className="flex flex-col gap-1 mr-2">
                            <button onClick={() => adjustTimer(30)} className="bg-zinc-800 text-[8px] px-2 py-1 text-zinc-400 border border-zinc-700 active:bg-zinc-600 transition-colors">+30s</button>
                            <button onClick={() => adjustTimer(-30)} className="bg-zinc-800 text-[8px] px-2 py-1 text-zinc-400 border border-zinc-700 active:bg-zinc-600 transition-colors">-30s</button>
                         </div>
                        <button onClick={() => toggleTimer()} className="w-10 h-10 flex items-center justify-center bg-zinc-900 text-red-500 hover:bg-red-500/20 border border-zinc-800 active:scale-95"><StopCircle size={20} className="fill-current" /></button>
                    </div>
                </div>
             </div>
         </div>
      )}

      <div className="space-y-10">
        {draftSession.exercises.map((ex) => {
            const programEx = TRAINING_PROGRAM.find(d => d.id === dayId)?.exercises.find(e => e.id === ex.exerciseId);
            const isCompleted = ex.sets.some(s => (s.type === 'TOP_SET' || s.type === 'BACK_OFF') && s.weight !== '' && s.reps !== '');
            const isExpanded = expandedLegends[ex.exerciseId];
            const hasSetupNote = ex.settingsNote && ex.settingsNote.trim().length > 0;
            const lastSessionData = getLastSessionExerciseData(ex.exerciseId);

            // Context Logic: Try program context, then master list context
            const why = ex.customContext?.why || EXERCISE_CONTEXT[ex.exerciseId]?.why;
            const cue = ex.customContext?.cue || EXERCISE_CONTEXT[ex.exerciseId]?.cue;
            const scheme = ex.customContext?.scheme || EXERCISE_CONTEXT[ex.exerciseId]?.scheme;
            const rest = ex.customContext?.rest || EXERCISE_CONTEXT[ex.exerciseId]?.rest || 90;

            return (
          <div key={ex.id} className="transition-all duration-700 ease-out">
            <div className="flex items-start mb-3 pl-1 relative">
                <div className={`absolute left-0 top-0 bottom-0 w-[2px] transition-all duration-700 ${isCompleted ? 'bg-gold-gradient shadow-[0_0_10px_rgba(212,175,55,0.5)] h-full' : 'bg-zinc-800 h-full'}`}></div>
                <div className="pl-5 flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                             <h3 className="text-base font-black text-white uppercase tracking-tight leading-none mb-1 font-heading">{ex.name}</h3>
                             <div className="flex flex-wrap items-center gap-2 mt-1">
                                    <button onClick={() => toggleSetup(ex.exerciseId)} className={`flex items-center text-[9px] font-mono px-1.5 py-0.5 border transition-all ${hasSetupNote ? 'text-primary border-primary/50 bg-primary/10' : 'text-zinc-600 border-zinc-800 bg-black'}`}>
                                        <Settings2 size={10} className="mr-1" /> {hasSetupNote ? 'SETUP LOGAT' : 'SETUP'}
                                    </button>
                             </div>
                             {expandedSetup[ex.exerciseId] && (
                                <div className="mt-2 bg-zinc-900/50 p-2 border-l-2 border-primary/50">
                                    <input type="text" className="w-full bg-black border-b border-primary/30 text-white text-xs font-mono p-2 outline-none" placeholder="Ex: Scaun 4, Spătar 2..." value={ex.settingsNote || ''} onChange={(e) => updateExerciseNote(ex.exerciseId, e.target.value)} autoFocus />
                                </div>
                             )}
                        </div>
                        <button onClick={() => toggleLegend(ex.exerciseId)} className={`w-8 h-8 flex items-center justify-center border transition-all ${isExpanded ? 'bg-zinc-800 text-white' : 'bg-black text-zinc-600 hover:text-primary'}`}><Info size={14} /></button>
                    </div>

                    {isExpanded && (
                        <div className="mt-3 mb-2 bg-zinc-900/80 border border-zinc-700 p-3 animate-slide-down backdrop-blur-sm space-y-3">
                            {why && (<div><h4 className="text-[9px] font-black text-primary uppercase mb-1">DE CE ACEST EXERCIȚIU?</h4><p className="text-xs text-zinc-300 font-mono">{why}</p></div>)}
                            {scheme && (<div><h4 className="text-[9px] font-black text-primary uppercase mb-1">DE CE ACEST NR. SETURI?</h4><p className="text-xs text-zinc-300 font-mono">{scheme}</p></div>)}
                            {cue && (<div><h4 className="text-[9px] font-black text-primary uppercase mb-1">EXECUȚIE</h4><p className="text-xs text-white font-mono bg-black/50 p-2 border-l-2 border-primary">{cue}</p></div>)}
                            <div><h4 className="text-[9px] font-black text-primary uppercase mb-1">PAUZĂ RECOMANDATĂ</h4><p className="text-xs text-emerald-400 font-mono flex items-center"><Clock size={12} className="mr-1" /> {formatTime(rest)}</p></div>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-card border border-zinc-800 overflow-hidden ml-4 shadow-sm">
                <div className="grid grid-cols-12 gap-1 py-2 bg-surface border-b border-zinc-800 text-[9px] text-zinc-500 font-black uppercase text-center px-2">
                    <div className="col-span-3 text-left pl-1">Set</div><div className="col-span-3">Kg</div><div className="col-span-3">Reps</div><div className="col-span-3">RIR / Rest</div>
                </div>
                <div className="divide-y divide-zinc-800/50">
                    {ex.sets.map((set) => (
                    <div key={set.id} className={`grid grid-cols-12 gap-2 items-center p-2 relative group/set ${set.type === 'TOP_SET' ? 'bg-primary/5' : ''}`}>
                        <div className="col-span-3 flex items-center relative group/type">
                            <button onClick={() => removeSet(ex.id, set.id)} className="absolute -left-1 w-6 h-6 flex items-center justify-center text-zinc-700 hover:text-red-500 z-20"><Trash2 size={12} /></button>
                            <div className="pl-5"><span className={`text-[10px] font-black uppercase block ${set.type === 'TOP_SET' ? 'text-primary' : 'text-zinc-600'}`}>{set.type === 'TOP_SET' ? 'TOP' : set.type === 'RAMP_UP' ? 'WARM' : 'BACK'}</span></div>
                        </div>
                        <div className="col-span-3 relative group/input">
                            <input type="number" placeholder="-" className={`w-full bg-black border border-zinc-800 py-3 text-center text-base font-bold font-mono outline-none ${set.weight !== '' ? 'text-white border-zinc-700' : 'text-zinc-700'}`} value={set.weight} onChange={(e) => handleSetUpdate(ex.id, set.id, 'weight', e.target.value)} />
                            {set.type === 'TOP_SET' && lastSessionData && set.weight === '' && (<div className="absolute top-full left-0 w-full text-center mt-0.5 opacity-0 group-focus-within/input:opacity-100 transition-opacity"><span className="text-[8px] font-mono text-zinc-400 bg-black/80 px-1">Last: {lastSessionData.weight}</span></div>)}
                        </div>
                        <div className="col-span-3 relative group/input">
                            <input type="number" placeholder="-" className={`w-full bg-black border border-zinc-800 py-3 text-center text-base font-bold font-mono outline-none ${set.reps !== '' ? 'text-white border-zinc-700' : 'text-zinc-700'}`} value={set.reps} onChange={(e) => handleSetUpdate(ex.id, set.id, 'reps', e.target.value)} />
                            {set.type === 'TOP_SET' && lastSessionData && set.reps === '' && (<div className="absolute top-full left-0 w-full text-center mt-0.5 opacity-0 group-focus-within/input:opacity-100 transition-opacity"><span className="text-[8px] font-mono text-zinc-400 bg-black/80 px-1">Last: {lastSessionData.reps}</span></div>)}
                        </div>
                        <div className="col-span-3 flex items-center justify-end pr-1">
                            <input type="number" placeholder="-" max={5} className="w-8 h-8 bg-transparent text-center text-sm font-bold text-zinc-400 outline-none mr-2" value={set.rir} onChange={(e) => handleSetUpdate(ex.id, set.id, 'rir', e.target.value)} />
                            <button onClick={() => toggleTimer(ex.exerciseId)} className="w-9 h-9 flex items-center justify-center bg-zinc-900 text-zinc-500 hover:text-primary transition-colors border border-zinc-800"><Timer size={14} /></button>
                        </div>
                    </div>
                    ))}
                </div>
                <div className="flex border-t border-zinc-800 divide-x divide-zinc-800">
                    <button onClick={() => addSet(ex.id, 'RAMP_UP')} className="flex-1 py-3 text-[9px] font-black text-zinc-600 hover:text-white uppercase tracking-wider">+ Warm Up</button>
                    <button onClick={() => addSet(ex.id, 'BACK_OFF')} className="flex-1 py-3 text-[9px] font-black text-zinc-600 hover:text-white uppercase tracking-wider">+ Back Off</button>
                </div>
            </div>
          </div>
        )})}
      </div>

      {showFinishModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
            <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setShowFinishModal(false)}></div>
            <div className="relative bg-[#050505] border-t border-zinc-800 w-full max-w-sm overflow-hidden shadow-2xl animate-slide-up-fade">
                <div className="bg-zinc-950 p-6 border-b border-zinc-800 flex justify-between items-center">
                    <div><h3 className="text-xl font-black text-white uppercase tracking-tight">System Log</h3></div>
                    <button onClick={() => setShowFinishModal(false)} className="w-8 h-8 flex items-center justify-center bg-black border border-zinc-800 text-zinc-500"><X size={16} /></button>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex justify-between items-center">
                        <div className="text-center w-1/2 border-r border-zinc-800"><span className="block text-2xl font-black text-white font-mono">{durationMinutes}</span><span className="text-[9px] text-zinc-500 uppercase">Minute</span></div>
                        <div className="text-center w-1/2"><span className="block text-2xl font-black font-mono text-white">{completedExercisesCount}/{totalExercises}</span><span className="text-[9px] text-zinc-500 uppercase">Exerciții</span></div>
                    </div>
                    <button onClick={confirmSave} className="w-full bg-gold-gradient text-black font-black uppercase py-5 text-sm shadow-glow">Confirmă Salvarea</button>
                </div>
            </div>
        </div>
      )}

      {showExitModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100] p-8">
            <div className="bg-card border border-zinc-800 p-8 w-full max-w-sm shadow-2xl">
                <h3 className="text-xl font-black text-white text-center uppercase mb-2">Închizi sesiunea?</h3>
                <div className="space-y-3 mt-6">
                    <button onClick={() => setShowExitModal(false)} className="w-full bg-black border border-zinc-800 text-white font-bold py-4 uppercase text-xs">Înapoi</button>
                    <button onClick={() => { discardSession(); navigate('/'); }} className="w-full text-red-500 font-bold py-4 uppercase text-xs">Ieși și Șterge</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ActiveWorkout;
