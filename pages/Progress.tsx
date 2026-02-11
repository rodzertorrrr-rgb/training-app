
import React, { useMemo, useState } from 'react';
import { useData } from '../context/DataContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Minus, HelpCircle, AlertTriangle, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const Progress: React.FC = () => {
  const { sessions, getAllExercises } = useData();
  const allAvailableExercises = getAllExercises();
  
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>(allAvailableExercises[0]?.id || '');

  // Group exercises by muscle group for a better UI in dropdown
  const groupedExercises = useMemo(() => {
    return allAvailableExercises.reduce((acc, ex) => {
        const group = ex.muscleGroup || 'Altele';
        if (!acc[group]) acc[group] = [];
        acc[group].push(ex);
        return acc;
    // Using a more explicit type for the accumulator to ensure Object.entries works correctly later
    }, {} as Record<string, any[]>);
  }, [allAvailableExercises]);

  // Calculate stats for the selected exercise
  const data = useMemo(() => {
    if (!selectedExerciseId) return [];
    
    // Get all completed top sets for this exercise, sorted by date asc
    const points = sessions
      .filter(s => s.status === 'COMPLETED')
      .flatMap(s => 
        s.exercises
          .filter(e => e.exerciseId === selectedExerciseId)
          .map(e => {
            const topSet = e.sets.find(s => s.type === 'TOP_SET');
            // If no top set, try to use the heaviest set from that session
            const fallbackSet = e.sets.reduce((prev, current) => {
                return (Number(current.weight) > Number(prev?.weight || 0)) ? current : prev;
            }, e.sets[0]);
            
            const targetSet = topSet || fallbackSet;

            return {
              date: s.completedAt || 0,
              weight: Number(targetSet?.weight || 0),
              reps: Number(targetSet?.reps || 0),
              // Epley Formula: 1RM = Weight * (1 + Reps/30)
              e1rm: Number(targetSet?.weight || 0) * (1 + Number(targetSet?.reps || 0) / 30)
            };
          })
      )
      .filter(p => p.weight > 0) // Filter out empty points
      .sort((a, b) => a.date - b.date);

    return points;
  }, [sessions, selectedExerciseId]);

  // Comparison logic (Last vs Previous)
  const comparison = useMemo(() => {
    if (data.length < 2) return null;
    const current = data[data.length - 1];
    const previous = data[data.length - 2];
    
    return {
      weightDiff: current.weight - previous.weight,
      repsDiff: current.reps - previous.reps,
      e1rmDiff: current.e1rm - previous.e1rm
    };
  }, [data]);

  // Plateau Detector
  const plateauDetected = useMemo(() => {
    if (data.length < 3) return false;
    const last3 = data.slice(-3);
    const firstOfThree = last3[0].e1rm;
    const current = last3[2].e1rm;
    return current <= firstOfThree * 1.005; // Less than 0.5% growth
  }, [data]);

  if (sessions.length === 0) {
     return (
        <div className="text-center py-20 animate-fade-in">
            <h3 className="text-xl font-black text-white mb-2 uppercase tracking-wide">DATE INSUFICIENTE</h3>
            <p className="text-zinc-500 text-sm font-mono">Progresul va fi vizibil după prima sesiune salvată.</p>
        </div>
     )
  }

  return (
    <div className="animate-fade-in pb-12">
      <header className="mb-8 border-l-4 border-primary pl-4">
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">Analiză<br/><span className="text-primary">Performanță</span></h2>
        <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest mt-2">Urmărirea progresului incremental</p>
      </header>

      {/* Exercise Selector */}
      <div className="mb-10">
        <label className="block text-[10px] font-black text-zinc-600 uppercase mb-2 tracking-widest pl-1">Alege Exercițiul de Monitorizat</label>
        <div className="relative">
            <select 
            value={selectedExerciseId}
            onChange={(e) => setSelectedExerciseId(e.target.value)}
            className="w-full bg-surface border-2 border-zinc-900 text-white p-4 focus:border-primary outline-none appearance-none font-bold uppercase tracking-wide rounded-none transition-all"
            >
            {/* Fix: Explicitly cast entries and provide types to prevent "unknown" inference in strict TS environments */}
            {(Object.entries(groupedExercises) as [string, any[]][]).map(([group, exList]) => (
                <optgroup key={group} label={group.toUpperCase()} className="bg-black text-zinc-500 py-2">
                    {exList.map((ex: any) => (
                        <option key={ex.id} value={ex.id} className="text-white bg-surface">{ex.name}</option>
                    ))}
                </optgroup>
            ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
                <TrendingUp size={16} />
            </div>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="p-12 bg-zinc-950/50 border-2 border-zinc-900 text-center text-zinc-600 font-mono text-xs animate-scale-in">
          NU EXISTĂ DATE SALVATE PENTRU ACEST EXERCIȚIU
        </div>
      ) : (
        <>
          {/* Plateau Radar Alert */}
          {plateauDetected && (
              <div className="bg-red-950/20 border-l-4 border-red-500 p-5 mb-8 flex items-start gap-4 animate-scale-in">
                  <div className="p-2 bg-red-500/10 text-red-500 mt-1">
                      <AlertTriangle size={20} />
                  </div>
                  <div>
                      <h4 className="text-red-500 font-black uppercase tracking-wider text-sm mb-1">Alertă Stagnare</h4>
                      <p className="text-[10px] text-red-200 font-mono leading-relaxed">
                          Forța estimată (1RM) nu a progresat în ultimele 3 sesiuni. 
                          <br/>
                          <span className="opacity-70">Verifică execuția, somnul sau ia în calcul o săptămână de Deload.</span>
                      </p>
                  </div>
              </div>
          )}

          {/* Comparison Cards */}
          {comparison && (
             <div className="grid grid-cols-3 gap-3 mb-8">
                <div className="bg-surface border border-zinc-800 p-4">
                    <span className="text-[10px] text-zinc-600 font-black uppercase block mb-1">Δ Greutate</span>
                    <div className={`flex items-center text-xl font-black font-mono ${comparison.weightDiff > 0 ? 'text-emerald-500' : comparison.weightDiff < 0 ? 'text-red-500' : 'text-zinc-600'}`}>
                        <span className="text-sm mr-1">{comparison.weightDiff > 0 ? '+' : ''}</span>
                        {comparison.weightDiff.toFixed(1)}
                    </div>
                </div>
                <div className="bg-surface border border-zinc-800 p-4">
                    <span className="text-[10px] text-zinc-600 font-black uppercase block mb-1">Δ Reps</span>
                    <div className={`flex items-center text-xl font-black font-mono ${comparison.repsDiff > 0 ? 'text-emerald-500' : comparison.repsDiff < 0 ? 'text-red-500' : 'text-zinc-600'}`}>
                        <span className="text-sm mr-1">{comparison.repsDiff > 0 ? '+' : ''}</span>
                        {comparison.repsDiff}
                    </div>
                </div>
                <div className="bg-surface border border-primary/20 p-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-full h-0.5 bg-primary/30"></div>
                    <span className="text-[10px] text-primary font-black uppercase block mb-1">1RM Est.</span>
                    <div className="text-xl font-black text-white font-mono">
                         {data[data.length - 1].e1rm.toFixed(1)}
                    </div>
                </div>
             </div>
          )}

          {/* Chart Section */}
          <div className="bg-black border border-zinc-800 p-6 h-80 mb-8 relative shadow-2xl">
            <div className="absolute top-4 right-6 z-10 flex items-center gap-2">
                 <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                 <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest">Live Progression Tool</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
                <XAxis 
                    dataKey="date" 
                    tickFormatter={(tick) => new Date(tick).toLocaleDateString('ro-RO', {day: '2-digit', month: '2-digit'})} 
                    stroke="#525252"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                />
                <YAxis stroke="#525252" fontSize={10} domain={['auto', 'auto']} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', color: '#e4e4e7', borderRadius: '0px', fontFamily: 'monospace', fontSize: '10px' }}
                    labelFormatter={(label) => new Date(label).toLocaleDateString('ro-RO')}
                    formatter={(value: number) => [`${value.toFixed(1)} kg`, 'Capacitate Max. (1RM)']}
                />
                <Line 
                    type="monotone" 
                    dataKey="e1rm" 
                    stroke="#D4AF37" 
                    strokeWidth={3} 
                    dot={{r: 4, fill: '#000', stroke: '#D4AF37', strokeWidth: 2}} 
                    activeDot={{r: 6, fill: '#fff', stroke: '#D4AF37', strokeWidth: 2}} 
                    animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Education Context Link */}
          <Link to="/education?section=s11" className="block p-5 bg-zinc-900/40 border border-zinc-800 hover:border-primary/50 transition-all group relative">
             <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-800 group-hover:text-primary/30 transition-colors">
                 <HelpCircle size={48} />
             </div>
             <div className="relative z-10">
                <h5 className="text-sm font-black text-white uppercase tracking-wider mb-1">De ce variază graficul meu?</h5>
                <p className="text-[10px] text-zinc-500 font-mono leading-relaxed max-w-[80%]">
                    Află cum oboseala acumulată și tehnica de execuție influențează performanța zilnică.
                </p>
                <div className="mt-3 flex items-center text-[9px] text-primary font-black uppercase tracking-widest">
                    Consultă Manualul <TrendingUp size={10} className="ml-2" />
                </div>
             </div>
          </Link>
        </>
      )}
    </div>
  );
};

export default Progress;
