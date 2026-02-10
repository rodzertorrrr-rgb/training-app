import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { EDUCATION_CONTENT } from '../constants';
import { ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { EduCategory } from '../types';

const CATEGORY_NAMES: Record<EduCategory, string> = {
    'FOUNDATION': 'A) TEHNICI DE ANTRENAMENT',
    'EFFORT': 'B) MĂSURAREA EFORTULUI',
    'CLARITY': 'C) CLARIFICĂRI CRITICE',
    'STRUCTURE': 'D) STRUCTURA PROGRAMULUI',
    'RECOVERY': 'E) AUTOREGLARE & RECUPERARE',
    'ADVANCED': 'F) INDIVIDUALIZARE & AVANSAȚI',
    'PHILOSOPHY': 'G) FILOSOFIA APLICAȚIEI'
};

const Education: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [openSections, setOpenSections] = useState<string[]>([]);

  // Handle Deep Linking
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sectionId = params.get('section');
    if (sectionId) {
        if (!openSections.includes(sectionId)) {
            setOpenSections(prev => [...prev, sectionId]);
        }
        setTimeout(() => {
            const el = document.getElementById(sectionId);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }
  }, [location]);

  const toggleSection = (id: string) => {
    let newState: string[];
    if (openSections.includes(id)) {
        newState = openSections.filter(sid => sid !== id);
    } else {
        newState = [...openSections, id];
    }
    setOpenSections(newState);
  };

  // Group Content by Category
  const groupedContent = EDUCATION_CONTENT.reduce((acc, section) => {
    const cat = section.category || 'FOUNDATION';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(section);
    return acc;
  }, {} as Record<EduCategory, typeof EDUCATION_CONTENT>);

  // Order of categories
  const categoryOrder: EduCategory[] = ['FOUNDATION', 'EFFORT', 'CLARITY', 'STRUCTURE', 'RECOVERY', 'ADVANCED', 'PHILOSOPHY'];

  return (
    <div className="pb-24">
      <header className="mb-8 border-l-4 border-primary pl-4">
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">Tehnică &<br/><span className="text-primary">Raționament</span></h2>
        <p className="text-zinc-500 text-xs mt-2 font-mono uppercase tracking-widest">
           Sistemul de operare al hipertrofiei
        </p>
      </header>

      <div className="space-y-8">
        {categoryOrder.map((cat) => {
            if (!groupedContent[cat]) return null;
            return (
                <div key={cat}>
                    <h3 className="text-sm font-black text-zinc-500 uppercase tracking-widest mb-3 border-b border-zinc-800 pb-1">
                        {CATEGORY_NAMES[cat]}
                    </h3>
                    <div className="space-y-1">
                        {groupedContent[cat].map(section => (
                            <div key={section.id} id={section.id} className="border-2 border-zinc-900 bg-surface">
                                <button 
                                  onClick={() => toggleSection(section.id)}
                                  className={`w-full flex justify-between items-center p-4 text-left transition-all ${
                                      openSections.includes(section.id) 
                                      ? 'bg-zinc-900 text-primary border-b-2 border-zinc-900' 
                                      : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                                  }`}
                                >
                                  <span className="font-bold text-sm uppercase tracking-wide">
                                    {section.title}
                                  </span>
                                  {openSections.includes(section.id) ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                </button>
                                
                                {openSections.includes(section.id) && (
                                  <div className="p-5 text-sm text-zinc-400 leading-relaxed bg-black/50 font-mono">
                                    {section.type === 'list' && Array.isArray(section.content) ? (
                                      <ul className="space-y-3">
                                        {section.content.map((item, idx) => (
                                          <li key={idx} className="flex items-start">
                                            <span className="text-primary mr-2">■</span>
                                            {item}
                                          </li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <p>{section.content}</p>
                                    )}
                                  </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )
        })}
      </div>
    </div>
  );
};

export default Education;