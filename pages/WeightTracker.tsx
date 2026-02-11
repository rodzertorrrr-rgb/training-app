
import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { WeightEntry } from '../types';
import { Plus, Trash2, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Scale, TrendingDown, TrendingUp, Minus, MessageSquare } from 'lucide-react';

const WeightTracker: React.FC = () => {
  const { weightLogs, saveWeight, deleteWeight, getWeightStats } = useData();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [weightInput, setWeightInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [currentViewDate, setCurrentViewDate] = useState(new Date());

  const stats = getWeightStats();

  const handleSave = () => {
    const w = parseFloat(weightInput);
    if (isNaN(w) || w <= 0) return;
    saveWeight({ date: selectedDate, weight: w, note: noteInput });
    setWeightInput('');
    setNoteInput('');
  };

  const currentMonthEntries = useMemo(() => {
    const monthStr = currentViewDate.toISOString().slice(0, 7); // "YYYY-MM"
    return Object.values(weightLogs)
      .filter(entry => entry.date.startsWith(monthStr))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [weightLogs, currentViewDate]);

  const changeMonth = (offset: number) => {
    const d = new Date(currentViewDate);
    d.setMonth(d.getMonth() + offset);
    setCurrentViewDate(d);
  };

  const monthName = currentViewDate.toLocaleString('ro-RO', { month: 'long', year: 'numeric' });

  return (
    <div className="pb-12 animate-fade-in">
      <header className="mb-8 border-l-4 border-primary pl-4">
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">Body<br/><span className="text-primary">Composition</span></h2>
        <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest mt-2">Monitorizare greutate & trend</p>
      </header>

      {/* Summary Section */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-card border border-zinc-800 p-4 flex flex-col items-center">
            <span className="text-[8px] text-zinc-500 font-black uppercase mb-1">Azi</span>
            <span className="text-lg font-black text-white">{stats.current > 0 ? stats.current.toFixed(1) : '--'} <span className="text-[10px] text-zinc-600">KG</span></span>
        </div>
        <div className="bg-card border border-zinc-800 p-4 flex flex-col items-center">
            <span className="text-[8px] text-zinc-500 font-black uppercase mb-1">Medie 7z</span>
            <span className="text-lg font-black text-white">{stats.avg7d > 0 ? stats.avg7d.toFixed(1) : '--'} <span className="text-[10px] text-zinc-600">KG</span></span>
        </div>
        <div className={`bg-card border ${stats.diff7d < 0 ? 'border-emerald-900/50' : stats.diff7d > 0 ? 'border-red-900/50' : 'border-zinc-800'} p-4 flex flex-col items-center`}>
            <span className="text-[8px] text-zinc-500 font-black uppercase mb-1">Trend</span>
            <div className={`flex items-center text-lg font-black ${stats.diff7d < 0 ? 'text-emerald-500' : stats.diff7d > 0 ? 'text-red-500' : 'text-zinc-500'}`}>
                {stats.diff7d !== 0 ? (stats.diff7d < 0 ? <TrendingDown size={14} className="mr-1"/> : <TrendingUp size={14} className="mr-1"/>) : <Minus size={14} className="mr-1" />}
                {Math.abs(stats.diff7d).toFixed(2)}
            </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-surface border-2 border-zinc-900 p-6 mb-10">
        <div className="flex gap-4 mb-4">
            <div className="flex-1">
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Dată</label>
                <input 
                    type="date" 
                    value={selectedDate} 
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-black border border-zinc-800 text-white p-3 text-sm outline-none focus:border-primary"
                />
            </div>
            <div className="flex-1">
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Greutate (kg)</label>
                <input 
                    type="number" 
                    step="0.1"
                    placeholder="0.0"
                    value={weightInput} 
                    onChange={(e) => setWeightInput(e.target.value)}
                    className="w-full bg-black border border-zinc-800 text-white p-3 text-sm font-black outline-none focus:border-primary"
                />
            </div>
        </div>
        <div className="mb-4">
             <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Notiță (opțional)</label>
             <input 
                type="text" 
                placeholder="Ex: după masă, retenție..."
                value={noteInput} 
                onChange={(e) => setNoteInput(e.target.value)}
                className="w-full bg-black border border-zinc-800 text-white p-3 text-sm outline-none focus:border-primary"
            />
        </div>
        <button 
            onClick={handleSave}
            disabled={!weightInput}
            className="w-full bg-primary text-black font-black py-4 uppercase tracking-widest text-xs disabled:opacity-50 transition-all active:scale-[0.98] shadow-glow"
        >
            Înregistrează
        </button>
      </div>

      {/* History Section */}
      <div className="flex items-center justify-between mb-4 px-2">
          <button onClick={() => changeMonth(-1)} className="p-2 text-zinc-500 hover:text-white"><ChevronLeft size={20}/></button>
          <span className="text-xs font-black text-white uppercase tracking-[0.2em]">{monthName}</span>
          <button onClick={() => changeMonth(1)} className="p-2 text-zinc-500 hover:text-white"><ChevronRight size={20}/></button>
      </div>

      <div className="space-y-2">
          {currentMonthEntries.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-zinc-800 opacity-30">
                  <span className="text-[10px] font-mono uppercase">Nicio intrare în această lună</span>
              </div>
          ) : (
              currentMonthEntries.map(entry => (
                  <div key={entry.date} className="bg-card border border-zinc-900 p-4 flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                          <div className="flex flex-col">
                              <span className="text-[10px] font-mono text-zinc-500 uppercase">{new Date(entry.date).toLocaleDateString('ro-RO', { weekday: 'short', day: '2-digit' })}</span>
                              <span className="text-sm font-black text-white">{entry.weight.toFixed(1)} <span className="text-[10px] text-zinc-600">KG</span></span>
                          </div>
                          {entry.note && (
                              <div className="flex items-center text-zinc-600 gap-1 italic text-[10px]">
                                  <MessageSquare size={10} />
                                  <span className="truncate max-w-[150px]">{entry.note}</span>
                              </div>
                          )}
                      </div>
                      <button 
                        onClick={() => deleteWeight(entry.date)}
                        className="text-zinc-800 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                          <Trash2 size={14} />
                      </button>
                  </div>
              ))
          )}
      </div>
    </div>
  );
};

export default WeightTracker;
