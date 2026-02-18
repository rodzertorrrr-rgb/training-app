import React, { useState } from 'react';
import { useData } from '../context/DataContext.tsx';
import { Trash2, CheckCircle2, ChevronRight, History as HistoryIcon, AlertTriangle, Zap, Layers, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const History: React.FC = () => {
  const { sessions, deleteSession } = useData();
  const navigate = useNavigate();
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSessionToDelete(id);
  };

  const confirmDelete = () => {
    if (sessionToDelete) {
      deleteSession(sessionToDelete);
      setSessionToDelete(null);
    }
  };

  const calculateSessionVolume = (session: any) => {
    return session.exercises.reduce((total: number, ex: any) => {
      return total + ex.sets.reduce((setTotal: number, s: any) => {
        return setTotal + (Number(s.weight) || 0) * (Number(s.reps) || 0);
      }, 0);
    }, 0);
  };

  const calculateImpactUnits = (session: any) => {
    return session.exercises.reduce((total: number, ex: any) => {
      return total + ex.sets.filter((s: any) => s.type !== 'RAMP_UP' && s.isCompleted).length;
    }, 0);
  };

  if (sessions.length === 0) {
    return (
      <div className="text-center py-32 animate-fade-in px-8">
        <div className="border-2 border-dashed border-zinc-900 w-20 h-20 flex items-center justify-center mx-auto mb-8 rounded-full">
            <HistoryIcon className="text-zinc-800" size={32} />
        </div>
        <h3 className="text-xl font-black text-white mb-2 uppercase tracking-widest">ISTORIC GOL</h3>
        <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">Începe o sesiune de antrenament pentru a popula acest registru de performanță.</p>
      </div>
    );
  }

  return (
    <div className="pb-32 animate-fade-in">
      <header className="mb-12 flex items-start gap-5">
          <div className="w-[6px] h-12 bg-primary shadow-gold-glow"></div>
          <div>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">REGISTRU</h2>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">ISTORIC PERFORMANȚĂ</p>
          </div>
      </header>
      
      <div className="space-y-6">
        {sessions.map((session, index) => (
          <div 
            key={session.id} 
            onClick={() => navigate(`/history/${session.id}`)}
            style={{ animationDelay: `${index * 50}ms` }}
            className="group relative bg-card border border-white/5 rounded-3xl transition-all duration-300 cursor-pointer animate-slide-up shadow-premium overflow-hidden hover:border-primary/20"
          >
            <div className="p-6 pb-4 flex justify-between items-start">
              <div className="flex-1 pr-12">
                <div className="flex items-center gap-3 mb-3">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-primary/20">
                        {new Date(session.completedAt!).toLocaleDateString('ro-RO')}
                    </span>
                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                       {session.exercises.length} EXERCIȚII
                    </span>
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-primary transition-colors">
                    {session.dayName.split(':')[0]}
                </h3>
                <p className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.2em] mt-1">
                    {session.dayName.split(':')[1] || 'Protocol Standard'}
                </p>
              </div>
              <button 
                onClick={(e) => handleDelete(e, session.id)}
                className="w-12 h-12 flex items-center justify-center bg-zinc-900 border border-white/5 text-zinc-700 hover:text-red-500 hover:bg-red-500/10 transition-all rounded-2xl"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 border-t border-white/5 bg-zinc-950/30">
               <div className="p-5 flex flex-col gap-1 border-r border-white/5">
                  <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Seturi Hipertrofice</span>
                  <div className="flex items-center gap-2">
                    <Zap size={14} className="text-primary"/>
                    <span className="text-lg font-black text-white leading-none">{calculateImpactUnits(session)}</span>
                  </div>
               </div>
               <div className="p-5 flex flex-col gap-1">
                  <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Volum Total</span>
                  <div className="flex items-center gap-2">
                    <Layers size={14} className="text-primary"/>
                    <span className="text-lg font-black text-white leading-none">{calculateSessionVolume(session).toLocaleString()} <span className="text-[10px] font-normal text-zinc-700 ml-1">KG</span></span>
                  </div>
               </div>
            </div>
            
            <div className="px-6 py-4 bg-primary/5 flex justify-between items-center group-hover:bg-primary transition-all">
                 <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary group-hover:text-black">
                    <Share2 size={16} /> SHARE STORY
                 </div>
                 <ChevronRight size={18} className="text-primary group-hover:text-black transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        ))}
      </div>

      {sessionToDelete && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md animate-fade-in" onClick={() => setSessionToDelete(null)}>
            <div className="bg-card border-2 border-red-900/50 p-10 rounded-[2.5rem] w-full max-w-sm text-center shadow-2xl animate-scale-up" onClick={e => e.stopPropagation()}>
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 text-red-500 border border-red-500/20">
                     <AlertTriangle size={36} />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-4">Elimini Sesiunea?</h3>
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setSessionToDelete(null)} className="bg-zinc-900 border border-white/5 text-zinc-400 font-black py-5 rounded-2xl uppercase tracking-widest text-[10px]">Nu</button>
                    <button onClick={confirmDelete} className="bg-red-600 text-white font-black py-5 rounded-2xl uppercase tracking-widest text-[10px] shadow-lg shadow-red-500/20">Da, Șterge</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default History;
