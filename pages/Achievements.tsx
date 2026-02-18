
import React from 'react';
import { useData } from '../context/DataContext.tsx';
import { Award, Zap, CheckCircle2, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Achievements: React.FC = () => {
  const { achievements, sessions } = useData();
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in pb-32">
      <header className="mb-10 border-l-4 border-primary pl-6">
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">Hall of<br/><span className="text-primary">Gains</span></h2>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Colecția ta de realizări</p>
      </header>

      {achievements.length === 0 ? (
        <div className="py-24 text-center border-2 border-dashed border-zinc-900 bg-zinc-950/20 rounded-[2.5rem] px-10">
          <Trophy size={48} className="mx-auto text-zinc-800 mb-6" />
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">
            Niciun story generat încă. Mergi în istoric și distribuie performanța!
          </p>
          <button 
            onClick={() => navigate('/history')}
            className="mt-8 text-primary font-black text-[10px] uppercase tracking-widest border border-primary/20 px-6 py-3 rounded-xl"
          >
            Vezi Istoric
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {achievements.map(ach => (
            <div key={ach.id} className="bg-surface border border-zinc-800 p-6 rounded-3xl flex items-center justify-between animate-slide-up">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                  <Zap size={24} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-tight">
                    {sessions.find(s => s.id === ach.sessionId)?.dayName || 'PROTOCOL RDZ'}
                  </h4>
                  <p className="text-[10px] text-zinc-500 font-mono mt-1 uppercase">
                    Generat pe {new Date(ach.createdAt).toLocaleDateString('ro-RO')}
                  </p>
                </div>
              </div>
              <CheckCircle2 size={24} className="text-emerald-500/40" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Achievements;
