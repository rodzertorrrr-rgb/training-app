
import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '../context/DataContext';
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
  AlertCircle
} from 'lucide-react';

const WeightTracker: React.FC = () => {
  const { weightLogs, saveWeight, deleteWeight, getWeightStats } = useData();
  
  const todayStr = new Date().toISOString().split('T')[0];
  
  // State pentru Formular
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [weightValue, setWeightValue] = useState('');
  const [noteValue, setNoteValue] = useState('');
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [showUndo, setShowUndo] = useState<{date: string, weight: number} | null>(null);
  
  // Navigare Istoric
  const [viewDate, setViewDate] = useState(new Date());

  const stats = useMemo(() => getWeightStats(), [weightLogs]);

  // Pre-populare greutate daca exista deja pentru data selectata
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
    
    // Feedback vizual si reset
    if (!editingDate) {
      setWeightValue('');
      setNoteValue('');
    }
    setEditingDate(null);
    
    // Daca am salvat pentru alta luna, mutam vizualizarea acolo
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
    
    return Object.values(weightLogs)
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

      {/* 1. STATISTICI DASHBOARD */}
      <div className="grid grid-cols-3 gap-2 mb-8">
        <div className="bg-card border border-zinc-900 p-4 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-zinc-800"></div>
          <span className="text-[8px] text-zinc-500 font-black uppercase block mb-1">Ultima</span>
          <div className="text-xl font-black text-white leading-none">{stats.current || '--'} <span className="text-[10px] text-zinc-600 font-normal">kg</span></div>
        </div>
        <div className="bg-card border border-zinc-900 p-4 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary/20"></div>
          <span className="text-[8px] text-zinc-500 font-black uppercase block mb-1">Medie 7z</span>
          <div className="text-xl font-black text-white leading-none">{stats.avg7d || '--'} <span className="text-[10px] text-zinc-600 font-normal">kg</span></div>
        </div>
        <div className="bg-card border border-zinc-900 p-4 shadow-sm relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-1 h-full ${stats.diff7d < 0 ? 'bg-emerald-500' : stats.diff7d > 0 ? 'bg-red-500' : 'bg-zinc-800'}`}></div>
          <span className="text-[8px] text-zinc-500 font-black uppercase block mb-1">Trend</span>
          <div className={`flex items-center text-xl font-black leading-none ${stats.diff7d < 0 ? 'text-emerald-500' : stats.diff7d > 0 ? 'text-red-500' : 'text-zinc-500'}`}>
            {stats.diff7d < 0 ? <TrendingDown size={14} className="mr-1"/> : stats.diff7d > 0 ? <TrendingUp size={14} className="mr-1"/> : <Minus size={14} className="mr-1"/>}
            {Math.abs(stats.diff7d).toFixed(1)}
          </div>
        </div>
      </div>

      {/* 2. ADĂUGARE RAPIDĂ */}
      <section className="bg-surface border-2 border-zinc-900 p-6 mb-10 relative">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
            <Scale size={16} className="text-primary" /> 
            {editingDate ? `Editare: ${new Date(selectedDate).toLocaleDateString('ro-RO')}` : 'Înregistrare Nouă'}
          </h3>
          {!editingDate && selectedDate !== todayStr && (
            <button 
              onClick={() => setSelectedDate(todayStr)}
              className="text-[9px] font-black text-primary uppercase border-b border-primary/30"
            >
              Mergi la Azi
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="group">
            <label className="text-[9px] text-zinc-500 font-black uppercase mb-2 block tracking-widest group-focus-within:text-primary transition-colors">Calendar</label>
            <input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-black border border-zinc-800 text-white p-4 text-xs outline-none focus:border-primary font-mono transition-all"
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
              className="w-full bg-black border border-zinc-800 text-white p-4 text-xl font-black outline-none focus:border-primary transition-all placeholder:text-zinc-900"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="text-[9px] text-zinc-500 font-black uppercase mb-2 block tracking-widest">Note sau context (somn, sare, stres)</label>
          <input 
            type="text" 
            value={noteValue}
            onChange={(e) => setNoteValue(e.target.value)}
            placeholder="Ex: după antrenament, hidratat..."
            className="w-full bg-black border border-zinc-800 text-white p-4 text-xs outline-none focus:border-primary transition-all"
          />
        </div>

        <button 
          onClick={handleSave}
          disabled={!weightValue}
          className="w-full bg-primary text-black font-black py-5 uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-3 hover:bg-white transition-all disabled:opacity-20 active:scale-95 shadow-glow"
        >
          <Save size={18} /> {weightLogs[selectedDate] ? 'Actualizează Datele' : 'Salvează Azi'}
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

      {/* 3. ISTORIC LUNAR */}
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
          <Calendar size={14} className="text-zinc-600"/> Arhivă Date
        </h3>
        <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-900 px-2 py-1">
          <button onClick={() => changeMonth(-1)} className="p-2 text-zinc-600 hover:text-white transition-colors"><ChevronLeft size={16}/></button>
          <span className="text-[9px] font-black text-white uppercase min-w-[110px] text-center tracking-widest">
            {viewDate.toLocaleDateString('ro-RO', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={() => changeMonth(1)} className="p-2 text-zinc-600 hover:text-white transition-colors"><ChevronRight size={16}/></button>
        </div>
      </div>

      <div className="space-y-1">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-zinc-900 bg-zinc-950/30 text-zinc-700 text-[10px] font-mono uppercase tracking-[0.2em]">
            Lipsă date pentru perioada selectată
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <div 
              key={entry.date} 
              className={`bg-card border border-zinc-950 p-4 flex items-center justify-between group transition-all ${entry.date === todayStr ? 'border-primary/20' : ''}`}
            >
              <div className="flex items-center gap-5">
                <div className="text-center min-w-[36px] border-r border-zinc-900 pr-5">
                  <div className="text-[8px] font-mono text-zinc-600 uppercase">
                    {new Date(entry.date).toLocaleDateString('ro-RO', { weekday: 'short' })}
                  </div>
                  <div className={`text-sm font-black ${entry.date === todayStr ? 'text-primary' : 'text-zinc-300'}`}>
                    {entry.date.split('-')[2]}
                  </div>
                </div>
                <div>
                  <div className="text-base font-black text-white tracking-tight">
                    {entry.weight.toFixed(1)} <span className="text-[10px] text-zinc-600 font-normal">kg</span>
                  </div>
                  {entry.note && (
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 mt-1 max-w-[180px] truncate">
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

      {/* Snackbar-ul pentru Undo (Simulare) */}
      {showUndo && (
        <div className="fixed bottom-24 left-6 right-6 z-[60] bg-zinc-900 border border-zinc-800 p-4 shadow-2xl flex items-center justify-between animate-slide-up">
          <div className="flex items-center gap-3">
            <AlertCircle size={18} className="text-primary" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Înregistrare ștearsă</span>
          </div>
          <button 
            onClick={() => {
              saveWeight(showUndo.weight, showUndo.date);
              setShowUndo(null);
            }}
            className="text-[10px] font-black text-primary uppercase tracking-widest"
          >
            Anulează
          </button>
        </div>
      )}
    </div>
  );
};

export default WeightTracker;
