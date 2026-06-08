
import React, { useState } from 'react';
import { Shield, Lock, EyeOff, FileText, Globe, Server, Database, HardDrive, WifiOff, Scan, Fingerprint, Trash2, CheckCircle2, AlertOctagon, Terminal, Clock, ArrowRight, Zap, Box, Network } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const PrivacyCore3D = () => {
    return (
        <div className="relative w-64 h-64 flex items-center justify-center transform-style-3d animate-spin-slow-3d">
           <div className="absolute inset-0 border-4 border-green-500/30 rounded-full"></div>
           <div className="absolute inset-4 border-4 border-green-500/50 rounded-full" style={{ transform: 'rotateX(90deg)' }}></div>
           <div className="absolute inset-8 border-4 border-green-500/70 rounded-full" style={{ transform: 'rotateY(90deg)' }}></div>
           <div className="w-20 h-20 bg-green-500/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-[0_0_30px_#22c55e]">
              <div className="w-10 h-10 bg-green-500 rounded-full animate-pulse"></div>
           </div>
           <style>{`
            .transform-style-3d { transform-style: preserve-3d; }
            @keyframes spin3d { from { transform: rotateY(0) rotateX(45deg); } to { transform: rotateY(360deg) rotateX(45deg); } }
            .animate-spin-slow-3d { animation: spin3d 10s linear infinite; }
           `}</style>
        </div>
    );
};

// Fixed Hexagonal Network Visual
const HexMeshNetwork = () => {
    // 6 fixed positions forming a hexagon around the center
    // Coordinates are percentages: left, top
    const nodes = [
        { left: 50, top: 15 },  // Top
        { left: 80, top: 32 },  // Top Right
        { left: 80, top: 68 },  // Bottom Right
        { left: 50, top: 85 },  // Bottom
        { left: 20, top: 68 },  // Bottom Left
        { left: 20, top: 32 },  // Top Left
    ];

    return (
        <div className="relative w-72 h-72 flex items-center justify-center rounded-full bg-blue-950/20 border border-blue-500/20 shadow-inner group">
             {/* Background Pulse */}
             <div className="absolute inset-0 bg-blue-500/5 rounded-full animate-pulse"></div>
             
             {/* Central Hub */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-blue-900/40 border border-blue-500 rounded-full flex items-center justify-center z-10 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                 <Network className="w-8 h-8 text-blue-400" />
             </div>

             {/* Connection Lines (SVG) */}
             <svg className="absolute inset-0 w-full h-full pointer-events-none">
                 {/* Connect Center to Nodes */}
                 {nodes.map((node, i) => (
                     <line 
                        key={`line-center-${i}`}
                        x1="50%" y1="50%" 
                        x2={`${node.left}%`} y2={`${node.top}%`} 
                        className="stroke-blue-500/30 stroke-1"
                     />
                 ))}
                 {/* Connect Neighbor Nodes (Hexagon Perimeter) */}
                 {nodes.map((node, i) => {
                     const nextNode = nodes[(i + 1) % nodes.length];
                     return (
                        <line 
                            key={`line-perimeter-${i}`}
                            x1={`${node.left}%`} y1={`${node.top}%`} 
                            x2={`${nextNode.left}%`} y2={`${nextNode.top}%`} 
                            className="stroke-blue-500/20 stroke-[0.5] stroke-dashed"
                        />
                     );
                 })}
             </svg>

             {/* Surrounding Nodes */}
             {nodes.map((node, i) => (
                 <div 
                    key={i}
                    className="absolute w-4 h-4 rounded-full bg-blue-950 border border-blue-400 flex items-center justify-center shadow-[0_0_10px_#3b82f6] z-10"
                    style={{
                        left: `${node.left}%`,
                        top: `${node.top}%`,
                        transform: 'translate(-50%, -50%)',
                    }}
                 >
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: `${i * 0.2}s` }}></div>
                 </div>
             ))}
             
             {/* Orbiting Particles */}
             <div className="absolute inset-0 animate-spin-slow rounded-full border border-dashed border-blue-500/10"></div>
        </div>
    );
};

