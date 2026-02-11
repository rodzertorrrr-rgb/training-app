
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { TRAINING_PROGRAM } from '../constants';
import { ChevronRight, Dumbbell, Sparkles, Layers, ChevronDown, Target, Zap } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { draftSession, startSession, customPrograms } = useData();
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'standard' | 'custom'>('standard');

  const handleStart = (dayId: string) => {
    if (draftSession) {
      navigate(`/workout/${draftSession.dayId}`);
    } else {
      startSession(dayId);
      navigate(`/workout/${dayId}`);
    }
  };

  const renderCard = (day: any, index: number, isCustom: boolean) => {
    const isDraft = draftSession && draftSession.dayId === day.id;
    return (
      <button
        key={day.id} 
        onClick={() => handleStart(day.id)}
        className={`w-full text-left p-5 bg-card border transition-all duration-300 animate-slide-up-fade opacity-0 fill-mode-forwards ${
          isDraft ? 'border-primary shadow-glow scale-[1.01]' : 'border-zinc-800 hover:border-zinc-600'
        }`}
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <div className="flex justify-between items-start mb-3">
          <span className={`text-[8px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 border ${isCustom ? 'text-emerald-500 border-emerald-900' : 'text-zinc-500 border-zinc-800'}`}>
            {isCustom ? 'CUSTOM WORKOUT' : `PROTOCOL 0${index + 1}`}
          </span>
          <ChevronRight size={14} className="text-zinc-700" />
        </div>
        <h3 className={`text-base font-black uppercase tracking-tight mb-4 ${isDraft ? 'text-primary' : 'text-white'}`}>
          {day.name.includes(':') ? day.name.split(':')[1] : day.name}
        </h3>
        <div className="flex items-center text-zinc-500 text-[9px] font-bold uppercase tracking-widest">
          <Dumbbell size={10} className="mr-1.5" /> {day.exercises.length} EXERCIȚII
        </div>
      </button>
    );
  };

  return (
    <div className="animate-fade-in pb-12">
      <header className="mb-6 pt-4 border-l-4 border-primary pl-4">
        <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none mb-1 font-heading">
          /// RDZ<br /><span className="text-primary">PROTOCOL</span>
        </h2>
        
        <button 
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          className="flex items-center gap-2 mt-4 py-2.5 px-4 bg-zinc-900/50 border border-zinc-800 text-zinc-400 hover:text-primary transition-all active:scale-95"
        >
          <div className={`transition-transform duration-300 ${isDrawerOpen ? 'rotate-180 text-primary' : ''}`}>
            <ChevronDown size={14} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] font-mono">
            {isDrawerOpen ? 'ÎNCHIDE SELECTORUL' : 'ALEGE ANTRENAMENTUL'}
          </span>
        </button>
      </header>

      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isDrawerOpen ? 'max-h-[1000px] opacity-100 mb-10' : 'max-h-0 opacity-0 pointer-events-none'}`}>
        <div className="flex p-1 bg-zinc-950 border border-zinc-900 mb-6">
          <button onClick={() => setActiveTab('standard')} className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'standard' ? 'bg-primary text-black' : 'text-zinc-500'}`}>
            <Layers size={12} className="inline mr-2" /> STANDARD
          </button>
          <button onClick={() => setActiveTab('custom')} className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'custom' ? 'bg-emerald-500 text-black' : 'text-zinc-500'}`}>
            <Sparkles size={12} className="inline mr-2" /> PERSONALIZAT
          </button>
        </div>

        <div className="space-y-3">
          {activeTab === 'standard' ? TRAINING_PROGRAM.map((day, i) => renderCard(day, i, false)) : (
            <>
              {customPrograms.map((day, i) => renderCard(day, i, true))}
              <button onClick={() => navigate('/settings/program-editor')} className="w-full py-4 border border-dashed border-zinc-800 text-zinc-600 text-[10px] font-black uppercase hover:text-white transition-all">+ ADAUGĂ PROTOCOL NOU</button>
            </>
          )}
        </div>
      </div>

      {!isDrawerOpen && draftSession && (
        <div className="bg-primaryDim border border-primary/30 p-5 flex justify-between items-center animate-scale-in">
          <div>
            <div className="flex items-center gap-2 text-[8px] font-black text-primary uppercase tracking-widest mb-1">
              <Zap size={10} className="animate-pulse" /> SESIUNE ACTIVĂ
            </div>
            <p className="text-white font-black uppercase text-lg leading-tight">{draftSession.dayName}</p>
          </div>
          <button onClick={() => navigate(`/workout/${draftSession.dayId}`)} className="bg-primary text-black px-6 py-3 text-[10px] font-black uppercase tracking-widest shadow-glow">REIA</button>
        </div>
      )}

      {!isDrawerOpen && !draftSession && (
        <div className="text-center py-20 opacity-30 border border-dashed border-zinc-900">
          <Dumbbell size={32} className="mx-auto mb-4 text-zinc-700" />
          <p className="text-[10px] font-mono uppercase tracking-[0.4em]">Ready for execution</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
