
import React, { ReactNode, useEffect, useState, useRef } from 'react';
import { AppRoute } from '../types';
import { Shield, Lock, Unlock, Hexagon, Moon, Sun, AlertOctagon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { LANGUAGES } from '../data/languages';

interface LayoutProps {
  children: ReactNode;
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentRoute, onNavigate, isDark, toggleTheme }) => {
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const { currentLang, setLanguage, t } = useLanguage();
  const langMenuRef = useRef<HTMLDivElement>(null);

  const handlePanic = () => {
    // 1. Clear LocalStorage
    localStorage.clear();
    // 2. Clear SessionStorage
    sessionStorage.clear();
    // 3. Redirect to Google (history replacement)
    window.location.replace("https://www.google.com");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-pimx-bg text-pimx-text selection:bg-yellow-500/30 selection:text-yellow-500 transition-colors duration-300 overflow-x-hidden pt-16 sm:pt-20">
      <header className="border-b border-pimx-border bg-pimx-bg/80 backdrop-blur-md fixed top-0 left-0 w-full z-50 transition-colors duration-300">
        <div className="container mx-auto px-3 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onNavigate(AppRoute.HOME)}
          >
            <div className="relative">
               <div className="absolute inset-0 bg-yellow-500/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
               <Hexagon className="text-yellow-500 w-8 h-8 sm:w-9 sm:h-9 relative z-10 transition-transform group-hover:rotate-180 duration-700" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl sm:text-2xl font-black tracking-wider text-pimx-text font-sans uppercase leading-none">
                PIMX<span className="text-gold-live">_WIDE</span>
              </h1>
              <span className="text-[9px] sm:text-[10px] text-pimx-muted tracking-[0.3em] uppercase hidden xs:block mt-1 font-mono">{t('header_subtitle')}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-4">
            {/* PANIC BUTTON */}
            <button
               onClick={handlePanic}
               className="flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-[10px] font-bold tracking-widest uppercase transition-all shadow-lg hover:shadow-red-600/40 animate-pulse"
               title={t('layout_panic_title')}
            >
               <AlertOctagon className="w-3 h-3" />
               <span className="hidden md:inline">{t('btn_panic')}</span>
            </button>

            <div className="relative" ref={langMenuRef}>
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-lg text-pimx-muted hover:text-pimx-text hover:bg-pimx-surface transition-all border border-transparent hover:border-pimx-border"
              >
                <span className="text-lg sm:text-xl grayscale hover:grayscale-0 transition-all">{currentLang.flag}</span>
                <span className="text-xs font-bold uppercase hidden md:block">{currentLang.code}</span>
              </button>

              {isLangMenuOpen && (
                <div className="absolute top-full end-0 mt-2 w-48 sm:w-56 max-h-80 overflow-y-auto bg-pimx-card border border-pimx-border rounded-xl shadow-2xl z-50 custom-scrollbar animate-fade-in-up">
                  <div className="p-2 grid gap-1">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangMenuOpen(false);
                        }}
                        className={`flex items-center gap-3 w-full text-start px-3 py-2 rounded-lg text-sm transition-colors ${
                          currentLang.code === lang.code 
                            ? 'bg-yellow-500/10 text-yellow-600 font-bold border border-yellow-500/20' 
                            : 'text-pimx-text hover:bg-pimx-surface'
                        }`}
                      >
                        <span className="text-lg grayscale group-hover:grayscale-0">{lang.flag}</span>
                        <div className="flex flex-col">
                           <span>{lang.nativeName}</span>
                           <span className="text-[10px] text-pimx-muted">{lang.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-full text-pimx-muted hover:text-yellow-500 hover:bg-pimx-surface transition-all"
            >
              {isDark ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

            <div className="h-4 sm:h-6 w-px bg-pimx-border hidden sm:block"></div>

            <nav className="flex items-center gap-1 sm:gap-2">
              <button 
                onClick={() => onNavigate(AppRoute.ENCRYPT)}
                className={`flex items-center justify-center gap-2 w-9 h-9 sm:w-auto sm:h-auto sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 ${
                  currentRoute === AppRoute.ENCRYPT 
                    ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-black shadow-lg shadow-yellow-500/20 scale-105' 
                    : 'text-pimx-muted hover:text-pimx-text hover:bg-pimx-surface'
                }`}
                title={t('nav_encrypt')}
              >
                <Lock className="w-4 h-4" />
                <span className="hidden sm:inline">{t('nav_encrypt')}</span>
              </button>
              <button 
                onClick={() => onNavigate(AppRoute.DECRYPT)}
                className={`flex items-center justify-center gap-2 w-9 h-9 sm:w-auto sm:h-auto sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 ${
                  currentRoute === AppRoute.DECRYPT 
                    ? 'bg-pimx-surface text-yellow-600 border border-yellow-500/30 scale-105' 
                    : 'text-pimx-muted hover:text-pimx-text hover:bg-pimx-surface'
                }`}
                title={t('nav_decrypt')}
              >
                <Unlock className="w-4 h-4" />
                <span className="hidden sm:inline">{t('nav_decrypt')}</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content: Removed fixed container to allow full-width sections in Home */}
      <main className="flex-grow w-full relative">
         <div className="absolute inset-0 opacity-[0.03] bg-hero-pattern pointer-events-none z-0 mix-blend-overlay"></div>
         <div className="relative z-10 w-full">
            {children}
         </div>
      </main>

      <footer className="border-t border-pimx-border bg-pimx-surface/50 backdrop-blur-sm pt-12 pb-8 transition-colors duration-300">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 text-center md:text-start">
            <div className="col-span-1 md:col-span-2 flex flex-col items-center md:items-start">
              <h4 className="text-pimx-text font-bold text-lg mb-4 flex items-center gap-2 justify-center md:justify-start">
                <Shield className="w-5 h-5 text-yellow-500" />
                {t('layout_footer_brand')}
              </h4>
              <p className="text-pimx-muted text-sm leading-7 max-w-md text-justify md:ps-4 md:border-s-2 border-pimx-border/50 border-0 ps-0">
                {t('hero_desc')}
              </p>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <h5 className="text-pimx-text font-medium mb-4">{t('footer_quick_access')}</h5>
              <ul className="space-y-2 text-sm text-pimx-muted">
                <li><button onClick={() => onNavigate(AppRoute.HOME)} className="hover:text-yellow-500 transition">{t('footer_home')}</button></li>
                <li><button onClick={() => onNavigate(AppRoute.ENCRYPT)} className="hover:text-yellow-500 transition">{t('nav_encrypt')}</button></li>
                <li><button onClick={() => onNavigate(AppRoute.DECRYPT)} className="hover:text-yellow-500 transition">{t('nav_decrypt')}</button></li>
                <li><button onClick={() => onNavigate(AppRoute.ABOUT)} className="hover:text-yellow-500 transition">{t('footer_about')}</button></li>
              </ul>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <h5 className="text-pimx-text font-medium mb-4">{t('footer_legal')}</h5>
              <ul className="space-y-2 text-sm text-pimx-muted">
                <li><button onClick={() => onNavigate(AppRoute.PRIVACY)} className="hover:text-yellow-500 transition">{t('footer_privacy')}</button></li>
                <li><button onClick={() => onNavigate(AppRoute.TERMS)} className="hover:text-yellow-500 transition">{t('footer_terms')}</button></li>
                <li><button onClick={() => onNavigate(AppRoute.SLA)} className="hover:text-yellow-500 transition">{t('footer_sla')}</button></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-pimx-border pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-pimx-muted text-center md:text-start">
            <p className="mb-2 md:mb-0">&copy; 2026 {t('layout_footer_copy')} {t('footer_rights')}</p>
            <div className="flex gap-4">
               <span>{t('footer_security')}</span>
               <span className="w-1 h-1 bg-pimx-border rounded-full self-center"></span>
               <span>{t('footer_iso')}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
