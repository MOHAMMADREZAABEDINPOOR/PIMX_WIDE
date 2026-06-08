
import React from 'react';
import { FileText, Gavel, AlertTriangle, Key, PenTool, CheckSquare, ShieldAlert, BadgeCheck, Scale, Scroll, Globe, XCircle, ShieldOff, Ban, AlertOctagon, Ghost, Zap, Siren } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

// --- 3D COMPONENTS ---

const HyperVault3D = () => {
  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center [perspective:1000px] group">
       <div className="relative w-40 h-40 [transform-style:preserve-3d] animate-[spin_20s_linear_infinite]">
          {/* Outer Cube Faces */}
          <div className="absolute inset-0 border-2 border-purple-500/30 bg-purple-500/5 [transform:translateZ(80px)] backdrop-blur-[1px] shadow-[inset_0_0_20px_rgba(168,85,247,0.1)]"></div>
          <div className="absolute inset-0 border-2 border-purple-500/30 bg-purple-500/5 [transform:rotateY(90deg)_translateZ(80px)] backdrop-blur-[1px] shadow-[inset_0_0_20px_rgba(168,85,247,0.1)]"></div>
          <div className="absolute inset-0 border-2 border-purple-500/30 bg-purple-500/5 [transform:rotateY(180deg)_translateZ(80px)] backdrop-blur-[1px] shadow-[inset_0_0_20px_rgba(168,85,247,0.1)]"></div>
          <div className="absolute inset-0 border-2 border-purple-500/30 bg-purple-500/5 [transform:rotateY(-90deg)_translateZ(80px)] backdrop-blur-[1px] shadow-[inset_0_0_20px_rgba(168,85,247,0.1)]"></div>
          <div className="absolute inset-0 border-2 border-purple-500/30 bg-purple-500/5 [transform:rotateX(90deg)_translateZ(80px)] backdrop-blur-[1px] shadow-[inset_0_0_20px_rgba(168,85,247,0.1)]"></div>
          <div className="absolute inset-0 border-2 border-purple-500/30 bg-purple-500/5 [transform:rotateX(-90deg)_translateZ(80px)] backdrop-blur-[1px] shadow-[inset_0_0_20px_rgba(168,85,247,0.1)]"></div>
          
          {/* Inner Glowing Core */}
          <div className="absolute inset-10 border border-indigo-600/50 dark:border-indigo-400 bg-indigo-500/20 [transform:translateZ(0px)] shadow-[0_0_50px_rgba(99,102,241,0.5)] animate-pulse flex items-center justify-center">
             <Scale className="w-8 h-8 text-indigo-700 dark:text-indigo-200 animate-bounce" />
          </div>
       </div>
       
       {/* Orbiting Rings */}
       <div className="absolute inset-0 border border-purple-500/10 rounded-full animate-spin-slow [transform:rotateX(70deg)]"></div>
       <div className="absolute inset-4 border border-purple-500/10 rounded-full animate-spin-reverse-slow [transform:rotateY(70deg)]"></div>
    </div>
  )
}

const JurisdictionGlobe3D = () => (
    <div className="relative w-64 h-64 flex items-center justify-center [perspective:1000px]">
        <div className="absolute inset-0 border border-indigo-500/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
        {/* Sphere effect with multiple rings */}
        <div className="absolute inset-0 border border-indigo-500/20 rounded-full [transform:rotateX(60deg)]"></div>
        <div className="absolute inset-0 border border-indigo-500/20 rounded-full [transform:rotateY(60deg)]"></div>
        <div className="absolute inset-0 border border-indigo-500/20 rounded-full [transform:rotate(45deg)]"></div>
        
        {/* Core Dot */}
        <div className="w-3 h-3 bg-indigo-500 rounded-full shadow-[0_0_20px_#6366f1] animate-ping"></div>
    </div>
);

const LiabilityShield3D = () => (
    <div className="relative w-64 h-64 flex items-center justify-center">
         <ShieldAlert className="w-48 h-48 text-gray-500/10 animate-pulse" />
         <div className="absolute inset-0 flex items-center justify-center">
            <ShieldOff className="w-24 h-24 text-gray-500/50" />
         </div>
         {/* Animated barrier */}
         <div className="absolute inset-0 border-4 border-gray-500/10 rounded-full animate-ping"></div>
    </div>
);

