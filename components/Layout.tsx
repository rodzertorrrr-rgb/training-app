
import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useData } from '../context/DataContext.tsx';
import { Home, ClipboardList, BookOpen, Settings, Users } from 'lucide-react';

const Layout: React.FC = () => {
  const { draftSession } = useData();
  const location = useLocation();

  const navItems = [
    { to: "/", label: "Acasă", icon: <Home size={20} /> },
    { to: "/coach", label: "Coach", icon: <Users size={20} /> },
    { to: "/history", label: "Istoric", icon: <ClipboardList size={20} /> },
    { to: "/education", label: "Manual", icon: <BookOpen size={20} /> },
    { to: "/settings", label: "Setări", icon: <Settings size={20} /> },
  ];

  const isWorkoutActive = location.pathname.includes('/workout/');

  return (
    <div className="min-h-screen bg-background text-zinc-200 font-sans selection:bg-primary selection:text-black">
      <main className={`pt-6 px-5 max-w-xl mx-auto min-h-screen relative z-10 ${isWorkoutActive ? 'pb-10' : 'pb-32'}`}>
        <Outlet />
      </main>

      {!isWorkoutActive && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-6 pointer-events-none">
          <div className="bg-zinc-900/90 backdrop-blur-lg border border-zinc-800 rounded-2xl h-16 flex items-center justify-around px-2 shadow-2xl pointer-events-auto w-[90%] max-w-md">
              {navItems.map((item) => (
                  <NavLink 
                    key={item.to} 
                    to={item.to} 
                    className={({ isActive }) => `
                        relative flex flex-col items-center justify-center w-full h-full transition-all duration-200
                        ${isActive ? 'text-primary' : 'text-zinc-500 hover:text-zinc-300'}
                    `}
                  >
                    {({ isActive }) => (
                        <>
                          <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                            {item.icon}
                          </div>
                          <span className={`text-[8px] font-bold mt-1 transition-all duration-200 uppercase tracking-tighter ${isActive ? 'opacity-100' : 'opacity-0 scale-75'}`}>
                            {item.label}
                          </span>
                        </>
                    )}
                  </NavLink>
              ))}
          </div>
        </nav>
      )}
    </div>
  );
};

export default Layout;
