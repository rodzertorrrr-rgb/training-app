
import React from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { 
  Download, 
  ToggleLeft, 
  ToggleRight, 
  FileText, 
  Trash2, 
  HelpCircle, 
  Plus, 
  LogOut, 
  Scale, 
  TrendingDown, 
  TrendingUp, 
  Minus,
  ChevronRight,
  Edit
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useNavigate, Link } from 'react-router-dom';

const Settings: React.FC = () => {
  const { advancedMode, toggleAdvancedMode, sessions, customPrograms, deleteCustomProgram, getWeightStats } = useData();
  const { user, logout, deleteUser } = useAuth();
  const navigate = useNavigate();

  const weightStats = getWeightStats();

  const handleExportCSV = () => {
    const headers = ['Data', 'Protocol', 'Exercitiu', 'Tip Set', 'Greutate', 'Repetari', 'RIR'];
    const rows = sessions.flatMap(s => 
        s.exercises.flatMap(e => 
            e.sets.map(set => [
                new Date(s.completedAt!).toLocaleDateString(),
                s.dayName,
                e.name,
                set.type,
                set.weight,
                set.reps,
                set.rir
            ])
        )
    );

    const csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n" 
        + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `RDZ_Export_${user?.name}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("TRAINED BY RDZ - RAPORT PROGRES", 14, 20);
    doc.setFontSize(10);
    doc.text(`Utilizator: ${user?.name} | Data: ${new Date().toLocaleDateString()}`, 14, 28);
    
    const tableData = sessions.flatMap(s => 
        s.exercises.flatMap(e => {
            const topSet = e.sets.find(st => st.type === 'TOP_SET');
            if(!topSet) return [];
            return [[
                new Date(s.completedAt!).toLocaleDateString(),
                e.name,
                `${topSet.weight} kg`,
                topSet.reps,
                topSet.rir
            ]];
        })
    );

    autoTable(doc, {
        head: [['Data', 'Exercițiu', 'Greutate (Top)', 'Reps', 'RIR']],
        body: tableData,
        startY: 35,
        theme: 'grid',
        headStyles: { fillColor: [212, 175, 55], textColor: [0, 0, 0] },
    });

    doc.save(`RDZ_Raport_${user?.name}.pdf`);
  };

  const handleLogout = () => {
      logout();
      navigate('/login');
  };

  const handleDeleteAccount = () => {
    const confirmStr = prompt("ATENȚIE: Ștergerea este ireversibilă.\nScrie 'STERGE' pentru a confirma eliminarea contului:");
    if (confirmStr === 'STERGE' && user) {
        deleteUser(user.id, true);
        navigate('/login');
    }
  };

  const handleDeleteProgram = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      if(window.confirm("Ștergi acest program custom?")) {
          deleteCustomProgram(id);
      }
  };

  return (
    <div className="pb-12 animate-fade-in">
      <header className="mb-8 border-l-4 border-primary pl-4">
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">Control<br/><span className="text-primary">Sistem</span></h2>
        <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest mt-2">Configurații & Management Date</p>
      </header>

      {/* 1. CONT UTILIZATOR */}
      <div className="bg-surface border border-zinc-900 p-6 mb-4 relative overflow-hidden group">
         <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-all"></div>
         <div className="flex items-center justify-between">
            <div>
                 <h3 className="text-lg font-black text-white uppercase tracking-wider">{user?.name || 'Atlet'}</h3>
                 <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Sesiuni totale: {sessions.length}</p>
            </div>
            <button 
                onClick={handleLogout}
                className="flex items-center gap-2 bg-zinc-900 text-zinc-400 px-4 py-2 border border-zinc-800 text-[9px] font-black uppercase tracking-widest hover:text-white transition-colors"
            >
                <LogOut size={14} /> Ieșire
            </button>
         </div>
      </div>

      {/* 2. BIO-FEEDBACK (NOU) */}
      <div className="bg-surface border border-zinc-900 p-6 mb-4">
         <div className="flex justify-between items-start mb-6">
             <div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Bio-Feedback</h3>
                <p className="text-[9px] text-zinc-600 font-mono uppercase">Status Greutate Corporală</p>
             </div>
             <button onClick={() => navigate('/weight')} className="text-primary hover:text-white">
                <ChevronRight size={20} />
             </button>
         </div>
         
         <div className="grid grid-cols-2 gap-4">
            <div className="bg-black p-4 border border-zinc-900">
                <span className="text-[8px] text-zinc-600 font-black uppercase block mb-1">Curentă</span>
                <div className="text-xl font-black text-white leading-none">
                    {weightStats.current || '--'} <span className="text-[10px] text-zinc-700 font-normal">kg</span>
                </div>
            </div>
            <div className="bg-black p-4 border border-zinc-900">
                <span className="text-[8px] text-zinc-600 font-black uppercase block mb-1">Trend 7z</span>
                <div className={`flex items-center text-xl font-black leading-none ${weightStats.diff7d < 0 ? 'text-emerald-500' : weightStats.diff7d > 0 ? 'text-red-500' : 'text-zinc-700'}`}>
                    {weightStats.diff7d < 0 ? <TrendingDown size={14} className="mr-1"/> : weightStats.diff7d > 0 ? <TrendingUp size={14} className="mr-1"/> : <Minus size={14} className="mr-1"/>}
                    {Math.abs(weightStats.diff7d).toFixed(1)}
                </div>
            </div>
         </div>
      </div>

      {/* 3. PROTOCOALE CUSTOM */}
      <div className="bg-surface border border-zinc-900 p-6 mb-4">
         <div className="flex justify-between items-center mb-6">
             <h3 className="text-sm font-black text-white uppercase tracking-widest">Protocoalele Tale</h3>
             <button onClick={() => navigate('/settings/program-editor')} className="bg-primary/10 text-primary p-2 border border-primary/20 hover:bg-primary hover:text-black transition-all">
                 <Plus size={16} />
             </button>
         </div>
         
         <div className="space-y-2">
             {customPrograms.length === 0 ? (
                 <div className="text-center py-6 border border-dashed border-zinc-900 text-[10px] text-zinc-700 font-mono uppercase">Niciun protocol personalizat</div>
             ) : (
                 customPrograms.map(p => (
                     <div key={p.id} onClick={() => navigate(`/settings/program-editor/${p.id}`)} className="bg-black border border-zinc-900 p-4 flex justify-between items-center cursor-pointer hover:border-primary/40 group transition-all">
                         <div>
                             <h4 className="text-xs font-black text-white uppercase group-hover:text-primary transition-colors">{p.name}</h4>
                             <span className="text-[9px] text-zinc-600 font-mono uppercase">{p.exercises.length} exerciții active</span>
                         </div>
                         <div className="flex items-center gap-4 opacity-30 group-hover:opacity-100">
                            <Edit size={14} className="text-zinc-500" />
                            <button onClick={(e) => handleDeleteProgram(e, p.id)} className="text-zinc-500 hover:text-red-500">
                                <Trash2 size={14} />
                            </button>
                         </div>
                     </div>
                 ))
             )}
         </div>
      </div>

      {/* 4. MOD AVANSAT */}
      <div className="bg-surface border border-zinc-900 p-6 mb-4">
        <div className="flex justify-between items-center">
            <div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Mod Avansat</h3>
                <p className="text-[9px] text-zinc-500 font-mono uppercase mt-1">Instrumente de Autoreglare (RPE/RIR)</p>
            </div>
            <button onClick={toggleAdvancedMode} className="transition-all active:scale-90">
                {advancedMode ? <ToggleRight size={44} className="text-primary" /> : <ToggleLeft size={44} className="text-zinc-800" />}
            </button>
        </div>
      </div>

      {/* 5. EXPORT & SIGURANȚĂ */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <button onClick={handleExportCSV} className="bg-surface border border-zinc-900 p-5 flex flex-col items-center gap-3 hover:bg-zinc-900 transition-all group">
            <FileText size={20} className="text-zinc-600 group-hover:text-white" />
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest group-hover:text-white">Export CSV</span>
        </button>
        <button onClick={handleExportPDF} className="bg-surface border border-zinc-900 p-5 flex flex-col items-center gap-3 hover:bg-zinc-900 transition-all group">
            <Download size={20} className="text-zinc-600 group-hover:text-white" />
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest group-hover:text-white">Export PDF</span>
        </button>
      </div>

      {/* DANGER ZONE */}
      <div className="border border-red-900/30 p-6 bg-red-950/5">
        <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
            <h3 className="text-xs font-black text-red-500 uppercase tracking-widest">Zonă Critică</h3>
        </div>
        <button onClick={handleDeleteAccount} className="w-full flex items-center justify-between text-red-900 hover:text-red-500 transition-colors py-2 group">
            <span className="text-[10px] font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform">Șterge Profilul Definitiv</span>
            <Trash2 size={14} />
        </button>
      </div>

      <div className="mt-12 text-center">
         <p className="text-[8px] text-zinc-800 font-mono uppercase tracking-[0.5em]">Trained by RDZ OS v2.1 // System Encrypted</p>
      </div>
    </div>
  );
};

export default Settings;