const Privacy: React.FC = () => {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState(0);

  const steps = [
    { title: t('priv_step_knowledge'), icon: <Lock className="w-5 h-5" />, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/30" },
    { title: t('priv_step_logs'), icon: <FileText className="w-5 h-5" />, color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/30" },
    { title: t('priv_step_local'), icon: <HardDrive className="w-5 h-5" />, color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/30" }
  ];

  return (
    <div className="container mx-auto px-4 md:px-0 pt-12 md:pt-24">
    <div className="max-w-6xl mx-auto w-full pb-20 animate-fade-in-up">
      
      {/* Hero Header with Scanner Effect */}
      <div className="relative mb-16 rounded-3xl overflow-hidden border border-pimx-border bg-pimx-card shadow-2xl transition-colors duration-300 group ring-1 ring-black/5 dark:ring-white/5">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        {/* Scanner Bar */}
        <div className="absolute top-0 w-full h-1 bg-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.6)] animate-[scan_3s_linear_infinite]"></div>
        
        {/* Radar Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
           <div className="w-[500px] h-[500px] border border-green-500 rounded-full animate-ping-slow"></div>
           <div className="w-[300px] h-[300px] border border-green-500 rounded-full absolute animate-ping-slow delay-700"></div>
        </div>

        <div className="relative z-10 p-10 md:p-16 text-center">
          <div className="inline-flex items-center gap-3 bg-green-500/10 text-green-600 text-xs px-4 py-2 rounded border border-green-500/20 font-mono tracking-[0.3em] uppercase mb-6 backdrop-blur-sm shadow-sm">
             <Scan className="w-4 h-4 animate-pulse" />
             {t('privacy_protocol')}
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-pimx-text mb-6 tracking-tighter transition-colors drop-shadow-sm">
            {t('header_privacy_1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-700">{t('header_privacy_2')}</span>
          </h1>
          <p className="text-pimx-muted max-w-2xl mx-auto font-mono text-sm">
            {t('privacy_date')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {steps.map((step, index) => (
            <button
              key={index}
              onClick={() => setActiveSection(index)}
              className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 flex items-center gap-4 group ${
                activeSection === index 
                  ? `${step.bg} ${step.border} ring-1 ring-inset ring-current shadow-lg` 
                  : 'bg-pimx-card border-pimx-border hover:border-gray-400 dark:hover:border-gray-600 hover:shadow-md'
              }`}
            >
              <div className={`p-3 rounded-xl ${step.bg} ${step.color} shadow-inner transition-transform group-hover:scale-110`}>
                {step.icon}
              </div>
              <div>
                <h3 className={`font-bold text-lg ${activeSection === index ? 'text-pimx-text' : 'text-pimx-text'}`}>{step.title}</h3>
                <span className="text-[10px] text-pimx-muted font-mono uppercase tracking-widest">{t('priv_module')}</span>
              </div>
              {activeSection === index && (
                <div className="ml-auto w-2 h-2 rounded-full bg-current animate-pulse"></div>
              )}
            </button>
          ))}

          {/* Data Incinerator Visual */}
          <div className="mt-8 p-6 bg-red-500/5 border border-red-500/20 rounded-2xl text-center group hover:bg-red-500/10 transition-colors cursor-not-allowed shadow-sm">
             <div className="w-16 h-16 mx-auto bg-red-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
               <Trash2 className="w-8 h-8 text-red-500" />
             </div>
             <h4 className="text-red-500 font-bold mb-1">{t('priv_incinerator')}</h4>
             <p className="text-[10px] text-red-500/60 uppercase tracking-widest">{t('priv_always_active')}</p>
          </div>
        </div>

        {/* Content Display */}
        <div className="lg:col-span-2 bg-pimx-card border border-pimx-border rounded-3xl p-8 md:p-10 shadow-2xl relative min-h-[500px] flex flex-col transition-colors overflow-hidden ring-1 ring-black/5 dark:ring-white/5">
           <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none text-pimx-text">
              <Fingerprint className="w-64 h-64" />
           </div>

           <div className="relative z-10 flex-grow">
              {activeSection === 0 && (
                <div className="animate-fade-in-up space-y-6">
                   <div className="flex items-center gap-4 mb-6">
                      <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 border border-blue-500/30">
                         <Lock className="w-5 h-5" />
                      </div>
                      <h2 className="text-2xl font-bold text-pimx-text">{t('privacy_intro_title')}</h2>
                   </div>
                   <p className="text-pimx-muted leading-8 text-justify border-s-2 border-blue-500/30 ps-6 text-sm md:text-base">
                      {t('privacy_intro_desc')}
                   </p>
                   
                   <div className="grid grid-cols-2 gap-4 mt-8">
                      <div className="p-4 bg-pimx-bg rounded-xl border border-pimx-border text-center group hover:border-blue-500/30 transition-colors shadow-sm">
                         <div className="text-blue-500 font-bold text-2xl mb-1 group-hover:scale-110 transition-transform">0%</div>
                         <div className="text-[10px] text-pimx-muted uppercase">{t('priv_knowledge_stat')}</div>
                      </div>
                      <div className="p-4 bg-pimx-bg rounded-xl border border-pimx-border text-center group hover:border-blue-500/30 transition-colors shadow-sm">
                         <div className="text-blue-500 font-bold text-2xl mb-1 group-hover:scale-110 transition-transform">100%</div>
                         <div className="text-[10px] text-pimx-muted uppercase">{t('priv_blindness_stat')}</div>
                      </div>
                   </div>
                </div>
              )}

              {activeSection === 1 && (
                <div className="animate-fade-in-up space-y-6">
                   <div className="flex items-center gap-4 mb-6">
                      <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500 border border-green-500/30">
                         <EyeOff className="w-5 h-5" />
                      </div>
                      <h2 className="text-2xl font-bold text-pimx-text">{t('privacy_data_title')}</h2>
                   </div>
                   <p className="text-pimx-muted leading-8 text-justify border-s-2 border-green-500/30 ps-6 text-sm md:text-base">
                      {t('privacy_data_desc')}
                   </p>
                   
                   <div className="mt-8 bg-gray-950 rounded-lg p-4 font-mono text-xs text-green-500 border border-gray-800 overflow-hidden shadow-inner dark:border-gray-700" dir="ltr">
                      <div className="flex gap-2 mb-2 border-b border-gray-800 pb-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                      </div>
                      <div className="opacity-50 text-[10px] mb-2 text-gray-400">{t('priv_term_server')}</div>
                      <div className="space-y-1">
                        <div>&gt; {t('priv_term_get_user')} <span className="text-red-500">{t('priv_term_404')}</span></div>
                        <div>&gt; {t('priv_term_track')} <span className="text-red-500">{t('priv_term_null')}</span></div>
                        <div>&gt; {t('priv_term_ip')} <span className="text-red-500">{t('priv_term_discard')}</span></div>
                        <div className="animate-pulse">&gt; _</div>
                      </div>
                   </div>
                </div>
              )}

              {activeSection === 2 && (
                <div className="animate-fade-in-up space-y-6">
                   <div className="flex items-center gap-4 mb-6">
                      <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-500 border border-yellow-500/30">
                         <Database className="w-5 h-5" />
                      </div>
                      <h2 className="text-2xl font-bold text-pimx-text">{t('privacy_cookie_title')}</h2>
                   </div>
                   <p className="text-pimx-muted leading-8 text-justify border-s-2 border-yellow-500/30 ps-6 text-sm md:text-base">
                      {t('privacy_cookie_desc')}
                   </p>

                   <div className="flex items-center justify-center gap-8 mt-8 opacity-80 py-4">
                      <div className="flex flex-col items-center gap-2">
                         <div className="w-14 h-14 border-2 border-yellow-500 rounded-full flex items-center justify-center bg-yellow-500/10 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                            <HardDrive className="w-6 h-6 text-yellow-500" />
                         </div>
                         <span className="text-[10px] font-bold text-pimx-text">{t('priv_device')}</span>
                      </div>
                      <div className="h-0.5 w-16 bg-red-500/50 relative">
                         <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-pimx-card border border-pimx-border px-1.5 py-0.5 text-[8px] text-red-500 font-bold rounded shadow-sm">{t('priv_blocked')}</div>
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-500 font-bold text-xs">X</div>
                      </div>
                      <div className="flex flex-col items-center gap-2 opacity-30 grayscale">
                         <div className="w-14 h-14 border-2 border-dashed border-pimx-muted rounded-full flex items-center justify-center">
                            <Server className="w-6 h-6" />
                         </div>
                         <span className="text-[10px] font-bold text-pimx-muted">{t('priv_cloud')}</span>
                      </div>
                   </div>
                </div>
              )}
           </div>
           
           <div className="mt-auto pt-6 border-t border-pimx-border flex justify-between items-center text-xs text-pimx-muted">
              <span>{t('priv_section')}: {activeSection + 1} / 3</span>
              <div className="flex gap-1">
                 <div className={`w-2 h-2 rounded-full transition-colors ${activeSection === 0 ? 'bg-blue-500' : 'bg-pimx-border'}`}></div>
                 <div className={`w-2 h-2 rounded-full transition-colors ${activeSection === 1 ? 'bg-green-500' : 'bg-pimx-border'}`}></div>
                 <div className={`w-2 h-2 rounded-full transition-colors ${activeSection === 2 ? 'bg-yellow-500' : 'bg-pimx-border'}`}></div>
              </div>
           </div>
        </div>
      </div>

      {/* REPLACED SECTION: The Trust Core */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24 items-center">
         {/* Visualizer Column */}
         <div className="order-2 md:order-1 flex justify-center relative py-12">
            <PrivacyCore3D />
         </div>

         {/* Content Column */}
         <div className="order-1 md:order-2 bg-pimx-card border border-pimx-border rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group hover:border-yellow-500/20 transition-all duration-500 ring-1 ring-black/5 dark:ring-white/5">
            <div className="absolute top-0 right-0 p-8 opacity-5 transition-opacity group-hover:opacity-10 text-pimx-text pointer-events-none">
                <Box className="w-40 h-40" />
            </div>
            
            <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-600 border border-yellow-500/20 shadow-lg shadow-yellow-500/10">
                        <Box className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black text-pimx-text tracking-tight">{t('priv_core_title')}</h3>
                </div>
                
                <p className="text-pimx-muted leading-8 text-lg mb-10 text-justify border-l-2 border-pimx-border pl-6">
                    {t('priv_core_desc')}
                </p>

                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-pimx-bg border border-pimx-border rounded-2xl p-6 text-center group/stat hover:border-red-500/30 transition-colors shadow-sm">
                        <div className="text-4xl font-black text-pimx-text mb-2 group-hover/stat:text-red-500 transition-colors">0</div>
                        <div className="text-[10px] text-pimx-muted uppercase tracking-[0.2em] font-bold">{t('priv_stat_seized')}</div>
                    </div>
                    <div className="bg-pimx-bg border border-pimx-border rounded-2xl p-6 text-center group/stat hover:border-green-500/30 transition-colors shadow-sm">
                        <div className="text-4xl font-black text-pimx-text mb-2 group-hover/stat:text-green-500 transition-colors">100%</div>
                        <div className="text-[10px] text-pimx-muted uppercase tracking-[0.2em] font-bold">{t('priv_stat_code')}</div>
                    </div>
                </div>
            </div>
         </div>
      </div>

      {/* NEW SECTION: Network Anonymity Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24 items-center">
         {/* Content Column */}
         <div className="bg-pimx-card border border-pimx-border rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group hover:border-blue-500/20 transition-all duration-500 ring-1 ring-black/5 dark:ring-white/5">
            <div className="absolute top-0 right-0 p-8 opacity-5 transition-opacity group-hover:opacity-10 text-pimx-text pointer-events-none">
                <Network className="w-40 h-40" />
            </div>
            
            <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-600 border border-blue-500/20 shadow-lg shadow-blue-500/10">
                        <Network className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black text-pimx-text tracking-tight">{t('priv_network_title')}</h3>
                </div>
                
                <p className="text-pimx-muted leading-8 text-lg mb-6 text-justify border-l-2 border-pimx-border pl-6">
                    {t('priv_network_desc')}
                </p>
            </div>
         </div>

         {/* Visualizer Column - Replaced NetworkAnonymity3D with HexMeshNetwork */}
         <div className="flex justify-center relative py-12">
            <HexMeshNetwork />
         </div>
      </div>

      {/* WARRANT CANARY */}
      <div className="bg-pimx-card border border-pimx-border rounded-3xl p-8 md:p-10 relative overflow-hidden font-mono shadow-lg transition-colors duration-300 ring-1 ring-black/5 dark:ring-white/5" dir="ltr">
        <div className="absolute top-0 right-0 p-4 opacity-5">
           <AlertOctagon className="w-32 h-32" />
        </div>
        <div className="flex items-center justify-between mb-8 border-b border-pimx-border pb-4">
            <div className="flex items-center gap-3 text-yellow-500">
               <AlertOctagon className="w-6 h-6" />
               <h3 className="text-lg font-bold uppercase tracking-widest">{t('priv_canary_title')}</h3>
            </div>
            <div className="flex gap-2">
               <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
            </div>
        </div>
        
        <div className="space-y-4 text-xs md:text-sm text-pimx-text leading-6 font-medium">
            <p>
              <span className="text-blue-500">root@pimx:~$</span> ./status_check.sh
            </p>
            <div className="pl-4 border-l border-pimx-border/30 space-y-2">
              <p className="flex justify-between max-w-md"><span>{t('priv_canary_gov')}</span> <span className="text-green-500 font-bold">[ 0 ]</span></p>
              <p className="flex justify-between max-w-md"><span>{t('priv_canary_sub')}</span> <span className="text-green-500 font-bold">[ 0 ]</span></p>
              <p className="flex justify-between max-w-md"><span>{t('priv_canary_gag')}</span> <span className="text-green-500 font-bold">[ 0 ]</span></p>
              <p className="text-pimx-muted italic mt-2">// {t('priv_canary_desc')}</p>
            </div>
            <p className="animate-pulse text-yellow-500">
              <span className="text-blue-500">root@pimx:~$</span> _
            </p>
        </div>
      </div>

    </div>
    </div>
  );
};

export default Privacy;
