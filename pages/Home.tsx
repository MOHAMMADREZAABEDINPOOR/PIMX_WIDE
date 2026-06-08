
import React, { useState, useEffect } from 'react';
import { AppRoute } from '../types';
import { 
  ArrowLeft, Cpu, Lock, Zap, Key, Linkedin, Twitter, Send, AlertTriangle, ArrowRight, Server, Shield, Globe, Briefcase, Feather, Scale, WifiOff, Trash2, EyeOff, Code, ChevronDown, HelpCircle, Binary, Users, CheckCircle, FileCheck, Terminal, Activity, ArrowRightCircle, Box, Layers, MapPin, AlertOctagon
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface HomeProps {
  onNavigate: (route: AppRoute) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const { t, currentLang } = useLanguage();
  const ArrowIcon = currentLang.dir === 'rtl' ? ArrowLeft : ArrowRight;
  const isRtl = currentLang.dir === 'rtl';

  return (
    <div className="flex flex-col gap-0 pb-20 overflow-x-hidden">
      
      {/* Hero Section - Contained */}
      <section className="container mx-auto px-4 sm:px-6 pt-12 md:pt-24 pb-20 flex flex-col items-center text-center gap-6 md:gap-8 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-600 text-[10px] md:text-xs font-bold tracking-widest uppercase shadow-lg shadow-yellow-500/10 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
          {t('hero_badge')}
        </div>
        
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-pimx-text leading-tight max-w-6xl tracking-tighter px-2">
          {t('hero_title_1')} <br/>
          <span className="text-gold-live drop-shadow-2xl">
            {t('hero_title_2')}
          </span>
        </h1>
        
        <p className="text-base sm:text-xl md:text-2xl text-pimx-muted max-w-4xl mx-auto leading-relaxed font-light mt-4 px-4 sm:px-0">
          {t('hero_desc')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mt-10 px-4 sm:px-0">
          <button
            onClick={() => onNavigate(AppRoute.ENCRYPT)}
            className="flex-1 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-bold py-4 px-8 rounded-xl transition-all shadow-xl hover:shadow-yellow-500/30 hover:scale-105 flex items-center justify-center gap-2 group"
          >
            {t('btn_start')}
            <ArrowIcon className="w-5 h-5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => onNavigate(AppRoute.DECRYPT)}
            className="flex-1 bg-pimx-surface/50 border border-pimx-border text-pimx-text hover:bg-pimx-surface backdrop-blur-md font-medium py-4 px-8 rounded-xl transition-all flex items-center justify-center gap-2 hover:border-yellow-500/30"
          >
            <Key className="w-5 h-5 text-pimx-muted group-hover:text-yellow-500" />
            {t('btn_recover')}
          </button>
        </div>
      </section>

      {/* NEW COOL SECTION 1: THE BLACK BOX (3D Animation) - Full Width BG - FIXED LIGHT MODE */}
      <section className="w-full bg-pimx-bg py-20 border-y border-pimx-border overflow-hidden">
         <div className="container mx-auto px-4 md:px-0">
            <div className="relative bg-pimx-card rounded-3xl p-8 md:p-20 overflow-hidden border border-pimx-border shadow-2xl flex flex-col md:flex-row items-center justify-between gap-16 transition-colors duration-300">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent pointer-events-none opacity-50"></div>
               
               {/* Text Content */}
               <div className="relative z-10 max-w-xl text-left">
                  <div className="text-yellow-500 font-mono text-xs uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                     <Box className="w-4 h-4" />
                     {t('home_blackbox_label')}
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black text-pimx-text mb-6">{t('home_blackbox_title')}</h2>
                  <p className="text-pimx-muted leading-8 mb-8 text-lg">
                     {t('home_blackbox_desc')}
                  </p>
                  <div className="flex gap-4">
                     <div className="px-4 py-2 rounded border border-pimx-border text-pimx-text text-xs font-mono bg-pimx-bg">{t('home_depth')}</div>
                     <div className="px-4 py-2 rounded border border-pimx-border text-pimx-text text-xs font-mono bg-pimx-bg">{t('home_scope')}</div>
                  </div>
               </div>

               {/* 3D CUBE VISUALIZER */}
               <div className="relative z-10 perspective-1000 w-64 h-64 flex items-center justify-center">
                  <Cube3D />
               </div>
            </div>
         </div>
      </section>

      {/* Statistics Strip - Full Width */}
      <section className="w-full border-b border-pimx-border bg-pimx-surface/20 backdrop-blur-md py-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern pointer-events-none"></div>
        <div className="container mx-auto px-4 md:px-0">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center divide-x divide-x-reverse divide-pimx-border/30 relative z-10">
             <StatItem value="Poly-Alpha" label={t('stat_algo')} />
             <StatItem value="48h" label={t('stat_time')} />
             <StatItem value="AES-256" label={t('stat_std')} />
             <StatItem value="Zero-Log" label={t('stat_log')} />
           </div>
        </div>
      </section>

      {/* NEW SECTION: PANIC BUTTON 3D */}
      <section className="container mx-auto px-4 md:px-0 py-24">
         <div className="bg-gradient-to-br from-red-600/5 to-transparent border border-red-500/20 rounded-3xl p-8 md:p-20 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl"></div>
            
            <div className="flex-1 w-full order-2 md:order-1 relative z-10">
               <div className="inline-flex items-center gap-2 text-red-500 font-bold mb-4 uppercase tracking-widest text-xs">
                  <AlertOctagon className="w-4 h-4" />
                  {t('home_panic_exfil')}
               </div>
               <h2 className="text-3xl md:text-5xl font-black text-pimx-text mb-6">{t('home_panic_title')}</h2>
               <p className="text-pimx-muted leading-8 mb-8 text-justify text-lg">
                  {t('home_panic_desc')}
               </p>
               <div className="flex items-center gap-4 text-xs font-mono text-red-500">
                   <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                   <span>{t('home_panic_clear')}</span>
               </div>
            </div>

            <div className="flex-1 flex justify-center order-1 md:order-2 perspective-1000">
               <PanicButton3D />
            </div>
         </div>
      </section>

      {/* Differentiator Section - Contained */}
      <section className="container mx-auto px-4 md:px-0 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="md:col-span-1 p-8 bg-pimx-card border border-pimx-border rounded-2xl shadow-lg relative overflow-hidden group hover:border-yellow-500/30 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-bl-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
              <h3 className="text-2xl font-bold mb-6">{t('home_diff_title')}</h3>
              <div className="space-y-6">
                 <div className="flex gap-4 items-start">
                    <Server className="w-6 h-6 text-red-400 shrink-0 mt-1" />
                    <p className="text-sm text-pimx-muted leading-relaxed">{t('home_diff_p1')}</p>
                 </div>
                 <div className="flex gap-4 items-start">
                    <Shield className="w-6 h-6 text-green-400 shrink-0 mt-1" />
                    <p className="text-sm text-pimx-muted leading-relaxed">{t('home_diff_p2')}</p>
                 </div>
                 <div className="flex gap-4 items-start">
                    <Globe className="w-6 h-6 text-blue-400 shrink-0 mt-1" />
                    <p className="text-sm text-pimx-muted leading-relaxed">{t('home_diff_p3')}</p>
                 </div>
              </div>
           </div>
           
           <div className="md:col-span-2 bg-gradient-to-br from-red-900/10 to-transparent border border-red-900/20 rounded-2xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute -right-20 top-0 w-64 h-64 bg-red-500/10 blur-3xl rounded-full"></div>
              <div className="flex flex-col h-full justify-center relative z-10">
                 <div className="inline-flex items-center gap-2 text-red-500 font-bold uppercase tracking-widest text-xs mb-4">
                     <AlertTriangle className="w-4 h-4" />
                     {t('home_threat_report')}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-pimx-text mb-6">{t('home_threat_title')}</h2>
                  <p className="text-base text-pimx-muted leading-8 text-justify mb-8 max-w-2xl">
                     {t('home_threat_desc')}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ThreatCard title={t('threat_brute')} desc={t('threat_brute_desc')} status={t('status_mitigated')} />
                    <ThreatCard title={t('threat_traffic')} desc={t('threat_traffic_desc')} status={t('status_resistant')} />
                    <ThreatCard title={t('threat_ai')} desc={t('threat_ai_desc')} status={t('status_secure')} />
                    <ThreatCard title={t('threat_mitm')} desc={t('threat_mitm_desc')} status={t('status_unreadable')} />
                  </div>
              </div>
           </div>
        </div>
      </section>

      {/* NEW COOL SECTION 2: LIVE ENTROPY STREAM (Data Viz) - Contained Card with Padding */}
      <section className="container mx-auto px-4 md:px-0 py-12">
         <div className="bg-pimx-card border border-pimx-border rounded-3xl p-8 md:p-20 relative overflow-hidden shadow-2xl transition-colors duration-300">
            <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-10 pointer-events-none"></div>
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
               <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-[10px] font-bold mb-4 uppercase tracking-widest">
                     <Zap className="w-3 h-3" />
                     {t('home_entropy_label')}
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black text-pimx-text mb-6">{t('home_entropy_title')}</h2>
                  <p className="text-pimx-muted leading-8 mb-8 text-justify text-lg">
                     {t('home_entropy_desc')}
                  </p>
                  <div className="flex gap-6 text-xs font-mono">
                     <div className="flex items-center gap-2 bg-pimx-surface border border-pimx-border px-3 py-1.5 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-green-500 font-bold">{t('home_noise_stat')}</span>
                     </div>
                     <div className="flex items-center gap-2 bg-pimx-surface border border-pimx-border px-3 py-1.5 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-blue-500 font-bold">{t('home_source_stat')}</span>
                     </div>
                  </div>
               </div>
               <div className="flex-1 w-full max-w-2xl transform hover:scale-[1.02] transition-transform duration-500">
                  <EntropyVisualizer t={t} />
               </div>
            </div>
         </div>
      </section>

      {/* Mathematics Section - Contained */}
      <section className="container mx-auto px-4 md:px-0 pb-24">
          <div className="bg-pimx-bg border border-pimx-border rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-full h-full bg-grid-pattern opacity-10 pointer-events-none"></div>
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
             
             <div className="flex-1 space-y-6 relative z-10">
                <div className="inline-block p-3 rounded-2xl bg-blue-500/10 text-blue-500 mb-2 animate-float">
                   <Binary className="w-8 h-8" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-pimx-text">{t('math_title')}</h2>
                <p className="text-lg text-pimx-muted leading-8 text-justify">
                   {t('math_desc')}
                </p>
                <div className="grid grid-cols-2 gap-4 pt-4">
                   <div className="bg-pimx-surface rounded-lg p-4 border border-pimx-border text-center hover:border-blue-500/50 transition-colors">
                      <span className="block text-2xl font-bold text-blue-500">2<sup className="text-sm">256</sup></span>
                      <span className="text-[10px] text-pimx-muted uppercase tracking-wider">{t('home_math_combo')}</span>
                   </div>
                   <div className="bg-pimx-surface rounded-lg p-4 border border-pimx-border text-center hover:border-green-500/50 transition-colors">
                      <span className="block text-2xl font-bold text-green-500">100k</span>
                      <span className="text-[10px] text-pimx-muted uppercase tracking-wider">{t('home_math_rounds')}</span>
                   </div>
                </div>
             </div>
             <div className="flex-1 w-full flex justify-center perspective-1000">
                <div className="w-64 h-64 md:w-80 md:h-80 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-full blur-3xl opacity-20 absolute animate-pulse-slow"></div>
                <div className="relative z-10 bg-pimx-card border border-pimx-border p-6 rounded-2xl shadow-2xl w-full max-w-sm font-mono text-xs leading-6 text-pimx-muted animate-float-delayed transform rotate-y-12 hover:rotate-y-0 transition-transform duration-700 ring-1 ring-blue-500/20" dir="ltr">
                   <div className="text-blue-500 font-bold mb-2 flex justify-between">
                     <span>{t('home_proof_header')}</span>
                     <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                     </div>
                   </div>
                   <div className="pl-4 border-l border-pimx-border space-y-1">
                      <p>const <span className="text-yellow-500">KEYS</span> = 1.1579e+77;</p>
                      <p>const <span className="text-yellow-500">ENERGY_REQ</span> = "Supernova";</p>
                      <p><span className="text-purple-400">async function</span> break() {'{'}</p>
                      <p className="pl-4 text-pimx-muted">{t('home_proof_404')}</p>
                      <p className="pl-4">await <span className="text-blue-400">universe.end()</span>;</p>
                      <p className="pl-4 text-green-500">return "SECURE";</p>
                      <p>{'}'}</p>
                   </div>
                </div>
             </div>
          </div>
      </section>

      {/* Use Cases Bento Grid - Contained */}
      <section className="container mx-auto px-4 md:px-0 pb-24">
         <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-pimx-text">{t('uc_title')}</h2>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="col-span-1 md:col-span-7 bg-gradient-to-br from-yellow-500/10 to-pimx-card border border-yellow-500/30 rounded-3xl p-8 md:p-12 flex flex-col justify-center relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                  <Feather className="w-32 h-32" />
               </div>
               <div className="relative z-10">
                  <div className="w-12 h-12 bg-yellow-500 text-black rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-yellow-500/20">
                     <Feather className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-pimx-text mb-4">{t('uc_1_title')}</h3>
                  <p className="text-base text-pimx-muted leading-7">{t('uc_1_desc')}</p>
               </div>
            </div>

            <div className="col-span-1 md:col-span-5 flex flex-col gap-6">
               <div className="flex-1 bg-pimx-card border border-pimx-border rounded-3xl p-8 hover:border-blue-500/30 transition-colors group">
                  <div className="flex items-center gap-4 mb-4">
                     <div className="p-2 bg-pimx-surface rounded-lg text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        <Briefcase className="w-5 h-5" />
                     </div>
                     <h3 className="font-bold text-pimx-text">{t('uc_2_title')}</h3>
                  </div>
                  <p className="text-sm text-pimx-muted leading-6">{t('uc_2_desc')}</p>
               </div>
               
               <div className="flex-1 bg-pimx-card border border-pimx-border rounded-3xl p-8 hover:border-purple-500/30 transition-colors group">
                  <div className="flex items-center gap-4 mb-4">
                     <div className="p-2 bg-pimx-surface rounded-lg text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                        <Scale className="w-5 h-5" />
                     </div>
                     <h3 className="font-bold text-pimx-text">{t('uc_3_title')}</h3>
                  </div>
                  <p className="text-sm text-pimx-muted leading-6">{t('uc_3_desc')}</p>
               </div>
            </div>
         </div>
      </section>

      {/* Footer CTA - Contained */}
      <section className="container mx-auto px-4 md:px-0 mb-12">
         <div className="bg-gradient-to-b from-pimx-surface to-pimx-bg border border-pimx-border rounded-2xl p-8 md:p-16 text-center space-y-8">
            <div>
               <h2 className="text-2xl md:text-3xl font-bold text-pimx-text mb-4">{t('home_cta_title')}</h2>
               <p className="text-base text-pimx-muted max-w-2xl mx-auto">
               {t('home_cta_desc')}
               </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
               <SocialButton icon={<Linkedin size={20} />} label={t('home_social_linkedin')} />
               <SocialButton icon={<Twitter size={20} />} label={t('home_social_twitter')} />
               <SocialButton icon={<Send size={20} />} label={t('home_social_telegram')} />
            </div>
         </div>
      </section>

    </div>
  );
};

// --- Sub Components ---

const PanicButton3D = () => (
    <div className="relative w-48 h-48 flex items-center justify-center transform-style-3d">
         {/* Button Base */}
         <div className="absolute inset-x-8 bottom-8 h-12 bg-gray-800 rounded-full shadow-2xl transform translate-y-4"></div>
         
         {/* The Button */}
         <div className="relative w-32 h-32 bg-gradient-to-b from-red-500 to-red-700 rounded-full shadow-[0_10px_0_#991b1b] active:shadow-[0_2px_0_#991b1b] active:translate-y-2 transition-all cursor-pointer flex items-center justify-center group z-10 border-4 border-red-900/20">
             <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent to-white/20"></div>
             <AlertOctagon className="w-16 h-16 text-white/90 drop-shadow-md group-hover:scale-110 transition-transform" />
         </div>
         
         {/* Warning Stripes Ring */}
         <div className="absolute inset-0 border-4 border-dashed border-yellow-500/30 rounded-full animate-spin-slow pointer-events-none"></div>
    </div>
);

const Cube3D = () => {
  return (
    <div className="cube-container w-40 h-40 relative transform-style-3d animate-spin-slow-3d">
      {/* Front */}
      <div className="absolute inset-0 border-2 border-blue-500/50 bg-blue-900/10 flex items-center justify-center translate-z-20 text-blue-500 text-4xl font-black backdrop-blur-sm">P</div>
      {/* Back */}
      <div className="absolute inset-0 border-2 border-purple-500/50 bg-purple-900/10 flex items-center justify-center -translate-z-20 rotate-y-180 text-purple-500 text-4xl font-black backdrop-blur-sm">I</div>
      {/* Right */}
      <div className="absolute inset-0 border-2 border-yellow-500/50 bg-yellow-900/10 flex items-center justify-center translate-x-20 rotate-y-90 text-yellow-500 text-4xl font-black backdrop-blur-sm">M</div>
      {/* Left */}
      <div className="absolute inset-0 border-2 border-red-500/50 bg-red-900/10 flex items-center justify-center -translate-x-20 -rotate-y-90 text-red-500 text-4xl font-black backdrop-blur-sm">X</div>
      {/* Top */}
      <div className="absolute inset-0 border-2 border-green-500/50 bg-green-900/10 flex items-center justify-center -translate-y-20 rotate-x-90 text-green-500 text-4xl font-black backdrop-blur-sm"></div>
      {/* Bottom */}
      <div className="absolute inset-0 border-2 border-cyan-500/50 bg-cyan-900/10 flex items-center justify-center translate-y-20 -rotate-x-90 text-cyan-500 text-4xl font-black backdrop-blur-sm"></div>
      
      {/* Inner Core */}
      <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-white/50 blur-2xl rounded-full animate-pulse"></div>
      
      <style>{`
        .transform-style-3d { transform-style: preserve-3d; }
        .translate-z-20 { transform: translateZ(5rem); }
        .-translate-z-20 { transform: translateZ(-5rem); }
        .translate-x-20 { transform: translateX(5rem); }
        .-translate-x-20 { transform: translateX(-5rem); }
        .translate-y-20 { transform: translateY(5rem); }
        .-translate-y-20 { transform: translateY(-5rem); }
        .rotate-y-180 { transform: rotateY(180deg) translateZ(5rem); }
        .rotate-y-90 { transform: rotateY(90deg) translateZ(5rem); }
        .-rotate-y-90 { transform: rotateY(-90deg) translateZ(5rem); }
        .rotate-x-90 { transform: rotateX(90deg) translateZ(5rem); }
        .-rotate-x-90 { transform: rotateX(-90deg) translateZ(5rem); }
        @keyframes spin3d {
          from { transform: rotateX(0) rotateY(0) rotateZ(0); }
          to { transform: rotateX(360deg) rotateY(720deg) rotateZ(360deg); }
        }
        .animate-spin-slow-3d { animation: spin3d 20s linear infinite; }
      `}</style>
    </div>
  );
};

// Entropy Visualizer Component - Fixed for Light Mode
const EntropyVisualizer = ({ t }: { t: any }) => {
   const [bytes, setBytes] = useState<string[]>([]);
   
   useEffect(() => {
      const interval = setInterval(() => {
         const newBytes = Array.from({length: 64}, () => 
            Math.floor(Math.random() * 255).toString(16).padStart(2, '0').toUpperCase()
         );
         setBytes(newBytes);
      }, 80);
      return () => clearInterval(interval);
   }, []);

   return (
      <div className="bg-pimx-card p-6 md:p-8 rounded-2xl border border-pimx-border font-mono text-sm shadow-[inset_0_0_20px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] relative overflow-hidden w-full h-full min-h-[300px] flex flex-col justify-center transition-colors duration-300" dir="ltr">
         <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none"></div>
         <div className="grid grid-cols-8 md:grid-cols-12 gap-3 md:gap-4 text-center opacity-90 relative z-10">
            {bytes.map((b, i) => (
               <span key={i} className={`transition-colors duration-200 font-bold ${
                  i % 11 === 0 ? 'text-yellow-600 dark:text-yellow-500' : 
                  i % 7 === 0 ? 'text-blue-600 dark:text-blue-500' : 
                  i % 5 === 0 ? 'text-pimx-text' : 'text-green-600'
               }`}>
                  {b}
               </span>
            ))}
         </div>
         <div className="mt-6 pt-4 border-t border-pimx-border flex justify-between text-xs text-pimx-muted">
            <span>{t('home_entropy_pool_label')}</span>
            <span className="animate-pulse text-green-600">{t('home_entropy_collecting_label')}</span>
         </div>
      </div>
   );
};

const StatItem: React.FC<{value: string, label: string}> = ({value, label}) => (
  <div className="flex flex-col items-center gap-2 group cursor-default p-4 hover:bg-pimx-bg/50 transition-colors rounded-lg">
    <span className="text-2xl md:text-4xl font-black text-pimx-text group-hover:text-yellow-500 transition-colors tracking-tight">{value}</span>
    <span className="text-[10px] md:text-xs text-pimx-muted uppercase tracking-[0.2em]">{label}</span>
  </div>
);

const SocialButton: React.FC<{icon: React.ReactNode, label: string}> = ({icon, label}) => (
  <button className="flex items-center justify-center gap-3 px-8 py-3 bg-pimx-bg border border-pimx-border rounded-xl text-pimx-muted hover:text-pimx-text hover:border-yellow-500 hover:shadow-lg hover:shadow-yellow-500/10 transition-all group w-full sm:w-auto">
    <span className="group-hover:scale-110 transition-transform text-yellow-500">{icon}</span>
    <span className="font-medium text-sm">{label}</span>
  </button>
);

const ThreatCard: React.FC<{title: string, desc: string, status: string}> = ({title, desc, status}) => (
   <div className="bg-pimx-bg p-4 rounded-lg border border-pimx-border/50 hover:border-red-500/30 transition-colors">
      <div className="flex justify-between items-center mb-2">
         <h4 className="font-bold text-xs md:text-sm text-pimx-text">{title}</h4>
         <span className="text-[9px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded border border-green-500/20 uppercase tracking-wider">{status}</span>
      </div>
      <p className="text-[10px] md:text-xs text-pimx-muted leading-5">{desc}</p>
   </div>
);

export default Home;
