import React, { useState, useEffect } from 'react';
import {
  Wifi,
  Battery,
  Smartphone,
  Maximize2,
  Minimize2,
  Moon,
  Sun,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenNewTaskModal: () => void;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  darkMode,
  onToggleDarkMode,
  soundEnabled,
  onToggleSound,
}) => {
  const [currentTime, setCurrentTime] = useState('');
  const [isFramed, setIsFramed] = useState(true);

  // Update status bar time every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-0 sm:p-4 select-none">
      {/* Desktop Top Control Bar for Android App Experience */}
      <header className="w-full max-w-md hidden sm:flex items-center justify-between mb-3 px-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-indigo-400" />
          <span className="font-medium text-slate-200">Android OS Simulator</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Sound toggle */}
          <button
            id="toggle-sound-btn"
            type="button"
            onClick={onToggleSound}
            title={soundEnabled ? 'Désactiver les sons' : 'Activer les sons'}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-indigo-400" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Theme toggle */}
          <button
            id="toggle-theme-btn"
            type="button"
            onClick={onToggleDarkMode}
            title={darkMode ? 'Passer en mode clair' : 'Passer en mode sombre'}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
          </button>

          {/* Frame toggle */}
          <button
            id="toggle-frame-btn"
            type="button"
            onClick={() => setIsFramed(!isFramed)}
            title={isFramed ? 'Vue plein écran' : 'Vue smartphone'}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1.5"
          >
            {isFramed ? (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Plein écran</span>
              </>
            ) : (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Format Mobile</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Container - either Smartphone shell or full screen responsive */}
      <div
        className={`w-full transition-all duration-300 flex flex-col ${
          isFramed
            ? 'sm:max-w-[430px] sm:h-[880px] sm:rounded-[48px] sm:border-[8px] sm:border-slate-800 sm:shadow-2xl sm:shadow-indigo-950/40 relative sm:overflow-hidden bg-white dark:bg-slate-900'
            : 'max-w-2xl min-h-screen sm:min-h-0 sm:rounded-3xl sm:border sm:border-slate-800 bg-white dark:bg-slate-900'
        }`}
      >
        {/* Android Punch Hole Camera (on framed desktop) */}
        {isFramed && (
          <div className="hidden sm:block absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full z-40 border border-slate-800 shadow-inner" />
        )}

        {/* Android Status Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 px-6 pt-3 pb-2 flex items-center justify-between text-xs font-medium z-30 border-b border-slate-200/50 dark:border-slate-800/60">
          <div className="flex items-center gap-2">
            <span className="font-semibold tracking-tight">{currentTime || '12:00'}</span>
          </div>

          <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-400">
            <span className="text-[10px] font-bold tracking-wider">5G</span>
            <Wifi className="w-3.5 h-3.5" />
            <div className="flex items-center gap-1">
              <span className="text-[10px]">98%</span>
              <Battery className="w-4 h-4 text-emerald-500 fill-emerald-500" />
            </div>
          </div>
        </div>

        {/* App Content Area */}
        <div className="flex-1 flex flex-col overflow-y-auto relative no-scrollbar">
          {children}
        </div>

        {/* Android Gesture Bar / 3-button navigation footer */}
        <div className="w-full bg-slate-100 dark:bg-slate-900/95 py-2 flex items-center justify-center border-t border-slate-200/50 dark:border-slate-800/60 z-20">
          <div className="w-32 h-1 bg-slate-400 dark:bg-slate-600 rounded-full" />
        </div>
      </div>
    </div>
  );
};
