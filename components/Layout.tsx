
import React from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Dumbbell, History, TrendingUp, BookOpen, Settings, Scale } from 'lucide-react';

const Layout: React.FC = () => {
  const { draftSession } = useData();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { to: "/", label: "LOG", icon: <Dumbbell size={22} /> },
    { to: "/weight", label: "GREUTATE", icon: <Scale size={22} /> },
    { to: "/history", label: "ISTORIC", icon: <History size={22} /> },
    { to: "/progress", label: "PROGRES", icon: <TrendingUp size={22} /> },
    { to: "/settings", label: "SETĂRI", icon: <Settings size={22} /> },
  ];

  const isFocusMode = location.pathname.includes('/settings/program-editor');
  const isWorkoutActive = draftSession && location.pathname !== `/workout/${draftSession.dayId}` && !isFocusMode;

  return (
    <div className="min-h-screen bg-background text-zinc-200 font-sans selection:bg-primary selection:text-black">
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0"></div>

      <main className={`pt-6 px-6 max-w-2xl mx-auto min-h-screen relative z-10 transition-all duration-500 ${isFocusMode ? 'pb-12' : 'pb-32'}`}>
        <Outlet />
      </main>

      {isWorkoutActive && (
        <div className="fixed bottom-[100px] left-6 right-6 z-40 max-w-2xl mx-auto animate-slide-up">
            <button 
               onClick={() => navigate(`/workout/${draftSession.dayId}`)}
               className="w-full glass-panel shadow-glow p-0.5 group overflow-hidden relative"
            >
               <div className="bg-black/80 w-full h-full p-4 flex justify-between items-center relative z-10">
                   <div className="absolute left-0 top-0 h-full w-[3px] bg-gold-gradient"></div>
                   <div className="flex flex-col text-left pl-3">
                        <span className="text-[9px] text-primary uppercase font-black tracking-widest mb-1 flex items-center">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse mr-2 shadow-[0_0_5px_#D4AF37]"></span>
                            Live Session
                        </span>
                        <span className="text-sm font-bold text-white truncate max-w-[180px] group-hover:text-gold-gradient transition-all">{draftSession.dayName}</span>
                   </div>
                   <div className="bg-primary/10 text-primary border border-primary/30 px-4 py-2 text-[10px] font-black uppercase tracking-widest group-hover:bg-primary group-hover:text-black transition-all duration-300">
                       Resume
                   </div>
               </div>
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none z-20"></div>
            </button>
        </div>
      )}

      <nav className={`fixed bottom-6 left-4 right-4 z-50 max-w-2xl mx-auto transition-all duration-500 ease-in-out transform ${isFocusMode ? 'translate-y-[200%] opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
        <div className="glass-panel shadow-2xl px-2 h-[72px] flex items-center justify-between relative overflow-hidden">
            <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

            {navItems.map((item) => (
                <NavLink 
                key={item.to} 
                to={item.to} 
                className={({ isActive }) => `
                    relative flex flex-col items-center justify-center w-full h-full group
                    ${isActive ? 'text-primary' : 'text-zinc-600 hover:text-zinc-300'}
                `}
                >
                {({ isActive }) => (
                    <>
                        <div className={`
                            relative z-10 transition-all duration-300 ease-out transform
                            ${isActive ? '-translate-y-1' : ''}
                        `}>
                            <div className={`${isActive ? 'drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]' : ''}`}>
                                {item.icon}
                            </div>
                        </div>
                        <span className={`
                            text-[8px] font-black tracking-widest absolute bottom-2.5 transition-all duration-300
                            ${isActive ? 'opacity-100 text-gold-gradient' : 'opacity-0 translate-y-2'}
                        `}>
                            {item.label}
                        </span>
                        {isActive && (
                            <div className="absolute top-0 w-8 h-[2px] bg-gold-gradient shadow-[0_2px_10px_#D4AF37]"></div>
                        )}
                        <div className="absolute inset-2 bg-white/5 rounded opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                    </>
                )}
                </NavLink>
            ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
