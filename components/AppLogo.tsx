
import React from 'react';
import LogoIcon from './LogoIcon';

export const AppLogo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div 
      className={`flex items-center justify-center bg-transparent ${className}`}
    >
      <LogoIcon className="w-full h-full" />
    </div>
  );
};

export default AppLogo;
