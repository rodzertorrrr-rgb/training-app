
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ProgramDay, ProgramExercise, MasterExercise } from '../types';
import { ArrowLeft, Save, Plus, Trash2, Search, ArrowUp, ArrowDown, Minus, Check, Settings2, HelpCircle, Zap, BookOpen, ChevronDown, Clock } from 'lucide-react';

const ProgramEditor: React.FC = () => {
  const { customPrograms, saveCustomProgram, getAllExercises, addCustomExercise } = useData();
  const navigate = useNavigate();
  const { programId } = useParams<{ programId: string }>();

  const [programName, setProgramName] = useState('');
  const [exercises, setExercises] = useState<ProgramExercise[]>([]);
  const [expandedDetails, setExpandedDetails] = useState<Record<number, boolean>>({});
  
  const [showPicker, setShowPicker] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newExerciseName, setNewExerciseName] = useState('');
  const [newExerciseGroup, setNewExerciseGroup] = useState('Altele');

  useEffect(() => {
    if (programId) {
        const existing = customPrograms.find(p => p.id === programId);
        if (existing) {
            setProgramName(existing.name);
            setExercises(existing.exercises);
        }
    }
  }, [programId, customPrograms]);

  const allMasterExercises = getAllExercises();
  const filteredExercises = allMasterExercises.filter(ex => 
      ex.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      ex.muscleGroup.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveProgram = () => {
      if (!programName.trim()) {
          alert("Programul trebuie să aibă un nume.");
          return;
      }
      if (exercises.length === 0) {
          alert("Adaugă cel puțin un exercițiu.");
          return;
      }
      const newProgram: ProgramDay = { id: programId || `custom_prog_${Date.now()}`, name: programName, exercises: exercises, isCustom: true };
      saveCustomProgram(newProgram);
      navigate('/', { state: { tab: 'custom' } });
  };

  const addExerciseToProgram = (master: MasterExercise) => {
      const newEx: ProgramExercise = { id: master.id, masterId: master.id, name: master.name, defaultRampUpSets: 1, defaultBackOffSets: 1, hasTopSet: true, targetReps: '8-12', targetRir: 1 };
      setExercises([...exercises, newEx]);
      setShowPicker(false);
      setSearchTerm('');
  };

  const handleCreateCustomExercise = () => {
      if (!newExerciseName.trim()) return;
      const created = addCustomExercise(newExerciseName, newExerciseGroup);
      addExerciseToProgram(created);
      setNewExerciseName('');
  };

  const updateExercise = (index: number, field: keyof ProgramExercise, value: any) => {
      const updated = [...exercises];
      updated[index] = { ...updated[index], [field]: value };
      setExercises(updated);
  };

  const removeExercise = (index: number) => {
      if(window.confirm("Elimini acest exercițiu?")) {
          const updated = exercises.filter((_, i) => i !== index);
          setExercises(updated);
      }
  };
  
  const toggleDetails = (idx: number) => {
      setExpandedDetails(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const moveExercise = (index: number, direction: -1 | 1) => {
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= exercises.length) return;
      const updated = [...exercises];
      const temp = updated[index];
      updated[index] = updated[newIndex];
      updated[newIndex] = temp;
      setExercises(updated);
  };

  const Stepper = ({ label, value, onChange, min = 0, max = 10 }: { label: string, value: number, onChange: (val: number) => void, min?: number, max?: number }) => (
      <div className="flex flex-col">
          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-2">{label}</span>
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-sm">
              <button onClick={() => value > min && onChange(value - 1)} className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white border-r border-zinc-800"><Minus size={14} /></button>
              <div className="flex-1 text-center font-mono font-bold text-white text-sm">{value}</div>
              <button onClick={() => value < max && onChange(value + 1)} className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white border-l border-zinc-800"><Plus size={14} /></button>
          </div>
      </div>
  );

  return (
    <div className="pb-24 animate-fade-in">
        <div className="sticky top-0 bg-black/90 backdrop-blur-md z-40 pt-4 pb-4 -mx-5 px-5 flex justify-between items-center mb-6 border-b border-zinc-800 shadow-xl">
            <button onClick={() => navigate('/settings')} className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white"><ArrowLeft size={20} /></button>
            <div className="flex flex-col items-center">
                <span className="text-[10px] font-black text-gold-gradient uppercase tracking-[0.2em]">{programId ? 'MOD EDITARE' : 'CONSTRUCTOR'}</span>
                <span className="text-[10px] text-zinc-500 font-mono">{exercises.length} Exerciții</span>
            </div>
            <button onClick={handleSaveProgram} disabled={!programName.trim() || exercises.length === 0} className="h-9 px-3 bg-primary/10 border border-primary/30 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-black disabled:opacity-30 flex items-center">
                <Save size={14} className="mr-1.5" /> Salvează
            </button>
        </div>

        <div className="mb-8 px-1">
            <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2 pl-1">Nume Antrenament <span className="text-red-500">*</span></label>
            <input type="text" value={programName} onChange={(e) => setProgramName(e.target.value)} placeholder="Ex: PUSH DAY - RDZ" className="w-full bg-surface border-b-2 border-zinc-800 text-white p-4 font-black uppercase tracking-tight focus:border-primary outline-none text-xl placeholder-zinc-700 transition-colors" />
        </div>

        <div className="space-y-4">
            {exercises.map((ex, idx) => (
                <div key={idx} className="bg-card border border-zinc-800 relative transition-all">
                    <div className="flex items-center justify-between p-4 border-b border-zinc-800/50 bg-zinc-900/30">
                        <div className="flex items-center gap-3 flex-1 overflow-hidden">
                            <div className="w-6 h-6 flex items-center justify-center bg-zinc-800 text-[10px] font-mono text-zinc-400 border border-zinc-700">{idx + 1}</div>
                            <h3 className="text-sm font-black text-white uppercase truncate pr-2">{ex.name}</h3>
                        </div>
                        <div className="flex items-center gap-1">
                             <div className="flex bg-zinc-900 border border-zinc-800 rounded-sm mr-2">
                                <button onClick={() => moveExercise(idx, -1)} disabled={idx === 0} className="p-1.5 text-zinc-500 hover:text-white disabled:opacity-20"><ArrowUp size={14} /></button>
                                <button onClick={() => moveExercise(idx, 1)} disabled={idx === exercises.length - 1} className="p-1.5 text-zinc-500 hover:text-white disabled:opacity-20"><ArrowDown size={14} /></button>
                             </div>
                             <button onClick={() => removeExercise(idx)} className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:text-red-500"><Trash2 size={16} /></button>
                        </div>
                    </div>

                    <div className="p-4 grid grid-cols-2 gap-x-4 gap-y-6">
                        <div className="col-span-2">
                            <label className="block text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-2">Conține Top Set?</label>
                            <div className="flex bg-black border border-zinc-800 p-0.5 rounded-sm h-10">
                                <button onClick={() => updateExercise(idx, 'hasTopSet', true)} className={`flex-1 text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center ${ex.hasTopSet ? 'bg-primary text-black shadow-sm' : 'text-zinc-600'}`}><Check size={12} className={`mr-1 ${!ex.hasTopSet ? 'hidden' : ''}`} /> DA</button>
                                <button onClick={() => updateExercise(idx, 'hasTopSet', false)} className={`flex-1 text-[10px] font-black uppercase tracking-widest transition-all ${!ex.hasTopSet ? 'bg-zinc-800 text-white' : 'text-zinc-600'}`}>NU</button>
                            </div>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-2">Target Repetări (Text)</label>
                            <input type="text" value={ex.targetReps} onChange={(e) => updateExercise(idx, 'targetReps', e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-white text-sm p-2.5 font-mono text-center focus:border-primary outline-none" />
                        </div>

                        <Stepper label="Warm-up Sets" value={ex.defaultRampUpSets} onChange={(val) => updateExercise(idx, 'defaultRampUpSets', val)} max={5} />
                        <Stepper label="Back-off Sets" value={ex.defaultBackOffSets} onChange={(val) => updateExercise(idx, 'defaultBackOffSets', val)} max={6} />
                        
                        <div className="col-span-2 border-t border-zinc-800 pt-4">
                            <button 
                                onClick={() => toggleDetails(idx)}
                                className={`w-full flex items-center justify-between text-[10px] font-black uppercase tracking-widest p-3 border transition-all ${expandedDetails[idx] ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-black border-zinc-800 text-zinc-500'}`}
                            >
                                <div className="flex items-center gap-2">
                                    <Settings2 size={14} />
                                    DETALII AVANSATE (PENTRU INFO LEGENDĂ)
                                </div>
                                <ChevronDown size={14} className={`transition-transform duration-300 ${expandedDetails[idx] ? 'rotate-180' : ''}`} />
                            </button>
                            
                            {expandedDetails[idx] && (
                                <div className="mt-4 space-y-4 animate-slide-down">
                                    <div>
                                        <label className="flex items-center gap-2 text-[9px] text-zinc-500 font-bold uppercase mb-2">
                                            <HelpCircle size={10} className="text-primary" /> Raționament (Why)
                                        </label>
                                        <textarea 
                                            value={ex.why || ''}
                                            onChange={(e) => updateExercise(idx, 'why', e.target.value)}
                                            className="w-full bg-zinc-950 border border-zinc-800 text-white text-xs p-3 font-mono h-20 outline-none focus:border-primary"
                                            placeholder="De ce este acest exercițiu aici? (Ex: Izolare laterală)"
                                        />
                                    </div>
                                    <div>
                                        <label className="flex items-center gap-2 text-[9px] text-zinc-500 font-bold uppercase mb-2">
                                            <Zap size={10} className="text-primary" /> Indicații (Cue / Ques)
                                        </label>
                                        <textarea 
                                            value={ex.cue || ''}
                                            onChange={(e) => updateExercise(idx, 'cue', e.target.value)}
                                            className="w-full bg-zinc-950 border border-zinc-800 text-white text-xs p-3 font-mono h-20 outline-none focus:border-primary"
                                            placeholder="Instrucțiuni specifice... (Ex: Trage coatele în jos)"
                                        />
                                    </div>
                                    <div>
                                        <label className="flex items-center gap-2 text-[9px] text-zinc-500 font-bold uppercase mb-2">
                                            <BookOpen size={10} className="text-primary" /> Structura (Scheme)
                                        </label>
                                        <textarea 
                                            value={ex.scheme || ''}
                                            onChange={(e) => updateExercise(idx, 'scheme', e.target.value)}
                                            className="w-full bg-zinc-950 border border-zinc-800 text-white text-xs p-3 font-mono h-20 outline-none focus:border-primary"
                                            placeholder="Explică seturile... (Ex: 1 Top Set Greu, 1 Back-off)"
                                        />
                                    </div>
                                    <div>
                                        <label className="flex items-center gap-2 text-[9px] text-zinc-500 font-bold uppercase mb-2">
                                            <Clock size={10} className="text-primary" /> Pauză Target (Secunde)
                                        </label>
                                        <input 
                                            type="number" 
                                            value={ex.rest || 90}
                                            onChange={(e) => updateExercise(idx, 'rest', parseInt(e.target.value) || 0)}
                                            className="w-full bg-zinc-950 border border-zinc-800 text-white text-sm p-3 font-mono outline-none focus:border-primary"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
            <button onClick={() => setShowPicker(true)} className="w-full py-5 bg-zinc-900 border border-zinc-800 hover:border-primary/50 text-zinc-400 hover:text-white flex items-center justify-center gap-2 transition-all active:scale-[0.99]">
                <Plus size={16} /> <span className="text-xs font-black uppercase tracking-widest">Adaugă Exercițiu</span>
            </button>
        </div>

        {showPicker && (
            <div className="fixed inset-0 bg-black z-50 flex flex-col animate-slide-up">
                <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">Selectează Exercițiu</h3>
                    <button onClick={() => setShowPicker(false)} className="p-2 bg-zinc-900 text-zinc-400"><ArrowDown size={20} /></button>
                </div>
                <div className="p-4 border-b border-zinc-800 bg-black">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                        <input type="text" placeholder="Caută în bibliotecă..." className="w-full bg-zinc-900 border border-zinc-800 text-white pl-10 pr-4 py-3 text-sm outline-none focus:border-primary" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} autoFocus />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto no-scrollbar">
                    {filteredExercises.map(ex => (
                        <button key={ex.id} onClick={() => addExerciseToProgram(ex)} className="w-full text-left p-4 border-b border-zinc-900 hover:bg-zinc-900 flex justify-between items-center group">
                            <span className="font-bold text-zinc-300 group-hover:text-white text-sm">{ex.name}</span>
                            <span className="text-[9px] font-mono text-zinc-600 border border-zinc-800 px-1.5 py-0.5 uppercase">{ex.muscleGroup}</span>
                        </button>
                    ))}
                    {searchTerm && filteredExercises.length === 0 && (
                        <div className="p-6 bg-zinc-900/50 border-t border-zinc-800 mt-auto">
                            <p className="text-[10px] font-black text-primary uppercase mb-3">Nu există? Creează-l acum:</p>
                            <div className="flex flex-col gap-3">
                                <input type="text" placeholder="Nume Exercițiu..." className="bg-black border border-zinc-700 text-white text-sm p-3 outline-none focus:border-primary" value={newExerciseName} onChange={(e) => setNewExerciseName(e.target.value)} />
                                <select className="bg-black border border-zinc-700 text-white text-sm p-3 outline-none" value={newExerciseGroup} onChange={(e) => setNewExerciseGroup(e.target.value)}>
                                    <option value="Piept">Piept</option>
                                    <option value="Spate">Spate</option>
                                    <option value="Picioare">Picioare</option>
                                    <option value="Umeri">Umeri</option>
                                    <option value="Brațe">Brațe</option>
                                    <option value="Altele">Altele</option>
                                </select>
                                <button onClick={handleCreateCustomExercise} disabled={!newExerciseName.trim()} className="w-full bg-primary text-black py-4 text-xs font-black uppercase tracking-widest disabled:opacity-50">+ Adaugă în Program</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )}
    </div>
  );
};

export default ProgramEditor;
