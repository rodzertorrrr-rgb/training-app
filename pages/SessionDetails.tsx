
import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { 
  ArrowLeft, Zap, Share2, X, Camera, 
  RotateCcw, Loader2, MoveHorizontal, MoveVertical, Search
} from 'lucide-react';

/**
 * MASTER DESIGN SPECIFICATIONS - "STRAVA STYLE" v2.5
 * -------------------------------------------------
 * Branding: RDZ Training Protocol (Gold #D4AF37)
 * Date Display: Auto-fetched from session context
 * Exercise Start: 1320px (Bottom 30% of canvas)
 * Transparency: 0.8 (80%) for Exercise List
 * Shadows: 20px Blur Gold Glow
 */

const SessionDetails: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { sessions, saveAchievement } = useData();
  
  const [showStoryMode, setShowStoryMode] = useState(false);
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const session = sessions.find(s => s.id === sessionId);

  if (!session) return null;

  const calculateImpactUnits = () => session.exercises.reduce((total, ex) => total + ex.sets.filter(s => s.type !== 'RAMP_UP' && s.isCompleted).length, 0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBgImage(reader.result as string);
        setTransform({ x: 0, y: 0, scale: 1 });
      };
      reader.readAsDataURL(file);
    }
  };

  const exportAsImage = async () => {
    if (!bgImage) return;
    setIsExporting(true);
    
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Fundal Negru de bază
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const img = new Image();
      img.src = bgImage;
      await new Promise((res) => img.onload = res);

      const sW = img.width;
      const sH = img.height;
      const scaleBase = Math.max(canvas.width / sW, canvas.height / sH);
      const dW = sW * scaleBase * transform.scale;
      const dH = sH * scaleBase * transform.scale;
      
      const ratio = 4.9; 
      const dX = (canvas.width - dW) / 2 + (transform.x * ratio); 
      const dY = (canvas.height - dH) / 2 + (transform.y * ratio);

      ctx.drawImage(img, dX, dY, dW, dH);

      // 2. Gradianți Overlay pentru Lizibilitate
      const topG = ctx.createLinearGradient(0, 0, 0, 550);
      topG.addColorStop(0, 'rgba(0,0,0,0.7)');
      topG.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = topG;
      ctx.fillRect(0, 0, canvas.width, 550);

      const bottomG = ctx.createLinearGradient(0, canvas.height - 1000, 0, canvas.height);
      bottomG.addColorStop(0, 'rgba(0,0,0,0)');
      bottomG.addColorStop(1, 'rgba(0,0,0,0.95)');
      ctx.fillStyle = bottomG;
      ctx.fillRect(0, canvas.height - 1000, canvas.width, 1000);

      // 3. Branding & Header (Opacitate 100%)
      ctx.globalAlpha = 1.0;
      ctx.shadowColor = 'rgba(0,0,0,0.9)';
      ctx.shadowBlur = 25;

      // RDZ TITLE
      ctx.textAlign = 'center';
      ctx.fillStyle = '#D4AF37'; 
      ctx.font = '900 115px Montserrat'; 
      ctx.fillText('RDZ', canvas.width / 2, 195);
      
      // PROTOCOL SUBTITLE
      ctx.font = '700 24px Montserrat';
      ctx.letterSpacing = '14px';
      ctx.fillText('TRAINING PROTOCOL', canvas.width / 2, 250);
      
      // AUTO-DATE
      const sessionDate = new Date(session.completedAt || Date.now()).toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' });
      ctx.letterSpacing = '5px';
      ctx.font = '700 20px Montserrat';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.fillText(sessionDate, canvas.width / 2, 295);
      ctx.letterSpacing = '0px';

      // IMPACT UNIT (CENTRU-SUS)
      const impact = calculateImpactUnits();
      const impactY = 480; 
      ctx.font = '900 130px Montserrat'; 
      ctx.fillStyle = '#D4AF37';
      ctx.shadowBlur = 30;
      ctx.fillText(impact.toString(), canvas.width / 2, impactY);

      ctx.font = '900 26px Montserrat'; 
      ctx.fillStyle = 'white';
      ctx.letterSpacing = '12px';
      ctx.shadowBlur = 10;
      ctx.fillText('SETURI HIPERTROFICE', canvas.width / 2, impactY + 50);
      ctx.letterSpacing = '0px';

      // 4. LISTA EXERCIȚII - "STRAVA STYLE" (ULTRA-JOS + 80% TRANSPARENT)
      let yPos = 1350; // Start chiar mai jos pentru libertate maximă în centru
      const exerciseStep = 58; 
      
      session.exercises.forEach(ex => {
        const top = ex.sets.find(s => s.type === 'TOP_SET') || ex.sets.find(s => s.isCompleted) || ex.sets[0];
        const hasDS = ex.sets.some(s => s.type === 'DROP_SET');
        const hasSS = ex.sets.some(s => s.type === 'SUPER_SET');
        
        let exLabel = ex.name.toUpperCase();
        if (hasDS) exLabel += " [DS]";
        if (hasSS) exLabel += " [SS]";

        // Transparență 80% cerută
        ctx.globalAlpha = 0.8; 
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(212, 175, 55, 0.35)';
        ctx.fillStyle = '#D4AF37';
        
        ctx.textAlign = 'left';
        ctx.font = '900 24px Montserrat'; 
        ctx.fillText(exLabel.substring(0, 38), 110, yPos);
        
        ctx.textAlign = 'right';
        ctx.font = '700 24px Montserrat';
        ctx.fillText(`${top.weight || 0}KG × ${top.reps || 0}`, canvas.width - 110, yPos);
        
        yPos += exerciseStep;
      });

      // FOOTER
      ctx.globalAlpha = 0.4;
      ctx.shadowBlur = 0;
      ctx.textAlign = 'center';
      ctx.font = '900 20px Montserrat';
      ctx.fillStyle = '#D4AF37';
      ctx.fillText(session.dayName.toUpperCase(), canvas.width / 2, canvas.height - 50);
      
      ctx.globalAlpha = 1.0;

      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      const link = document.createElement('a');
      link.download = `RDZ_STORY_${session.dayName.replace(/\s+/g, '_')}.jpg`;
      link.href = dataUrl;
      link.click();
      
      saveAchievement(session.id);
      setIsExporting(false);
      setShowStoryMode(false);
    } catch (e) {
      console.error("Story Export Error:", e);
      setIsExporting(false);
    }
  };

  const updateTransform = (field: 'x' | 'y' | 'scale', val: number) => {
    setTransform(prev => ({ ...prev, [field]: val }));
  };

  return (
    <div className="pb-32 animate-fade-in min-h-screen bg-background text-zinc-200">
      <header className="fixed top-0 left-0 right-0 bg-background/90 backdrop-blur-md z-50 px-5 py-4 border-b border-zinc-800 flex items-center justify-between max-w-xl mx-auto">
        <button onClick={() => navigate('/history')} className="p-2 text-zinc-500 hover:text-white"><ArrowLeft size={20}/></button>
        <div className="text-center">
            <h3 className="text-[10px] font-black text-primary uppercase tracking-widest">Protocol Detaliat</h3>
            <p className="text-xs font-bold text-white uppercase">{session.dayName}</p>
        </div>
        <button onClick={() => setShowStoryMode(true)} className="p-2 text-primary hover:scale-110 transition-transform"><Share2 size={20}/></button>
      </header>

      <div className="mt-24 space-y-6 px-1">
        <div className="bg-surface border border-zinc-800 p-8 rounded-[2.5rem] text-center shadow-premium">
           <div className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Impact Hipertrofie</div>
           <div className="text-5xl font-black text-white">{calculateImpactUnits()} <Zap size={24} className="inline text-primary ml-1"/></div>
        </div>

        <div className="space-y-3">
           {session.exercises.map((ex) => (
             <div key={ex.id} className="bg-surface border border-zinc-800 rounded-2xl overflow-hidden p-5 flex justify-between items-center group">
                <h3 className="text-[10px] font-black text-zinc-300 uppercase max-w-[70%] group-hover:text-white transition-colors">{ex.name}</h3>
                <div className="flex flex-col items-end">
                  <span className="text-xs font-black text-primary">
                    {ex.sets.filter(s => s.isCompleted).length} SETURI
                  </span>
                </div>
             </div>
           ))}
        </div>

        <button 
          onClick={() => setShowStoryMode(true)}
          className="w-full bg-white text-black py-6 rounded-3xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all mt-4 shadow-2xl"
        >
          <Share2 size={16} /> SHARE STORY RDZ
        </button>
      </div>

      {/* STORY EDITOR MODAL */}
      {showStoryMode && (
        <div className="fixed inset-0 z-[1000] bg-black flex flex-col animate-fade-in overflow-y-auto no-scrollbar shadow-2xl">
          <div className="sticky top-0 p-6 flex justify-between items-center bg-black/95 backdrop-blur-xl border-b border-white/5 z-[1010] safe-top">
            <button onClick={() => setShowStoryMode(false)} className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-500 active:scale-90">
              <X size={24} />
            </button>
            <div className="flex gap-2">
              <button onClick={() => setTransform({x:0, y:0, scale:1})} className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-white active:scale-90 border border-white/5">
                <RotateCcw size={20}/>
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="bg-primary text-black h-12 px-6 rounded-2xl text-[11px] font-black uppercase flex items-center gap-3 active:scale-95 shadow-lg">
                <Camera size={20} /> MEDIA
              </button>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          </div>

          <div className="flex-1 flex flex-col items-center py-4 px-6 overflow-y-auto pointer-events-auto">
            {/* Live Preview Box */}
            <div className="w-full max-w-[280px] aspect-[9/16] bg-zinc-950 shadow-2xl relative overflow-hidden rounded-[2.5rem] border border-white/10 shrink-0 select-none mb-6">
              <div className="absolute inset-0 pointer-events-none">
                {bgImage ? (
                  <img 
                    src={bgImage} 
                    className="absolute w-full h-full pointer-events-none object-cover"
                    style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`, transformOrigin: 'center center' }}
                    alt="preview"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-zinc-900 gap-4">
                    <Camera size={24} strokeWidth={1}/>
                    <span className="text-[6px] font-black uppercase tracking-[0.3em]">Select Media</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/70"></div>
              </div>

              {/* PREVIEW HEADER */}
              <div className="absolute top-8 left-0 right-0 text-center pointer-events-none z-10">
                <h1 className="text-xl font-black text-primary italic leading-none drop-shadow-lg">RDZ</h1>
                <p className="text-[4px] font-bold text-primary tracking-[4px] mt-0.5 uppercase">TRAINING PROTOCOL</p>
                <p className="text-[3.5px] font-bold text-white/50 tracking-[2px] mt-1 uppercase">
                  {new Date(session.completedAt || Date.now()).toLocaleDateString('ro-RO')}
                </p>
              </div>

              {/* PREVIEW IMPACT */}
              <div className="absolute top-44 left-0 right-0 text-center pointer-events-none z-10">
                <div className="text-3xl font-black text-primary leading-none tracking-tighter drop-shadow-2xl">
                    {calculateImpactUnits()}
                </div>
                <div className="text-[5px] font-black text-white uppercase tracking-[2px] -mt-1">
                    SETURI HIPERTROFICE
                </div>
              </div>

              {/* PREVIEW LIST (STRVA STYLE) */}
              <div className="absolute bottom-12 left-0 right-0 px-6 pointer-events-none z-10 space-y-1 opacity-80">
                {session.exercises.map((ex, i) => (
                  <div key={i} className="flex justify-between items-end border-b border-white/10 pb-1">
                    <span className="text-[4px] font-black text-primary uppercase truncate max-w-[120px]">
                      {ex.name}
                    </span>
                    <span className="text-[4px] font-black text-primary/80 font-mono">{(ex.sets[0]?.weight || 0)}KG</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ADJUSTMENT SLIDERS */}
            <div className="w-full max-w-sm space-y-4 py-4 pb-32">
               <div className="grid grid-cols-2 gap-3">
                  <div className="bg-zinc-900/40 p-4 rounded-3xl border border-white/5">
                    <label className="text-[7px] text-zinc-500 font-black uppercase tracking-widest flex items-center gap-2 mb-2"><MoveHorizontal size={10}/> Pan X</label>
                    <input type="range" min="-160" max="160" step="1" value={transform.x} onChange={(e) => updateTransform('x', parseInt(e.target.value))} className="w-full accent-primary bg-black h-1 rounded-lg appearance-none"/>
                  </div>
                  <div className="bg-zinc-900/40 p-4 rounded-3xl border border-white/5">
                    <label className="text-[7px] text-zinc-500 font-black uppercase tracking-widest flex items-center gap-2 mb-2"><MoveVertical size={10}/> Pan Y</label>
                    <input type="range" min="-280" max="280" step="1" value={transform.y} onChange={(e) => updateTransform('y', parseInt(e.target.value))} className="w-full accent-primary bg-black h-1 rounded-lg appearance-none"/>
                  </div>
               </div>
               <div className="bg-zinc-900/40 p-4 rounded-3xl border border-white/5">
                  <label className="text-[7px] text-zinc-500 font-black uppercase tracking-widest flex items-center gap-2 mb-2"><Search size={10}/> Zoom</label>
                  <input type="range" min="0.5" max="3" step="0.01" value={transform.scale} onChange={(e) => updateTransform('scale', parseFloat(e.target.value))} className="w-full accent-primary bg-black h-1 rounded-lg appearance-none"/>
               </div>

               <button 
                  onClick={exportAsImage}
                  disabled={isExporting || !bgImage}
                  className="w-full bg-white text-black py-6 rounded-3xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 active:scale-95 transition-all shadow-2xl disabled:opacity-20 mt-4"
                >
                  {isExporting ? <Loader2 className="animate-spin text-primary" size={24}/> : <><Share2 size={20}/> EXPORTĂ PROTOCOL FINAL</>}
                </button>
                <p className="text-[8px] text-zinc-600 font-black uppercase text-center mt-4 tracking-widest">Design configurat: Ultra-Low Positioning & 80% Opacity</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionDetails;
