
import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); 
    }, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const config = {
    success: { bg: 'bg-emerald-600', icon: CheckCircle },
    error: { bg: 'bg-rose-600', icon: AlertCircle },
    info: { bg: 'bg-medical-primary', icon: Info }
  };

  const { bg, icon: Icon } = config[type];

  return (
    <div 
      className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-4 text-white rounded-2xl shadow-2xl transition-all duration-500 ease-out border border-white/20 backdrop-blur-md ${bg} ${visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-90 pointer-events-none'}`}
    >
      <div className="bg-white/20 p-1 rounded-lg">
        <Icon size={22} strokeWidth={2.5} />
      </div>
      <span className="font-bold text-sm md:text-base whitespace-nowrap">{message}</span>
    </div>
  );
};

export default Toast;
