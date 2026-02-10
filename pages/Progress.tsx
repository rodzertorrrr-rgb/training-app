import React, { useMemo, useState } from 'react';
import { useData } from '../context/DataContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Minus, HelpCircle, AlertTriangle, Activity } from 'lucide-react';
import { TRAINING_PROGRAM } from '../constants';
import { Link } from 'react-router-dom';

const Progress: React.FC = () => {
  const { sessions } = useData();
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>(TRAINING_PROGRAM[0].exercises[0].id);

  // Flatten all exercises for the selector
  const allExercises = useMemo(() => {
    return TRAINING_PROGRAM.flatMap(day => day.exercises);
  }, []);

  // Calculate stats for the selected exercise
  const data = useMemo(() => {
    // Get all completed top sets for this exercise, sorted by date asc
    const points = sessions
      .filter(s => s.status === 'COMPLETED')
      .flatMap(s => 
        s.exercises
          .filter(e => e.exerciseId === selectedExerciseId)
          .map(e => {
            const topSet = e.sets.find(s => s.type === 'TOP_SET');
            return {
              date: s.completedAt || 0,
              weight: Number(topSet?.weight || 0),
              reps: Number(topSet?.reps || 0),
              // Epley Formula: 1RM = Weight * (1 + Reps/30)
              e1rm: Number(topSet?.weight || 0) * (1 + Number(topSet?.reps || 0) / 30)
            };
          })
      )
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

  // Plateau Detector (Stagnation Radar)
  const plateauDetected = useMemo(() => {
    if (data.length < 3) return false;
    const last3 = data.slice(-3);
    // If the 1RM has not improved by at least 1% from 3 sessions ago to now
    // Or if it has declined
    const firstOfThree = last3[0].e1rm;
    const current = last3[2].e1rm;
    
    // Check for regression or stagnation (< 1% growth over 3 sessions)
    return current <= firstOfThree * 1.01; 
  }, [data]);

  if (sessions.length === 0) {
     return (
        <div className="text-center py-20">
            <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">Nu există date</h3>
            <p className="text-zinc-500 text-sm">Progresul va apărea aici după prima sesiune salvată.</p>
        </div>
     )
  }

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">Analiză Progres</h2>

      {/* Exercise Selector */}
      <div className="mb-8 group">
        <label className="block text-[10px] font-black text-zinc-600 uppercase mb-2 tracking-widest">Selectează exercițiul</label>
        <div className="relative">
            <select 
            value={selectedExerciseId}
            onChange={(e) => setSelectedExerciseId(e.target.value)}
            className="w-full bg-black border-2 border-zinc-800 text-white p-4 focus:border-primary outline-none appearance-none font-bold uppercase tracking-wide rounded-none"
            >
            {allExercises.map(ex => (
                <option key={ex.id} value={ex.id}>{ex.name}</option>
            ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">▼</div>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="p-8 bg-zinc-950/50 border-2 border-zinc-900 text-center text-zinc-500 font-mono text-sm">
          NO DATA FOUND FOR THIS EXERCISE
        </div>
      ) : (
        <>
          {/* Plateau Radar Alert */}
          {plateauDetected && (
              <div className="bg-red-950/20 border-l-4 border-red-500 p-4 mb-8 flex items-start gap-4 animate-pulse-fast">
                  <div className="p-2 bg-red-500/10 rounded-full text-red-500 mt-1">
                      <AlertTriangle size={20} />
                  </div>
                  <div>
                      <h4 className="text-red-500 font-black uppercase tracking-wider text-sm mb-1">Stagnare Detectată</h4>
                      <p className="text-[10px] text-red-200 font-mono leading-relaxed">
                          Est. 1RM nu a crescut semnificativ în ultimele 3 sesiuni.
                          <br/>
                          <span className="opacity-70">Sugestii: Verifică somnul, caloriile, sau ia în considerare un Deload.</span>
                      </p>
                  </div>
              </div>
          )}

          {/* Comparison Cards */}
          {comparison && (
             <div className="grid grid-cols-3 gap-2 mb-8">
                <div className="bg-surface border-2 border-zinc-900 p-3">
                    <span className="text-[10px] text-zinc-600 font-black uppercase block mb-1">Diferență Kg</span>
                    <div className={`flex items-center text-xl font-black ${comparison.weightDiff > 0 ? 'text-emerald-500' : comparison.weightDiff < 0 ? 'text-red-500' : 'text-zinc-600'}`}>
                        {comparison.weightDiff > 0 ? <ArrowUpRight size={18} /> : comparison.weightDiff < 0 ? <ArrowDownRight size={18} /> : <Minus size={18} />}
                        <span className="ml-1">{comparison.weightDiff > 0 ? '+' : ''}{comparison.weightDiff.toFixed(1)}</span>
                    </div>
                </div>
                <div className="bg-surface border-2 border-zinc-900 p-3">
                    <span className="text-[10px] text-zinc-600 font-black uppercase block mb-1">Diferență Reps</span>
                    <div className={`flex items-center text-xl font-black ${comparison.repsDiff > 0 ? 'text-emerald-500' : comparison.repsDiff < 0 ? 'text-red-500' : 'text-zinc-600'}`}>
                        {comparison.repsDiff > 0 ? <ArrowUpRight size={18} /> : comparison.repsDiff < 0 ? <ArrowDownRight size={18} /> : <Minus size={18} />}
                        <span className="ml-1">{comparison.repsDiff > 0 ? '+' : ''}{comparison.repsDiff}</span>
                    </div>
                </div>
                <div className="bg-surface border-2 border-zinc-900 p-3">
                    <span className="text-[10px] text-zinc-600 font-black uppercase block mb-1">Est. 1RM</span>
                    <div className={`flex items-center text-xl font-black ${comparison.e1rmDiff > 0 ? 'text-primary' : 'text-zinc-500'}`}>
                         {comparison.e1rmDiff.toFixed(1)}
                    </div>
                </div>
             </div>
          )}

          {/* Chart */}
          <div className="bg-zinc-950 border-2 border-zinc-900 p-4 h-64 mb-6 relative">
            <div className="absolute top-2 right-4 z-10 flex items-center gap-2">
                 <Activity size={12} className="text-zinc-600" />
                 <span className="text-[9px] text-zinc-600 font-mono uppercase">Performance Trend</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
                <XAxis 
                    dataKey="date" 
                    tickFormatter={(tick) => new Date(tick).toLocaleDateString('ro-RO', {day: '2-digit', month: '2-digit'})} 
                    stroke="#3f3f46"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis stroke="#3f3f46" fontSize={10} domain={['auto', 'auto']} tickLine={false} axisLine={false} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', color: '#e4e4e7', borderRadius: '0px' }}
                    labelFormatter={(label) => new Date(label).toLocaleDateString('ro-RO')}
                    formatter={(value: number) => [`${value.toFixed(1)} kg`, 'Est. 1RM']}
                />
                <Line 
                    type="linear" 
                    dataKey="e1rm" 
                    stroke="#d97706" 
                    strokeWidth={2} 
                    dot={{r: 4, fill: '#000', stroke: '#d97706', strokeWidth: 2}} 
                    activeDot={{r: 6, fill: '#fff'}} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Contextual Link */}
          <Link to="/education?section=s8_2" className="block p-5 bg-zinc-900/30 border-l-2 border-primary hover:bg-zinc-900 transition-colors group">
             <div className="flex items-start">
                <HelpCircle className="text-zinc-600 group-hover:text-primary mt-0.5 mr-3 flex-shrink-0 transition-colors" size={20} />
                <div>
                    <h5 className="text-sm font-black text-white uppercase tracking-wider">De ce variază graficul?</h5>
                    <p className="text-xs text-zinc-500 mt-1 font-mono">
                        Citește despre "Non-linearitate" în secțiunea de Educație. Click aici.
                    </p>
                </div>
             </div>
          </Link>
        </>
      )}
    </div>
  );
};

export default Progress;