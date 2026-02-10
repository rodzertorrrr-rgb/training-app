import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ArrowLeft, Calendar, Clock, Target, Dumbbell, Share2 } from 'lucide-react';

const SessionDetails: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { sessions } = useData();

  const session = sessions.find(s => s.id === sessionId);

  if (!session) {
    return (
      <div className="text-center py-20">
        <h3 className="text-white text-lg">Sesiunea nu a fost găsită.</h3>
        <button onClick={() => navigate('/history')} className="text-primary mt-4">Înapoi la istoric</button>
      </div>
    );
  }

  const durationMin = session.completedAt 
    ? Math.floor((session.completedAt - session.startedAt) / 1000 / 60) 
    : 0;

  const totalSets = session.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  const totalVolume = session.exercises.reduce((acc, ex) => {
      return acc + ex.sets.reduce((sAcc, s) => sAcc + (Number(s.weight) * Number(s.reps)), 0);
  }, 0);

  return (
    <div className="pb-10 animate-fade-in">
      {/* Navigation Header */}
      <div className="flex items-center mb-8">
        <button 
          onClick={() => navigate('/history')} 
          className="w-10 h-10 flex items-center justify-center bg-black border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="ml-4">
            <h2 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-1">Mission Report</h2>
            <div className="h-0.5 w-12 bg-primary"></div>
        </div>
      </div>

      {/* Hero Stats Card */}
      <div className="bg-surface border border-zinc-800 p-6 mb-8 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-4 opacity-10">
             <Target size={120} className="text-white" />
         </div>
         
         <div className="relative z-10">
            <h1 className="text-2xl font-black text-white uppercase tracking-tight leading-none mb-1">
                {session.dayName.split(':')[0]}
            </h1>
            <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-6">
                {session.dayName.split(':')[1]}
            </p>

            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div>
                    <div className="flex items-center text-zinc-500 mb-1">
                        <Calendar size={12} className="mr-2" />
                        <span className="text-[9px] uppercase tracking-widest">Data Execuției</span>
                    </div>
                    <span className="text-lg font-bold text-white">
                        {new Date(session.completedAt!).toLocaleDateString('ro-RO')}
                    </span>
                </div>
                <div>
                    <div className="flex items-center text-zinc-500 mb-1">
                        <Clock size={12} className="mr-2" />
                        <span className="text-[9px] uppercase tracking-widest">Durată</span>
                    </div>
                    <span className="text-lg font-bold text-white">
                        {durationMin} <span className="text-xs text-zinc-600">MIN</span>
                    </span>
                </div>
                <div>
                    <div className="flex items-center text-zinc-500 mb-1">
                        <Dumbbell size={12} className="mr-2" />
                        <span className="text-[9px] uppercase tracking-widest">Total Volum</span>
                    </div>
                    <span className="text-lg font-bold text-white font-mono">
                        {(totalVolume / 1000).toFixed(1)} <span className="text-xs text-zinc-600">TONE</span>
                    </span>
                </div>
                <div>
                     <div className="flex items-center text-zinc-500 mb-1">
                        <Target size={12} className="mr-2" />
                        <span className="text-[9px] uppercase tracking-widest">Seturi Lucrate</span>
                    </div>
                    <span className="text-lg font-bold text-white font-mono">
                        {totalSets}
                    </span>
                </div>
            </div>
         </div>
      </div>

      {/* Exercises Detail List */}
      <div className="space-y-8 relative">
        {/* Vertical Line Connector */}
        <div className="absolute left-[11px] top-4 bottom-4 w-[1px] bg-zinc-900 -z-10"></div>

        {session.exercises.map((ex, index) => {
            return (
                <div key={ex.id} className="relative pl-8">
                    {/* Node Dot */}
                    <div className="absolute left-0 top-1.5 w-[23px] h-[23px] bg-black border-2 border-zinc-800 flex items-center justify-center z-10">
                        <span className="text-[9px] font-bold text-zinc-500">{index + 1}</span>
                    </div>

                    <div className="mb-3">
                        <h3 className="text-base font-black text-white uppercase tracking-tight">{ex.name}</h3>
                    </div>

                    <div className="bg-card border border-zinc-900">
                         {/* Table Header */}
                        <div className="grid grid-cols-12 gap-1 py-2 bg-zinc-950 border-b border-zinc-900 text-[9px] text-zinc-600 font-black uppercase tracking-widest text-center">
                            <div className="col-span-3 text-left pl-3">Type</div>
                            <div className="col-span-3">Kg</div>
                            <div className="col-span-3">Reps</div>
                            <div className="col-span-3">RIR</div>
                        </div>

                        {/* Sets */}
                        <div className="divide-y divide-zinc-900">
                            {ex.sets.map((set) => (
                                <div key={set.id} className={`grid grid-cols-12 gap-1 py-3 text-center items-center ${
                                    set.type === 'TOP_SET' ? 'bg-primary/5' : ''
                                }`}>
                                    <div className="col-span-3 text-left pl-3">
                                        {set.type === 'TOP_SET' ? (
                                            <span className="text-[9px] font-black text-primary border border-primary/30 px-1 py-0.5 bg-primary/10">TOP</span>
                                        ) : set.type === 'RAMP_UP' ? (
                                            <span className="text-[9px] font-bold text-zinc-600">WARM</span>
                                        ) : (
                                            <span className="text-[9px] font-bold text-zinc-500">BACK</span>
                                        )}
                                    </div>
                                    <div className="col-span-3 font-mono font-bold text-white text-sm">
                                        {set.weight}
                                    </div>
                                    <div className="col-span-3 font-mono font-bold text-white text-sm">
                                        {set.reps}
                                    </div>
                                    <div className="col-span-3 font-mono text-zinc-400 text-xs">
                                        {set.rir}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )
        })}
      </div>

      <div className="mt-12 text-center border-t border-zinc-900 pt-8">
          <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-[0.3em]">End of Report /// RDZ Protocol</p>
      </div>
    </div>
  );
};

export default SessionDetails;