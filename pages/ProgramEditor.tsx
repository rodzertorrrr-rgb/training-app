
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ProgramDay, ProgramExercise, MasterExercise } from '../types';
import { ArrowLeft, Save, Plus, Trash2, Search, Dumbbell, AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react';

const ProgramEditor: React.FC = () => {
  const { customPrograms, saveCustomProgram, getAllExercises, addCustomExercise } = useData();
  const navigate = useNavigate();
  const { programId } = useParams<{ programId: string }>();

  // Form State
  const [programName, setProgramName] = useState('');
  const [exercises, setExercises] = useState<ProgramExercise[]>([]);
  
  // Exercise Selector Modal State
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

      const newProgram: ProgramDay = {
          id: programId || `custom_prog_${Date.now()}`,
          name: programName,
          exercises: exercises,
          isCustom: true
      };

      saveCustomProgram(newProgram);
      
      // Redirect to Dashboard (Custom Tab) instead of Settings
      navigate('/', { state: { tab: 'custom' } });
  };

  const addExerciseToProgram = (master: MasterExercise) => {
      const newEx: ProgramExercise = {
          id: master.id, // Using master ID to link context? No, strictly program ID.
          masterId: master.id,
          name: master.name,
          defaultRampUpSets: 1,
          defaultBackOffSets: 1,
          hasTopSet: true,
          targetReps: '8-12',
          targetRir: 1
      };
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
      const updated = exercises.filter((_, i) => i !== index);
      setExercises(updated);
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

  return (
    // Decreased padding-bottom (pb-12) because nav bar is hidden now
    <div className="pb-12 animate-fade-in">
        {/* Header */}
        <div className="sticky top-0 bg-black/80 backdrop-blur-md z-30 pt-4 pb-4 -mx-5 px-5 flex justify-between items-center mb-6 border-b border-zinc-800">
            <button onClick={() => navigate('/settings')} className="text-zinc-400 hover:text-white">
                <ArrowLeft size={24} />
            </button>
            <h2 className="text-lg font-black text-white uppercase tracking-tight">
                {programId ? 'Edit Program' : 'New Program'}
            </h2>
            <button onClick={handleSaveProgram} className="text-primary hover:text-white">
                <Save size={24} />
            </button>
        </div>

        {/* Program Name */}
        <div className="mb-8">
            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Nume Antrenament</label>
            <input 
                type="text" 
                value={programName}
                onChange={(e) => setProgramName(e.target.value)}
                placeholder="Ex: Leg Day Destruction"
                className="w-full bg-surface border-2 border-zinc-800 text-white p-4 font-bold uppercase tracking-wide focus:border-primary outline-none text-lg"
            />
        </div>

        {/* Exercises List */}
        <div className="space-y-6">
            {exercises.map((ex, idx) => (
                <div key={idx} className="bg-card border border-zinc-800 p-4 relative group">
                    <div className="flex justify-between items-start mb-4 border-b border-zinc-800 pb-2">
                        <div className="flex items-center gap-2">
                            <span className="text-zinc-600 font-mono text-xs">0{idx + 1}</span>
                            <h3 className="text-white font-bold uppercase">{ex.name}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => moveExercise(idx, -1)} disabled={idx === 0} className="text-zinc-600 hover:text-white disabled:opacity-20"><ArrowUp size={16} /></button>
                            <button onClick={() => moveExercise(idx, 1)} disabled={idx === exercises.length - 1} className="text-zinc-600 hover:text-white disabled:opacity-20"><ArrowDown size={16} /></button>
                            <button onClick={() => removeExercise(idx)} className="text-zinc-600 hover:text-red-500 ml-2"><Trash2 size={16} /></button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[9px] text-zinc-500 uppercase mb-1">Top Set?</label>
                            <div className="flex items-center bg-black border border-zinc-800 p-1">
                                <button 
                                    onClick={() => updateExercise(idx, 'hasTopSet', true)}
                                    className={`flex-1 text-[10px] font-bold py-1 ${ex.hasTopSet ? 'bg-primary text-black' : 'text-zinc-500'}`}
                                >DA</button>
                                <button 
                                    onClick={() => updateExercise(idx, 'hasTopSet', false)}
                                    className={`flex-1 text-[10px] font-bold py-1 ${!ex.hasTopSet ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}
                                >NU</button>
                            </div>
                        </div>
                        <div>
                             <label className="block text-[9px] text-zinc-500 uppercase mb-1">Target Reps</label>
                             <input 
                                type="text" 
                                value={ex.targetReps} 
                                onChange={(e) => updateExercise(idx, 'targetReps', e.target.value)}
                                className="w-full bg-black border border-zinc-800 text-white text-xs p-2 font-mono"
                             />
                        </div>
                        <div>
                             <label className="block text-[9px] text-zinc-500 uppercase mb-1">Warmup Sets</label>
                             <input 
                                type="number" 
                                value={ex.defaultRampUpSets} 
                                onChange={(e) => updateExercise(idx, 'defaultRampUpSets', parseInt(e.target.value))}
                                className="w-full bg-black border border-zinc-800 text-white text-xs p-2 font-mono"
                             />
                        </div>
                        <div>
                             <label className="block text-[9px] text-zinc-500 uppercase mb-1">Backoff Sets</label>
                             <input 
                                type="number" 
                                value={ex.defaultBackOffSets} 
                                onChange={(e) => updateExercise(idx, 'defaultBackOffSets', parseInt(e.target.value))}
                                className="w-full bg-black border border-zinc-800 text-white text-xs p-2 font-mono"
                             />
                        </div>
                    </div>
                </div>
            ))}

            <button 
                onClick={() => setShowPicker(true)}
                className="w-full py-6 border-2 border-dashed border-zinc-700 flex flex-col items-center justify-center text-zinc-500 hover:text-primary hover:border-primary transition-colors"
            >
                <Plus size={32} className="mb-2" />
                <span className="text-xs font-black uppercase tracking-widest">Adaugă Exercițiu</span>
            </button>
        </div>

        {/* EXERCISE PICKER MODAL */}
        {showPicker && (
            <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex flex-col p-6 animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-white uppercase">Library</h3>
                    <button onClick={() => setShowPicker(false)} className="bg-zinc-800 p-2 rounded-full text-white"><ArrowDown size={20} /></button>
                </div>

                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input 
                        type="text" 
                        placeholder="Caută exercițiu..." 
                        className="w-full bg-surface border border-zinc-700 text-white pl-12 pr-4 py-3 rounded-none outline-none focus:border-primary"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                    />
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 no-scrollbar mb-4">
                    {filteredExercises.map(ex => (
                        <button 
                            key={ex.id}
                            onClick={() => addExerciseToProgram(ex)}
                            className="w-full text-left bg-card border border-zinc-800 p-4 hover:border-primary flex justify-between items-center group"
                        >
                            <span className="font-bold text-zinc-300 group-hover:text-white uppercase text-sm">{ex.name}</span>
                            <span className="text-[9px] bg-zinc-900 text-zinc-500 px-2 py-1 uppercase">{ex.muscleGroup}</span>
                        </button>
                    ))}
                    {filteredExercises.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-zinc-500 text-sm mb-4">Exercițiul nu există.</p>
                        </div>
                    )}
                </div>

                {/* Create Custom Interface */}
                <div className="bg-zinc-900 p-4 border-t border-zinc-700">
                    <p className="text-[10px] font-black text-primary uppercase mb-2">Creează Exercițiu Nou</p>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder="Nume..."
                            className="flex-1 bg-black border border-zinc-700 text-white text-xs p-3 outline-none focus:border-primary"
                            value={newExerciseName}
                            onChange={(e) => setNewExerciseName(e.target.value)}
                        />
                        <select 
                            className="bg-black border border-zinc-700 text-white text-xs p-3 outline-none"
                            value={newExerciseGroup}
                            onChange={(e) => setNewExerciseGroup(e.target.value)}
                        >
                            <option value="Piept">Piept</option>
                            <option value="Spate">Spate</option>
                            <option value="Picioare">Picioare</option>
                            <option value="Umeri">Umeri</option>
                            <option value="Brațe">Brațe</option>
                            <option value="Altele">Altele</option>
                        </select>
                    </div>
                    <button 
                        onClick={handleCreateCustomExercise}
                        disabled={!newExerciseName.trim()}
                        className="w-full mt-2 bg-zinc-800 hover:bg-primary hover:text-black text-white py-3 text-xs font-black uppercase tracking-widest transition-colors disabled:opacity-50"
                    >
                        Salvează și Adaugă
                    </button>
                </div>
            </div>
        )}
    </div>
  );
};

export default ProgramEditor;
