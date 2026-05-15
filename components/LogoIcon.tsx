import React from 'react';
import { LOGO_PNG_BASE64 } from '../assets/logo_assets';

export const LogoIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div 
      className={`${className} logo-inverts-on-dark logo-shadow`}
      role="img"
      aria-label="شعار صندوق الخدمات الطبية"
      style={{
        backgroundImage: `url(${LOGO_PNG_BASE64})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    />
  );
};

export default LogoIcon;