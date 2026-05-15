
import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import HomeScreen from './components/HomeScreen';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'home'>('splash');
  
  // Theme State Management
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
       const savedTheme = localStorage.getItem('theme');
       if (savedTheme) return savedTheme === 'dark';
       return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply theme class to HTML element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <>
      {currentScreen === 'splash' ? (
        <SplashScreen onEnter={() => setCurrentScreen('home')} />
      ) : (
        <HomeScreen 
          onBack={() => setCurrentScreen('splash')} 
          isDark={isDark}
          toggleTheme={toggleTheme}
        />
      )}
    </>
  );
};

export default App;
