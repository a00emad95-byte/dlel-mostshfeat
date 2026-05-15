
import React, { useEffect, useState } from 'react';
import LogoIcon from './LogoIcon';

interface SplashScreenProps {
  onEnter: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onEnter }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleStart = () => {
    setIsExiting(true);
    setTimeout(onEnter, 400); 
  };

  return (
    <div 
      className={`dark fixed inset-0 bg-[#020617] flex flex-col items-center justify-center z-50 touch-manipulation cursor-pointer select-none overflow-hidden transition-all duration-500 ease-in-out ${isExiting ? 'opacity-0 scale-110 blur-lg' : 'opacity-100'}`}
      onClick={handleStart}
    >
      {/* Background - Deep Slate/Navy Professional Gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] to-[#020617]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-blue-900/5 rounded-full blur-[180px]"></div>
      </div>

      <div className="relative flex flex-col items-center px-6 max-w-4xl text-center w-full">
        <div className="space-y-10 animate-fade-in-up w-full">
          {/* Main Logo - Increased size */}
          <div className="w-64 h-64 md:w-96 md:h-96 mx-auto">
            <LogoIcon className="w-full h-full" />
          </div>
          
          <div className="space-y-6">
            <h1 className="text-5xl md:text-8xl font-black text-white leading-tight font-cairo tracking-tight">
              الدليل الطبي
            </h1>
            <div className="flex items-center justify-center gap-6 opacity-30">
               <div className="h-[1.5px] w-8 bg-white"></div>
               <p className="text-sm md:text-lg text-white font-bold tracking-[0.25em]">
                 للمستشفيات والمراكز الطبية
               </p>
               <div className="h-[1.5px] w-8 bg-white"></div>
            </div>
          </div>
        </div>
        
        {/* Interaction Prompt */}
        <div className="mt-24 flex flex-col items-center gap-6">
          <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white/20 transition-transform duration-200 animate-bounce">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m7 13 5 5 5-5M7 6l5 5 5-5"/>
            </svg>
          </div>
          <p className="text-white/10 font-bold text-[11px] tracking-[0.7em] uppercase">اضغط للبدء</p>
        </div>
      </div>

      {/* Developer Credit - Upscaled & Font Changed */}
      <div className="absolute bottom-12 flex flex-col items-center gap-1.5 no-print">
        <div className="text-blue-50/70 font-mono font-bold tracking-[0.4em] uppercase text-xs md:text-sm drop-shadow-lg">
          AHMAD EMAD
        </div>
        <div className="text-blue-50/40 font-mono font-bold tracking-[0.2em] uppercase text-[8px] md:text-[10px]">
          update 0.2
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
