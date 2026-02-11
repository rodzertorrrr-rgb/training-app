
import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Scale, TrendingDown, TrendingUp, Minus, ChevronLeft, ChevronRight, Trash2, Calendar, MessageSquare, Save, Edit2 } from 'lucide-react';

const WeightTracker: React.FC = () => {
  const { weightLogs, saveWeight, deleteWeight, getWeightStats } = useData();
  
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [weightValue, setWeightValue] = useState('');
  const [noteValue, setNoteValue] = useState('');
  const [editingDate, setEditingDate] = useState<string | null>(null);
  
  // Navigare pentru istoric (an/lună)
  const [viewDate, setViewDate] = useState(new Date());

  const stats = useMemo(() => getWeightStats(), [weightLogs]);

  const handleSave = () => {
    const val = parseFloat(weightValue);
    if (isNaN(val) || val <= 0) return;
    saveWeight(val, selectedDate, noteValue);
    
    // Reset form
    setWeightValue('');
    setNoteValue('');
    setEditingDate(null);
    setSelectedDate(todayStr);
  };

  const handleEdit = (entry: any) => {
    setSelectedDate(entry.date);
    setWeightValue(entry.weight.toString());
    setNoteValue(entry.note || '');
    setEditingDate(entry.date);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  return (
    <div className="animate-fade-in pb-20">
      <header className="mb-8 border-l-4 border-primary pl-4">
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">Status<br/><span className="text-primary">Greutate</span></h2>
        <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest mt-2">Monitorizare & Analiză Trend</p>
      </header>

      {/* 1. REZUMAT STATISTICI */}
      <div className="grid grid-cols-3 gap-2 mb-8">
        <div className="bg-card border border-zinc-900 p-3">
          <span className="text-[8px] text-zinc-500 font-black uppercase block mb-1">Curentă</span>
          <div className="text-lg font-black text-white leading-none">{stats.current || '--'} <span className="text-[10px] text-zinc-600 font-normal">kg</span></div>
        </div>
        <div className="bg-card border border-zinc-900 p-3">
          <span className="text-[8px] text-zinc-500 font-black uppercase block mb-1">Medie 7z</span>
          <div className="text-lg font-black text-white leading-none">{stats.avg7d || '--'} <span className="text-[10px] text-zinc-600 font-normal">kg</span></div>
        </div>
        <div className="bg-card border border-zinc-900 p-3">
          <span className="text-[8px] text-zinc-500 font-black uppercase block mb-1">Trend 7z</span>
          <div className={`flex items-center text-lg font-black leading-none ${stats.diff7d < 0 ? 'text-emerald-500' : stats.diff7d > 0 ? 'text-red-500' : 'text-zinc-600'}`}>
            {stats.diff7d < 0 ? <TrendingDown size={14} className="mr-1"/> : stats.diff7d > 0 ? <TrendingUp size={14} className="mr-1"/> : <Minus size={14} className="mr-1"/>}
            {Math.abs(stats.diff7d).toFixed(1)}
          </div>
        </div>
      </div>

      {/* 2. ADĂUGARE / EDITARE */}
      <div className="bg-surface border border-zinc-800 p-6 mb-10 relative overflow-hidden shadow-glow">
        {editingDate && (
          <div className="absolute top-0 left-0 bg-primary text-black px-3 py-1 text-[8px] font-black uppercase tracking-widest">Mod Editare</div>
        )}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-[9px] text-zinc-500 font-black uppercase mb-1 block">Dată</label>
            <input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-black border border-zinc-800 text-white p-3 text-xs outline-none focus:border-primary font-mono"
            />
          </div>
          <div>
            <label className="text-[9px] text-zinc-500 font-black uppercase mb-1 block">KG</label>
            <input 
              type="number" 
              step="0.1"
              value={weightValue}
              onChange={(e) => setWeightValue(e.target.value)}
              placeholder="00.0"
              className="w-full bg-black border border-zinc-800 text-white p-3 text-lg font-black outline-none focus:border-primary"
            />
          </div>
        </div>
        <div className="mb-6">
          <label className="text-[9px] text-zinc-500 font-black uppercase mb-1 block">Notă (opțional)</label>
          <input 
            type="text" 
            value={noteValue}
            onChange={(e) => setNoteValue(e.target.value)}
            placeholder="Ex: după cheat meal..."
            className="w-full bg-black border border-zinc-800 text-white p-3 text-xs outline-none focus:border-primary"
          />
        </div>
        <button 
          onClick={handleSave}
          disabled={!weightValue}
          className="w-full bg-primary text-black font-black py-4 uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 hover:bg-white transition-all disabled:opacity-20 active:scale-95"
        >
          <Save size={16} /> {editingDate ? 'Actualizează' : 'Salvează Azi'}
        </button>
        {editingDate && (
          <button 
            onClick={() => { setEditingDate(null); setWeightValue(''); setNoteValue(''); setSelectedDate(todayStr); }}
            className="w-full mt-2 text-zinc-500 text-[10px] font-black uppercase py-2"
          >
            Anulează
          </button>
        )}
      </div>

      {/* 3. ISTORIC FILTRABIL */}
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
          <Calendar size={14} className="text-primary"/> Istoric
        </h3>
        <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-900 px-2 py-1">
          <button onClick={() => changeMonth(-1)} className="p-1 text-zinc-600 hover:text-white"><ChevronLeft size={16}/></button>
          <span className="text-[9px] font-black text-white uppercase min-w-[100px] text-center">
            {viewDate.toLocaleDateString('ro-RO', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={() => changeMonth(1)} className="p-1 text-zinc-600 hover:text-white"><ChevronRight size={16}/></button>
        </div>
      </div>

      <div className="space-y-1">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-zinc-900 text-zinc-700 text-[10px] font-mono uppercase">
            Nicio înregistrare în această lună
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <div key={entry.date} className="bg-card border border-zinc-950 p-4 flex items-center justify-between group animate-slide-up-fade">
              <div className="flex items-center gap-4">
                <div className="text-center min-w-[32px] border-r border-zinc-900 pr-4">
                  <div className="text-[8px] font-mono text-zinc-600 uppercase">
                    {new Date(entry.date).toLocaleDateString('ro-RO', { weekday: 'short' })}
                  </div>
                  <div className="text-sm font-black text-white">{entry.date.split('-')[2]}</div>
                </div>
                <div>
                  <div className="text-sm font-black text-white">{entry.weight.toFixed(1)} <span className="text-[10px] text-zinc-600">kg</span></div>
                  {entry.note && (
                    <div className="flex items-center gap-1 text-[9px] text-zinc-500 mt-0.5 truncate max-w-[150px]">
                      <MessageSquare size={10}/> {entry.note}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEdit(entry)}
                  className="p-2 text-zinc-600 hover:text-primary transition-colors"
                >
                  <Edit2 size={14}/>
                </button>
                <button 
                  onClick={() => { if(confirm('Ștergi definitiv?')) deleteWeight(entry.date) }}
                  className="p-2 text-zinc-800 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={14}/>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WeightTracker;
