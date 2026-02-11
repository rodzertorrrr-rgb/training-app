
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { SetLog } from '../types';
import { Trash2, ArrowLeft, Clock, Check, Timer, StopCircle, X, Info, Settings2, History } from 'lucide-react';

const ActiveWorkout: React.FC = () => {
  const { dayId } = useParams<{ dayId: string }>();
  const navigate = useNavigate();
  const { draftSession, updateDraft, saveSession, discardSession, removeSet, updateExerciseNote, getExerciseHistory } = useData();
  
  const [showExitModal, setShowExitModal] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [activeInfoEx, setActiveInfoEx] = useState<string | null>(null);
  const [infoTab, setInfoTab] = useState<'legend' | 'history'>('legend');

  useEffect(() => {
    if (!draftSession) navigate('/');
  }, [draftSession, navigate]);

  const handleSetUpdate = (exerciseId: string, setId: string, field: keyof SetLog, value: string) => {
    if (!draftSession) return;
    const updatedExercises = draftSession.exercises.map(ex => {
      if (ex.id !== exerciseId) return ex;
      const updatedSets = ex.sets.map(set => 
        set.id === setId ? { ...set, [field]: value === '' ? '' : Number(value) } : set
      );
      return { ...ex, sets: updatedSets };
    });
    updateDraft({ ...draftSession, exercises: updatedExercises });
  };

  const addSet = (exerciseId: string, type: any) => {
    if (!draftSession) return;
    const updatedExercises = draftSession.exercises.map(ex => {
      if (ex.id !== exerciseId) return ex;
      const newSet: SetLog = { id: Date.now().toString(), type, weight: '', reps: '', rir: '', isCompleted: false };
      return { ...ex, sets: [...ex.sets, newSet] };
    });
    updateDraft({ ...draftSession, exercises: updatedExercises });
  };

  if (!draftSession) return null;

  return (
    <div className="pb-40 animate-fade-in">
      <div className="sticky top-0 bg-black/80 backdrop-blur-xl z-30 pt-4 pb-4 border-b border-white/5 -mx-5 px-5 flex justify-between items-center mb-6">
        <button onClick={() => setShowExitModal(true)} className="text-zinc-400"><ArrowLeft size={20} /></button>
        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">LOG SESIUNE</span>
        <button onClick={() => setShowFinishModal(true)} className="bg-primary text-black px-4 py-1.5 text-[10px] font-black uppercase">Finalizează</button>
      </div>

      <div className="space-y-10">
        {draftSession.exercises.map((ex) => (
          <div key={ex.id}>
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h3 className="text-base font-black text-white uppercase pr-4">{ex.name}</h3>
                    <button 
                        onClick={() => setActiveInfoEx(ex.id)}
                        className="flex items-center gap-1.5 text-[9px] text-zinc-500 font-bold uppercase mt-1"
                    >
                        <Info size={10}/> Detalii & Istoric
                    </button>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setActiveInfoEx(ex.id)} className="w-9 h-9 flex items-center justify-center border border-zinc-800 text-zinc-500"><Settings2 size={14}/></button>
                </div>
            </div>

            <div className="bg-card border border-zinc-800">
                <div className="grid grid-cols-12 gap-1 py-2 bg-zinc-950 text-[9px] text-zinc-600 font-black uppercase text-center border-b border-zinc-900">
                    <div className="col-span-2">Tip</div>
                    <div className="col-span-3">KG</div>
                    <div className="col-span-3">REPS</div>
                    <div className="col-span-2">RIR</div>
                    <div className="col-span-2"></div>
                </div>
                <div className="divide-y divide-zinc-900">
                    {ex.sets.map((set) => (
                        <div key={set.id} className="grid grid-cols-12 gap-1 items-center p-2">
                            <div className="col-span-2 text-[8px] font-black text-zinc-500">{set.type.replace('_', ' ')}</div>
                            <div className="col-span-3"><input type="number" value={set.weight} onChange={(e) => handleSetUpdate(ex.id, set.id, 'weight', e.target.value)} className="w-full bg-black border border-zinc-800 p-2 text-center text-sm font-bold text-white outline-none"/></div>
                            <div className="col-span-3"><input type="number" value={set.reps} onChange={(e) => handleSetUpdate(ex.id, set.id, 'reps', e.target.value)} className="w-full bg-black border border-zinc-800 p-2 text-center text-sm font-bold text-white outline-none"/></div>
                            <div className="col-span-2"><input type="number" value={set.rir} onChange={(e) => handleSetUpdate(ex.id, set.id, 'rir', e.target.value)} className="w-full bg-transparent text-center text-xs text-zinc-400 outline-none"/></div>
                            <div className="col-span-2 flex justify-center">
                                <button onClick={() => removeSet(ex.id, set.id)} className="text-zinc-800 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={() => addSet(ex.id, 'WORKING')} className="w-full py-3 text-[9px] font-black text-zinc-600 hover:text-primary uppercase">+ Adaugă Set</button>
            </div>
          </div>
        ))}
      </div>

      {activeInfoEx && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setActiveInfoEx(null)}></div>
              <div className="relative bg-surface border-t border-zinc-800 w-full max-w-xl animate-slide-up pb-10">
                  <div className="flex border-b border-zinc-900">
                      <button onClick={() => setInfoTab('legend')} className={`flex-1 py-4 text-[10px] font-black uppercase ${infoTab === 'legend' ? 'text-primary border-b-2 border-primary' : 'text-zinc-600'}`}>Detalii</button>
                      <button onClick={() => setInfoTab('history')} className={`flex-1 py-4 text-[10px] font-black uppercase ${infoTab === 'history' ? 'text-primary border-b-2 border-primary' : 'text-zinc-600'}`}>Istoric Progres</button>
                  </div>
                  <div className="p-6 max-h-[60vh] overflow-y-auto no-scrollbar">
                      {infoTab === 'legend' ? (
                          <div className="space-y-6">
                              <div>
                                  <label className="text-[9px] text-zinc-600 uppercase font-black">Setup Note (Persistă)</label>
                                  <textarea 
                                    className="w-full bg-black border border-zinc-800 p-3 text-xs text-white mt-2 outline-none"
                                    value={draftSession.exercises.find(e => e.id === activeInfoEx)?.settingsNote || ''}
                                    onChange={(e) => updateExerciseNote(draftSession.exercises.find(e => e.id === activeInfoEx)?.exerciseId || '', e.target.value)}
                                  />
                              </div>
                              <div className="text-xs text-zinc-400 font-mono italic">"Aici se scrie poziția scaunului sau unghiul băncii."</div>
                          </div>
                      ) : (
                          <div className="space-y-4">
                              {getExerciseHistory(draftSession.exercises.find(e => e.id === activeInfoEx)?.exerciseId || '').map((h, i) => (
                                  <div key={i} className="flex justify-between items-center bg-black p-3 border border-zinc-900">
                                      <span className="text-[10px] font-mono text-zinc-500">{new Date(h.date).toLocaleDateString()}</span>
                                      <div className="flex gap-4">
                                          {h.sets?.filter((s: any) => s.type === 'TOP_SET').map((s: any, j: number) => (
                                              <span key={j} className="text-xs font-black text-white">{s.weight}kg x {s.reps}</span>
                                          ))}
                                      </div>
                                  </div>
                              ))}
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}

      {showFinishModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/95" onClick={() => setShowFinishModal(false)}></div>
            <div className="relative bg-card border border-zinc-800 p-8 w-full max-w-sm">
                <h3 className="text-xl font-black text-white uppercase mb-4">Salvezi Sesiunea?</h3>
                <button onClick={() => { saveSession(); navigate('/history'); }} className="w-full bg-primary text-black font-black uppercase py-4 mb-3">Confirmă</button>
                <button onClick={() => setShowFinishModal(false)} className="w-full text-zinc-500 font-black uppercase text-xs">Anulează</button>
            </div>
        </div>
      )}
    </div>
  );
};

export default ActiveWorkout;