const VolatileMemory3D = ({t}: {t: any}) => (
   <div className="relative w-64 h-64 flex items-center justify-center perspective-1000">
      {/* Central Stick */}
      <div className="w-40 h-10 bg-red-900/40 border border-red-500/50 rounded transform rotate-12 flex items-center justify-center shadow-[0_0_20px_#7f1d1d] relative overflow-hidden backdrop-blur-sm">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(239,68,68,0.2),transparent)] animate-[shimmer_2s_infinite]"></div>
          <span className="font-mono font-bold text-red-500 text-xs tracking-widest">{t('terms_ddr5')}</span>
      </div>
      
      {/* Fragments Disintegrating */}
      {[...Array(8)].map((_, i) => (
         <div 
            key={i}
            className="absolute w-2 h-2 bg-red-500 rounded-full"
            style={{
               left: '50%',
               top: '50%',
               animation: `particle-explode 2s infinite ${i * 0.2}s`,
               opacity: 0
            }}
         ></div>
      ))}
      
      <style>{`
         @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
         @keyframes particle-explode {
            0% { transform: translate(0,0) scale(1); opacity: 1; }
            100% { transform: translate(${Math.random()*100-50}px, ${Math.random()*-100}px) scale(0); opacity: 0; }
         }
      `}</style>
   </div>
);

const PanicSiren3D = () => (
    <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Spinner Base */}
        <div className="absolute w-40 h-40 border-4 border-red-600 rounded-full border-t-transparent border-b-transparent animate-spin-slow shadow-[0_0_20px_#dc2626]"></div>
        <div className="absolute w-32 h-32 border-4 border-red-500/50 rounded-full border-l-transparent border-r-transparent animate-spin-reverse-slow"></div>
        
        {/* Central Siren */}
        <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-900 rounded-full flex items-center justify-center shadow-[0_0_50px_#b91c1c] animate-pulse relative z-10 border border-red-400/30">
            <AlertOctagon className="w-10 h-10 text-white animate-bounce" />
        </div>
        
        {/* Shockwaves */}
        <div className="absolute inset-0 border border-red-500/30 rounded-full animate-ping"></div>
        <div className="absolute inset-8 border border-red-500/50 rounded-full animate-ping delay-75"></div>
    </div>
);

