
import React from 'react';
import { 
  Globe, Shield, Lock, Eye, Terminal, 
  Fingerprint, Zap, Box, Key, GitBranch, 
  ArrowRight, Search, Server, Database, Activity, Code2, 
  Share2, Users, Cpu, FileJson, Layers, Radio, Network, Link2, Sparkles
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { AppRoute } from '../types';

// --- NEW WORLD CLASS 3D COMPONENTS ---

const GenesisCore3D = () => (
    <div className="relative w-80 h-80 md:w-96 md:h-96 flex items-center justify-center [perspective:1000px] group scale-90 md:scale-100">
        {/* Background Nebula Glow */}
        <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>

        {/* Outer Rotating Ring (Time) */}
        <div className="absolute inset-0 border border-dashed border-cyan-500/30 rounded-full animate-[spin_60s_linear_infinite]"></div>
        
        {/* Inner Gyroscope (Space) */}
        <div className="relative w-64 h-64 [transform-style:preserve-3d] animate-[spin_20s_linear_infinite]">
            <div className="absolute inset-0 border border-cyan-400/40 rounded-full [transform:rotateX(70deg)] shadow-[0_0_10px_rgba(34,211,238,0.2)]"></div>
            <div className="absolute inset-0 border border-cyan-400/40 rounded-full [transform:rotateY(70deg)] shadow-[0_0_10px_rgba(34,211,238,0.2)]"></div>
            <div className="absolute inset-0 border border-blue-500/40 rounded-full [transform:rotateX(70deg)_rotateY(70deg)]"></div>
            
            {/* Orbiting Electrons */}
            <div className="absolute top-0 left-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_20px_white] [transform:translateZ(120px)]"></div>
            <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-cyan-300 rounded-full shadow-[0_0_15px_cyan] [transform:translateZ(-120px)]"></div>
        </div>

        {/* The Singularity (Core) */}
        <div className="absolute w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-700 rounded-full shadow-[0_0_60px_rgba(6,182,212,0.8)] flex items-center justify-center z-10 animate-float-fast">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30 animate-spin-slow mix-blend-overlay"></div>
             <Sparkles className="w-10 h-10 text-white animate-pulse" />
        </div>
    </div>
);

const WideNetwork3D = () => (
  <div className="relative w-72 h-72 flex items-center justify-center [perspective:1000px] group">
     {/* Background Glow */}
     <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors duration-500"></div>

     {/* Main Rotating Globe */}
     <div className="relative w-56 h-56 [transform-style:preserve-3d] animate-[spin_20s_linear_infinite]">
        {/* Longitudinal Lines */}
        {[0, 45, 90, 135].map((deg) => (
            <div key={deg} className="absolute inset-0 border border-blue-500/30 rounded-full" 
                 style={{ transform: `rotateY(${deg}deg)` }}></div>
        ))}
        {/* Equator */}
        <div className="absolute inset-0 border border-blue-400/50 rounded-full [transform:rotateX(90deg)] shadow-[0_0_15px_#3b82f6]"></div>
        
        {/* Floating Nodes */}
        <div className="absolute top-0 left-1/2 w-3 h-3 bg-blue-400 rounded-full shadow-[0_0_10px_#60a5fa] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-blue-400 rounded-full shadow-[0_0_10px_#60a5fa] -translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-0 w-3 h-3 bg-blue-400 rounded-full shadow-[0_0_10px_#60a5fa] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-1/2 right-0 w-3 h-3 bg-blue-400 rounded-full shadow-[0_0_10px_#60a5fa] translate-x-1/2 -translate-y-1/2"></div>
        
        {/* Core */}
        <div className="absolute inset-[30%] bg-blue-500/10 rounded-full backdrop-blur-sm border border-blue-500/20 flex items-center justify-center [transform:rotateY(-20deg)]">
            <Globe className="w-8 h-8 text-blue-400 animate-pulse" />
        </div>
     </div>

     {/* Orbiting Ring */}
     <div className="absolute w-72 h-72 border border-dashed border-blue-500/20 rounded-full animate-[spin_30s_linear_infinite_reverse] [transform:rotateX(70deg)]"></div>
  </div>
);

const MissionShield3D = () => (
    <div className="relative w-64 h-64 flex items-center justify-center [perspective:800px]">
        <div className="relative w-full h-full [transform-style:preserve-3d]">
            {/* Tunnel Rings */}
            {[...Array(4)].map((_, i) => (
                <div key={i} className="absolute top-1/2 left-1/2 w-40 h-40 border-[2px] border-green-500/30 rounded-lg shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                     style={{
                         transform: `translate(-50%, -50%) translateZ(${-i * 50}px) rotate(${i * 15}deg)`,
                         opacity: 1 - i * 0.2,
                         animation: `pulse 3s ease-in-out infinite ${i * 0.5}s`
                     }}></div>
            ))}
            
            {/* Secure Core Shield */}
            <div className="absolute top-1/2 left-1/2 w-20 h-24 bg-gradient-to-b from-green-500/20 to-transparent border border-green-500/50 [transform:translate(-50%,-50%)_translateZ(50px)] flex items-center justify-center backdrop-blur-md shadow-[0_0_30px_rgba(34,197,94,0.3)] clip-path-shield">
                <Shield className="w-8 h-8 text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.8)]" />
            </div>

            {/* Scanning Laser */}
            <div className="absolute top-0 left-1/2 w-0.5 h-full bg-green-400/50 [transform:translateX(-50%)] animate-[scan_2s_ease-in-out_infinite] blur-[1px]"></div>
        </div>
        <style>{`
            .clip-path-shield { clip-path: polygon(50% 0, 100% 20%, 100% 80%, 50% 100%, 0 80%, 0 20%); }
        `}</style>
    </div>
);

