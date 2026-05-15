
import React, { useState, memo } from 'react';
import { Phone, MapPin, Building2, Copy, Check, Microscope } from 'lucide-react';
import { Hospital } from '../types';

interface HospitalCardProps {
  hospital: Hospital;
  onCall: (phone: string) => void;
  onCopy: (phone: string) => void;
  index: number;
  type?: 'hospital' | 'lab';
}

const HospitalCard: React.FC<HospitalCardProps> = memo(({ hospital, onCall, onCopy, index, type = 'hospital' }) => {
  const [justCopied, setJustCopied] = useState(false);

  const handleCopyClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    if (justCopied || !hospital.phone || hospital.phone === "-") return;
    onCopy(hospital.phone);
    setJustCopied(true);
    setTimeout(() => setJustCopied(false), 1500);
  };

  // Military Check (Excluding Police)
  const isMilitary = 
    hospital.name.includes("عسكري") || 
    hospital.name.includes("القوات المسلحة") ||
    hospital.name.includes("المجمع الطبي");
    
  // Police Check
  const isPolice = hospital.name.includes("الشرطة");
    
  const hasPhone = hospital.phone && hospital.phone !== "-";

  return (
    <div 
      className="group bg-white dark:bg-[#111827] rounded-2xl p-4 transition-all duration-300 animate-fade-in-up hover:shadow-md hover:-translate-y-0.5 relative overflow-hidden border border-transparent hover:border-slate-100 dark:hover:border-slate-800 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] dark:shadow-none print:shadow-none print:border-slate-300 print:rounded-xl print:break-inside-avoid"
      style={{ animationDelay: `${Math.min(index * 30, 400)}ms` }}
    >
      {/* Military Badge */}
      {isMilitary && (
        <div className="absolute top-3 left-3 pointer-events-none opacity-20 md:opacity-100">
           <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-500 text-[9px] font-black px-1.5 py-0.5 rounded border border-amber-100/50 dark:border-amber-700/30">
            جهة عسكرية
          </div>
        </div>
      )}

      {/* Police Badge */}
      {isPolice && (
        <div className="absolute top-3 left-3 pointer-events-none opacity-20 md:opacity-100">
           <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-500 text-[9px] font-black px-1.5 py-0.5 rounded border border-blue-100/50 dark:border-blue-700/30">
            هيئة الشرطة
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {/* Header Section */}
        <div className="flex items-start gap-3">
           <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 ${
             isMilitary 
               ? 'bg-amber-100/30 dark:bg-amber-900/10 text-amber-600 dark:text-amber-500' 
               : isPolice
                 ? 'bg-blue-100/30 dark:bg-blue-900/10 text-blue-600 dark:text-blue-500'
                 : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-medical-primary/10 dark:group-hover:bg-red-900/20 group-hover:text-medical-primary dark:group-hover:text-red-400'
           }`}>
              {type === 'lab' ? (
                <Microscope size={18} strokeWidth={2} />
              ) : (
                <Building2 size={18} strokeWidth={2} />
              )}
           </div>
           
           <div className="flex-1 min-w-0 pt-0.5">
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100 leading-tight group-hover:text-medical-primary dark:group-hover:text-red-400 transition-colors truncate-multiline">
                {hospital.name}
              </h3>
              <div className="flex items-center gap-1 mt-1 text-slate-500 dark:text-slate-400">
                <MapPin size={10} />
                <span className="text-[11px] font-bold">{hospital.gov} <span className="text-slate-300 dark:text-slate-600 mx-1">|</span> {hospital.area}</span>
              </div>
           </div>
        </div>

        {/* Action Section - Compact */}
        <div className="flex items-center gap-2 mt-0.5 pt-3 border-t border-slate-50 dark:border-slate-800 print:border-none">
           {hasPhone ? (
             <>
                <div 
                  onClick={handleCopyClick}
                  className="flex-1 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg px-3 py-2.5 cursor-pointer transition-colors group/phone"
                >
                   <span className="font-mono font-bold text-slate-700 dark:text-slate-300 text-base tracking-wide">{hospital.phone}</span>
                   <div className="text-slate-300 dark:text-slate-600 group-hover/phone:text-medical-primary dark:group-hover/phone:text-red-400 transition-colors">
                      {justCopied ? <Check size={14} /> : <Copy size={14} />}
                   </div>
                </div>
                
                <button
                  onClick={() => onCall(hospital.phone)}
                  className="w-11 h-11 flex items-center justify-center rounded-lg bg-slate-900 dark:bg-slate-700 text-white shadow-md shadow-slate-200 dark:shadow-none hover:bg-medical-primary dark:hover:bg-red-600 hover:shadow-medical-primary/20 hover:scale-105 active:scale-95 transition-all"
                  title="اتصال"
                >
                   <Phone size={18} fill="currentColor" />
                </button>
             </>
           ) : (
             <div className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-lg px-3 py-2.5 text-center">
               <span className="text-xs font-bold text-slate-400 dark:text-slate-500">الرقم غير متوفر</span>
             </div>
           )}
        </div>
      </div>
    </div>
  );
});

export default HospitalCard;
