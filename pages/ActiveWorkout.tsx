
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
  
  // Modal States
  const [showExitModal, setShowExitModal] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Expanded Legends State
  const [expandedLegends, setExpandedLegends] = useState<Record<string, boolean>>({});
  
  // Setup Notes Expanded State
  const [expandedSetup, setExpandedSetup] = useState<Record<string, boolean>>({});

  // Timer State
  const [restStart, setRestStart] = useState<number | null>(null);
  const [timerExerciseId, setTimerExerciseId] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [manualAdjustment, setManualAdjustment] = useState(0); // Add/Subtract time
  const intervalRef = useRef<number | null>(null);

  // Initialize checks
  useEffect(() => {
    if (isSaving) return;

    if (!draftSession) {
      navigate('/');
      return;
    }
    if (draftSession.dayId !== dayId) {
      navigate(`/workout/${draftSession.dayId}`);
    }
  }, [draftSession, dayId, navigate, isSaving]);

  // Handle Timer Logic
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

    return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [restStart]);

  // Request Notification Permission
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
      setExpandedLegends(prev => ({
          ...prev,
          [exerciseId]: !prev[exerciseId]
      }));
  };
  
  const toggleSetup = (exerciseId: string) => {
      setExpandedSetup(prev => ({
          ...prev,
          [exerciseId]: !prev[exerciseId]
      }));
  };

  const formatTime = (totalSeconds: number) => {
    if (totalSeconds < 0) totalSeconds = 0;
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Prevent accidental back navigation
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // --- LOGIC HELPERS ---

  const handleSetUpdate = (exerciseId: string, setId: string, field: keyof SetLog, value: string) => {
    if (!draftSession) return;
    const updatedExercises = draftSession.exercises.map(ex => {
      if (ex.id !== exerciseId) return ex;

      if (!ex.startedAt) {
        logInternalEvent('exercise_started', { exercise: ex.name });
        ex.startedAt = Date.now();
      }

      const updatedSets = ex.sets.map(set => {
        if (set.id !== setId) return set;
        
        let processedValue: number | '' = value === '' ? '' : Number(value);
        if (field === 'rir') {
            if (typeof processedValue === 'number') {
                if (processedValue < 0) processedValue = 0;
                if (processedValue > 5) processedValue = 5;
            }
        }
        if (field === 'reps' && typeof processedValue === 'number') {
             processedValue = Math.floor(processedValue);
             if (processedValue < 0) processedValue = '';
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
      
      const newSet: SetLog = {
        id: Date.now().toString(),
        type,
        weight: '',
        reps: '',
        rir: '',
        isCompleted: false
      };

      let newSets = [...ex.sets];
      if (type === 'RAMP_UP') {
        const topSetIndex = newSets.findIndex(s => s.type === 'TOP_SET');
        if (topSetIndex !== -1) {
             newSets.splice(topSetIndex, 0, newSet);
        } else {
             const firstBackOff = newSets.findIndex(s => s.type === 'BACK_OFF');
             if(firstBackOff !== -1) newSets.splice(firstBackOff, 0, newSet);
             else newSets.unshift(newSet);
        }
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

  // --- ACTIONS ---

  const triggerFinishFlow = () => {
    setShowFinishModal(true);
  };

  const confirmSave = () => {
    setIsSaving(true);
    setTimeout(() => {
        saveSession();
        navigate('/history');
    }, 500); 
  };

  const handleExit = (confirm: boolean) => {
    if (confirm) {
      discardSession();
      navigate('/');
    } else {
      setShowExitModal(false);
    }
  };

  // --- CALCULATIONS ---

  const completedExercisesCount = draftSession ? draftSession.exercises.filter(ex => 
    ex.sets.some(s => (s.type === 'TOP_SET' || s.type === 'BACK_OFF') && s.weight !== '' && s.reps !== '' && Number(s.weight) > 0)
  ).length : 0;

  const totalExercises = draftSession ? draftSession.exercises.length : 0;
  const durationMinutes = draftSession ? Math.floor((Date.now() - draftSession.startedAt) / 1000 / 60) : 0;

  // Timer Recommendation Logic
  const getRestTarget = () => {
      let base = 90; // Default
      if (timerExerciseId && EXERCISE_CONTEXT[timerExerciseId]) {
          base = EXERCISE_CONTEXT[timerExerciseId].rest;
      }
      return base + manualAdjustment;
  };
  
  const restTarget = getRestTarget();
  const isRestComplete = elapsed >= restTarget;
  const timerProgress = Math.min((elapsed / restTarget) * 100, 100);

  // Send Notification when done (THIS WAS THE CAUSE OF ERROR #300 - MOVED UP BEFORE RETURNS)
  useEffect(() => {
      if (restStart && isRestComplete && elapsed === restTarget) {
          if ('Notification' in window && Notification.permission === 'granted') {
              new Notification("Trained by RDZ", { body: "Pauză finalizată. Back to work." });
          }
          // Haptic feedback
          if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      }
  }, [isRestComplete, restStart, elapsed, restTarget]);


  // --- EARLY RETURNS (MUST BE AFTER ALL HOOKS) ---

  // LOADING STATE
  if (isSaving) {
      return (
          <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center z-[100] fixed inset-0 animate-fade-in">
              <div className="animate-spin text-primary mb-6">
                  <Loader size={64} />
              </div>
              <h2 className="text-2xl font-black text-gold-gradient uppercase tracking-widest animate-pulse">Saving System...</h2>
          </div>
      );
  }

  if (!draftSession) return null;

  return (
    <div className="pb-40 animate-fade-in">
      
      {/* 1. PREMIUM HEADER */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-xl z-30 pt-4 pb-4 border-b border-white/5 -mx-5 px-5 flex justify-between items-center mb-6 shadow-2xl transition-all duration-300">
        <button onClick={() => setShowExitModal(true)} className="w-10 h-10 flex items-center justify-center rounded-full bg-surface border border-white/10 text-zinc-400 hover:text-white transition-all active:scale-95">
             <ArrowLeft size={20} />
        </button>
        
        <div className="flex flex-col items-center">
             <span className="text-[10px] font-black text-gold-gradient uppercase tracking-[0.2em] mb-0.5">/// ACTIVE LOG</span>
             <span className="text-[10px] font-mono text-zinc-500 flex items-center bg-zinc-900/50 px-2 rounded-full border border-white/5">
                <Clock size={10} className="mr-1.5" />
                {durationMinutes} MIN
             </span>
        </div>

        {/* PRIMARY SAVE BUTTON - REPOSITIONED TO HEADER */}
        <button 
            onClick={triggerFinishFlow}
            className="h-10 px-4 flex items-center justify-center bg-primary/10 border border-primary/20 text-primary hover:bg-gold-gradient hover:text-black transition-all active:scale-95 group shadow-[0_0_10px_rgba(212,175,55,0.15)] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
        >
            <span className="text-[10px] font-black uppercase tracking-widest mr-2">SALVEAZĂ</span>
            <Check size={14} className="stroke-[3]" />
        </button>
      </div>

      {/* 2. PREMIUM TIMER WIDGET (Floating) */}
      {restStart && (
         <div className="fixed top-24 left-4 right-4 z-40 animate-slide-down">
             <div className={`glass-panel overflow-hidden transition-all duration-300 ${isRestComplete ? 'shadow-[0_0_30px_rgba(212,175,55,0.4)] border-primary' : 'shadow-2xl border-white/10'}`}>
                
                {/* Progress Bar Background */}
                <div className="absolute top-0 bottom-0 left-0 bg-gold-gradient opacity-10 transition-all duration-1000 ease-linear" style={{ width: `${timerProgress}%` }}></div>
                
                {/* Main Timer Display */}
                <div className="p-4 flex items-center justify-between relative z-10">
                    <div className="flex items-center">
                        <div className={`relative w-12 h-12 flex items-center justify-center mr-4`}>
                             <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                <path className="text-zinc-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                <path 
                                    className={`${isRestComplete ? 'text-emerald-500' : 'text-primary drop-shadow-[0_0_5px_rgba(212,175,55,0.8)]'}`} 
                                    strokeDasharray={`${timerProgress}, 100`}
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    strokeWidth="3" 
                                />
                             </svg>
                             <div className={`absolute inset-0 flex items-center justify-center ${isRestComplete ? 'animate-pulse' : ''}`}>
                                 <Clock size={16} className={`${isRestComplete ? 'text-emerald-500' : 'text-primary'}`} />
                             </div>
                        </div>

                        <div>
                            <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mb-0.5">
                                {isRestComplete ? <span className="text-emerald-500 animate-pulse">RECOVERY COMPLETE</span> : 'RESTING'}
                            </p>
                            <div className="flex items-baseline gap-2">
                                <p className={`text-3xl font-black font-mono leading-none ${isRestComplete ? 'text-emerald-500' : 'text-white'}`}>
                                    {formatTime(elapsed)}
                                </p>
                                <span className="text-[10px] text-zinc-600 font-mono">/ {formatTime(restTarget)}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {/* Adjustment Buttons */}
                         <div className="flex flex-col gap-1 mr-2">
                            <button onClick={() => adjustTimer(30)} className="bg-zinc-800 text-[8px] px-2 py-1 text-zinc-400 hover:text-white hover:bg-zinc-700 border border-zinc-700 active:bg-zinc-600 transition-colors">+30s</button>
                            <button onClick={() => adjustTimer(-30)} className="bg-zinc-800 text-[8px] px-2 py-1 text-zinc-400 hover:text-white hover:bg-zinc-700 border border-zinc-700 active:bg-zinc-600 transition-colors">-30s</button>
                         </div>

                        <button 
                            onClick={() => toggleTimer()}
                            className="w-10 h-10 flex items-center justify-center bg-zinc-900 text-red-500 hover:bg-red-500/20 hover:text-red-400 transition-all border border-zinc-800 hover:border-red-500 active:scale-95"
                        >
                            <StopCircle size={20} className="fill-current" />
                        </button>
                    </div>
                </div>
                
                {/* Contextual Tip with Gold Accent */}
                {timerExerciseId && EXERCISE_CONTEXT[timerExerciseId] && (
                    <div className="bg-gradient-to-r from-zinc-900 to-black px-4 py-1.5 border-t border-white/5 flex items-center">
                        <Zap size={10} className="text-primary mr-2" />
                        <p className="text-[9px] text-zinc-400 font-mono truncate">
                             Recuperare Recomandată: <span className="text-primary">{restTarget >= 180 ? 'Sistem Nervos (CNS)' : 'Metabolic (Local)'}</span>
                        </p>
                    </div>
                )}
             </div>
         </div>
      )}

      {/* 3. WORKOUT FORM */}
      <div className="space-y-10">
        {draftSession.exercises.map((ex, exIndex) => {
            const programEx = TRAINING_PROGRAM.find(d => d.id === dayId)?.exercises.find(e => e.id === ex.exerciseId);
            const isCompleted = ex.sets.some(s => (s.type === 'TOP_SET' || s.type === 'BACK_OFF') && s.weight !== '' && s.reps !== '');
            const context = EXERCISE_CONTEXT[ex.exerciseId];
            const isExpanded = expandedLegends[ex.exerciseId];
            
            // GHOST DATA (Last Session)
            const lastSessionData = getLastSessionExerciseData(ex.exerciseId);

            return (
          <div key={ex.id} className={`transition-all duration-700 ease-out ${isCompleted ? 'opacity-100' : 'opacity-100'}`}>
            
            {/* Exercise Header */}
            <div className="flex items-start mb-3 pl-1 relative">
                {/* Metallic Accent Line */}
                <div className={`absolute left-0 top-0 bottom-0 w-[2px] transition-all duration-700 ${isCompleted ? 'bg-gold-gradient shadow-[0_0_10px_rgba(212,175,55,0.5)] h-full' : 'bg-zinc-800 h-full'}`}></div>
                
                <div className="pl-5 flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                             <h3 className="text-base font-black text-white uppercase tracking-tight leading-none mb-1 font-heading">{ex.name}</h3>
                             {programEx && (
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                    <div className="text-[9px] font-mono text-zinc-500 border border-zinc-800 bg-black px-1.5 py-0.5">
                                        TARGET: <span className="text-zinc-300">{programEx.targetReps}</span>
                                    </div>
                                    {programEx.targetRir === 0 && (
                                        <span className="text-[9px] font-black text-red-500 bg-red-500/10 border border-red-500/20 px-1.5 py-0.5">FAILURE</span>
                                    )}
                                    
                                    {/* Machine Setup Summary Toggle */}
                                    <button 
                                        onClick={() => toggleSetup(ex.exerciseId)}
                                        className={`flex items-center text-[9px] font-mono px-1.5 py-0.5 border transition-all ${ex.settingsNote ? 'text-primary border-primary/30 bg-primary/5' : 'text-zinc-600 border-zinc-800'}`}
                                    >
                                        <Settings2 size={10} className="mr-1" />
                                        {ex.settingsNote ? 'SETUP SAVED' : 'SETUP'}
                                    </button>
                                </div>
                            )}
                            
                            {/* MACHINE SETUP INPUT AREA */}
                            {expandedSetup[ex.exerciseId] && (
                                <div className="mt-2 animate-slide-down">
                                    <input 
                                        type="text" 
                                        className="w-full bg-zinc-900 border-b border-primary/50 text-white text-xs font-mono p-2 outline-none placeholder-zinc-600 focus:bg-zinc-800 transition-colors"
                                        placeholder="Ex: Scaun 4, Spătar 2, Pin Jos..."
                                        value={ex.settingsNote || ''}
                                        onChange={(e) => updateExerciseNote(ex.exerciseId, e.target.value)}
                                        autoFocus
                                    />
                                    <p className="text-[8px] text-zinc-500 mt-1 uppercase tracking-wider">* Se va salva automat pentru sesiunea următoare.</p>
                                </div>
                            )}

                        </div>
                        
                        {/* Legend Toggle */}
                        {context && (
                            <button 
                                onClick={() => toggleLegend(ex.exerciseId)}
                                className={`w-8 h-8 flex items-center justify-center border transition-all active:scale-95 ${isExpanded ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-black border-zinc-800 text-zinc-600 hover:text-primary'}`}
                            >
                                <Info size={14} />
                            </button>
                        )}
                    </div>

                    {/* MICRO-EDUCATION LEGEND */}
                    {isExpanded && context && (
                        <div className="mt-3 mb-2 bg-zinc-900/80 border border-zinc-700 p-3 animate-slide-down backdrop-blur-sm">
                            <div className="space-y-3">
                                <div>
                                    <h4 className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">DE CE ACEST EXERCIȚIU?</h4>
                                    <p className="text-xs text-zinc-300 font-mono leading-relaxed">{context.why}</p>
                                </div>
                                <div className="w-full h-[1px] bg-white/5"></div>
                                <div>
                                    <h4 className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">DE CE ACEST NR. SETURI?</h4>
                                    <p className="text-xs text-zinc-300 font-mono leading-relaxed">{context.scheme}</p>
                                </div>
                                <div className="w-full h-[1px] bg-white/5"></div>
                                <div>
                                    <h4 className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">EXECUȚIE</h4>
                                    <p className="text-xs text-white font-mono leading-relaxed bg-black/50 p-2 border-l-2 border-primary">{context.cue}</p>
                                </div>
                                <div className="w-full h-[1px] bg-white/5"></div>
                                <div>
                                    <h4 className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">PAUZĂ RECOMANDATĂ</h4>
                                    <p className="text-xs text-emerald-400 font-mono leading-relaxed flex items-center">
                                        <Clock size={12} className="mr-1" />
                                        {formatTime(context.rest)} ({context.rest >= 180 ? 'Compound / CNS' : 'Isolation / Metabolic'})
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={() => toggleLegend(ex.exerciseId)}
                                className="w-full mt-3 py-1 bg-black border border-zinc-800 text-[9px] text-zinc-500 uppercase tracking-widest hover:text-white hover:border-zinc-600"
                            >
                                Close Info
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-card border border-zinc-800 overflow-hidden ml-4 shadow-sm">
                {/* Headers */}
                <div className="grid grid-cols-12 gap-1 py-2 bg-surface border-b border-zinc-800 text-[9px] text-zinc-500 font-black uppercase tracking-widest text-center px-2">
                    <div className="col-span-3 text-left pl-1">Set</div>
                    <div className="col-span-3">Kg</div>
                    <div className="col-span-3">Reps</div>
                    <div className="col-span-3">RIR / Rest</div>
                </div>

                <div className="divide-y divide-zinc-800/50">
                    {ex.sets.map((set, i) => (
                    <div key={set.id} className={`grid grid-cols-12 gap-2 items-center p-2 transition-all duration-300 relative ${
                            set.type === 'TOP_SET' 
                            ? 'bg-gradient-to-r from-primary/10 to-transparent' 
                            : 'bg-transparent'
                        }`}>
                        
                        {/* Type Label */}
                        <div className="col-span-3 flex items-center">
                            {set.type === 'TOP_SET' ? (
                                <div className="pl-1 border-l-2 border-primary pl-2">
                                    <span className="text-[10px] font-black text-primary tracking-wider block drop-shadow-sm">TOP</span>
                                    <span className="text-[8px] text-zinc-600 uppercase">PRIORITY</span>
                                </div>
                            ) : set.type === 'RAMP_UP' ? (
                                <div className="pl-1 pl-2">
                                    <span className="text-[10px] font-bold text-zinc-600 block">WARM</span>
                                </div>
                            ) : (
                                <div className="pl-1 pl-2">
                                    <span className="text-[10px] font-bold text-zinc-500 block">BACK</span>
                                </div>
                            )}
                        </div>

                        {/* Inputs */}
                        <div className="col-span-3 relative group/input">
                            <input 
                                type="number" 
                                placeholder="-" 
                                className={`w-full bg-black border border-zinc-800 py-3 text-center text-base font-bold font-mono focus:border-primary focus:text-gold-gradient transition-all outline-none relative z-10 ${set.weight !== '' ? 'text-white border-zinc-700' : 'text-zinc-700'} focus:scale-105`}
                                value={set.weight}
                                onChange={(e) => handleSetUpdate(ex.id, set.id, 'weight', e.target.value)}
                            />
                            {/* Ghost Target (Weight) */}
                            {set.type === 'TOP_SET' && lastSessionData && set.weight === '' && (
                                <div className="absolute top-full left-0 w-full text-center mt-0.5 pointer-events-none z-20 opacity-0 group-focus-within/input:opacity-100 transition-opacity">
                                    <span className="text-[8px] font-mono text-zinc-400 bg-black/80 px-1 border border-zinc-800">Last: {lastSessionData.weight}</span>
                                </div>
                            )}
                        </div>

                        <div className="col-span-3 relative group/input">
                            <input 
                                type="number" 
                                placeholder="-" 
                                className={`w-full bg-black border border-zinc-800 py-3 text-center text-base font-bold font-mono focus:border-primary focus:text-gold-gradient transition-all outline-none relative z-10 ${set.reps !== '' ? 'text-white border-zinc-700' : 'text-zinc-700'} focus:scale-105`}
                                value={set.reps}
                                onChange={(e) => handleSetUpdate(ex.id, set.id, 'reps', e.target.value)}
                            />
                             {/* Ghost Target (Reps) */}
                             {set.type === 'TOP_SET' && lastSessionData && set.reps === '' && (
                                <div className="absolute top-full left-0 w-full text-center mt-0.5 pointer-events-none z-20 opacity-0 group-focus-within/input:opacity-100 transition-opacity">
                                    <span className="text-[8px] font-mono text-zinc-400 bg-black/80 px-1 border border-zinc-800">Last: {lastSessionData.reps}</span>
                                </div>
                            )}
                        </div>

                        <div className="col-span-3 flex items-center justify-end pr-1">
                            <input 
                                type="number" 
                                placeholder="-" 
                                max={5}
                                className="w-8 h-8 bg-transparent text-center text-sm font-bold text-zinc-400 focus:text-white outline-none mr-2 border-b border-transparent focus:border-primary transition-all focus:scale-110"
                                value={set.rir}
                                onChange={(e) => handleSetUpdate(ex.id, set.id, 'rir', e.target.value)}
                            />
                            <button 
                                onClick={() => toggleTimer(ex.exerciseId)}
                                className="w-9 h-9 flex items-center justify-center bg-zinc-900 text-zinc-500 hover:text-primary hover:bg-zinc-800 transition-colors border border-zinc-800 shadow-sm active:scale-95"
                            >
                                <Timer size={14} />
                            </button>
                        </div>
                    </div>
                    ))}
                </div>

                {/* Footer Actions */}
                <div className="flex border-t border-zinc-800 divide-x divide-zinc-800">
                    <button onClick={() => addSet(ex.id, 'RAMP_UP')} className="flex-1 py-3 text-[9px] font-black text-zinc-600 hover:text-white hover:bg-white/5 uppercase tracking-wider transition-colors active:bg-zinc-800">
                        + Warm Up
                    </button>
                    <button onClick={() => addSet(ex.id, 'BACK_OFF')} className="flex-1 py-3 text-[9px] font-black text-zinc-600 hover:text-white hover:bg-white/5 uppercase tracking-wider transition-colors active:bg-zinc-800">
                        + Back Off
                    </button>
                </div>
            </div>
          </div>
        )})}
      </div>

      {/* 5. FINISH SUMMARY MODAL */}
      {showFinishModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4">
            {/* Backdrop with higher opacity for focus */}
            <div className="absolute inset-0 bg-black/95 backdrop-blur-md animate-fade-in" onClick={() => setShowFinishModal(false)}></div>
            
            <div className="relative bg-[#050505] border-t sm:border border-zinc-800 w-full max-w-sm overflow-hidden shadow-2xl animate-slide-up-fade transform">
                
                {/* Modal Header */}
                <div className="bg-zinc-950 p-6 border-b border-zinc-800 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tight">System Log</h3>
                        <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">{draftSession.dayName.split(':')[0]}</p>
                    </div>
                    <button onClick={() => setShowFinishModal(false)} className="w-8 h-8 flex items-center justify-center bg-black border border-zinc-800 text-zinc-500 hover:text-white active:scale-95">
                        <X size={16} />
                    </button>
                </div>

                {/* Statistics */}
                <div className="p-6 space-y-6">
                    <div className="flex justify-between items-center">
                        <div className="text-center w-1/2 border-r border-zinc-800">
                            <span className="block text-2xl font-black text-white font-mono">{durationMinutes}</span>
                            <span className="text-[9px] text-zinc-500 uppercase tracking-widest">Minute</span>
                        </div>
                        <div className="text-center w-1/2">
                            <span className={`block text-2xl font-black font-mono ${completedExercisesCount === totalExercises ? 'text-primary' : 'text-white'}`}>
                                {completedExercisesCount}<span className="text-zinc-600 text-lg">/{totalExercises}</span>
                            </span>
                            <span className="text-[9px] text-zinc-500 uppercase tracking-widest">Exerciții</span>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1 bg-zinc-900 overflow-hidden">
                        <div 
                            className="h-full bg-gold-gradient transition-all duration-1000 ease-out shadow-[0_0_10px_#D4AF37]"
                            style={{ width: `${(completedExercisesCount / totalExercises) * 100}%` }}
                        ></div>
                    </div>

                    {/* Warning Messages */}
                    {completedExercisesCount === 0 ? (
                        <div className="bg-red-900/10 border border-red-900/30 p-3 flex items-start gap-3 animate-scale-in">
                            <AlertCircle className="text-red-500 shrink-0" size={16} />
                            <p className="text-[11px] text-red-200 leading-tight">
                                <strong className="block text-red-500 mb-1 uppercase text-[10px] tracking-wider">Atenție</strong>
                                Nu ai completat niciun set. Sesiunea va fi salvată ca goală.
                            </p>
                        </div>
                    ) : completedExercisesCount < totalExercises ? (
                        <div className="bg-yellow-900/10 border border-yellow-900/30 p-3 flex items-start gap-3 animate-scale-in">
                            <CheckCircle2 className="text-yellow-500 shrink-0" size={16} />
                            <p className="text-[11px] text-yellow-200 leading-tight">
                                <strong className="block text-yellow-500 mb-1 uppercase text-[10px] tracking-wider">Parțial Complet</strong>
                                Exercițiile necompletate vor fi ignorate la salvare.
                            </p>
                        </div>
                    ) : (
                         <div className="bg-emerald-900/10 border border-emerald-900/30 p-3 flex items-start gap-3 animate-scale-in">
                            <CheckCircle2 className="text-emerald-500 shrink-0" size={16} />
                            <p className="text-[11px] text-emerald-200 leading-tight">
                                <strong className="block text-emerald-500 mb-1 uppercase text-[10px] tracking-wider">Excelent</strong>
                                Toate exercițiile au fost completate.
                            </p>
                        </div>
                    )}
                </div>

                {/* Primary Action - Added extra bottom padding for Safe Area */}
                <div className="p-6 pt-0 pb-10">
                    <button 
                        onClick={confirmSave}
                        className="w-full bg-gold-gradient hover:brightness-110 text-black font-black uppercase tracking-[0.2em] py-5 text-sm shadow-glow transition-all active:scale-[0.98]"
                    >
                        Confirmă Salvarea
                    </button>
                    <div className="mt-4 text-center">
                        <button onClick={() => setShowFinishModal(false)} className="text-[10px] text-zinc-500 hover:text-white uppercase tracking-widest font-bold">
                            Înapoi la antrenament
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* 6. EXIT MODAL */}
      {showExitModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100] p-8 animate-fade-in">
            <div className="bg-card border border-zinc-800 p-8 w-full max-w-sm shadow-2xl animate-scale-in">
                <div className="flex justify-center mb-6 text-primary">
                    <AlertCircle size={48} className="stroke-[1.5]" />
                </div>
                <h3 className="text-xl font-black text-white text-center uppercase mb-2 tracking-wide">Închizi sesiunea?</h3>
                <p className="text-zinc-500 text-xs text-center mb-8 font-mono uppercase tracking-widest">Progresul nesalvat va fi pierdut ireversibil.</p>
                
                <div className="space-y-3">
                    <button 
                        onClick={() => handleExit(false)}
                        className="w-full bg-black border border-zinc-800 text-white font-bold py-4 hover:bg-zinc-900 transition-colors uppercase tracking-widest text-xs active:scale-95"
                    >
                        Înapoi la Antrenament
                    </button>
                    <button 
                        onClick={() => handleExit(true)}
                        className="w-full text-red-500 font-bold py-4 hover:text-red-400 transition-colors uppercase tracking-widest text-xs active:scale-95"
                    >
                        Șterge și Ieși
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ActiveWorkout;