// REBUILT: ZERO KNOWLEDGE - THE COSMIC EYE
const NullVoid3D = () => (
    <div className="relative w-72 h-72 flex items-center justify-center">
        {/* The Abyss (Central Void) */}
        <div className="w-24 h-24 bg-black rounded-full shadow-[0_0_60px_rgba(168,85,247,0.4)] relative z-20 border-2 border-purple-900 overflow-hidden">
             {/* Inner reflection */}
             <div className="absolute top-2 left-4 w-6 h-4 bg-purple-500/10 rounded-full rotate-45 blur-sm"></div>
        </div>

        {/* Event Horizon Ripples */}
        {[0, 1, 2].map((i) => (
             <div key={i} className="absolute inset-0 border border-purple-500/20 rounded-full animate-ping-slow" 
                  style={{ animationDelay: `${i * 1.5}s`, animationDuration: '4s' }}></div>
        ))}
        
        {/* Rotating Energy Fields */}
        <div className="absolute w-40 h-40 border-2 border-purple-600/30 rounded-full border-t-transparent border-b-transparent animate-[spin_5s_linear_infinite]"></div>
        <div className="absolute w-56 h-56 border border-purple-400/20 rounded-full border-r-transparent border-l-transparent animate-[spin_8s_linear_infinite_reverse]"></div>
        
        {/* Floating Particles getting sucked in */}
        {[...Array(8)].map((_, i) => (
             <div key={i} className="absolute w-1.5 h-1.5 bg-purple-400 rounded-full"
                  style={{
                      top: '50%',
                      left: '50%',
                      transform: `rotate(${i * 45}deg) translateX(${100}px)`,
                      animation: `implode 3s ease-in infinite ${i * 0.3}s`
                  }}></div>
        ))}

        <style>{`
            @keyframes implode {
                0% { transform: rotate(var(--rot)) translateX(110px) scale(1); opacity: 0; }
                20% { opacity: 1; }
                100% { transform: rotate(var(--rot)) translateX(0px) scale(0); opacity: 0; }
            }
        `}</style>
    </div>
);

