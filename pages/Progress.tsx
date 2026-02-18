
import React, { useMemo, useState } from 'react';
import { useData } from '../context/DataContext.tsx';
import { 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  AreaChart, 
  Area,
  LineChart,
  Line,
} from 'recharts';
import { 
  TrendingUp, 
  Activity, 
  ChevronDown, 
  Layers,
  Dumbbell,
  Target,
  Zap,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Calendar,
  BrainCircuit,
  // Added Sparkles to the imports to resolve "Cannot find name 'Sparkles'" error
  Sparkles
} from 'lucide-react';

type ProgressMetric = 'e1rm' | 'top_set' | 'volume' | 'effective_sets' | 'reps_progression';

const Progress: React.FC = () => {
  const { sessions, getAllExercises } = useData();
  const allAvailableExercises = getAllExercises();
  
  const [selectedExName, setSelectedExName] = useState<string>(allAvailableExercises[0]?.name || '');
  const [activeMetric, setActiveMetric] = useState<ProgressMetric>('e1rm');

  // Logică de calcul metrici conform consensului științific
  const metricsLogic = {
    e1rm: (w: number, r: number) => Math.round((w * (1 + r / 30)) * 10) / 10, // Formula Epley
    volume: (sets: any[]) => sets.reduce((acc, s) => acc + (Number(s.weight) * Number(s.reps)), 0),
    effective: (sets: any[]) => sets.filter(s => (s.rir !== '' && Number(s.rir) <= 3) || s.type === 'TOP_SET').length,
  };

  const chartData = useMemo(() => {
    if (!selectedExName) return [];
    
    return sessions
      .filter(s => s.status === 'COMPLETED')
      .map(s => {
        const ex = s.exercises.find(e => e.name === selectedExName);
        if (!ex) return null;

        const workingSets = ex.sets.filter(st => st.weight !== '' && st.reps !== '' && st.type !== 'RAMP_UP');
        if (workingSets.length === 0) return null;

        const topSet = workingSets.reduce((prev, curr) => (Number(curr.weight) > Number(prev.weight) ? curr : prev), workingSets[0]);
        
        const vals: Record<ProgressMetric, number> = {
          e1rm: metricsLogic.e1rm(Number(topSet.weight), Number(topSet.reps)),
          top_set: Number(topSet.weight),
          volume: metricsLogic.volume(workingSets),
          effective_sets: metricsLogic.effective(workingSets),
          reps_progression: Number(topSet.reps)
        };

        return {
          date: new Date(s.completedAt!).toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit' }),
          timestamp: s.completedAt,
          value: vals[activeMetric],
          fullDate: new Date(s.completedAt!).toLocaleDateString('ro-RO')
        };
      })
      .filter((d): d is any => d !== null)
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [selectedExName, activeMetric, sessions]);

  const insights = useMemo(() => {
    if (chartData.length < 2) return null;
    const current = chartData[chartData.length - 1].value;
    const previous = chartData[chartData.length - 2].value;
    const diff = current - previous;
    const trend = diff > 0 ? 'up' : diff < 0 ? 'down' : 'stable';

    let advice = "Progresie stabilă. Continuă protocolul actual.";
    if (activeMetric === 'e1rm' && diff > 0) advice = "Forța estimată (e1RM) a crescut. Tensiunea mecanică este la nivel optim.";
    if (activeMetric === 'e1rm' && diff === 0) advice = "Platou forță. Încearcă să crești volumul prin repetări suplimentare.";
    if (activeMetric === 'volume' && diff > 0) advice = "Capacitatea de muncă a crescut. Adaptarea metabolică este în curs.";
    if (activeMetric === 'effective_sets' && diff < 0) advice = "Volumul efectiv a scăzut. Verifică nivelul de oboseală acumulată.";
    
    return { trend, diff, advice };
  }, [chartData, activeMetric]);

  const metricTabs: { id: ProgressMetric; label: string; icon: any }[] = [
    { id: 'e1rm', label: 'e1RM', icon: <Zap size={14}/> },
    { id: 'top_set', label: 'Greutate', icon: <Dumbbell size={14}/> },
    { id: 'volume', label: 'Volum', icon: <Layers size={14}/> },
    { id: 'effective_sets', label: 'Seturi Ef.', icon: <Target size={14}/> }
  ];

  return (
    <div className="pb-32 animate-fade-in">
      <header className="mb-8 border-l-4 border-primary pl-4">
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">ANALIZĂ<br/><span className="text-primary">PROGRES</span></h2>
        <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest mt-2">Sistem de monitorizare a performanței</p>
      </header>

      {/* SELECTOR EXERCIȚIU */}
      <div className="mb-6">
        <div className="relative">
            <select 
                value={selectedExName}
                onChange={(e) => setSelectedExName(e.target.value)}
                className="w-full bg-zinc-950 border-2 border-zinc-900 text-white p-4 font-black uppercase text-xs outline-none focus:border-primary appearance-none transition-all shadow-xl"
            >
                {allAvailableExercises.map(ex => (
                    <option key={ex.id} value={ex.name}>{ex.name.toUpperCase()}</option>
                ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-primary pointer-events-none" size={18} />
        </div>
      </div>

      {/* SELECTOR METRICĂ */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 -mx-1 px-1">
        {metricTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveMetric(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap text-[10px] font-black uppercase tracking-widest border transition-all ${
              activeMetric === tab.id ? 'bg-primary text-black border-primary shadow-glow' : 'bg-zinc-900 text-zinc-500 border-zinc-800'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {chartData.length >= 2 ? (
        <div className="space-y-6 animate-slide-up">
            {/* GRAFIC AVANSAT */}
            <div className="bg-surface border border-zinc-900 p-5 shadow-2xl relative overflow-hidden">
                <div className="flex justify-between items-end mb-8 relative z-10">
                   <div>
                      <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest block mb-1">Valoare curentă</span>
                      <div className="text-3xl font-black text-white tracking-tighter">
                        {chartData[chartData.length-1].value}
                        <span className="text-[10px] text-zinc-700 ml-1 font-bold uppercase">
                          {activeMetric === 'volume' || activeMetric === 'top_set' || activeMetric === 'e1rm' ? 'kg' : 'units'}
                        </span>
                      </div>
                   </div>
                   {insights && (
                     <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 border ${
                       insights.trend === 'up' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : 
                       insights.trend === 'down' ? 'text-red-500 border-red-500/20 bg-red-500/5' : 
                       'text-zinc-500 border-zinc-800'
                     }`}>
                        {insights.trend === 'up' ? <ArrowUpRight size={12}/> : insights.trend === 'down' ? <ArrowDownRight size={12}/> : <Minus size={12}/>}
                        {Math.abs(insights.diff).toFixed(1)}
                     </div>
                   )}
                </div>

                <div className="h-[240px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
                            <XAxis dataKey="date" stroke="#52525b" fontSize={9} tickLine={false} axisLine={false} dy={10} />
                            <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '0px', padding: '8px' }}
                                itemStyle={{ color: '#D4AF37', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                                labelStyle={{ color: '#52525b', fontSize: '8px', marginBottom: '4px' }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="value" 
                                stroke="#D4AF37" 
                                strokeWidth={3} 
                                fillOpacity={1} 
                                fill="url(#colorValue)" 
                                animationDuration={1000} 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* AI INSIGHT CARD */}
            {insights && (
              <div className="bg-zinc-950 border border-primary/20 p-5 flex gap-4 items-start shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-5"><BrainCircuit size={40} className="text-primary" /></div>
                  <div className="p-2 bg-primary/10 rounded-full shrink-0 border border-primary/20">
                    <Sparkles size={16} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">RDZ INTELLIGENCE INSIGHT</h4>
                    <p className="text-[11px] text-zinc-500 font-medium leading-relaxed uppercase">{insights.advice}</p>
                  </div>
              </div>
            )}

            {/* LISTĂ ISTORIC RECENT */}
            <div className="space-y-2">
                <h3 className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] pl-1 mb-3">Istoric Metrică</h3>
                {[...chartData].reverse().slice(0, 5).map((entry, idx) => (
                    <div key={idx} className="bg-card border border-zinc-900 p-4 flex justify-between items-center group hover:border-primary/30 transition-all">
                        <div className="flex items-center gap-3">
                            <Calendar size={12} className="text-zinc-700" />
                            <span className="text-[10px] font-black text-zinc-400 uppercase">{entry.fullDate}</span>
                        </div>
                        <div className="text-sm font-black text-white">
                            {entry.value} 
                            <span className="text-[9px] text-zinc-700 ml-1 font-bold">VAL</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      ) : (
        <div className="py-24 text-center border-2 border-dashed border-zinc-900 bg-zinc-950/30">
            <Activity size={40} className="mx-auto text-zinc-800 mb-4" />
            <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em] px-12 leading-relaxed">
                Insuficiente date pentru analiză. Finalizează minim 2 sesiuni cu acest exercițiu.
            </p>
        </div>
      )}
    </div>
  );
};

export default Progress;
