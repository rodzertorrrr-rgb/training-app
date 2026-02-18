import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../context/DataContext.tsx';
import { ProgramExercise, MasterExercise, MuscleGroup, MovementType, RestCategory } from '../types.ts';
import { 
  ArrowLeft, Trash2, Plus, Search, X, Zap, Target, LayoutGrid, Settings2, Info, Activity
} from 'lucide-react';

const ProgramEditor: React.FC = () => {
  const { customPrograms, saveCustomProgram, getAllExercises, addCustomExercise } = useData();
  const navigate = useNavigate();
  const { programId } = useParams<{ programId: string }>();

  const [programName, setProgramName] = useState('');
  const [exercises, setExercises] = useState<ProgramExercise[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingExId, setEditingExId] = useState<string | null>(null);
  
  // Custom Exercise Creation State
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customExName, setCustomExName] = useState('');
  const [customExGroup, setCustomExGroup] = useState<MuscleGroup>('Piept');
  const [customExType, setCustomExType] = useState<MovementType>('compound');

  const allExercises = getAllExercises();

  const groupedExercises = useMemo(() => {
    const filtered = allExercises.filter(ex => 
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.muscleGroup.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const groups: Record<string, MasterExercise[]> = {};
    filtered.forEach(ex => {
      if (!groups[ex.muscleGroup]) groups[ex.muscleGroup] = [];
      groups[ex.muscleGroup].push(ex);
    });
    
    return Object.keys(groups).sort().reduce((acc, key) => {
      acc[key] = groups[key];
      return acc;
    }, {} as Record<string, MasterExercise[]>);
  }, [allExercises, searchQuery]);

  useEffect(() => {
    if (programId && programId !== 'new') {
      const existing = customPrograms.find(p => p.id === programId);
      if (existing) {
        setProgramName(existing.name);
        setExercises(existing.exercises);
      }
    }
  }, [programId, customPrograms]);

  const handleSave = () => {
    if (!programName.trim()) return;
    saveCustomProgram({
      id: programId && programId !== 'new' ? programId : `custom_${Date.now()}`,
      name: programName,
      exercises
    });
    navigate('/settings');
  };

  const addExercise = (master: MasterExercise) => {
    const newId = `pe_${Date.now()}`;
    setExercises([...exercises, {
      id: newId,
      masterId: master.id,
      name: master.name,
      defaultRampUpSets: master.movementType === 'compound' ? 2 : 1,
      defaultBackOffSets: 2,
      hasTopSet: true,
      targetReps: master.movementType === 'compound' ? '6-10' : '10-15',
      targetRir: 1,
      why: '',
      cue: '',
      stimulus: ''
    }]);
    setEditingExId(newId); // Deschide configurarea imediat
  };

  const updateExerciseDetail = (id: string, field: keyof ProgramExercise, value: any) => {
    setExercises(exercises.map(ex => ex.id === id ? { ...ex, [field]: value } : ex));
  };

  const removeExercise = (id: string) => {
    setExercises(exercises.filter(e => e.id !== id));
    if (editingExId === id) setEditingExId(null);
  };

  const createAndAddCustom = () => {
    if (!customExName.trim()) return;
    const restCat: RestCategory = customExType === 'compound' ? 'compound_machine' : 'isolation';
    const newEx = addCustomExercise({
      name: customExName,
      muscleGroup: customExGroup,
      movementType: customExType,
      restCategory: restCat,
      equipment: 'other'
    });
    addExercise(newEx);
    setShowCustomModal(false);
    setCustomExName('');
  };

  // Fixed: 'Abdomen' changed to 'Core' and added missing muscle groups to match type definition in types.ts
  const muscleGroups: MuscleGroup[] = ['Piept', 'Spate', 'Umeri', 'Biceps', 'Triceps', 'Cvadriceps', 'Femurali', 'Glutei', 'Adductori / Abductori', 'Lower Back', 'Gambe', 'Core', 'Altele'];

  return (
    <div className="pb-40 animate-fade-in px-1">
      <div className="sticky top-0 bg-black/95 backdrop-blur-md z-50 py-4 flex justify-between items-center border-b border-zinc-900 mb-8">
        <button onClick={() => navigate(-1)} className="text-zinc-400 p-2"><ArrowLeft size={20} /></button>
        <h3 className="text-xs font-black text-primary uppercase tracking-[0.3em]">EDITOR PROTOCOL</h3>
        <button 
          onClick={handleSave} 
          disabled={!programName.trim() || exercises.length === 0}
          className="bg-primary text-black px-6 py-2 text-[10px] font-black uppercase shadow-glow disabled:opacity-20 transition-all"
        >
          Salvează
        </button>
      </div>

      <div className="mb-10">
        <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2 block">Denumire Program</label>
        <input 
          type="text" 
          value={programName} 
          onChange={(e) => setProgramName(e.target.value)}
          className="w-full bg-zinc-950 border-2 border-zinc-900 p-5 text-white font-black uppercase outline-none focus:border-primary transition-all text-sm rounded-2xl"
          placeholder="Ex: Lower Body - Hipertrofie"
        />
      </div>

      <div className="space-y-4 mb-16">
        <div className="flex items-center justify-between mb-4 border-l-4 border-primary pl-4">
          <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Protocol Curent ({exercises.length})</h4>
        </div>
        
        {exercises.length === 0 ? (
           <div className="py-12 text-center border-2 border-dashed border-zinc-900 text-zinc-800 uppercase font-black text-[10px] tracking-widest bg-zinc-950/20 rounded-2xl">
              Selectează exerciții din librăria de mai jos
           </div>
        ) : (
          <div className="space-y-3">
            {exercises.map((ex, idx) => (
              <div key={ex.id} className="bg-card border border-zinc-900 rounded-3xl overflow-hidden transition-all shadow-premium border-white/5">
                <div className="p-5 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-zinc-700">{idx + 1}</span>
                    <div>
                      <h4 className="text-xs font-black text-white uppercase tracking-tight">{ex.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[8px] text-primary font-black uppercase tracking-widest">
                          {ex.hasTopSet ? '1 TOP' : 'NO TOP'} • {ex.defaultBackOffSets} BACK • {ex.targetReps} REPS
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => setEditingExId(editingExId === ex.id ? null : ex.id)}
                      className={`p-3 rounded-xl transition-all ${editingExId === ex.id ? 'bg-primary text-black' : 'bg-zinc-900 text-zinc-500'}`}
                    >
                      <Settings2 size={16} />
                    </button>
                    <button onClick={() => removeExercise(ex.id)} className="p-3 text-zinc-700 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* PANOU CONFIGURARE DETALIATĂ */}
                {editingExId === ex.id && (
                  <div className="p-6 pt-0 bg-black/40 border-t border-white/5 space-y-6 animate-slide-up">
                    <div className="grid grid-cols-3 gap-3 pt-6">
                      <div className="space-y-1.5">
                        <label className="text-[8px] font-black text-zinc-600 uppercase tracking-widest block text-center">Ramp-up</label>
                        <input 
                          type="number" 
                          value={ex.defaultRampUpSets} 
                          onChange={(e) => updateExerciseDetail(ex.id, 'defaultRampUpSets', parseInt(e.target.value) || 0)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 text-center text-xs font-black text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[8px] font-black text-zinc-600 uppercase tracking-widest block text-center">Top Set</label>
                        <button 
                          onClick={() => updateExerciseDetail(ex.id, 'hasTopSet', !ex.hasTopSet)}
                          className={`w-full py-2 rounded-xl text-[9px] font-black uppercase transition-all ${ex.hasTopSet ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-zinc-900 text-zinc-600 border border-zinc-800'}`}
                        >
                          {ex.hasTopSet ? 'DA' : 'NU'}
                        </button>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[8px] font-black text-zinc-600 uppercase tracking-widest block text-center">Back-off</label>
                        <input 
                          type="number" 
                          value={ex.defaultBackOffSets} 
                          onChange={(e) => updateExerciseDetail(ex.id, 'defaultBackOffSets', parseInt(e.target.value) || 0)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 text-center text-xs font-black text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[8px] font-black text-zinc-600 uppercase tracking-widest block">Interval Repetări</label>
                        <input 
                          type="text" 
                          value={ex.targetReps} 
                          onChange={(e) => updateExerciseDetail(ex.id, 'targetReps', e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-xs font-black text-white uppercase"
                          placeholder="EX: 6-10"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[8px] font-black text-zinc-600 uppercase tracking-widest block">Target RIR</label>
                        <input 
                          type="number" 
                          value={ex.targetRir} 
                          onChange={(e) => updateExerciseDetail(ex.id, 'targetRir', parseInt(e.target.value) || 1)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 text-center text-xs font-black text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[8px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                          <Info size={10}/> De ce acest exercițiu?
                        </label>
                        <textarea 
                          value={ex.why || ''} 
                          onChange={(e) => updateExerciseDetail(ex.id, 'why', e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-[10px] font-bold text-zinc-400 uppercase outline-none focus:border-primary/50 min-h-[60px] resize-none"
                          placeholder="Ex: Izolare deltoid lateral..."
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[8px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                          <Activity size={10}/> Indicații Execuție (Cues)
                        </label>
                        <textarea 
                          value={ex.cue || ''} 
                          onChange={(e) => updateExerciseDetail(ex.id, 'cue', e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-[10px] font-bold text-zinc-400 uppercase outline-none focus:border-primary/50 min-h-[60px] resize-none"
                          placeholder="Ex: Coatele sus, torci apă din carafă..."
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-8 border-t border-zinc-900">
        <div className="flex flex-col gap-4 mb-8">
           <div className="flex justify-between items-end border-l-4 border-zinc-800 pl-4">
              <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Librărie Master</h4>
              <button 
                onClick={() => setShowCustomModal(true)}
                className="flex items-center gap-2 text-[10px] font-black text-primary uppercase border-b border-primary/30 pb-1 hover:text-white transition-colors"
              >
                <Plus size={12} /> Crează Custom
              </button>
           </div>
           <div className="relative">
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="CAUTĂ DUPĂ NUME SAU GRUPĂ..."
                className="w-full bg-zinc-900 border border-zinc-800 p-4 pl-12 text-[10px] font-black uppercase text-white outline-none focus:border-primary/50 rounded-2xl"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={16} />
           </div>
        </div>

        <div className="space-y-10">
          {Object.entries(groupedExercises).map(([group, list]) => (
            <div key={group} className="animate-fade-in">
              <div className="flex items-center gap-3 mb-4 bg-zinc-950/50 p-2 border-b border-zinc-900">
                <LayoutGrid size={12} className="text-primary" />
                <h5 className="text-[11px] font-black text-white uppercase tracking-widest">{group}</h5>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {(list as MasterExercise[]).map(master => (
                  <button 
                    key={master.id} 
                    onClick={() => addExercise(master)}
                    className="w-full bg-zinc-950/30 border border-zinc-900 p-4 text-left hover:border-primary/40 hover:bg-zinc-900/50 flex justify-between items-center group active:scale-[0.98] transition-all rounded-2xl"
                  >
                    <div>
                      <span className="text-xs font-black text-zinc-500 uppercase group-hover:text-white transition-colors">{master.name}</span>
                      <p className="text-[8px] text-zinc-800 font-mono uppercase mt-1">
                        {master.movementType === 'compound' ? 'COMPUS' : 'IZOLARE'}
                      </p>
                    </div>
                    <div className="w-8 h-8 flex items-center justify-center bg-zinc-900 border border-zinc-800 text-zinc-700 group-hover:bg-primary group-hover:text-black group-hover:border-primary transition-all rounded-lg">
                      <Plus size={14} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showCustomModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fade-in">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setShowCustomModal(false)}></div>
          <div className="relative bg-surface border-2 border-primary w-full max-w-sm p-8 shadow-glow-strong animate-scale-in rounded-[2.5rem]">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-white uppercase tracking-tighter">EXERCIȚIU NOU</h3>
              <button onClick={() => setShowCustomModal(false)} className="text-zinc-600 hover:text-white"><X size={24}/></button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2 block">Nume Exercițiu</label>
                <input 
                  type="text" 
                  value={customExName}
                  onChange={(e) => setCustomExName(e.target.value)}
                  className="w-full bg-black border border-zinc-800 p-4 text-white text-xs font-bold uppercase outline-none focus:border-primary rounded-xl"
                  placeholder="EX: RAMAT DIN PLECATE..."
                />
              </div>

              <div>
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2 block">Grupa Musculară</label>
                <select 
                  value={customExGroup}
                  onChange={(e) => setCustomExGroup(e.target.value as MuscleGroup)}
                  className="w-full bg-black border border-zinc-800 p-4 text-white text-xs font-bold uppercase outline-none focus:border-primary appearance-none rounded-xl"
                >
                  {muscleGroups.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2 block">Tip Mișcare</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setCustomExType('compound')}
                    className={`p-4 border text-[10px] font-black uppercase flex flex-col items-center gap-2 transition-all rounded-xl ${customExType === 'compound' ? 'bg-primary border-primary text-black' : 'border-zinc-800 text-zinc-600'}`}
                  >
                    <Zap size={14} /> Compus
                  </button>
                  <button 
                    onClick={() => setCustomExType('isolation')}
                    className={`p-4 border text-[10px] font-black uppercase flex flex-col items-center gap-2 transition-all rounded-xl ${customExType === 'isolation' ? 'bg-primary border-primary text-black' : 'border-zinc-800 text-zinc-600'}`}
                  >
                    <Target size={14} /> Izolare
                  </button>
                </div>
              </div>

              <button 
                onClick={createAndAddCustom}
                disabled={!customExName.trim()}
                className="w-full bg-primary text-black font-black uppercase py-5 text-[11px] tracking-widest shadow-glow disabled:opacity-20 transition-all mt-4 rounded-xl"
              >
                Crează & Adaugă
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramEditor;