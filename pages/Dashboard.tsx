
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext.tsx';
import { TRAINING_PROGRAM } from '../constants.ts';
import { 
  Play, 
  ChevronRight, 
  Trophy, 
  Dumbbell,
  Target,
  Zap,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { draftSession, startSession, customPrograms, sessions } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'standard' | 'custom'>('standard');

  const handleStart = (dayId: string) => {
    if (draftSession) {
      navigate(`/workout/${draftSession.dayId}`);
    } else {
      startSession(dayId);
      navigate(`/workout/${dayId}`);
    }
  };

  const renderCard = (day: any, isCustom: boolean) => {
    const isDraft = draftSession && draftSession.dayId === day.id;
    return (
      <button
        key={day.id} 
        onClick={() => handleStart(day.id)}
        className={`w-full text-left p-5 rounded-2xl border transition-all flex items-center justify-between ${
          isDraft ? 'bg-primary/5 border-primary/40' : 'bg-surface border-zinc-800 hover:border-zinc-700'
        }`}
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDraft ? 'bg-primary text-black' : 'bg-zinc-900 text-primary'}`}>
            <Dumbbell size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-tight">{day.name}</h3>
            <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">{day.exercises.length} Exerciții</p>
          </div>
        </div>
        <ChevronRight size={18} className={isDraft ? 'text-primary' : 'text-zinc-600'} />
      </button>
    );
  };

  return (
    <div className="animate-fade-in space-y-8">
      <header className="flex items-center justify-between pt-2">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">Salut, {user?.name.split(' ')[0]}</h2>
          <p className="text-zinc-500 text-xs font-medium">Ești gata pentru progres?</p>
        </div>
        <button onClick={() => navigate('/achievements')} className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-primary">
           <Award size={20} />
        </button>
      </header>

      {draftSession && (
        <div 
          onClick={() => navigate(`/workout/${draftSession.dayId}`)}
          className="bg-primary p-6 rounded-2xl flex items-center justify-between cursor-pointer shadow-lg active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-black/10 rounded-full flex items-center justify-center">
              <Play size={18} className="text-black fill-current" />
            </div>
            <div>
              <p className="text-[10px] font-black text-black/60 uppercase tracking-widest">Antrenament în curs</p>
              <h3 className="text-lg font-black text-black uppercase tracking-tight">{draftSession.dayName}</h3>
            </div>
          </div>
          <ChevronRight size={24} className="text-black" />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface border border-zinc-800 p-5 rounded-2xl flex flex-col gap-2">
          <Trophy size={18} className="text-emerald-500" />
          <span className="text-2xl font-black text-white">{sessions.length}</span>
          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Sesiuni Totale</span>
        </div>
        <div className="bg-surface border border-zinc-800 p-5 rounded-2xl flex flex-col gap-2">
          <Target size={18} className="text-primary" />
          <span className="text-2xl font-black text-white">Elite</span>
          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Rating Atlet</span>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex gap-2 p-1 bg-zinc-900 rounded-xl">
           <button 
             onClick={() => setActiveTab('standard')} 
             className={`flex-1 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'standard' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500'}`}
           >
             Standard
           </button>
           <button 
             onClick={() => setActiveTab('custom')} 
             className={`flex-1 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'custom' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500'}`}
           >
             Personalizat
           </button>
        </div>

        <div className="space-y-3">
           {activeTab === 'standard' ? TRAINING_PROGRAM.map(day => renderCard(day, false)) : (
              <>
                {customPrograms.length === 0 ? (
                  <div className="py-12 text-center border border-dashed border-zinc-800 rounded-2xl">
                    <p className="text-zinc-600 text-xs font-medium mb-4">Niciun protocol personalizat</p>
                    <button onClick={() => navigate('/settings/program-editor')} className="text-primary font-bold text-[10px] uppercase tracking-widest border border-primary/20 px-4 py-2 rounded-lg">Creează</button>
                  </div>
                ) : customPrograms.map(day => renderCard(day, true))}
              </>
           )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
