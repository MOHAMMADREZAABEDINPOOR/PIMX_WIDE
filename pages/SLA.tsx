
import React, { useEffect, useState } from 'react';
import { Activity, Server, LifeBuoy, ShieldCheck, Zap, Wifi, Clock, BarChart3, Radio, Globe, Cpu, Timer, Flame, ServerCrash, History, CheckCircle, AlertTriangle, ArrowRight, Trash2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const LatencyBar: React.FC<{label: string, ms: string, width: string, color: string, glow?: boolean}> = ({label, ms, width, color, glow}) => (
  <div className="flex items-center gap-4 text-xs group py-2">
     <div className="w-36 text-pimx-muted text-right font-mono text-[10px] uppercase tracking-wider">{label}</div>
     
     {/* Bar Track */}
     <div className="flex-1 bg-gray-200 dark:bg-white/5 h-2.5 rounded-full overflow-hidden relative border border-black/5 dark:border-white/5">
        <div className={`h-full ${color} rounded-full ${glow ? 'shadow-[0_0_15px_currentColor]' : ''} transition-all duration-1000 relative`} style={{width}}>
            {/* Glossy Tip for Glow Effect */}
            {glow && <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/80 blur-[2px] animate-pulse"></div>}
        </div>
     </div>
     
     {/* Value Display (Moved Outside) */}
     <div className={`w-12 font-mono text-[11px] font-bold text-right ${glow ? 'text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]' : 'text-pimx-text'}`}>{ms}</div>
  </div>
);

// --- NEW 3D COMPONENT: Status Core ---
const StatusCore3D = () => (
  <div className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center [perspective:1000px] group">
     {/* Background Glow */}
     <div className="absolute inset-0 bg-green-500/5 rounded-full blur-3xl transform scale-75 group-hover:scale-100 transition-transform duration-1000"></div>

     {/* Rotating Assembly */}
     <div className="relative w-48 h-48 md:w-64 md:h-64 [transform-style:preserve-3d] animate-[spin_20s_linear_infinite]">
        
        {/* Outer Ring - Horizontal */}
        <div className="absolute inset-0 border-[1px] border-green-500/30 rounded-full [transform:rotateX(75deg)] shadow-[0_0_15px_rgba(34,197,94,0.1)]"></div>
        {/* Outer Ring - Vertical */}
        <div className="absolute inset-0 border-[1px] border-green-500/30 rounded-full [transform:rotateY(75deg)] shadow-[0_0_15px_rgba(34,197,94,0.1)]"></div>
        
        {/* Inner Gyroscope Rings (Counter-Spinning) */}
        <div className="absolute inset-8 border-2 border-green-400/40 rounded-full [transform:rotateX(45deg)] animate-[spin_10s_linear_infinite_reverse] border-dashed"></div>
        <div className="absolute inset-12 border-2 border-green-400/40 rounded-full [transform:rotateY(45deg)] animate-[spin_15s_linear_infinite] border-dotted"></div>

        {/* Central Core */}
        <div className="absolute inset-[35%] bg-green-500/10 rounded-full backdrop-blur-sm shadow-[0_0_40px_rgba(34,197,94,0.5)] animate-pulse border border-green-500/30 flex items-center justify-center [transform:translateZ(0)]">
           <div className="w-3 h-3 bg-green-400 rounded-full shadow-[0_0_20px_#4ade80] animate-ping"></div>
        </div>
        
        {/* Orbiting Data Particles */}
        <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-white rounded-full [transform:translateZ(100px)] shadow-[0_0_10px_#fff]"></div>
        <div className="absolute bottom-0 left-1/2 w-1.5 h-1.5 bg-white rounded-full [transform:translateZ(-100px)] shadow-[0_0_10px_#fff]"></div>
        <div className="absolute left-0 top-1/2 w-1.5 h-1.5 bg-green-300 rounded-full [transform:translateX(-80px)] shadow-[0_0_10px_#fff]"></div>
     </div>
     
     {/* Static decorative elements outside the spin */}
     <div className="absolute inset-0 border border-green-500/5 rounded-full scale-125 pointer-events-none"></div>
  </div>
);

const UptimeTower3D = () => (
    <div className="relative w-32 h-64 flex flex-col-reverse items-center gap-1 opacity-80 perspective-1000">
        {[...Array(10)].map((_, i) => (
            <div key={i} className={`w-20 h-4 bg-green-500/${20 + i*5} border border-green-500/50 rounded transform skew-x-12 shadow-[0_0_10px_rgba(34,197,94,0.3)] animate-pulse`} style={{animationDelay: `${i*0.1}s`}}></div>
        ))}
    </div>
);

const RetentionVortex3D = () => (
    <div className="relative w-64 h-64 flex items-center justify-center">
        <div className="absolute inset-0 border-t-2 border-r-2 border-red-500/30 rounded-full animate-[spin_2s_linear_infinite]"></div>
        <div className="absolute inset-4 border-b-2 border-l-2 border-red-500/30 rounded-full animate-[spin_3s_linear_infinite_reverse]"></div>
        <div className="absolute inset-8 border-t-2 border-l-2 border-red-500/30 rounded-full animate-[spin_4s_linear_infinite]"></div>
        <div className="w-8 h-8 bg-red-500 rounded-full blur-md animate-pulse"></div>
    </div>
);

const SLA: React.FC = () => {
  const { t } = useLanguage();
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setUptime(prev => {
        if (prev >= 99.99) {
          clearInterval(interval);
          return 99.99;
        }
        return prev + 1.1;
      });
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto px-4 md:px-0 pt-12 md:pt-24">
    <div className="max-w-6xl mx-auto w-full pb-12 animate-fade-in-up">
      
      {/* 3D Header Section */}
      <div className="flex flex-col-reverse md:flex-row items-center justify-between mb-24 gap-12 bg-gradient-to-br from-pimx-card via-pimx-bg to-pimx-card border border-pimx-border rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
         {/* Background Grid Accent */}
         <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
         <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>

         <div className="flex-1 w-full relative z-10">
             <div className="flex items-center gap-3 mb-6">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></div>
               <span className="text-green-600 dark:text-green-500 font-mono text-[10px] uppercase tracking-[0.2em] border border-green-500/30 px-3 py-1 rounded-full bg-green-500/5">{t('sla_date')}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-pimx-text tracking-tighter mb-8 leading-[0.9]">
               {t('header_sla_1')} <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-400 dark:from-green-500 dark:to-emerald-300">{t('header_sla_2')}</span>
            </h1>
            
            {/* NOC Dashboard Card - Enhanced */}
            <div className="bg-white/80 dark:bg-[#0c0c0c]/80 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-2xl p-6 flex items-center gap-6 shadow-xl relative overflow-hidden max-w-md group hover:border-green-500/40 transition-all duration-300 ring-1 ring-black/5" dir="ltr">
               <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Activity className="w-32 h-32 text-green-500 transform rotate-12" />
               </div>
               
               <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20 relative z-10 group-hover:scale-110 transition-transform duration-500">
                   <Server className="w-8 h-8 text-green-600 dark:text-green-500" />
               </div>
               <div className="relative z-10">
                  <div className="text-5xl font-mono font-bold text-gray-900 dark:text-white leading-none mb-2 tracking-tighter">
                     {uptime.toFixed(2)}<span className="text-xl text-gray-400">%</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-green-600 dark:text-green-500 uppercase tracking-wider font-bold">
                     <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                     {t('sla_uptime')}
                  </div>
               </div>
            </div>
         </div>
         
         {/* 3D STATUS CORE */}
         <div className="flex-1 flex justify-center perspective-1000 relative z-10 py-10 md:py-0">
             <StatusCore3D />
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
         {/* Card 1 */}
         <div className="bg-pimx-bg border border-pimx-border rounded-2xl p-6 relative overflow-hidden group hover:border-green-500/50 transition-colors shadow-lg hover:shadow-[0_5px_20px_rgba(34,197,94,0.15)]">
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-green-500/10 rounded-full blur-xl group-hover:bg-green-500/20 transition-colors"></div>
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-green-500/10 rounded-lg text-green-600 dark:text-green-500"><Wifi className="w-6 h-6" /></div>
                <div className="text-[10px] font-mono text-pimx-muted">{t('sla_node_1')}</div>
            </div>
            <h3 className="text-lg font-bold text-pimx-text mb-2">{t('sla_guarantee')}</h3>
            <p className="text-xs text-pimx-muted leading-5 text-justify mb-4">
               {t('sla_desc')}
            </p>
            <div className="w-full bg-pimx-surface h-1 rounded-full overflow-hidden">
               <div className="h-full bg-green-500 w-[99%] shadow-[0_0_10px_#22c55e]"></div>
            </div>
         </div>

         {/* Card 2 */}
         <div className="bg-pimx-bg border border-pimx-border rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/50 transition-colors shadow-lg hover:shadow-[0_5px_20px_rgba(59,130,246,0.15)]">
             <div className="absolute -right-4 -top-4 w-20 h-20 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-colors"></div>
             <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-500"><LifeBuoy className="w-6 h-6" /></div>
                <div className="text-[10px] font-mono text-pimx-muted">{t('sla_node_2')}</div>
            </div>
            <h3 className="text-lg font-bold text-pimx-text mb-2">{t('sla_support')}</h3>
            <p className="text-xs text-pimx-muted leading-5 text-justify mb-4">
               {t('sla_support_desc')}
            </p>
            <div className="flex items-center gap-2 text-[10px] font-mono text-blue-600 dark:text-blue-500 bg-blue-500/5 px-2 py-1 rounded w-fit border border-blue-500/20">
               <Radio className="w-3 h-3 animate-pulse" />
               {t('sla_no_logs')}
            </div>
         </div>

         {/* Card 3 */}
         <div className="bg-pimx-bg border border-pimx-border rounded-2xl p-6 relative overflow-hidden group hover:border-red-500/50 transition-colors shadow-lg hover:shadow-[0_5px_20px_rgba(239,68,68,0.15)]">
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-red-500/10 rounded-full blur-xl group-hover:bg-red-500/20 transition-colors"></div>
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-red-500/10 rounded-lg text-red-600 dark:text-red-500"><ShieldCheck className="w-6 h-6" /></div>
                <div className="text-[10px] font-mono text-pimx-muted">{t('sla_node_3')}</div>
            </div>
            <h3 className="text-lg font-bold text-pimx-text mb-2">{t('sla_security')}</h3>
            <p className="text-xs text-pimx-muted leading-5 text-justify mb-4">
               {t('sla_security_desc')}
            </p>
             <div className="flex items-center justify-between text-[10px] text-red-600 dark:text-red-500 bg-red-500/5 px-2 py-1 rounded border border-red-500/20">
               <span>{t('sla_mitigation')}</span>
               <span className="font-bold font-mono">{t('sla_mitigation_time')}</span>
            </div>
         </div>
      </div>

      {/* Latency Visualization Section */}
      <div className="bg-pimx-card border border-pimx-border rounded-3xl p-8 relative overflow-hidden shadow-inner mb-24">
         <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
         <div className="flex items-center gap-3 mb-8 relative z-10">
            <BarChart3 className="w-5 h-5 text-pimx-muted" />
            <h3 className="font-bold text-pimx-text uppercase tracking-widest text-sm">{t('sla_latency_title')}</h3>
         </div>
         
         <div className="space-y-6 relative z-10">
            <LatencyBar label={t('sla_lat_na')} ms="12ms" width="10%" color="bg-green-500" />
            <LatencyBar label={t('sla_lat_eu')} ms="24ms" width="18%" color="bg-green-500" />
            <LatencyBar label={t('sla_lat_asia')} ms="45ms" width="35%" color="bg-yellow-500" />
            <LatencyBar label={t('sla_lat_me')} ms="52ms" width="40%" color="bg-yellow-500" />
            <LatencyBar label={t('sla_lat_local')} ms="0ms" width="0.5%" color="bg-blue-500" glow={true} />
         </div>
         
         <div className="mt-10 pt-6 border-t border-pimx-border text-center relative z-10">
             <div className="inline-flex items-center gap-2 text-xs text-pimx-muted bg-pimx-bg border border-pimx-border px-4 py-2 rounded-full shadow-sm">
                <Zap className="w-3 h-3 text-yellow-500" />
                {t('sla_lat_note')}
             </div>
         </div>
      </div>

      {/* --- NEW SECTION 1: 3D UPTIME TOWER (3D) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24 items-center">
         <div className="flex justify-center perspective-1000">
            <UptimeTower3D />
         </div>
         
         <div>
            <div className="inline-flex items-center gap-2 text-green-600 dark:text-green-500 font-bold mb-4 uppercase tracking-widest text-xs bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
               <History className="w-4 h-4" />
               {t('sla_reliability')}
            </div>
            <h2 className="text-3xl font-black text-pimx-text mb-6">{t('sla_avail_title')}</h2>
            <p className="text-pimx-muted leading-7 mb-8 text-justify">
               {t('sla_avail_desc')}
            </p>
            <div className="space-y-4">
               <div className="flex items-center gap-4 p-4 bg-pimx-card border border-pimx-border rounded-xl">
                  <div className="p-2 bg-green-500/10 rounded-lg text-green-600 dark:text-green-500"><CheckCircle className="w-5 h-5" /></div>
                  <div>
                     <div className="font-bold text-pimx-text">{t('sla_offline')}</div>
                     <div className="text-xs text-pimx-muted">{t('sla_offline_desc')}</div>
                  </div>
               </div>
               <div className="flex items-center gap-4 p-4 bg-pimx-card border border-pimx-border rounded-xl">
                  <div className="p-2 bg-green-500/10 rounded-lg text-green-600 dark:text-green-500"><CheckCircle className="w-5 h-5" /></div>
                  <div>
                     <div className="font-bold text-pimx-text">{t('sla_edge')}</div>
                     <div className="text-xs text-pimx-muted">{t('sla_edge_desc')}</div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* --- NEW SECTION 2: INCIDENT RESPONSE TIMELINE (NON-3D) --- */}
      <div className="mb-24">
         <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-pimx-text mb-2">{t('sla_incident_title')}</h2>
            <p className="text-pimx-muted text-sm">{t('sla_incident_sub')}</p>
         </div>

         <div className="relative">
             {/* Timeline Line */}
             <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500"></div>

             {/* Item 1 */}
             <div className="flex flex-col md:flex-row items-center gap-8 mb-12 relative">
                <div className="md:w-1/2 md:text-right md:pr-12 pl-12 md:pl-0">
                   <h3 className="text-xl font-bold text-blue-600 dark:text-blue-500">{t('sla_t0')}</h3>
                   <p className="text-pimx-muted text-sm mt-2">{t('sla_t0_desc')}</p>
                </div>
                <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-blue-500 border-4 border-pimx-bg -translate-x-[7px] shadow-[0_0_10px_#3b82f6]"></div>
                <div className="md:w-1/2 md:pl-12 pl-12 hidden md:block">
                   <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg font-mono text-xs text-blue-500 dark:text-blue-400" dir="ltr">
                      &gt; {t('sla_t0_log')}
                   </div>
                </div>
             </div>

             {/* Item 2 */}
             <div className="flex flex-col md:flex-row items-center gap-8 mb-12 relative">
                <div className="md:w-1/2 md:text-right md:pr-12 pl-12 hidden md:block">
                   <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-lg font-mono text-xs text-purple-600 dark:text-purple-400" dir="ltr">
                      &gt; {t('sla_t1_log')}
                   </div>
                </div>
                <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-purple-500 border-4 border-pimx-bg -translate-x-[7px] shadow-[0_0_10px_#a855f7]"></div>
                <div className="md:w-1/2 md:pl-12 pl-12 md:pl-12">
                   <h3 className="text-xl font-bold text-purple-600 dark:text-purple-500">{t('sla_t1')}</h3>
                   <p className="text-pimx-muted text-sm mt-2">{t('sla_t1_desc')}</p>
                </div>
             </div>

             {/* Item 3 */}
             <div className="flex flex-col md:flex-row items-center gap-8 relative">
                <div className="md:w-1/2 md:text-right md:pr-12 pl-12 md:pl-0">
                   <h3 className="text-xl font-bold text-green-600 dark:text-green-500">{t('sla_t2')}</h3>
                   <p className="text-pimx-muted text-sm mt-2">{t('sla_t2_desc')}</p>
                </div>
                <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-green-500 border-4 border-pimx-bg -translate-x-[7px] shadow-[0_0_10px_#22c55e]"></div>
                <div className="md:w-1/2 md:pl-12 pl-12 hidden md:block">
                   <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-lg font-mono text-xs text-green-600 dark:text-green-400" dir="ltr">
                      &gt; {t('sla_t2_log')}
                   </div>
                </div>
             </div>
         </div>
      </div>

      {/* --- NEW SECTION 3: DATA RETENTION VORTEX (3D) --- */}
      <div className="bg-gradient-to-br from-red-600/5 to-transparent border border-red-500/20 rounded-3xl p-8 md:p-12 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl"></div>
         
         <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
            <div className="flex-1 w-full order-2 md:order-1">
               <div className="inline-flex items-center gap-2 text-red-600 dark:text-red-500 font-bold mb-4 uppercase tracking-widest text-xs">
                  <Flame className="w-4 h-4" />
                  {t('sla_destruct')}
               </div>
               <h2 className="text-3xl font-black text-pimx-text mb-6">{t('sla_retention_title')}</h2>
               <p className="text-pimx-muted leading-7 mb-6 text-justify">
                  {t('sla_retention_desc')}
               </p>
               <div className="flex gap-4 font-mono text-xs">
                  <div className="bg-pimx-bg border border-pimx-border px-3 py-2 rounded text-red-500">
                     {t('sla_ttl')}
                  </div>
                  <div className="bg-pimx-bg border border-pimx-border px-3 py-2 rounded text-red-500">
                     {t('sla_action')}
                  </div>
               </div>
            </div>

            <div className="flex-1 flex justify-center order-1 md:order-2 perspective-1000">
               <RetentionVortex3D />
            </div>
         </div>
      </div>

    </div>
    </div>
  );
};

export default SLA;
