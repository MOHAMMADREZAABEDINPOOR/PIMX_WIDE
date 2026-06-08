
import React, { useState, useEffect, useLayoutEffect } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Encrypt from './pages/Encrypt';
import Decrypt from './pages/Decrypt';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import SLA from './pages/SLA';
import About from './pages/About';
import { AdminPage } from './pages/Admin';
import { AppRoute } from './types';
import { Hexagon, Fingerprint } from 'lucide-react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

// --- Boot Screen Component ---
const BootScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const { t } = useLanguage();

  const bootLogs = [
    t('boot_log_1'),
    t('boot_log_2'),
    t('boot_log_3'),
    t('boot_log_4'),
    t('boot_log_5'),
    t('boot_log_6')
  ];

  useEffect(() => {
    let logIndex = 0;
    
    // Log interval
    const logInterval = setInterval(() => {
      if (logIndex < bootLogs.length) {
        setLogs(prev => [...prev, bootLogs[logIndex]]);
        logIndex++;
      }
    }, 400);

    // Progress bar interval
    const progressInterval = setInterval(() => {
      setProgress(old => {
        if (old >= 100) {
          clearInterval(progressInterval);
          clearInterval(logInterval);
          setTimeout(onComplete, 500); // Small delay before unmounting
          return 100;
        }
        // Random jump in progress
        const diff = Math.random() * 10;
        return Math.min(old + diff, 100);
      });
    }, 150);

    return () => {
      clearInterval(logInterval);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-pimx-bg z-[100] flex flex-col items-center justify-center font-mono text-pimx-gold overflow-hidden cursor-wait transition-colors duration-300">
      {/* Background Grid Animation */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-40 animate-pulse mix-blend-multiply dark:mix-blend-overlay dark:opacity-20"></div>
      
      <div className="z-10 w-full max-w-md p-6 relative">
        <div className="flex justify-center mb-8 relative">
           <div className="absolute inset-0 bg-pimx-gold/20 blur-xl rounded-full animate-pulse"></div>
           <Hexagon className="w-20 h-20 text-pimx-gold animate-spin-slow duration-[3s]" strokeWidth={1} />
           <div className="absolute inset-0 flex items-center justify-center">
             <Fingerprint className="w-10 h-10 text-pimx-text/80" />
           </div>
        </div>

        <h1 className="text-3xl font-black text-center mb-2 tracking-[0.2em] text-pimx-text transition-colors">PIMX_WIDE</h1>
        <div className="text-xs text-center text-pimx-muted mb-8 tracking-widest">{t('boot_subtitle')}</div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-pimx-border rounded-full mb-2 overflow-hidden border border-pimx-border/50">
          <div 
            className="h-full bg-pimx-gold shadow-[0_0_10px_rgba(197,160,89,0.8)] transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-[10px] text-pimx-muted font-bold mb-6">
          <span>{t('boot_system')}</span>
          <span>{Math.round(progress)}%</span>
        </div>

        {/* Logs */}
        <div className="h-32 border-t border-pimx-border pt-4 flex flex-col justify-end">
          {logs.map((log, index) => (
            <div key={index} className="text-[10px] sm:text-xs text-green-600 dark:text-green-400 mb-1 flex items-center gap-2 animate-fade-in-up">
              <span className="text-pimx-muted">[{new Date().toLocaleTimeString('en-US', {hour12: false, hour: "2-digit", minute:"2-digit", second:"2-digit"})}]</span>
              <span className="typing-effect font-bold">{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function AppContent() {
  const [route, setRoute] = useState<AppRoute>(() => {
    const path = window.location.pathname.replace(/^\/|\/$/g, '').toLowerCase();
    if (path === 'pimxwideadmin') {
      return AppRoute.ADMIN;
    }
    const validRoutes = Object.values(AppRoute) as string[];
    if (validRoutes.includes(path)) {
      return path as AppRoute;
    }
    return AppRoute.HOME;
  });
  const [booting, setBooting] = useState(true);
  
  // Force Dark Mode by default for better visual impact
  const [isDark, setIsDark] = useState(true);

  // Synchronize route with URL pathname (popstate)
  useEffect(() => {
    const handleLocation = () => {
      const path = window.location.pathname.replace(/^\/|\/$/g, '').toLowerCase();
      if (path === 'pimxwideadmin') {
        setRoute(AppRoute.ADMIN);
      } else {
        const validRoutes = Object.values(AppRoute) as string[];
        if (validRoutes.includes(path)) {
          setRoute(path as AppRoute);
        } else if (path === '') {
          setRoute(AppRoute.HOME);
        }
      }
    };

    window.addEventListener('popstate', handleLocation);
    return () => window.removeEventListener('popstate', handleLocation);
  }, []);

  // Update browser URL on transition
  const handleNavigate = (newRoute: AppRoute) => {
    setRoute(newRoute);
    const targetPath = newRoute === AppRoute.HOME ? '/' : `/${newRoute}`;
    window.history.pushState(null, '', targetPath);
  };

  // Use useLayoutEffect to apply class before paint
  useLayoutEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  if (booting) {
    return <BootScreen onComplete={() => setBooting(false)} />;
  }

  const renderPage = () => {
    switch (route) {
      case AppRoute.HOME:
        return <Home onNavigate={handleNavigate} />;
      case AppRoute.ENCRYPT:
        return <Encrypt />;
      case AppRoute.DECRYPT:
        return <Decrypt />;
      case AppRoute.PRIVACY:
        return <Privacy />;
      case AppRoute.TERMS:
        return <Terms />;
      case AppRoute.SLA:
        return <SLA />;
      case AppRoute.ABOUT:
        return <About onNavigate={handleNavigate} />;
      case AppRoute.ADMIN:
        return <AdminPage onNavigate={handleNavigate} />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <Layout 
      currentRoute={route} 
      onNavigate={handleNavigate}
      isDark={isDark}
      toggleTheme={() => setIsDark(!isDark)}
    >
      {renderPage()}
    </Layout>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
