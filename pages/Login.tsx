
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Trash2, ArrowRight, User, AlertTriangle, Plus } from 'lucide-react';
import { User as UserType } from '../types';

const Login: React.FC = () => {
  const [newName, setNewName] = useState('');
  const [userToDelete, setUserToDelete] = useState<UserType | null>(null);
  const { availableUsers, register, login, deleteUser, user } = useAuth();
  const navigate = useNavigate();
  
  // Cinematic Animation State
  const [showContent, setShowContent] = useState(false);
  const [introPhase, setIntroPhase] = useState(0); // 0: Start, 1: Logo Reveal, 2: Content

  useEffect(() => {
    // If user is already authenticated, redirect immediately
    if (user) {
        navigate('/');
        return;
    }

    // Sequence the animation
    const timer1 = setTimeout(() => setIntroPhase(1), 500);
    const timer2 = setTimeout(() => {
        setIntroPhase(2);
        setShowContent(true);
    }, 2500);

    return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
    };
  }, [user, navigate]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      register(newName.trim());
      setNewName('');
      navigate('/');
    }
  };

  const handleLogin = (userId: string) => {
      login(userId);
      navigate('/');
  }

  const handleDeleteClick = (e: React.MouseEvent, user: UserType) => {
      e.stopPropagation();
      setUserToDelete(user);
  };

  const confirmDelete = () => {
      if (userToDelete) {
          deleteUser(userToDelete.id, true);
          setUserToDelete(null);
      }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col font-sans relative overflow-hidden">
      
      {/* Intro Overlay - Only visible during phase 0 and 1 */}
      <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-1000 ${introPhase >= 2 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
         <div className={`transform transition-all duration-1000 ${introPhase === 1 ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
             <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter font-heading text-center animate-title-reveal">
                 TRAINED BY <span className="text-primary block md:inline">RDZ</span>
             </h1>
             <div className="w-24 h-1 bg-primary mx-auto mt-4 animate-pulse-fast shadow-[0_0_20px_#D4AF37]"></div>
         </div>
      </div>

      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[60%] bg-primary radial-gradient opacity-[0.03] blur-[100px] pointer-events-none"></div>

      <div className={`relative z-10 flex flex-col h-full px-8 py-12 max-w-md mx-auto w-full transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        <div className="mb-12 text-center">
           <div className="inline-block border-b-2 border-primary mb-2 pb-1">
                <h2 className="text-xl font-black text-white tracking-tighter font-heading">TRAINED BY <span className="text-primary">RDZ</span></h2>
           </div>
           <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-[0.3em] animate-pulse">System Online</p>
        </div>

        {/* User Lobby List */}
        <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar pb-8 px-1">
            {availableUsers.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-zinc-800 bg-zinc-900/30">
                    <p className="text-zinc-600 text-xs uppercase tracking-widest font-bold">Inițializează Primul Atlet</p>
                </div>
            ) : (
                <>
                    <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest mb-2 pl-1">Select Profile</p>
                    {availableUsers.map((u, index) => (
                        <div 
                            key={u.id} 
                            style={{ animationDelay: `${index * 100}ms` }}
                            className="group relative bg-card border border-zinc-900 p-1 pr-16 transition-all hover:border-primary/50 hover:bg-zinc-900 animate-cinematic-slide-up"
                        >
                            <button 
                            onClick={() => handleLogin(u.id)}
                            className="flex items-center w-full p-4 text-left"
                            >
                                <div className="w-12 h-12 bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-600 mr-5 group-hover:text-primary group-hover:border-primary transition-all shadow-lg">
                                    <User size={20} />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg uppercase tracking-wide group-hover:text-primary transition-colors">{u.name}</h3>
                                    <div className="flex items-center mt-1">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                                        <p className="text-[9px] text-zinc-500 font-mono group-hover:text-zinc-300">READY</p>
                                    </div>
                                </div>
                            </button>
                            
                            {/* Delete Action */}
                            <button 
                            onClick={(e) => handleDeleteClick(e, u)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-zinc-700 hover:text-red-500 hover:bg-red-500/10 transition-all z-20 cursor-pointer active:scale-90"
                            title="Delete User"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </>
            )}
        </div>

        {/* Register Form */}
        <div className="mt-auto pt-8 border-t border-zinc-900">
          <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest mb-3 pl-1">New Profile</p>
          <form onSubmit={handleRegister} className="relative group">
              <input 
                type="text" 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-surface border border-zinc-800 text-white pl-6 pr-16 py-5 focus:border-primary transition-colors placeholder-zinc-700 text-sm font-bold uppercase tracking-widest outline-none"
                placeholder="Introdu Nume..."
              />
              <button 
                  type="submit"
                  disabled={!newName.trim()}
                  className="absolute right-2 top-2 bottom-2 aspect-square bg-zinc-800 text-white flex items-center justify-center disabled:opacity-0 disabled:translate-x-4 transition-all duration-300 hover:bg-primary hover:text-black"
              >
                  <Plus size={20} />
              </button>
          </form>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {userToDelete && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-6 animate-fade-in" onClick={() => setUserToDelete(null)}>
            <div className="bg-card border border-zinc-800 p-8 w-full max-w-sm shadow-2xl relative" onClick={e => e.stopPropagation()}>
                
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 text-red-500 border border-red-500/20">
                         <AlertTriangle size={32} />
                    </div>
                    
                    <h3 className="text-xl font-black text-white uppercase tracking-wide mb-2">Ștergi utilizatorul?</h3>
                    <p className="text-zinc-400 text-sm mb-6 font-mono">
                        <span className="text-white font-bold border-b border-zinc-700">{userToDelete.name}</span> va fi șters definitiv, împreună cu tot istoricul antrenamentelor.
                    </p>

                    <div className="grid grid-cols-2 gap-3 w-full">
                        <button 
                            onClick={() => setUserToDelete(null)}
                            className="bg-zinc-900 border border-zinc-700 text-white font-bold py-4 hover:bg-zinc-800 transition-colors uppercase tracking-widest text-xs"
                        >
                            Anulează
                        </button>
                        <button 
                            onClick={confirmDelete}
                            className="bg-red-600 text-white font-bold py-4 hover:bg-red-700 transition-colors uppercase tracking-widest text-xs shadow-glow"
                        >
                            Șterge
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Login;
