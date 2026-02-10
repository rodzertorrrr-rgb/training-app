
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Download, ShieldCheck, ToggleLeft, ToggleRight, FileText, Trash2, HelpCircle, Dumbbell, Edit, Plus, LogOut } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useNavigate, Link } from 'react-router-dom';

const Settings: React.FC = () => {
  const { advancedMode, toggleAdvancedMode, sessions, integrityCheck, customPrograms, deleteCustomProgram } = useData();
  const { user, deleteUser, logout } = useAuth();
  const [integrityReport, setIntegrityReport] = useState<string[] | null>(null);
  const navigate = useNavigate();

  const handleExportCSV = () => {
    // Basic CSV construction
    const headers = ['Date', 'Day', 'Exercise', 'Set Type', 'Weight', 'Reps', 'RIR'];
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
    link.setAttribute("download", "trained_by_rdz_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Trained by RDZ - Log Export", 14, 15);
    
    // Flatten data for table
    const tableData = sessions.flatMap(s => 
        s.exercises.flatMap(e => {
            const topSet = e.sets.find(st => st.type === 'TOP_SET');
            // If no top set, maybe show best backoff? For now just skip if no top set to keep PDF clean
            if(!topSet) return [];
            return [[
                new Date(s.completedAt!).toLocaleDateString(),
                e.name,
                `${topSet.weight}kg`,
                topSet.reps,
                topSet.rir
            ]];
        })
    );

    autoTable(doc, {
        head: [['Data', 'Exercițiu', 'Top Set Kg', 'Reps', 'RIR']],
        body: tableData,
        startY: 20,
    });

    doc.save("trained_by_rdz_report.pdf");
  };

  const runIntegrity = async () => {
    const report = await integrityCheck();
    setIntegrityReport(report);
  };

  const handleLogout = () => {
      logout();
      navigate('/login');
  }

  const handleDeleteAccount = () => {
    // Custom prompt UI would be better, but sticking to prompt for simplicity in logic
    const confirmStr = prompt("ATENȚIE: Ștergerea este ireversibilă.\nPentru a confirma ștergerea completă a contului, scrie 'STERGE' în câmpul de mai jos:");
    
    if (confirmStr === 'STERGE' && user) {
        deleteUser(user.id, true);
        navigate('/login'); // Force navigation immediately
    }
  };

  const handleDeleteProgram = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      if(window.confirm("Ștergi acest program custom?")) {
          deleteCustomProgram(id);
      }
  }

  return (
    <div className="pb-8">
      <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">Setări & Unelte</h2>

      {/* Account Control */}
      <div className="bg-surface border-2 border-zinc-900 p-6 mb-6">
         <div className="flex items-center justify-between mb-4">
            <div>
                 <h3 className="text-lg font-black text-white uppercase tracking-wider">{user?.name}</h3>
                 <p className="text-xs text-zinc-500 font-mono">Cont Activ</p>
            </div>
            <button 
                onClick={handleLogout}
                className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2 border border-zinc-800 text-xs font-bold uppercase tracking-widest transition-colors"
            >
                <LogOut size={14} />
                Ieșire Cont
            </button>
         </div>
      </div>

      {/* Program Manager */}
      <div className="bg-surface border-2 border-zinc-900 p-6 mb-6">
         <div className="flex justify-between items-center mb-4">
             <h3 className="text-lg font-black text-white uppercase tracking-wider">Antrenamente Custom</h3>
             <button onClick={() => navigate('/settings/program-editor')} className="bg-primary text-black p-2 rounded-full hover:bg-white transition-colors">
                 <Plus size={16} />
             </button>
         </div>
         
         <div className="space-y-2">
             {customPrograms.length === 0 ? (
                 <p className="text-xs text-zinc-500 font-mono italic">Nu ai creat niciun program personalizat.</p>
             ) : (
                 customPrograms.map(p => (
                     <div key={p.id} onClick={() => navigate(`/settings/program-editor/${p.id}`)} className="bg-black border border-zinc-800 p-3 flex justify-between items-center cursor-pointer hover:border-zinc-600 group">
                         <div>
                             <h4 className="text-sm font-bold text-white">{p.name}</h4>
                             <span className="text-[9px] text-zinc-500 uppercase tracking-widest">{p.exercises.length} Exerciții</span>
                         </div>
                         <div className="flex items-center gap-3">
                            <Edit size={14} className="text-zinc-600 group-hover:text-primary transition-colors" />
                            <button onClick={(e) => handleDeleteProgram(e, p.id)} className="text-zinc-600 hover:text-red-500 transition-colors">
                                <Trash2 size={14} />
                            </button>
                         </div>
                     </div>
                 ))
             )}
         </div>
         <button onClick={() => navigate('/settings/program-editor')} className="w-full mt-4 py-3 border border-dashed border-zinc-700 text-zinc-500 text-xs font-bold uppercase tracking-widest hover:text-white hover:border-zinc-500 transition-colors">
             + Creează Program Nou
         </button>
      </div>

      {/* Advanced Mode Toggle */}
      <div className="bg-surface border-2 border-zinc-900 p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
            <div>
                <h3 className="text-lg font-black text-white uppercase tracking-wider">Modul Avansat</h3>
                <p className="text-xs text-zinc-500 font-mono mt-1">Activează sugestii pentru volum și periodizare.</p>
            </div>
            <button onClick={toggleAdvancedMode} className="text-primary hover:text-white transition-colors">
                {advancedMode ? <ToggleRight size={48} className="fill-primary text-black" /> : <ToggleLeft size={48} className="text-zinc-800" />}
            </button>
        </div>
        {advancedMode && (
            <div className="mt-4 pt-4 border-t border-zinc-900">
                <Link to="/education?section=s8_1" className="text-[10px] text-primary font-bold uppercase tracking-widest flex items-center hover:underline">
                    <HelpCircle size={12} className="mr-2" />
                    Citește despre Autoreglare
                </Link>
            </div>
        )}
      </div>

      {/* Export */}
      <div className="bg-surface border-2 border-zinc-900 p-6 mb-6">
        <h3 className="text-lg font-black text-white uppercase tracking-wider mb-4">Export Date</h3>
        <div className="flex gap-4">
            <button onClick={handleExportCSV} className="flex-1 flex items-center justify-center space-x-2 bg-zinc-950 hover:bg-white hover:text-black text-white px-4 py-4 border border-zinc-800 text-xs font-black uppercase tracking-widest transition-all">
                <FileText size={16} />
                <span>CSV</span>
            </button>
            <button onClick={handleExportPDF} className="flex-1 flex items-center justify-center space-x-2 bg-zinc-950 hover:bg-white hover:text-black text-white px-4 py-4 border border-zinc-800 text-xs font-black uppercase tracking-widest transition-all">
                <Download size={16} />
                <span>PDF</span>
            </button>
        </div>
      </div>

      {/* Integrity */}
      <div className="bg-surface border-2 border-zinc-900 p-6 mb-6">
        <h3 className="text-lg font-black text-white uppercase tracking-wider mb-4">Mentenanță</h3>
        <button onClick={runIntegrity} className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-500 mb-4 text-xs font-black uppercase tracking-widest">
            <ShieldCheck size={16} />
            <span>Verificare integritate</span>
        </button>
        
        {integrityReport && (
            <div className="bg-black p-4 border border-zinc-800 text-[10px] font-mono text-zinc-400">
                {integrityReport.map((line, i) => (
                    <div key={i}>{line}</div>
                ))}
            </div>
        )}
      </div>

      {/* Danger Zone */}
      <div className="border-2 border-red-900/50 p-6 bg-red-950/5">
        <h3 className="text-lg font-black text-red-700 uppercase tracking-wider mb-4">Zonă Periculoasă</h3>
        <p className="text-zinc-500 text-xs mb-4 font-mono">Această acțiune este ireversibilă.</p>
        <button onClick={handleDeleteAccount} className="flex items-center space-x-2 text-red-600 hover:text-red-500 text-xs font-black uppercase tracking-widest">
            <Trash2 size={16} />
            <span>Șterge Cont & Date</span>
        </button>
      </div>
    </div>
  );
};

export default Settings;