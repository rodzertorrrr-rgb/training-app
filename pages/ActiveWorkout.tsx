
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext.tsx';
import { SetLog, RestCategory, SetType, ExerciseInfoCard, SubSetLog } from '../types.ts';
import { getPresetRest, EXERCISE_INFO_CARDS } from '../constants.ts';
import { 
  Check, 
  Trash2, 
  Plus, 
  Target, 
  X,
  Zap,
  HelpCircle,
  Clock,
  Settings,
  GripVertical,
  Activity,
  Moon,
  Link2,
  ArrowDownCircle,
  Layers,
  Info,
  Link as LinkIcon,
  Flame
} from 'lucide-react';

const ActiveWorkout: React.FC = () => {
  const { dayId } = useParams<{ dayId: string }>();
  const navigate = useNavigate();
  const { 
    draftSession, 
    updateDraft, 
    saveSession, 
    discardSession, 
    removeSet,
    addSubSet,
    removeSubSet,
    updateExerciseNote,
    updateSessionNotes
  } = useData();
  
  const [showExitModal, setShowExitModal] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [activeExerciseIdx, setActiveExerciseIdx] = useState(0);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showSessionContextModal, setShowSessionContextModal] = useState(false);
  const [showSetTypePicker, setShowSetTypePicker] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  
  const timerRef = useRef<number | null>(null);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  useEffect(() => {
    if (!draftSession) navigate('/');
  }, [draftSession, navigate]);

  useEffect(() => {
    if (isTimerActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft <= 0 && isTimerActive) {
      setIsTimerActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if(timerRef.current) clearInterval(timerRef.current); };
  }, [isTimerActive, timeLeft]);

  if (!draftSession) return null;
  const currentEx = draftSession.exercises[activeExerciseIdx];

  const handleSetUpdate = (exerciseId: string, setId: string, field: keyof SetLog, value: any) => {
    const updatedExercises = draftSession.exercises.map(ex => {
      if (ex.id !== exerciseId) return ex;
      const updatedSets = ex.sets.map(set => {
        if (set.id !== setId) return set;
        if (field === 'isCompleted' && value === true) {
          setTimeLeft(set.restTime || 90);
          setIsTimerActive(true);
        }
        return { ...set, [field]: value };
      });
      return { ...ex, sets: updatedSets };
    });
    updateDraft({ ...draftSession, exercises: updatedExercises });
  };

  const convertToSuperSet = (setId: string) => {
    handleSetUpdate(currentEx.id, setId, 'type', 'SUPER_SET');
  };

  const addSet = (type: SetType) => {
    const category = (currentEx.customContext?.restCategory as RestCategory) || 'isolation';
    const newSet: SetLog = { 
      id: Math.random().toString(36).substr(2, 9), 
      type, weight: '', reps: '', rir: (type === 'RAMP_UP' ? 5 : 1), 
      restTime: getPresetRest(category, type), isCompleted: false, subSets: [],
      supersetName: type === 'SUPER_SET' ? '' : undefined,
      supersetWeight: '',
      supersetReps: ''
    };
    
    const updatedExercises = draftSession.exercises.map(ex => {
      if (ex.id !== currentEx.id) return ex;
      return { ...ex, sets: [...ex.sets, newSet] };
    });
    
    updateDraft({ ...draftSession, exercises: updatedExercises });
    setShowSetTypePicker(false);
  };

  const handleSort = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    const setsCopy = [...currentEx.sets];
    const draggedItemContent = setsCopy.splice(dragItem.current, 1)[0];
    setsCopy.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;

    const updatedExercises = draftSession.exercises.map(ex => {
      if (ex.id !== currentEx.id) return ex;
      return { ...ex, sets: setsCopy };
    });
    updateDraft({ ...draftSession, exercises: updatedExercises });
  };

  return (
    <div className="pb-40 animate-fade-in">
      <header className="fixed top-0 left-0 right-0 bg-background/90 backdrop-blur-md z-50 px-5 py-4 border-b border-zinc-800 flex items-center justify-between max-w-xl mx-auto">
        <button onClick={() => setShowExitModal(true)} className="p-2 text-red-500">
          <X size={20} />
        </button>
        <div className="text-center truncate px-4 flex items-center gap-2">
          <button 
            onClick={() => setShowSessionContextModal(true)}
            className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-primary animate-pulse shadow-[0_0_10px_rgba(212,175,55,0.3)]"
          >
            <Activity size={14} />
          </button>
          <div className="text-center">
            <h2 className="text-[9px] font-black text-primary uppercase tracking-widest leading-none mb-1">Antrenament Activ</h2>
            <p className="text-[10px] font-bold text-white truncate uppercase leading-none">{draftSession.dayName}</p>
          </div>
        </div>
        <button onClick={() => setShowFinishModal(true)} className="bg-primary text-black px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-gold-glow active:scale-95 transition-all">
          FINISH
        </button>
      </header>

      <nav className="fixed top-[60px] left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-zinc-900 max-w-xl mx-auto">
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 py-4">
          {draftSession.exercises.map((ex, idx) => (
            <button
              key={ex.id}
              onClick={() => setActiveExerciseIdx(idx)}
              className={`flex-shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center text-xs font-bold transition-all ${
                activeExerciseIdx === idx 
                ? 'bg-primary border-primary text-black' 
                : ex.sets.every(s => s.isCompleted) ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-zinc-900 border-zinc-800 text-zinc-500'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </nav>

      <div className="mt-32 px-1">
        <section className="bg-surface p-6 rounded-2xl border border-zinc-800 mb-6 flex justify-between items-start shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary/40"></div>
          <div className="flex-1 pr-4">
            <h1 className="text-lg font-black text-white uppercase tracking-tight leading-tight mb-2">{currentEx.name}</h1>
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] border border-primary/20 px-2 py-0.5 rounded">Target: {currentEx.customContext?.targetReps || 'N/A'}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowSetupModal(true)} 
              className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col items-center justify-center gap-0.5 text-zinc-500 hover:text-white transition-colors"
            >
              <Settings size={14} />
              <span className="text-[7px] font-black uppercase">Setup</span>
            </button>
            <button 
              onClick={() => setShowInfoModal(true)} 
              className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-zinc-500 hover:text-primary transition-colors"
            >
              <HelpCircle size={18} />
            </button>
          </div>
        </section>

        <div className="space-y-4 mb-8">
          {currentEx.sets.map((set, sIdx) => (
            <div 
              key={set.id} 
              draggable
              onDragStart={() => { dragItem.current = sIdx; }}
              onDragEnter={() => { dragOverItem.current = sIdx; }}
              onDragEnd={handleSort}
              onDragOver={(e) => e.preventDefault()}
              className={`bg-surface border border-zinc-800 rounded-2xl overflow-hidden transition-all ${set.isCompleted ? 'opacity-40 grayscale-[0.5]' : 'shadow-lg border-zinc-700/50'}`}
            >
              <div className="px-5 py-2.5 flex justify-between items-center bg-zinc-900/50">
                <div className="flex items-center gap-2">
                    <div className="text-zinc-700 cursor-grab active:cursor-grabbing hover:text-primary transition-colors">
                        <GripVertical size={16} />
                    </div>
                    <span className={`text-[8px] font-black uppercase tracking-widest ${
                        set.type === 'TOP_SET' ? 'text-primary' : 
                        set.type === 'DROP_SET' ? 'text-red-500' : 
                        set.type === 'SUPER_SET' ? 'text-blue-400' : 
                        'text-zinc-500'
                    }`}>
                        Set {sIdx + 1} • {set.type.replace('_', ' ')}
                    </span>
                    <div className="flex gap-1.5 ml-2">
                        <button 
                          onClick={() => addSubSet(currentEx.id, set.id)}
                          className="bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                        >
                          + Drop
                        </button>
                        {set.type !== 'SUPER_SET' && (
                          <button 
                            onClick={() => convertToSuperSet(set.id)}
                            className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all"
                          >
                            + Super
                          </button>
                        )}
                        <button 
                          onClick={() => handleSetUpdate(currentEx.id, set.id, 'isFailure', !set.isFailure)}
                          className={`px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-widest transition-all flex items-center gap-1 ${set.isFailure ? 'bg-orange-500 text-white shadow-[0_0_8px_rgba(249,115,22,0.5)]' : 'bg-zinc-800 text-zinc-600 border border-zinc-700'}`}
                        >
                          <Flame size={8} /> Failure
                        </button>
                    </div>
                </div>
                <button onClick={() => removeSet(currentEx.id, set.id)} className="text-zinc-700 hover:text-red-500 transition-colors p-1"><Trash2 size={14}/></button>
              </div>

              <div className="p-5 grid grid-cols-3 gap-4">
                <div className="space-y-1 text-center">
                  <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">KG</span>
                  <input 
                    type="number" 
                    value={set.weight} 
                    onChange={(e) => handleSetUpdate(currentEx.id, set.id, 'weight', e.target.value)} 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 text-center font-black text-xl text-white outline-none focus:border-primary transition-all" 
                    placeholder="-"
                  />
                </div>
                <div className="space-y-1 text-center">
                  <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">REPS</span>
                  <input 
                    type="number" 
                    value={set.reps} 
                    onChange={(e) => handleSetUpdate(currentEx.id, set.id, 'reps', e.target.value)} 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 text-center font-black text-xl text-white outline-none focus:border-primary transition-all" 
                    placeholder="-"
                  />
                </div>
                <div className="space-y-1 text-center">
                  <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Bifat</span>
                  <button 
                    onClick={() => handleSetUpdate(currentEx.id, set.id, 'isCompleted', !set.isCompleted)} 
                    className={`w-full h-[52px] rounded-xl flex items-center justify-center transition-all ${set.isCompleted ? 'bg-primary text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'bg-zinc-900 text-zinc-700 border border-zinc-800'}`}
                  >
                    <Check size={24} strokeWidth={4} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActiveWorkout;
