
import React from 'react';
import { useData } from '../context/DataContext';
import { Trash2, Calendar, CheckCircle2, History as HistoryIcon, ArrowUpRight, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const History: React.FC = () => {
  const { sessions, deleteSession } = useData();
  const navigate = useNavigate();

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent navigation when clicking delete
    if (window.confirm("Ești sigur că vrei să ștergi această sesiune? Istoricul de progres va fi recalculat.")) {
      deleteSession(id);
    }
  };

  if (sessions.length === 0) {
    return (
      <div className="text-center py-32 opacity-50 animate-fade-in">
        <div className="border border-zinc-800 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-6">
            <HistoryIcon className="text-zinc-600" size={24} />
        </div>
        <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-widest">Istoric Gol</h3>
        <p className="text-zinc-500 text-xs font-mono">Completează primul antrenament.</p>
      </div>
    );
  }

  return (
    <div className="pb-10 animate-fade-in">
      <header className="mb-8 pl-4 border-l-4 border-primary animate-slide-down">
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">Istoric</h2>
          <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest mt-1">Sesiuni finalizate</p>
      </header>
      
      <div className="space-y-4">
        {sessions.map((session, index) => (
          <div 
            key={session.id} 
            onClick={() => navigate(`/history/${session.id}`)}
            style={{ animationDelay: `${index * 50}ms` }}
            className="group relative bg-card border border-zinc-800 p-6 hover:border-primary/50 transition-all duration-300 cursor-pointer active:scale-[0.99] animate-slide-up-fade opacity-0 fill-mode-forwards"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-6 pb-4 border-b border-zinc-900">
              <div>
                <div className="flex items-center text-primary mb-2">
                    <Calendar size={12} className="mr-2" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{new Date(session.completedAt!).toLocaleDateString('ro-RO')}</span>
                </div>
                <h3 className="text-xl font-bold text-white leading-none uppercase">{session.dayName.split(':')[0]}</h3>
                <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-wider">{session.dayName.split(':')[1]}</p>
              </div>
              <button 
                onClick={(e) => handleDelete(e, session.id)}
                className="w-8 h-8 flex items-center justify-center text-zinc-700 hover:text-red-500 hover:bg-red-500/10 transition-colors rounded-sm active:scale-90"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Quick Summary Preview */}
            <div className="space-y-2 mb-4">
              {session.exercises.slice(0, 3).map((ex) => {
                const topSet = ex.sets.find(s => s.type === 'TOP_SET');
                if (!topSet) return null;
                return (
                  <div key={ex.id} className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400 font-bold truncate pr-4 max-w-[70%] uppercase">{ex.name}</span>
                    <div className="font-mono text-zinc-500">
                      <span className="text-white">{topSet.weight}</span>kg
                    </div>
                  </div>
                );
              })}
              {session.exercises.length > 3 && (
                  <div className="text-[10px] text-zinc-600 font-mono pt-1 text-center">
                      + {session.exercises.length - 3} MORE EXERCISES
                  </div>
              )}
            </div>
            
            <div className="flex justify-between items-center pt-2 mt-2 border-t border-zinc-900">
                 <div className="flex items-center text-[10px] text-emerald-600 font-mono uppercase tracking-widest">
                    <CheckCircle2 size={10} className="mr-2" /> Completed
                 </div>
                 <div className="flex items-center text-[10px] text-primary font-bold uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                    View Report <ChevronRight size={12} className="ml-1" />
                 </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
