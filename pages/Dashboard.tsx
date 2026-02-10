
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { TRAINING_PROGRAM } from '../constants';
import { Play, ChevronRight, Clock, Dumbbell, Sparkles, Plus, Layers } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { draftSession, startSession, advancedMode, customPrograms } = useData();
  const navigate = useNavigate();
  const location = useLocation();

  // Tab State: 'standard' | 'custom'
  const [activeTab, setActiveTab] = useState<'standard' | 'custom'>('standard');

  // Check if we were redirected here with a request to open the custom tab
  useEffect(() => {
    if (location.state && location.state.tab === 'custom') {
        setActiveTab('custom');
    }
  }, [location]);

  const handleStart = (dayId: string) => {
    if (draftSession) {
      if (draftSession.dayId === dayId) {
        navigate(`/workout/${dayId}`);
      } else {
        alert("Ai deja o sesiune activă. Finalizeaz-o sau anuleaz-o pe cea curentă.");
        navigate(`/workout/${draftSession.dayId}`);
      }
    } else {
      startSession(dayId);
      navigate(`/workout/${dayId}`);
    }
  };

  const renderCard = (day: any, index: number, isCustom: boolean) => {
      const isDraftActive = draftSession && draftSession.dayId === day.id;
      const isOtherDraftActive = draftSession && draftSession.dayId !== day.id;

      return (
        <button
          key={day.id} 
          onClick={() => handleStart(day.id)}
          disabled={isOtherDraftActive}
          style={{ animationDelay: `${index * 75}ms` }}
          className={`w-full text-left relative group transition-all duration-300 animate-slide-up-fade opacity-0 fill-mode-forwards ${
              isDraftActive 
              ? 'scale-[1.02] z-10' 
              : isOtherDraftActive
                ? 'opacity-30 blur-[1px] cursor-not-allowed'
                : 'hover:-translate-y-1'
          }`}
        >
          {/* Card Container */}
          <div className={`h-full p-6 bg-card border ${isDraftActive ? 'border-primary shadow-glow' : 'border-zinc-800 hover:border-zinc-600'} flex flex-col justify-between relative overflow-hidden transition-colors duration-300`}>
            
            {/* Background Number */}
            <div className="absolute -right-2 -top-4 text-[80px] font-black text-white/0 stroke-text select-none opacity-[0.15] pointer-events-none font-heading transition-opacity duration-500 group-hover:opacity-[0.25]">
              {isCustom ? 'C' : `0${index + 1}`}
            </div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[9px] font-mono uppercase tracking-widest border px-2 py-1 bg-black ${isCustom ? 'text-emerald-500 border-emerald-900' : 'text-zinc-500 border-zinc-800'} transition-colors duration-300 group-hover:border-zinc-600`}>
                  {isCustom ? 'CUSTOM WORKOUT' : `Protocol 0${index + 1}`}
                </span>
                {!isDraftActive && <ChevronRight className="text-zinc-700 group-hover:text-primary transition-all duration-300 transform group-hover:translate-x-1" size={16} />}
              </div>

              <h3 className={`text-lg font-black uppercase tracking-wide mb-6 ${isDraftActive ? 'text-primary' : 'text-white'} transition-colors duration-300 group-hover:text-white`}>
                {day.name.includes(':') ? day.name.split(':')[1] : day.name}
              </h3>

              <div className="flex items-center space-x-6">
                 <div className="flex items-center text-zinc-500 group-hover:text-zinc-300 transition-colors duration-300">
                    <Dumbbell size={12} className="mr-2" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{day.exercises.length} EXERCISES</span>
                 </div>
                 {isCustom && (
                    <div className="flex items-center text-emerald-600">
                        <Sparkles size={12} />
                    </div>
                 )}
              </div>
            </div>

            {/* Progress Bar Line for aesthetics */}
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-zinc-900">
                <div className={`h-full w-0 group-hover:w-full transition-all duration-500 ease-out ${isCustom ? 'bg-emerald-500' : 'bg-primary'}`}></div>
            </div>
          </div>
        </button>
      );
  }

  return (
    <div className="animate-fade-in pb-10">
      <header className="mb-6 pt-4 border-l-4 border-primary pl-4 animate-slide-down">
        <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-1 font-heading leading-none">
          /// RDZ<br /><span className="text-primary">PROTOCOL</span>
        </h2>
        <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-[0.2em] mt-2">
          Select Day Sequence
          {advancedMode && <span className="ml-2 text-primary">● ADVANCED</span>}
        </p>
      </header>

      {/* Active Session Banner */}
      {draftSession && (
        <div className="mb-8 relative overflow-hidden group border border-primary/50 bg-primaryDim/5 animate-scale-in">
          <div className="absolute top-0 right-0 p-2 opacity-20">
             <div className="w-16 h-16 border-2 border-primary rounded-full animate-spin-slow"></div>
          </div>
          
          <div className="relative p-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                 <div className="w-2 h-2 bg-primary animate-pulse-fast"></div>
                 <h3 className="text-primary font-black text-[10px] uppercase tracking-[0.2em]">System Active</h3>
              </div>
              <p className="text-white font-bold text-xl uppercase tracking-tight">{draftSession.dayName}</p>
            </div>
            <button 
              onClick={() => navigate(`/workout/${draftSession.dayId}`)}
              className="w-full md:w-auto flex items-center justify-center space-x-3 bg-primary text-black px-8 py-4 font-black text-xs uppercase tracking-widest hover:bg-primaryHover transition-all shadow-glow active:scale-95"
            >
              <span>RESUME</span>
              <Play size={12} className="fill-black" />
            </button>
          </div>
        </div>
      )}

      {/* TABS SWITCHER */}
      <div className="flex p-1 bg-zinc-900/50 border border-zinc-800 mb-8 backdrop-blur-sm animate-fade-in">
          <button 
            onClick={() => setActiveTab('standard')}
            className={`flex-1 flex items-center justify-center py-3 text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === 'standard' ? 'bg-zinc-800 text-primary shadow-sm border border-zinc-700' : 'text-zinc-500 hover:text-white'}`}
          >
            <Layers size={12} className="mr-2" />
            Standard
          </button>
          <button 
            onClick={() => setActiveTab('custom')}
            className={`flex-1 flex items-center justify-center py-3 text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === 'custom' ? 'bg-zinc-800 text-emerald-400 shadow-sm border border-zinc-700' : 'text-zinc-500 hover:text-white'}`}
          >
            <Sparkles size={12} className="mr-2" />
            Custom
          </button>
      </div>

      {/* LIST CONTENT */}
      <div className="grid gap-4 animate-fade-in key={activeTab}">
        {activeTab === 'standard' ? (
             TRAINING_PROGRAM.map((day, index) => renderCard(day, index, false))
        ) : (
             <>
                {customPrograms.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed border-zinc-800 bg-zinc-900/20 animate-scale-in">
                        <Sparkles size={32} className="text-zinc-700 mx-auto mb-4" />
                        <h3 className="text-white font-bold uppercase tracking-wide mb-2">Niciun Program Custom</h3>
                        <p className="text-zinc-500 text-xs mb-6 max-w-[200px] mx-auto font-mono">Creează-ți propriul program adaptat nevoilor tale.</p>
                        <button 
                            onClick={() => navigate('/settings/program-editor')}
                            className="bg-zinc-800 text-white border border-zinc-700 px-6 py-3 text-xs font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-all active:scale-95"
                        >
                            + Creează Acum
                        </button>
                    </div>
                ) : (
                    <>
                        {customPrograms.map((day, index) => renderCard(day, index, true))}
                        
                        <button 
                            onClick={() => navigate('/settings/program-editor')}
                            className="w-full mt-4 py-4 border border-zinc-800 bg-black text-zinc-500 hover:text-white hover:border-zinc-600 transition-all text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 group active:scale-[0.99] animate-fade-in"
                        >
                            <Plus size={14} className="group-hover:rotate-90 transition-transform duration-300" />
                            Program Nou
                        </button>
                    </>
                )}
             </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
