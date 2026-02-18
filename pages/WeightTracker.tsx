
import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { WeightEntry } from '../types';
import { 
  Scale, 
  TrendingDown, 
  TrendingUp, 
  Minus, 
  ChevronLeft, 
  ChevronRight, 
  Trash2, 
  Calendar, 
  MessageSquare, 
  Save, 
  Edit2,
  AlertCircle,
  Activity,
  Zap,
  BrainCircuit,
  Sparkles
} from 'lucide-react';

const WeightTracker: React.FC = () => {
  const { weightLogs, saveWeight, deleteWeight, getWeightStats } = useData();
  
  const todayStr = new Date().toISOString().split('T')[0];
  
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [weightValue, setWeightValue] = useState('');
  const [noteValue, setNoteValue] = useState('');
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [showUndo, setShowUndo] = useState<{date: string, weight: number} | null>(null);
  const [viewDate, setViewDate] = useState(new Date());

  const stats = useMemo(() => getWeightStats(), [weightLogs]);

  useEffect(() => {
    const existing = weightLogs[selectedDate];
    if (existing) {
      setWeightValue(existing.weight.toString());
      setNoteValue(existing.note || '');
    } else {
      setWeightValue('');
      setNoteValue('');
    }
  }, [selectedDate, weightLogs]);

  const handleSave = () => {
    const val = parseFloat(weightValue);
    if (isNaN(val) || val <= 0) return;
    
    saveWeight(val, selectedDate, noteValue);
    if (!editingDate) {
      setWeightValue('');
      setNoteValue('');
    }
    setEditingDate(null);
    const savedDate = new Date(selectedDate);
    if (savedDate.getMonth() !== viewDate.getMonth() || savedDate.getFullYear() !== viewDate.getFullYear()) {
      setViewDate(savedDate);
    }
  };

  const handleDelete = (date: string, weight: number) => {
    if (window.confirm(`Ștergi înregistrarea din ${new Date(date).toLocaleDateString('ro-RO')} (${weight} kg)?`)) {
      deleteWeight(date);
      setShowUndo({ date, weight });
      setTimeout(() => setShowUndo(null), 5000);
    }
  };

  const filteredEntries = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth() + 1;
    const monthStr = month < 10 ? `0${month}` : `${month}`;
    const prefix = `${year}-${monthStr}`;
    return (Object.values(weightLogs) as WeightEntry[])
      .filter(e => e.date.startsWith(prefix))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [weightLogs, viewDate]);

  const changeMonth = (offset: number) => {
    const next = new Date(viewDate);
    next.setMonth(next.getMonth() + offset);
    setViewDate(next);
  };

  const isTodayLogged = !!weightLogs[todayStr];

  return (
    <div className="animate-fade-in pb-24">
      <header className="mb-8 border-l-4 border-primary pl-4 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">Jurnal<br/><span className="text-primary">Greutate</span></h2>
          <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest mt-2">Bio-Feedback zilnic</p>
        </div>
        {isTodayLogged && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 mb-1">
            <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Azi bifat</span>
          </div>
        )}
      </header>

      {/* 1. RDZ NUTRI-COACH AI ADVICE */}
      <section className="mb-8">
          <div className={`p-6 rounded-[2.5rem] border ${
            stats.advice.type === 'SUCCESS' ? 'bg-emerald-500/5 border-emerald-500/20' : 
            stats.advice.type === 'ACTION' ? 'bg-primary/5 border-primary/20' : 
            'bg-zinc-950 border-white/5'
          } shadow-premium relative overflow-hidden transition-all duration-500`}>
              <div className="absolute top-0 right-0 p-6 opacity-5"><BrainCircuit size={60} className="text-primary" /></div>
              <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-xl border ${
                    stats.advice.type === 'SUCCESS' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                    stats.advice.type === 'ACTION' ? 'bg-primary/10 border-primary/20 text-primary' :
                    'bg-zinc-900 border-white/5 text-zinc-600'
                  }`}>
                      <Sparkles size={16} />
                  </div>
                  <h3 className="text-[10px] font-black text-white uppercase tracking-widest">RDZ Nutri-Coach Feedback</h3>
              </div>
              <p className="text-xs font-black text-zinc-300 uppercase leading-relaxed tracking-tight">
                  {stats.advice.text}
              </p>
          </div>
      </section>

      {/* 2. STATISTICI DASHBOARD */}
      <div className="bg-card border border-white/5 p-8 mb-8 rounded-[2.5rem] shadow-premium relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-4 opacity-5"><Activity size={80} className="text-primary" /></div>
         <div className="relative z-10 flex flex-col gap-6">
            <div className="flex justify-between items-end border-b border-white/5 pb-4">
               <div>
                  <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Media celor 7 zile (Actuală)</span>
                  <div className="text-5xl font-black text-white leading-none mt-1 tracking-tighter font-mono">
                    {stats.avg7d || '--'} <span className="text-lg text-zinc-700 font-normal">kg</span>
                  </div>
               </div>
               <div className={`text-right ${stats.diff7d < 0 ? 'text-emerald-500' : stats.diff7d > 0 ? 'text-red-500' : 'text-zinc-500'}`}>
                  <div className="flex items-center justify-end font-black text-xl font-mono">
                    {stats.diff7d < 0 ? <TrendingDown size={20} className="mr-1"/> : stats.diff7d > 0 ? <TrendingUp size={20} className="mr-1"/> : <Minus size={20} className="mr-1"/>}
                    {Math.abs(stats.diff7d).toFixed(1)}
                  </div>
                  <span className="text-[8px] font-bold uppercase tracking-widest opacity-60">Delta Săptămânal</span>
               </div>
            </div>
            
            <div className="flex gap-10">
               <div>
                  <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest">Media Anterioară</span>
                  <div className="text-xl font-black text-zinc-300 mt-0.5 font-mono">{stats.prevAvg7d || '--'} kg</div>
               </div>
               <div>
                  <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest">Consistență</span>
                  <div className="text-xl font-black text-white mt-0.5 font-mono">{stats.count} <span className="text-xs font-normal opacity-40">LOGS</span></div>
               </div>
            </div>
         </div>
      </div>

      {/* 3. ADĂUGARE RAPIDĂ */}
      <section className="bg-card border border-white/5 p-8 mb-10 rounded-[2.5rem] relative shadow-premium">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
            <Scale size={16} className="text-primary" /> 
            {editingDate ? `Editare: ${new Date(selectedDate).toLocaleDateString('ro-RO')}` : 'Cântărire Nouă'}
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="group">
            <label className="text-[9px] text-zinc-500 font-black uppercase mb-2 block tracking-widest group-focus-within:text-primary transition-colors">Data</label>
            <input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-zinc-950 border border-white/5 text-white p-4 text-xs outline-none focus:border-primary font-mono transition-all rounded-2xl"
            />
          </div>
          <div className="group">
            <label className="text-[9px] text-zinc-500 font-black uppercase mb-2 block tracking-widest group-focus-within:text-primary transition-colors">Greutate (kg)</label>
            <input 
              type="number" 
              inputMode="decimal"
              step="0.1"
              value={weightValue}
              onChange={(e) => setWeightValue(e.target.value)}
              placeholder="00.0"
              className="w-full bg-zinc-950 border border-white/5 text-white p-4 text-xl font-black outline-none focus:border-primary transition-all placeholder:text-zinc-900 rounded-2xl"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="text-[9px] text-zinc-500 font-black uppercase mb-2 block tracking-widest">Note Contextuale</label>
          <input 
            type="text" 
            value={noteValue}
            onChange={(e) => setNoteValue(e.target.value)}
            placeholder="Ex: după cheat meal, hidratare mare..."
            className="w-full bg-zinc-950 border border-white/5 text-white p-4 text-[10px] font-black uppercase outline-none focus:border-primary transition-all rounded-2xl"
          />
        </div>

        <button 
          onClick={handleSave}
          disabled={!weightValue}
          className="w-full bg-primary text-black font-black py-5 uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-3 hover:bg-white transition-all disabled:opacity-20 active:scale-95 shadow-gold-glow rounded-2xl"
        >
          <Save size={18} /> {weightLogs[selectedDate] ? 'Actualizează Înregistrarea' : 'Salvează în Log'}
        </button>

        {editingDate && (
          <button 
            onClick={() => { setEditingDate(null); setSelectedDate(todayStr); }}
            className="w-full mt-4 text-zinc-600 text-[9px] font-black uppercase tracking-widest py-2"
          >
            Anulează Editarea
          </button>
        )}
      </section>

      {/* 4. ISTORIC LUNAR */}
      <div className="flex items-center justify-between mb-6 px-2">
        <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
          <Calendar size={14} className="text-zinc-600"/> Arhivă Istorică
        </h3>
        <div className="flex items-center gap-2 bg-zinc-950 border border-white/5 px-3 py-1.5 rounded-xl">
          <button onClick={() => changeMonth(-1)} className="p-2 text-zinc-600 hover:text-white transition-colors"><ChevronLeft size={16}/></button>
          <span className="text-[9px] font-black text-white uppercase min-w-[110px] text-center tracking-widest">
            {viewDate.toLocaleDateString('ro-RO', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={() => changeMonth(1)} className="p-2 text-zinc-600 hover:text-white transition-colors"><ChevronRight size={16}/></button>
        </div>
      </div>

      <div className="space-y-3">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-zinc-900 bg-card/20 rounded-[2rem] text-zinc-700 text-[10px] font-black uppercase tracking-[0.2em]">
            Nu există înregistrări pentru această lună
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <div 
              key={entry.date} 
              className={`bg-card border border-white/5 p-6 flex items-center justify-between group transition-all rounded-[1.5rem] shadow-premium ${entry.date === todayStr ? 'border-primary/20' : ''}`}
            >
              <div className="flex items-center gap-5">
                <div className="text-center min-w-[36px] border-r border-white/5 pr-5">
                  <div className="text-[8px] font-black text-zinc-600 uppercase">
                    {new Date(entry.date).toLocaleDateString('ro-RO', { weekday: 'short' })}
                  </div>
                  <div className={`text-sm font-black ${entry.date === todayStr ? 'text-primary' : 'text-zinc-300'}`}>
                    {entry.date.split('-')[2]}
                  </div>
                </div>
                <div>
                  <div className="text-lg font-black text-white tracking-tighter font-mono">
                    {entry.weight.toFixed(1)} <span className="text-[10px] text-zinc-700 font-normal">kg</span>
                  </div>
                  {entry.note && (
                    <div className="flex items-center gap-1.5 text-[9px] text-zinc-600 mt-1 max-w-[180px] truncate uppercase font-bold">
                      <MessageSquare size={10} className="shrink-0"/> {entry.note}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => {
                    setEditingDate(entry.date);
                    setSelectedDate(entry.date);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-3 text-zinc-700 hover:text-primary transition-colors"
                >
                  <Edit2 size={16}/>
                </button>
                <button 
                  onClick={() => handleDelete(entry.date, entry.weight)}
                  className="p-3 text-zinc-700 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16}/>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showUndo && (
        <div className="fixed bottom-24 left-6 right-6 z-[60] bg-primary p-5 rounded-2xl shadow-gold-glow flex items-center justify-between animate-slide-up">
          <div className="flex items-center gap-3">
            <AlertCircle size={18} className="text-black" />
            <span className="text-[10px] font-black text-black uppercase tracking-widest">Intrare restabilită</span>
          </div>
          <button 
            onClick={() => {
              saveWeight(showUndo.weight, showUndo.date);
              setShowUndo(null);
            }}
            className="text-[10px] font-black text-black border-b-2 border-black uppercase tracking-widest"
          >
            Undo
          </button>
        </div>
      )}
    </div>
  );
};

export default WeightTracker;
