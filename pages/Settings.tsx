import React, { useRef } from 'react';
import { useData } from '../context/DataContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { 
  Download, 
  ToggleLeft, 
  ToggleRight, 
  FileText, 
  Trash2, 
  Plus, 
  LogOut, 
  TrendingDown, 
  TrendingUp, 
  Minus,
  ChevronRight,
  Edit,
  ShieldCheck,
  Cpu,
  Upload
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';

const Settings: React.FC = () => {
  const { 
    advancedMode, 
    toggleAdvancedMode, 
    sessions, 
    customPrograms, 
    deleteCustomProgram, 
    getWeightStats,
    weightLogs,
    customExercises
  } = useData();
  const { user, logout, deleteUser, importUserData, login } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const weightStats = getWeightStats();

  const handleSystemExport = () => {
    const dataPackage = {
        version: "2.1",
        exportedAt: Date.now(),
        user: { name: user?.name },
        sessions,
        weightLogs,
        customPrograms,
        customExercises
    };

    const blob = new Blob([JSON.stringify(dataPackage)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `RDZ_PROTOCOL_${user?.name?.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.rdz`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSystemImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const payload = JSON.parse(event.target?.result as string);
            if (!payload.user || !payload.sessions) throw new Error("Format invalid");
            
            const newUserId = importUserData(payload);
            if (window.confirm(`Profilul [${payload.user.name}] a fost importat cu succes. Vrei să comuți acum pe acest profil?`)) {
                login(newUserId);
            }
        } catch (err) {
            alert("Eroare la import: Fișierul nu este un protocol RDZ valid.");
        }
    };
    reader.readAsText(file);
  };

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

    (doc as any).autoTable({
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

      <div className="bg-primaryDim border-2 border-primary/20 p-6 mb-4 relative">
        <div className="flex items-center gap-2 mb-4">
            <ShieldCheck size={18} className="text-primary" />
            <h3 className="text-xs font-black text-white uppercase tracking-widest">Sincronizare Protocol</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
            <button 
                onClick={handleSystemExport}
                className="bg-zinc-950 border border-zinc-800 p-4 flex flex-col items-center gap-2 group hover:border-primary/50 transition-all"
            >
                <Cpu size={20} className="text-primary group-hover:scale-110 transition-transform" />
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest group-hover:text-primary">Exportă Date (.rdz)</span>
            </button>
            
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-zinc-950 border border-zinc-800 p-4 flex flex-col items-center gap-2 group hover:border-emerald-500/50 transition-all"
            >
                <Upload size={20} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest group-hover:text-emerald-500">Importă Client</span>
            </button>
        </div>
        <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleSystemImport} 
            accept=".rdz" 
            className="hidden" 
        />
        <p className="text-[8px] text-zinc-600 font-mono uppercase mt-4 text-center leading-relaxed">
            Folosește fișierele .rdz pentru a transfera datele între atlet și antrenor.
        </p>
      </div>

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