// REBUILT: BLACK BOX - THE TESSERACT
const EnigmaCube3D = () => (
    <div className="relative w-72 h-72 flex items-center justify-center [perspective:1000px]">
        
        {/* Outer Frame Cube */}
        <div className="relative w-32 h-32 [transform-style:preserve-3d] animate-[spin_12s_linear_infinite]">
            {/* Faces */}
            <div className="absolute inset-0 border-2 border-gray-600/50 bg-gray-900/20 [transform:translateZ(64px)]"></div>
            <div className="absolute inset-0 border-2 border-gray-600/50 bg-gray-900/20 [transform:rotateY(180deg)_translateZ(64px)]"></div>
            <div className="absolute inset-0 border-2 border-gray-600/50 bg-gray-900/20 [transform:rotateY(90deg)_translateZ(64px)]"></div>
            <div className="absolute inset-0 border-2 border-gray-600/50 bg-gray-900/20 [transform:rotateY(-90deg)_translateZ(64px)]"></div>
            <div className="absolute inset-0 border-2 border-gray-600/50 bg-gray-900/20 [transform:rotateX(90deg)_translateZ(64px)]"></div>
            <div className="absolute inset-0 border-2 border-gray-600/50 bg-gray-900/20 [transform:rotateX(-90deg)_translateZ(64px)]"></div>
        </div>

        {/* Inner Solid Cube (Counter Rotating) */}
        <div className="absolute w-16 h-16 [transform-style:preserve-3d] animate-[spin-reverse_8s_linear_infinite]">
             <div className="absolute inset-0 bg-gray-800 border border-gray-500 [transform:translateZ(32px)] shadow-[0_0_10px_rgba(255,255,255,0.1)]"></div>
             <div className="absolute inset-0 bg-gray-800 border border-gray-500 [transform:rotateY(180deg)_translateZ(32px)] shadow-[0_0_10px_rgba(255,255,255,0.1)]"></div>
             <div className="absolute inset-0 bg-gray-800 border border-gray-500 [transform:rotateY(90deg)_translateZ(32px)] shadow-[0_0_10px_rgba(255,255,255,0.1)]"></div>
             <div className="absolute inset-0 bg-gray-800 border border-gray-500 [transform:rotateY(-90deg)_translateZ(32px)] shadow-[0_0_10px_rgba(255,255,255,0.1)]"></div>
             <div className="absolute inset-0 bg-gray-800 border border-gray-500 [transform:rotateX(90deg)_translateZ(32px)] shadow-[0_0_10px_rgba(255,255,255,0.1)]"></div>
             <div className="absolute inset-0 bg-gray-800 border border-gray-500 [transform:rotateX(-90deg)_translateZ(32px)] shadow-[0_0_10px_rgba(255,255,255,0.1)]"></div>
        </div>

        {/* Singularity Point */}
        <div className="absolute w-2 h-2 bg-white rounded-full shadow-[0_0_20px_white] animate-pulse z-10"></div>
        
        {/* Orbital Rings */}
        <div className="absolute w-56 h-56 border border-gray-500/20 rounded-full [transform:rotateX(70deg)] animate-spin-slow"></div>
    </div>
);

const SovereignChip3D = () => (
    <div className="relative w-64 h-64 flex items-center justify-center [perspective:800px] animate-float">
        <div className="w-40 h-40 bg-red-900/10 border-2 border-red-500/50 rounded-xl backdrop-blur-sm [transform:rotateX(20deg)_rotateY(-20deg)] shadow-2xl relative overflow-hidden flex flex-col items-center justify-center">
            {/* Circuit Pattern */}
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-red-500/20 to-transparent"></div>
            <Cpu className="w-16 h-16 text-red-500 relative z-10 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
            <div className="mt-2 font-mono text-[10px] text-red-400 font-bold tracking-widest">LOCAL_ENV</div>
            
            {/* Energy Pulses */}
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-[scan_2s_linear_infinite]"></div>
        </div>
        
        {/* Data Particles */}
        <div className="absolute -right-4 top-10 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
        <div className="absolute -left-4 bottom-10 w-2 h-2 bg-red-500 rounded-full animate-ping delay-500"></div>
    </div>
);

interface AboutProps {
  onNavigate: (route: AppRoute) => void;
}

