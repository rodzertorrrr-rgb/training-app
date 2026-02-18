
import React, { useState } from 'react';
import { 
  Users, Search, ChevronRight, TrendingUp, TrendingDown, 
  UserPlus, BookMarked, Zap, CheckCircle2, Clock, Info
} from 'lucide-react';

interface MockClient {
  id: string;
  name: string;
  objective: string;
  lastActive: string;
  adherence: number;
  weightTrend: number;
}

const Coach: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const mockClients: MockClient[] = [
    { id: '1', name: 'Andrei Popescu', objective: 'Hipertrofie Avansată', lastActive: 'Azi', adherence: 95, weightTrend: -0.4 },
    { id: '2', name: 'Ionel Vasile', objective: 'Forță Maximă', lastActive: 'Ieri', adherence: 88, weightTrend: 0.2 },
    { id: '3', name: 'Elena Radu', objective: 'Body Recomp', lastActive: 'Acum 2 zile', adherence: 100, weightTrend: -0.8 },
  ];

  const filteredClients = mockClients.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-fade-in pb-32">
      <header className="mb-10 flex items-start gap-5">
        <div className="w-[6px] h-12 bg-primary shadow-gold-glow"></div>
        <div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">COACH<br/><span className="text-primary">DASHBOARD</span></h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-3">Sistem de Management Clienți</p>
        </div>
      </header>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mb-10">
        <button className="bg-card border border-white/5 p-6 rounded-[2rem] flex flex-col items-center justify-center gap-3 active:scale-95 transition-all shadow-premium group">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-black">
            <UserPlus size={24} />
          </div>
          <span className="text-[9px] font-black text-white uppercase tracking-widest">Adaugă Client</span>
        </button>
        <button className="bg-card border border-white/5 p-6 rounded-[2rem] flex flex-col items-center justify-center gap-3 active:scale-95 transition-all shadow-premium group">
          <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center text-primary border border-white/5">
            <BookMarked size={24} />
          </div>
          <span className="text-[9px] font-black text-white uppercase tracking-widest">Șabloane</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-8 px-1">
        <div className="relative group">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-primary transition-colors">
            <Search size={18} />
          </div>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="CAUTĂ CLIENT..."
            className="w-full bg-card border border-white/5 rounded-2xl py-5 pl-14 pr-4 text-xs font-black text-white uppercase tracking-[0.2em] outline-none focus:border-primary/50 transition-all shadow-premium"
          />
        </div>
      </div>

      {/* Client List */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] pl-1 mb-2 flex items-center gap-2">
          <Users size={12} /> Clienți Activi ({filteredClients.length})
        </h3>
        
        {filteredClients.map(client => (
          <div key={client.id} className="bg-card border border-white/5 rounded-[2rem] p-6 shadow-premium group hover:border-primary/20 transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-zinc-950 rounded-2xl border border-white/5 flex items-center justify-center text-primary font-black text-xl">
                  {client.name[0]}
                </div>
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-tight">{client.name}</h4>
                  <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">{client.objective}</p>
                </div>
              </div>
              <div className="bg-zinc-900/50 px-3 py-1 rounded-lg border border-white/5">
                <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Clock size={10} /> {client.lastActive}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-950/50 p-4 rounded-2xl border border-white/5">
                <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest block mb-1">Aderență</span>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span className="text-sm font-black text-white">{client.adherence}%</span>
                </div>
              </div>
              <div className="bg-zinc-950/50 p-4 rounded-2xl border border-white/5">
                <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest block mb-1">Trend Greutate</span>
                <div className={`flex items-center gap-2 ${client.weightTrend < 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {client.weightTrend < 0 ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                  <span className="text-sm font-black">{Math.abs(client.weightTrend)}kg</span>
                </div>
              </div>
            </div>

            <button className="w-full mt-6 bg-zinc-900 py-4 rounded-xl text-[9px] font-black text-primary uppercase tracking-[0.2em] flex items-center justify-center gap-2 active:scale-95 transition-all">
              Vezi Profil Complet <ChevronRight size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Help */}
      <div className="mt-12 p-8 text-center bg-primary/5 rounded-[2.5rem] border border-primary/10">
        <Zap size={32} className="mx-auto text-primary mb-4 opacity-30" />
        <p className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.3em] leading-loose">
          Monitorizează aderența și trendul greutății.<br/>Autoreglarea bazată pe feedback este cheia<br/>longevității în sport.
        </p>
      </div>
    </div>
  );
};

export default Coach;
