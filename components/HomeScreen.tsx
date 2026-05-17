
import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Search, MapPin, FileDown, ArrowUpCircle, ChevronRight, X, Moon, Sun, Building2, Microscope, Package, CalendarDays } from 'lucide-react';
import { HOSPITALS, LABS, PROSTHETICS, HEARING, SPEECH, PHYSIO } from '../constants';
import HospitalCard from './HospitalCard';
import Toast from './Toast';
import BottomNav, { TabId } from './BottomNav';
import LogoIcon from './LogoIcon';
import AppLogo from './AppLogo';
import { Accessibility, Ear, MessageSquare, Activity } from 'lucide-react';

type ToastState = { message: string; type: 'success' | 'error' | 'info'; } | null;
type EntityType = 'hospitals' | 'labs' | 'prosthetics' | 'hearing' | 'speech' | 'physio';

interface HomeScreenProps {
  onBack: () => void;
  isDark: boolean;
  toggleTheme: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onBack, isDark, toggleTheme }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGov, setSelectedGov] = useState('');
  const [toast, setToast] = useState<ToastState>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState<EntityType>('hospitals');
  const [navTab, setNavTab] = useState<TabId>('home');
  const [showAboutModal, setShowAboutModal] = useState(false);
  
  const mainRef = useRef<HTMLElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const currentData = useMemo(() => {
    switch (activeTab) {
      case 'hospitals': return HOSPITALS;
      case 'labs': return LABS;
      case 'prosthetics': return PROSTHETICS;
      case 'hearing': return HEARING;
      case 'speech': return SPEECH;
      case 'physio': return PHYSIO;
      default: return HOSPITALS;
    }
  }, [activeTab]);

  const governorates = useMemo(() => {
    return Array.from(new Set(currentData.map((h) => h.gov))).sort();
  }, [currentData]);

  const filteredData = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const phoneTerm = term.replace(/[\s-]/g, '');

    return currentData.filter((h) => {
      const matchGov = !selectedGov || h.gov === selectedGov;
      if (!term) return matchGov;
      
      const normalizedPhone = h.phone.replace(/[\s-]/g, '');
      
      return matchGov && (
        h.name.toLowerCase().includes(term) ||
        h.area.toLowerCase().includes(term) ||
        (phoneTerm.length > 2 && normalizedPhone.includes(phoneTerm))
      );
    });
  }, [searchTerm, selectedGov, currentData]);

  const handleScroll = useCallback(() => {
    const scrollY = mainRef.current?.scrollTop || 0;
    if (scrollY > 150 !== showScrollTop) setShowScrollTop(scrollY > 150);
    if (scrollY > 20 !== isScrolled) setIsScrolled(scrollY > 20);
  }, [showScrollTop, isScrolled]);

  useEffect(() => {
    const mainEl = mainRef.current;
    mainEl?.addEventListener('scroll', handleScroll, { passive: true });
    return () => mainEl?.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    setSearchTerm('');
    setSelectedGov('');
    mainRef.current?.scrollTo({ top: 0 });
  }, [activeTab]);

  const handleScrollToTop = () => mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  const handleCall = useCallback((phone: string) => {
    if (!phone || phone === "-") {
      showToast("عفواً، الرقم غير متوفر", 'error');
      return;
    }
    window.location.href = `tel:${phone}`;
  }, []);

  const handleCopy = useCallback(async (phone: string) => {
    if (!navigator.clipboard) {
      showToast('المتصفح لا يدعم النسخ التلقائي', 'error');
      return;
    }
    try {
      await navigator.clipboard.writeText(phone);
      showToast('تم نسخ الرقم بنجاح');
    } catch {
      showToast('حدث خطأ أثناء النسخ', 'error');
    }
  }, []);

  const handlePrintPdf = () => {
    if (filteredData.length === 0) {
      showToast("لا توجد بيانات للطباعة", "error");
      return;
    }
    window.print();
  };

  const handleNavChange = (tab: TabId) => {
    if (tab === 'exit') {
      onBack();
      return;
    }

    setNavTab(tab);

    if (tab === 'home') {
      handleScrollToTop();
      setSearchTerm('');
      setSelectedGov('');
      setShowAboutModal(false);
    } else if (tab === 'search') {
      handleScrollToTop();
      setShowAboutModal(false);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 300);
    } else if (tab === 'about') {
      setShowAboutModal(true);
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent relative overflow-hidden font-cairo print:h-auto print:overflow-visible print:block transition-colors duration-300">
      
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* Print Header */}
      <div className="print-only p-8 border-b-2 border-black mb-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-black mb-2">دليل {
              activeTab === 'hospitals' ? 'المستشفيات' : 
              activeTab === 'labs' ? 'المعامل والأشعة' : 
              activeTab === 'prosthetics' ? 'الأجهزة التعويضية' : 
              activeTab === 'hearing' ? 'السمع والاتزان' : 
              activeTab === 'speech' ? 'التخاطب' : 'العلاج الطبيعي'
            }</h1>
            <p className="text-sm font-bold text-gray-600">صندوق الخدمات الطبية - القوات المسلحة</p>
          </div>
          <div className="text-left">
            <p className="text-xs text-gray-500">تاريخ الاستخراج</p>
            <p className="font-mono font-bold text-lg">{new Date().toLocaleDateString('ar-EG')}</p>
          </div>
        </div>
      </div>

      {/* Minimalist Compact Header */}
      <header className={`bg-white/80 dark:bg-slate-900/80 backdrop-blur-md pt-safe transition-all duration-300 z-30 no-print sticky top-0 ${isScrolled ? 'border-b border-slate-200 dark:border-slate-800 shadow-sm' : ''}`}>
        <div className="flex flex-col px-4 pt-4 pb-2">
          
          <div className="flex justify-between items-center mb-3">
            <button 
              onClick={onBack} 
              className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all active:scale-90"
            >
              <ChevronRight size={18} strokeWidth={2.5} />
            </button>
            
            <div className={`flex items-center gap-3 transition-all duration-300 ${isScrolled ? 'opacity-100 scale-100' : 'opacity-100 scale-100'}`}>
               <LogoIcon className="w-11 h-11" />
               <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">الدليل الطبي</h1>
            </div>

             <div className="flex items-center gap-2">
               <button 
                onClick={toggleTheme} 
                className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-yellow-400 transition-all active:scale-90"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              
              <button 
                onClick={handlePrintPdf} 
                className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all active:scale-90"
              >
                <FileDown size={18} />
              </button>
             </div>
          </div>

          <div className="relative z-20 group">
             <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <Search className="text-slate-400 group-focus-within:text-slate-900 dark:group-focus-within:text-white transition-colors" size={18} />
             </div>
             <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={activeTab === 'hospitals' ? "ابحث باسم المستشفى..." : "ابحث بالاسم..."}
                className="w-full py-2.5 pr-10 pl-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 font-bold focus:outline-none focus:border-slate-400 dark:focus:border-slate-600 transition-all shadow-sm"
             />
             {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 left-3 flex items-center text-slate-400 hover:text-red-500"
                >
                  <X size={16} />
                </button>
             )}
          </div>

          <div className="flex gap-2 mt-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4">
             <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg shrink-0 border border-slate-200 dark:border-slate-800">
                <button 
                  onClick={() => setActiveTab('hospitals')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'hospitals' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                >
                  <Building2 size={14} />
                  <span>مستشفيات</span>
                </button>
                <button 
                  onClick={() => setActiveTab('labs')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'labs' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                >
                  <Microscope size={14} />
                  <span>معامل وأشعة</span>
                </button>
                <button 
                  onClick={() => setActiveTab('prosthetics')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'prosthetics' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                >
                  <Accessibility size={14} />
                  <span>أجهزة تعويضية</span>
                </button>
                <button 
                  onClick={() => setActiveTab('hearing')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'hearing' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                >
                  <Ear size={14} />
                  <span>سمع واتزان</span>
                </button>
                <button 
                  onClick={() => setActiveTab('speech')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'speech' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                >
                  <MessageSquare size={14} />
                  <span>تخاطب</span>
                </button>
                <button 
                  onClick={() => setActiveTab('physio')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'physio' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                >
                  <Activity size={14} />
                  <span>علاج طبيعي</span>
                </button>
             </div>

             <div className="relative shrink-0 min-w-[120px]">
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                   <MapPin size={12} />
                </div>
                <select 
                  value={selectedGov}
                  onChange={(e) => setSelectedGov(e.target.value)}
                  className="w-full h-full pl-6 pr-7 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none appearance-none"
                >
                  <option value="">كل المحافظات</option>
                  {governorates.map(gov => <option key={gov} value={gov}>{gov}</option>)}
                </select>
                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronRight size={12} className="-rotate-90" />
                </div>
             </div>
          </div>
        </div>
      </header>

      <main 
        ref={mainRef} 
        className="flex-1 overflow-y-auto px-4 pb-28 pt-2 scroll-smooth z-10"
      >
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 gap-3 print-grid">
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <HospitalCard 
                  key={`${item.name}-${index}`} 
                  hospital={item} 
                  onCall={handleCall} 
                  onCopy={handleCopy}
                  index={index}
                  type={activeTab === 'labs' ? 'lab' : 'hospital'}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-slate-300 dark:text-slate-800">
                <Search size={50} strokeWidth={1} className="mb-4 opacity-20" />
                <p className="text-base font-bold">لا توجد نتائج</p>
              </div>
            )}
          </div>
          
          <div className="mt-8 mb-4 flex flex-col items-center justify-center text-slate-300 dark:text-slate-800 no-print">
            <div className="opacity-60 flex flex-col items-center mt-8 gap-2.5">
              <LogoIcon className="w-6 h-6 opacity-20 grayscale" />
              <div className="flex flex-col items-center gap-1.5">
                <p className="text-[10px] md:text-xs font-mono font-bold tracking-[0.2em] uppercase opacity-50">Ahmad Emad</p>
                <p className="text-[8px] font-mono font-bold tracking-[0.1em] uppercase opacity-40">UPD-02</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <BottomNav activeTab={navTab} onTabChange={handleNavChange} />

      <button
        onClick={handleScrollToTop}
        className={`no-print fixed bottom-20 right-4 z-30 p-2.5 bg-slate-900 dark:bg-slate-700 text-white rounded-full shadow-lg transition-all duration-500 transform ${
            showScrollTop ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-75 pointer-events-none'
        } hover:bg-black active:scale-90`}
      >
        <ArrowUpCircle size={20} strokeWidth={2} />
      </button>

      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fade-in-up" onClick={() => setShowAboutModal(false)}>
           <div className="bg-white dark:bg-slate-900 w-full max-w-xs rounded-3xl p-6 shadow-2xl relative border border-slate-100 dark:border-slate-800" onClick={e => e.stopPropagation()}>
              <button onClick={() => setShowAboutModal(false)} className="absolute top-4 right-4 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 hover:text-black dark:hover:text-white transition-colors">
                <X size={16} />
              </button>
              
              <div className="flex flex-col items-center text-center">
                 <div className="w-16 h-16 mb-4">
                    <AppLogo />
                 </div>
                 <div className="mb-6">
                    <h2 className="text-xl font-black text-slate-800 dark:text-white">الدليل الطبي</h2>
                 </div>

                <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 text-center w-full">
                    <div className="flex justify-center items-center gap-4 text-xs font-bold text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div className="flex items-center gap-1.5">
                            <Package size={12} />
                            <span>إصدار 1.4</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <CalendarDays size={12} />
                            <span>فبراير 2026</span>
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg text-xs text-slate-500 dark:text-slate-400 text-center font-medium border border-slate-100 dark:border-slate-800">
                        <p>
                            هذا الدليل لمساعدة الأعضاء في الوصول إلى الجهات المتعاقد معها.
                        </p>
                    </div>

                    <div className="pt-6 flex flex-col items-center gap-2 text-xs text-slate-400 dark:text-slate-500 font-bold border-t border-slate-100 dark:border-slate-800 w-full">
                        <p>تطوير: أحمد عماد</p>
                        <p className="text-[10px] opacity-70">UPD-02</p>
                    </div>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
