import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EDUCATION_CONTENT } from '../constants.ts';
import { ChevronDown, ChevronUp, X, Sparkles, ShieldCheck, BookOpen } from 'lucide-react';

const Education: React.FC = () => {
  const navigate = useNavigate();
  const [openItems, setOpenItems] = useState<string[]>(['rdz_sec1']);

  const toggleItem = (id: string) => {
    setOpenItems(prev => prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]);
  };

  return (
    <div className="pb-32 animate-fade-in bg-black min-h-screen">
      <header className="mb-12 pt-6 px-1 flex justify-between items-start relative z-10">
        <div className="border-l-4 border-primary pl-6 py-1">
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">
              MANUAL<br/>
              <span className="text-primary italic">RDZ</span>
            </h1>
            <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em] mt-3">
              Ghidul Intern al Hipertrofiei
            </p>
        </div>
        <button 
            onClick={() => navigate('/')} 
            className="p-3 bg-zinc-900/50 backdrop-blur-md border border-white/5 rounded-2xl text-zinc-500 hover:text-white active:scale-90 transition-all"
        >
            <X size={24} />
        </button>
      </header>

      <div className="space-y-4 px-1 relative z-10">
        {EDUCATION_CONTENT.map((section) => (
          <div key={section.id} className="rounded-3xl border border-white/5 bg-zinc-950/50 overflow-hidden transition-all shadow-premium backdrop-blur-sm">
              <button 
                onClick={() => toggleItem(section.id)}
                className={`w-full flex justify-between items-center p-6 text-left transition-all ${
                    openItems.includes(section.id) 
                    ? 'bg-primary/5 text-primary' 
                    : 'text-zinc-400 hover:bg-zinc-900/30'
                }`}
              >
                <div className="flex items-center gap-4">
                  <ShieldCheck size={18} className={openItems.includes(section.id) ? 'text-primary' : 'text-zinc-800'} />
                  <span className="font-black text-xs uppercase tracking-widest">
                    {section.title}
                  </span>
                </div>
                {openItems.includes(section.id) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              
              {openItems.includes(section.id) && (
                <div className="p-8 pt-0 text-[11px] text-zinc-400 leading-relaxed font-medium animate-slide-up border-t border-white/5 bg-black/40">
                  <ul className="space-y-6 mt-6">
                    {Array.isArray(section.content) && section.content.map((point: string, pIdx: number) => (
                      <li key={pIdx} className="flex items-start gap-4">
                        <div className="mt-1.5 shrink-0 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_10px_#D4AF37]"></div>
                        <span className="uppercase tracking-tight leading-normal text-zinc-300 font-bold">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        ))}
      </div>

      <div className="mt-20 p-12 text-center bg-zinc-950/80 rounded-[3rem] border border-white/10 relative overflow-hidden mx-1 shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30"></div>
          <BookOpen size={44} className="mx-auto text-primary/20 mb-6" />
          <h4 className="text-[11px] font-black text-white uppercase tracking-[0.3em] mb-4">PROTOCOLUL ESTE LEGEA</h4>
          <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.4em] leading-loose max-w-[240px] mx-auto">
            Consistența este singura scurtătură către rezultate. Nu modifica protocolul fără motiv.
          </p>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="mt-10 text-primary/40 text-[9px] font-black uppercase tracking-widest hover:text-primary transition-colors border-b border-primary/10 pb-1"
          >
            Înapoi la început
          </button>
      </div>
      
      <div className="fixed top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
    </div>
  );
};

export default Education;
