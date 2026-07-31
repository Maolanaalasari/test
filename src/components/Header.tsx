import React, { useState, useEffect } from 'react';
import { HeartPulse, Download, Wifi, WifiOff, Smartphone, FileCode2 } from 'lucide-react';

interface HeaderProps {
  onOpenPhpExporter: () => void;
  onOpenPwaInfo: () => void;
  activeTab: string;
}

export const Header: React.FC<HeaderProps> = ({ onOpenPhpExporter, onOpenPwaInfo, activeTab }) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          setIsInstalled(true);
        }
        setDeferredPrompt(null);
      });
    } else {
      onOpenPwaInfo();
    }
  };

  return (
    <header className="bg-sky-800 text-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-3">
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="bg-sky-600 p-2 rounded-xl shadow-inner text-amber-300">
            <HeartPulse className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg sm:text-xl tracking-tight leading-none text-white">
                Posyandu Digital
              </h1>
              <span className="bg-amber-400 text-sky-950 font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                PWA Ready
              </span>
            </div>
            <p className="text-xs text-sky-200 mt-0.5 hidden sm:block">
              Sistem Informasi Posyandu Terpadu • Balita, KMS, & Ibu Hamil
            </p>
          </div>
        </div>

        {/* Action Badges & Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Online/Offline Status Indicator */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm transition ${
              isOnline
                ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/30'
                : 'bg-rose-500/30 text-rose-200 border border-rose-400/30 animate-bounce'
            }`}
          >
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-rose-400" />
                <span>Mode Offline (PWA)</span>
              </>
            )}
          </div>

          {/* PHP Code Exporter Button */}
          <button
            onClick={onOpenPhpExporter}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition shadow-sm ${
              activeTab === 'php'
                ? 'bg-amber-400 text-slate-900 border-amber-300'
                : 'bg-sky-700/80 hover:bg-sky-700 text-sky-100 border-sky-600 hover:text-white'
            }`}
            title="Lihat & Download Source Code PHP Native + MySQL"
          >
            <FileCode2 className="w-4 h-4 text-amber-300" />
            <span className="hidden md:inline">Source Code</span> PHP
          </button>

          {/* PWA Install App Button */}
          {!isInstalled && (
            <button
              onClick={handleInstallClick}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-md transition flex items-center gap-1.5 border border-emerald-400/50"
            >
              <Smartphone className="w-4 h-4" />
              <span>Instal PWA</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
