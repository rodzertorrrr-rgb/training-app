
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { TRAINING_PROGRAM } from '../constants';
import { Play, ChevronRight, Dumbbell, Sparkles, Plus, Layers, ChevronDown, Target } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { draftSession, startSession, customPrograms } = useData();
  const navigate = useNavigate();
  const location = useLocation();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'standard' | 'custom'>('standard');

  useEffect(() => {
    if (location.state && location.state.tab === 'custom') {
        setActiveTab('custom');
        setIsDrawerOpen(true);
    }
  }, [location]);

  const handleStart = (dayId: string) => {
    if (draftSession) {
      if (draftSession.dayId === dayId) {
        navigate(`/workout/${dayId}`);
      } else {
        alert("Ai deja o sesiune activă.");
        navigate(`/workout/${draftSession.dayId}`);
      }
    } else {
      startSession(dayId);
      navigate(`/workout/${dayId}`);
    }
  };

  const renderCard = (day: any, index: number, isCustom: boolean) => {
      const isDraftActive = draftSession && draftSession.dayId === day.id;
      return (
        <button
          key={day.id} 
          onClick={() => handleStart(day.id)}
          style={{ animationDelay: `${index * 50}ms` }}
          className={`w-full text-left relative group transition-all duration-300 animate-slide-up-fade opacity-0 fill-mode-forwards ${
              isDraftActive ? 'scale-[1.01] z-10' : 'hover:-translate-y-1'
          }`}
        >
          <div className={`h-full p-5 bg-card border ${isDraftActive ? 'border-primary shadow-glow' : 'border-zinc-800 hover:border-zinc-600'} flex flex-col justify-between relative overflow-hidden transition-all duration-300`}>
            <div className="absolute -right-2 -top-4 text-[70px] font-black text-white/0 stroke-text select-none opacity-[0.1] pointer-events-none font-heading transition-opacity duration-500 group-hover:opacity-[0.15]">
              {isCustom ? 'C' : `0${index + 1}`}
            </div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-3">
                <span className={`text-[8px] font-mono uppercase tracking-[0.2em] border px-2 py-0.5 bg-black ${isCustom ? 'text-emerald-500 border-emerald-900' : 'text-zinc-500 border-zinc-800'}`}>
                  {isCustom ? 'CUSTOM WORKOUT' : `PROTOCOL 0${index + 1}`}
                </span>
                {!isDraftActive && <ChevronRight className="text-zinc-700 group-hover:text-primary transition-all duration-300" size={14} />}
              </div>
              <h3 className={`text-base font-black uppercase tracking-tight mb-4 ${isDraftActive ? 'text-primary' : 'text-white'} group-hover:text-white`}>
                {day.name.includes(':') ? day.name.split(':')[1] : day.name}
              </h3>
              <div className="flex items-center space-x-4">
                 <div className="flex items-center text-zinc-500 text-[9px] font-bold uppercase tracking-widest">
                    <Dumbbell size={10} className="mr-1.5" />
                    {day.exercises.length} EXERCIȚII
                 </div>
              </div>
            </div>
          </div>
        </button>
      );
  }

  return (
    <div className="animate-fade-in pb-10">
      <header className="mb-4 pt-4 relative">
        <div className="flex flex-col border-l-4 border-primary pl-4">
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none mb-1 font-heading">
            /// RDZ<br /><span className="text-primary">PROTOCOL</span>
          </h2>
          
          <button 
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className="flex items-center gap-2 mt-4 py-2 text-zinc-500 hover:text-primary transition-all duration-300 active:scale-95 group w-fit"
          >
            <div className={`p-1 border border-zinc-800 bg-zinc-900/50 group-hover:border-primary/50 transition-all ${isDrawerOpen ? 'rotate-180 bg-primary/10 border-primary/30' : ''}`}>
              <ChevronDown size={14} className={isDrawerOpen ? 'text-primary' : ''} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] font-mono">
              {isDrawerOpen ? 'Închide' : 'Alege Antrenamentul'}
            </span>
          </button>
        </div>

        {/* Action Drawer Logic */}
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isDrawerOpen ? 'max-h-[500px] mt-6 opacity-100 mb-8' : 'max-h-0 opacity-0 pointer-events-none'}`}>
           <div className="flex p-1 bg-zinc-950/80 border border-zinc-900 backdrop-blur-md shadow-2xl mb-4">
              <button 
                onClick={() => setActiveTab('standard')}
                className={`flex-1 flex items-center justify-center py-3 text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === 'standard' ? 'bg-primary text-black' : 'text-zinc-500 hover:text-white hover:bg-zinc-900'}`}
              >
                <Layers size={12} className="mr-2" />
                Standard
              </button>
              <button 
                onClick={() => setActiveTab('custom')}
                className={`flex-1 flex items-center justify-center py-3 text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === 'custom' ? 'bg-emerald-500 text-black' : 'text-zinc-500 hover:text-white hover:bg-zinc-900'}`}
              >
                <Sparkles size={12} className="mr-2" />
                Personalizat
              </button>
           </div>
           
           <div className="space-y-3">
              {activeTab === 'standard' ? (
                TRAINING_PROGRAM.map((day, index) => renderCard(day, index, false))
              ) : (
                <>
                  {customPrograms.map((day, index) => renderCard(day, index, true))}
                  <button 
                    onClick={() => navigate('/settings/program-editor')}
                    className="w-full py-4 border border-zinc-800 bg-black text-zinc-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    <Plus size={14} /> Crează Program Nou
                  </button>
                </>
              )}
           </div>
        </div>
      </header>

      {draftSession && !isDrawerOpen && (
        <div className="mb-8 border border-primary/50 bg-primaryDim/5 animate-scale-in p-5 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-10"><Target size={64} className="text-primary" /></div>
          <div className="text-center md:text-left relative z-10">
            <h3 className="text-primary font-black text-[9px] uppercase tracking-[0.2em] mb-1">Sesiune activă</h3>
            <p className="text-white font-bold text-lg uppercase tracking-tight">{draftSession.dayName}</p>
          </div>
          <button 
            onClick={() => navigate(`/workout/${draftSession.dayId}`)}
            className="w-full md:w-auto bg-primary text-black px-6 py-3.5 font-black text-[10px] uppercase tracking-widest hover:bg-primaryHover transition-all active:scale-95 shadow-glow"
          >
            REIA ANTRENAMENTUL
          </button>
        </div>
      )}

      {!isDrawerOpen && (
          <div className="mt-12 opacity-50 text-center py-10 border border-zinc-900">
              <Dumbbell className="mx-auto mb-4 text-zinc-800" size={32} />
              <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Sistem pregătit. Alege un protocol.</p>
          </div>
      )}
    </div>
  );
};

export default Dashboard;