const About: React.FC<AboutProps> = ({ onNavigate }) => {
  const { t, currentLang } = useLanguage();
  const isRtl = currentLang.dir === 'rtl';

  return (
    <div className="container mx-auto px-4 md:px-0 pt-12 md:pt-24">
    <div className="max-w-6xl mx-auto w-full pb-20 animate-fade-in-up">
      
      {/* HERO HEADER */}
      <div className="relative mb-24 rounded-3xl overflow-hidden border border-pimx-border bg-pimx-card shadow-2xl transition-colors duration-300 group">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between p-10 md:p-16 relative z-10">
            {/* Right Side (Text) in RTL, Left in LTR */}
            <div className="md:w-1/2 text-center md:text-start order-2 md:order-1">
                <div className="inline-flex items-center gap-3 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs px-4 py-2 rounded border border-cyan-500/20 font-mono tracking-[0.3em] uppercase mb-6 backdrop-blur-sm shadow-sm justify-center md:justify-start">
                    <Globe className="w-4 h-4 animate-spin-slow" />
                    {t('header_about_1')}
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-pimx-text mb-6 tracking-tighter transition-colors drop-shadow-sm leading-[1.1]">
                    {t('about_hero_title')} <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">{t('about_hero_subtitle')}</span>
                </h1>
                <p className="text-pimx-muted text-lg leading-8 font-light text-justify md:pl-8">
                    {t('about_hero_desc')}
                </p>
            </div>

            {/* Left Side (3D) in RTL, Right in LTR */}
            <div className="md:w-1/2 flex justify-center order-1 md:order-2 mb-10 md:mb-0">
                <GenesisCore3D />
            </div>
        </div>
      </div>

      {/* --- SECTION 1: WIDE NETWORK --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24 items-center">
         {/* Text Content */}
         <div className="bg-pimx-card border border-pimx-border rounded-2xl p-8 shadow-lg hover:border-blue-500/30 transition-colors relative z-10">
            <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500"><Share2 className="w-6 h-6" /></div>
                <h2 className="text-3xl font-black text-pimx-text uppercase tracking-tight">{t('about_sec1_title')}</h2>
            </div>
            <p className="text-pimx-muted leading-8 text-lg font-light border-s-4 border-blue-500/50 ps-6 text-justify">
                {t('about_sec1_desc')}
            </p>
            <div className="mt-8 flex gap-4 flex-wrap">
                <div className="px-4 py-2 bg-blue-500/5 border border-blue-500/20 rounded text-xs font-mono text-blue-500 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div> Global_State
                </div>
                <div className="px-4 py-2 bg-blue-500/5 border border-blue-500/20 rounded text-xs font-mono text-blue-500 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div> P2P_Encryption
                </div>
                <div className="px-4 py-2 bg-blue-500/5 border border-blue-500/20 rounded text-xs font-mono text-blue-500 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div> Decentralized
                </div>
            </div>
         </div>
         
         {/* 3D Visual */}
         <div className="flex justify-center">
             <WideNetwork3D />
         </div>
      </div>

      {/* --- SECTION 2: THE MISSION --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24 items-center">
         <div className="bg-pimx-card border border-pimx-border rounded-2xl p-8 shadow-lg hover:border-green-500/30 transition-colors">
            <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-green-500/10 rounded-xl text-green-500"><Activity className="w-6 h-6" /></div>
                <h2 className="text-3xl font-black text-pimx-text">{t('about_sec2_title')}</h2>
            </div>
            <p className="text-pimx-muted leading-8 text-justify text-lg font-light">
                {t('about_sec2_desc')}
            </p>
         </div>
         
         <div className="flex justify-center">
             <MissionShield3D />
         </div>
      </div>

      {/* --- SECTION 4: ZERO KNOWLEDGE --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24 items-center">
         <div className="bg-pimx-card border border-pimx-border rounded-2xl p-8 shadow-lg hover:border-purple-500/30 transition-colors">
            <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500"><Eye className="w-6 h-6" /></div>
                <h2 className="text-3xl font-black text-pimx-text">{t('about_sec4_title')}</h2>
            </div>
            <p className="text-pimx-muted leading-8 text-justify text-lg font-light">
                {t('about_sec4_desc')}
            </p>
         </div>
         <div className="flex justify-center scale-110">
             <NullVoid3D />
         </div>
      </div>

      {/* --- SECTION 5: BLACK BOX --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24 items-center">
         <div className="order-1 bg-pimx-card border border-pimx-border rounded-2xl p-8 shadow-lg hover:border-gray-500/30 transition-colors">
            <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gray-500/10 rounded-xl text-gray-500"><Box className="w-6 h-6" /></div>
                <h2 className="text-3xl font-black text-pimx-text">{t('about_sec5_title')}</h2>
            </div>
            <p className="text-pimx-muted leading-8 text-justify text-lg font-light">
                {t('about_sec5_desc')}
            </p>
         </div>

         <div className="order-2 flex justify-center">
             <EnigmaCube3D />
         </div>
      </div>

      {/* --- SECTION 6: TARGET AUDIENCE --- */}
      <div className="mb-24">
          <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-pimx-text">{t('about_sec6_title')}</h2>
              <p className="text-pimx-muted mt-4 max-w-2xl mx-auto">{t('about_sec6_desc')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-pimx-bg border border-pimx-border rounded-xl text-center group hover:-translate-y-2 transition-transform">
                  <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4"><Users className="w-6 h-6" /></div>
                  <h3 className="font-bold text-pimx-text">Whistleblowers</h3>
              </div>
              <div className="p-6 bg-pimx-bg border border-pimx-border rounded-xl text-center group hover:-translate-y-2 transition-transform">
                  <div className="w-12 h-12 bg-yellow-500/10 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4"><Search className="w-6 h-6" /></div>
                  <h3 className="font-bold text-pimx-text">Journalists</h3>
              </div>
              <div className="p-6 bg-pimx-bg border border-pimx-border rounded-xl text-center group hover:-translate-y-2 transition-transform">
                  <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4"><Lock className="w-6 h-6" /></div>
                  <h3 className="font-bold text-pimx-text">Corporations</h3>
              </div>
          </div>
      </div>

      {/* --- SECTION 7: CLIENT SOVEREIGNTY --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24 items-center">
         <div className="bg-pimx-card border border-pimx-border rounded-2xl p-8 shadow-lg hover:border-red-500/30 transition-colors">
            <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-red-500/10 rounded-xl text-red-500"><Server className="w-6 h-6" /></div>
                <h2 className="text-3xl font-black text-pimx-text">{t('about_sec7_title')}</h2>
            </div>
            <p className="text-pimx-muted leading-8 text-justify text-lg font-light">
                {t('about_sec7_desc')}
            </p>
         </div>
         <div className="flex justify-center">
             <SovereignChip3D />
         </div>
      </div>

      {/* --- SECTION 8 & 9: ROADMAP & TRUST --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <div className="bg-gradient-to-br from-pimx-card to-pimx-bg border border-pimx-border rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                  <Zap className="w-6 h-6 text-yellow-500" />
                  <h2 className="text-2xl font-bold text-pimx-text">{t('about_sec8_title')}</h2>
              </div>
              <p className="text-pimx-muted leading-7">{t('about_sec8_desc')}</p>
              <div className="mt-6 flex gap-2">
                  <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 text-xs rounded-full border border-yellow-500/20">Lattice-Based</span>
                  <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 text-xs rounded-full border border-yellow-500/20">Post-Quantum</span>
              </div>
          </div>
          
          <div className="bg-gradient-to-br from-pimx-card to-pimx-bg border border-pimx-border rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                  <GitBranch className="w-6 h-6 text-green-500" />
                  <h2 className="text-2xl font-bold text-pimx-text">{t('about_sec9_title')}</h2>
              </div>
              <p className="text-pimx-muted leading-7">{t('about_sec9_desc')}</p>
              <div className="mt-6 p-4 bg-black/50 rounded-lg border border-gray-700 font-mono text-xs text-green-500 overflow-hidden">
                  $ git clone https://github.com/pimx/core
              </div>
          </div>
      </div>

      {/* --- SECTION 10: CTA --- */}
      <div className="relative rounded-3xl overflow-hidden p-12 text-center border border-pimx-border bg-pimx-card shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-50"></div>
          <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black text-pimx-text mb-6">{t('about_sec10_title')}</h2>
              <p className="text-xl text-pimx-muted mb-10 max-w-2xl mx-auto">{t('about_sec10_desc')}</p>
              
              <button 
                  onClick={() => onNavigate(AppRoute.ENCRYPT)}
                  className="px-12 py-5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all transform hover:scale-105 flex items-center gap-3 mx-auto"
              >
                  <span>{t('btn_start')}</span>
                  <ArrowRight className="w-5 h-5" />
              </button>
          </div>
      </div>

    </div>
    </div>
  );
};

export default About;