const Terms: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 md:px-0 pt-10 md:pt-20">
    <div className="max-w-6xl mx-auto w-full pb-12 animate-fade-in-up">
      
      {/* 3D Hero Section */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-24 gap-12 bg-gradient-to-br from-pimx-card to-pimx-bg border border-pimx-border rounded-3xl p-8 md:p-16 shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-3xl -mr-40 -mt-40 group-hover:bg-purple-600/10 transition-colors duration-700"></div>
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl -ml-20 -mb-20"></div>
         
         <div className="flex-1 text-center md:text-start relative z-10 order-2 md:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg text-[10px] font-bold mb-8 uppercase tracking-[0.3em] border border-purple-500/20 shadow-sm backdrop-blur-md">
               <Scale className="w-3 h-3" />
               {t('terms_covenant')}
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-pimx-text mb-8 uppercase tracking-tighter leading-[0.9] drop-shadow-sm">
               {t('header_terms_1')} <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-500">{t('header_terms_2')}</span>
            </h1>
            <p className="text-pimx-muted font-mono text-xs uppercase tracking-[0.2em] mb-10 text-purple-500/80 border-s-2 border-purple-500 ps-4 py-2">
               {t('terms_date')} • PROTOCOL V4.0
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
               <div className="px-4 py-2 rounded bg-pimx-surface border border-pimx-border text-xs font-mono text-pimx-muted">
                  {t('terms_sha')}
               </div>
               <div className="px-4 py-2 rounded bg-pimx-surface border border-pimx-border text-xs font-mono text-pimx-muted">
                  {t('terms_sig')}
               </div>
            </div>
         </div>
         
         <div className="flex-1 flex justify-center perspective-1000 relative z-10 pt-10 md:pt-0 order-1 md:order-2">
            <HyperVault3D />
         </div>
      </div>

      {/* Content Wrapper */}
      <div className="w-full">
         
         {/* Introduction Card */}
         <div className="mb-16 p-10 bg-pimx-bg border-l-4 border-purple-500 shadow-xl relative overflow-hidden group hover:bg-pimx-card transition-colors rounded-r-2xl">
            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-700">
               <Scroll className="w-40 h-40 text-purple-500" />
            </div>
            <h3 className="text-purple-500 font-bold mb-4 uppercase tracking-widest text-xs">{t('terms_preamble')}</h3>
            <p className="text-lg md:text-xl text-pimx-text leading-9 text-justify relative z-10 font-light">
               {t('terms_intro')}
            </p>
         </div>

         {/* Terms Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
            
            {/* Term 1 */}
            <div className="group relative bg-pimx-card border border-pimx-border rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-500 hover:shadow-[0_10px_40px_rgba(168,85,247,0.1)]">
               <div className="absolute -top-6 left-8 bg-pimx-bg border border-pimx-border p-3 rounded-xl group-hover:scale-110 transition-transform shadow-lg group-hover:border-purple-500/50">
                  <Gavel className="w-6 h-6 text-purple-500" />
               </div>
               <h3 className="text-xl font-bold text-pimx-text mb-4 mt-4 flex justify-between items-center">
                  {t('terms_sec1')}
                  <span className="text-[10px] text-purple-500 font-mono opacity-50">§ 01</span>
               </h3>
               <p className="text-pimx-muted text-sm leading-7 text-justify">
                  {t('terms_sec1_desc')}
               </p>
            </div>

            {/* Term 2 */}
            <div className="group relative bg-pimx-card border border-pimx-border rounded-2xl p-8 hover:border-red-500/50 transition-all duration-500 hover:shadow-[0_10px_40px_rgba(239,68,68,0.1)]">
               <div className="absolute -top-6 left-8 bg-pimx-bg border border-pimx-border p-3 rounded-xl group-hover:scale-110 transition-transform shadow-lg group-hover:border-red-500/50">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
               </div>
               <h3 className="text-xl font-bold text-pimx-text mb-4 mt-4 flex justify-between items-center">
                  {t('terms_sec2')}
                  <span className="text-[10px] text-red-500 font-mono opacity-50">§ 02</span>
               </h3>
               <p className="text-pimx-muted text-sm leading-7 text-justify">
                  {t('terms_sec2_desc')}
               </p>
            </div>

            {/* Term 3 */}
            <div className="group relative bg-pimx-card border border-pimx-border rounded-2xl p-8 hover:border-yellow-500/50 transition-all duration-500 hover:shadow-[0_10px_40px_rgba(234,179,8,0.1)]">
               <div className="absolute -top-6 left-8 bg-pimx-bg border border-pimx-border p-3 rounded-xl group-hover:scale-110 transition-transform shadow-lg group-hover:border-yellow-500/50">
                  <Key className="w-6 h-6 text-yellow-500" />
               </div>
               <h3 className="text-xl font-bold text-pimx-text mb-4 mt-4 flex justify-between items-center">
                  {t('terms_sec3')}
                  <span className="text-[10px] text-yellow-500 font-mono opacity-50">§ 03</span>
               </h3>
               <p className="text-pimx-muted text-sm leading-7 text-justify">
                  {t('terms_sec3_desc')}
               </p>
            </div>

         </div>

         {/* --- OPERATIONAL PROTOCOLS --- */}
         <div className="mb-24 space-y-12">
             <h2 className="text-3xl font-bold text-pimx-text text-center mb-8 border-b border-pimx-border pb-4">{t('terms_amend')}</h2>
             
             {/* Volatile Mode - Fixed Layout */}
             <div className="flex flex-col md:flex-row items-center gap-12 bg-pimx-card border border-red-500/20 rounded-2xl p-8 shadow-lg hover:shadow-red-900/10 transition-shadow group">
                 <div className="flex-1 order-2 md:order-1">
                     <div className="flex items-center gap-3 mb-4">
                         <div className="p-2 bg-red-500/10 rounded-lg text-red-500 border border-red-500/20 group-hover:bg-red-500 group-hover:text-white transition-colors">
                            <Ghost className="w-6 h-6" />
                         </div>
                         <h3 className="text-xl font-bold text-red-500">{t('terms_volatile_title')}</h3>
                     </div>
                     <p className="text-pimx-muted text-sm leading-7 text-justify">
                         {t('terms_volatile_desc')}
                     </p>
                 </div>
                 <div className="flex-1 flex justify-center order-1 md:order-2">
                     <VolatileMemory3D t={t} />
                 </div>
             </div>

             {/* Panic Button - Standardized Layout (Content Left/Right, Image Right/Left) */}
             <div className="flex flex-col md:flex-row items-center gap-12 bg-pimx-card border border-red-500/20 rounded-2xl p-8 shadow-lg hover:shadow-red-900/10 transition-shadow group">
                 <div className="flex-1 order-2 md:order-1">
                     <div className="flex items-center gap-3 mb-4">
                         <div className="p-2 bg-red-500/10 rounded-lg text-red-500 border border-red-500/20 group-hover:bg-red-500 group-hover:text-white transition-colors">
                            <AlertOctagon className="w-6 h-6" />
                         </div>
                         <h3 className="text-xl font-bold text-red-500">{t('terms_panic_title')}</h3>
                     </div>
                     <p className="text-pimx-muted text-sm leading-7 text-justify">
                         {t('terms_panic_desc')}
                     </p>
                 </div>
                 <div className="flex-1 flex justify-center order-1 md:order-2">
                     <PanicSiren3D />
                 </div>
             </div>
         </div>

         {/* --- 3D JURISDICTION --- */}
         <div className="flex flex-col md:flex-row items-center gap-16 mb-24">
            <div className="flex-1 relative z-10 order-2 md:order-1">
               <div className="inline-flex items-center gap-2 text-indigo-500 font-bold mb-4 uppercase tracking-widest text-xs">
                  <Globe className="w-4 h-4" />
                  {t('terms_law')}
               </div>
               <h2 className="text-3xl md:text-4xl font-black text-pimx-text mb-6">{t('terms_jur_title')}</h2>
               <p className="text-pimx-muted leading-8 mb-8 text-justify text-lg font-light">
                  {t('terms_jur_desc')}
               </p>
               <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-6 font-mono text-xs text-indigo-600 dark:text-indigo-400 shadow-inner">
                  &gt; {t('terms_status_dec')}<br/>
                  &gt; {t('terms_status_loc')}<br/>
                  &gt; {t('terms_status_client')}
               </div>
            </div>

            <div className="flex-1 flex justify-center order-1 md:order-2 perspective-1000">
               <JurisdictionGlobe3D />
            </div>
         </div>

         {/* --- LIABILITY SHIELD --- */}
         <div className="flex flex-col md:flex-row-reverse items-center gap-16 mb-16">
            <div className="flex-1 w-full order-2 md:order-1">
               <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-500/10 text-gray-600 dark:text-gray-400 rounded-lg text-[10px] font-bold mb-6 uppercase tracking-widest border border-gray-500/20 shadow-sm">
                  <ShieldOff className="w-3 h-3" />
                  {t('terms_defense')}
               </div>
               <h2 className="text-3xl font-black text-pimx-text mb-6">{t('terms_liab_title')}</h2>
               <p className="text-pimx-muted leading-8 mb-8 text-justify text-lg font-light">
                  {t('terms_sec2_desc')}
               </p>
               <ul className="space-y-4">
                  <li className="flex items-center gap-4 text-sm text-pimx-text font-medium bg-pimx-card p-4 rounded-xl border border-pimx-border">
                     <XCircle className="w-5 h-5 text-red-500" />
                     {t('terms_no_warranty')}
                  </li>
                  <li className="flex items-center gap-4 text-sm text-pimx-text font-medium bg-pimx-card p-4 rounded-xl border border-pimx-border">
                     <XCircle className="w-5 h-5 text-red-500" />
                     {t('terms_no_liability')}
                  </li>
                  <li className="flex items-center gap-4 text-sm text-pimx-text font-medium bg-pimx-card p-4 rounded-xl border border-pimx-border">
                     <XCircle className="w-5 h-5 text-red-500" />
                     {t('terms_no_remedy')}
                  </li>
               </ul>
            </div>
            
            <div className="flex-1 flex justify-center perspective-1000 order-1 md:order-2">
               <LiabilityShield3D />
            </div>
         </div>

      </div>
    </div>
    </div>
  );
};

export default Terms;
