
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ProgramDay, ProgramExercise, MasterExercise } from '../types';
import { ArrowLeft, Save, Plus, Trash2, Search, ArrowUp, ArrowDown, Minus, Check, Settings2, HelpCircle, Zap, BookOpen, ChevronDown, Clock, Edit3 } from 'lucide-react';

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

  useEffect(() => {
    if (programId) {
        const existing = customPrograms.find(p => p.id === programId);
        if (existing) {
            setProgramName(existing.name);
            setExercises(existing.exercises);
        }
    }
  }, [programId, customPrograms]);

  const handleSpellCheck = (idx: number, field: 'cue' | 'why' | 'scheme') => {
    let text = exercises[idx][field] || '';
    if (!text) return;
    
    // Simple ROMANIAN rule-based corrections for common mistakes
    const corrections: Record<string, string> = {
        'extensi': 'extensii',
        'impins': 'împins',
        'brate': 'brațe',
        'picioare': 'picioare',
        'coate': 'coate',
        'spate': 'spate'
    };
    
    let corrected = text;
    Object.keys(corrections).forEach(wrong => {
        const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
        corrected = corrected.replace(regex, corrections[wrong]);
    });

    if (corrected !== text && window.confirm(`Corectez automat: "${corrected}"?`)) {
        updateExercise(idx, field, corrected);
    } else {
        alert("Textul pare corect sau nu am sugestii.");
    }
  };

  const handleSaveProgram = () => {
      if (!programName.trim()) return alert("Pune un nume.");
      saveCustomProgram({ id: programId || `custom_${Date.now()}`, name: programName, exercises: exercises, isCustom: true });
      navigate('/', { state: { tab: 'custom' } });
  };

  const addExerciseToProgram = (master: MasterExercise) => {
      setExercises([...exercises, { id: master.id, masterId: master.id, name: master.name, defaultRampUpSets: 1, defaultBackOffSets: 1, hasTopSet: true, targetReps: '8-12', targetRir: 1 }]);
      setShowPicker(false);
  };

  const updateExercise = (index: number, field: keyof ProgramExercise, value: any) => {
      const updated = [...exercises];
      updated[index] = { ...updated[index], [field]: value };
      setExercises(updated);
  };

  const Stepper = ({ label, value, onChange }: { label: string, value: number, onChange: (val: number) => void }) => (
      <div className="flex flex-col">
          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-2">{label}</span>
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-sm">
              <button onClick={() => value > 0 && onChange(value - 1)} className="w-10 h-10 flex items-center justify-center text-zinc-400 border-r border-zinc-800"><Minus size={14} /></button>
              <div className="flex-1 text-center font-mono font-bold text-white text-sm">{value}</div>
              <button onClick={() => onChange(value + 1)} className="w-10 h-10 flex items-center justify-center text-zinc-400 border-l border-zinc-800"><Plus size={14} /></button>
          </div>
      </div>
  );

  return (
    <div className="pb-24 animate-fade-in">
        <div className="sticky top-0 bg-black/90 backdrop-blur-md z-40 pt-4 pb-4 -mx-5 px-5 flex justify-between items-center mb-6 border-b border-zinc-800">
            <button onClick={() => navigate('/settings')} className="text-zinc-400"><ArrowLeft size={20} /></button>
            <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Editor Protocol</h3>
            <button onClick={handleSaveProgram} className="bg-primary/10 border border-primary/30 text-primary px-3 py-1.5 text-[10px] font-black uppercase">Salvează</button>
        </div>

        <input 
            type="text" 
            value={programName} 
            onChange={(e) => setProgramName(e.target.value)} 
            placeholder="Nume Antrenament..." 
            className="w-full bg-transparent border-b-2 border-zinc-800 text-white p-4 font-black uppercase text-xl outline-none mb-6"
        />

        <div className="space-y-4">
            {exercises.map((ex, idx) => (
                <div key={idx} className="bg-card border border-zinc-800 p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-black text-white uppercase">{ex.name}</h3>
                        <button onClick={() => setExercises(exercises.filter((_, i) => i !== idx))} className="text-zinc-600 hover:text-red-500"><Trash2 size={16} /></button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Stepper label="Warm-up" value={ex.defaultRampUpSets} onChange={(v) => updateExercise(idx, 'defaultRampUpSets', v)} />
                        <Stepper label="Back-off" value={ex.defaultBackOffSets} onChange={(v) => updateExercise(idx, 'defaultBackOffSets', v)} />
                        
                        <div className="col-span-2">
                            <button 
                                onClick={() => setExpandedDetails({ ...expandedDetails, [idx]: !expandedDetails[idx] })}
                                className="w-full flex items-center justify-between p-3 bg-zinc-900 text-[10px] font-black uppercase border border-zinc-800"
                            >
                                <span className="flex items-center gap-2"><Settings2 size={12}/> Detalii Avansate</span>
                                <ChevronDown size={14} className={expandedDetails[idx] ? 'rotate-180' : ''} />
                            </button>
                            
                            {expandedDetails[idx] && (
                                <div className="mt-4 space-y-4 animate-slide-down">
                                    {['cue', 'why', 'scheme'].map((field: any) => (
                                        <div key={field}>
                                            <div className="flex justify-between items-center mb-1">
                                                <label className="text-[9px] text-zinc-500 uppercase font-bold">{field === 'cue' ? 'Indicații' : field === 'why' ? 'Raționament' : 'Structură'}</label>
                                                <button onClick={() => handleSpellCheck(idx, field)} className="text-[8px] text-primary uppercase font-black flex items-center gap-1"><Edit3 size={10}/> Corectează</button>
                                            </div>
                                            <textarea 
                                                value={(ex as any)[field] || ''} 
                                                onChange={(e) => updateExercise(idx, field as any, e.target.value)}
                                                className="w-full bg-black border border-zinc-800 p-3 text-xs text-zinc-300 outline-none h-20"
                                            />
                                        </div>
                                    ))}
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <label className="text-[9px] text-zinc-500 uppercase font-bold">Pauză (secunde)</label>
                                            <input type="number" value={ex.rest || 90} onChange={(e) => updateExercise(idx, 'rest', parseInt(e.target.value))} className="w-full bg-black border border-zinc-800 p-3 text-xs text-white" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
            <button onClick={() => setShowPicker(true)} className="w-full py-5 border border-zinc-800 text-zinc-500 text-xs font-black uppercase">+ Adaugă Exercițiu</button>
        </div>

        {showPicker && (
            <div className="fixed inset-0 bg-black z-50 flex flex-col p-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-black text-white uppercase">Alege Exercițiu</h3>
                    <button onClick={() => setShowPicker(false)} className="text-zinc-500"><Plus size={24} className="rotate-45"/></button>
                </div>
                <input type="text" placeholder="Caută..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-zinc-900 p-4 border border-zinc-800 text-white outline-none mb-4" />
                <div className="flex-1 overflow-y-auto no-scrollbar">
                    {getAllExercises().filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase())).map(e => (
                        <button key={e.id} onClick={() => addExerciseToProgram(e)} className="w-full text-left p-4 border-b border-zinc-900 text-sm font-bold text-zinc-300">{e.name}</button>
                    ))}
                </div>
            </div>
        )}
    </div>
  );
};

export default ProgramEditor;
