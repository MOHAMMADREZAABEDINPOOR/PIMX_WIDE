import React, { useState } from 'react';
import { generateStrongPassword, encryptData } from '../services/cipherService';
import { logTelemetryAction } from '../services/telemetryService';
import { Copy, Check, RefreshCw, AlertCircle, Clock, Download, Files, Activity, Terminal, Eye, Lock, Key, ShieldCheck, Binary, Layers, Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

// --- 3D Components ---

const CipherReactor3D = ({ t }: { t: any }) => {
    return (
        <div className="relative w-64 h-64 flex items-center justify-center transform-style-3d">
            {/* Core */}
            <div className="w-20 h-20 bg-yellow-500 rounded-full shadow-[0_0_50px_rgba(234,179,8,0.5)] animate-pulse relative z-10 flex items-center justify-center">
                <Lock className="w-8 h-8 text-black" />
            </div>
            {/* Orbit 1 */}
            <div className="absolute w-40 h-40 border-2 border-dashed border-yellow-500/30 rounded-full animate-spin-slow"></div>
            {/* Orbit 2 */}
            <div className="absolute w-56 h-56 border border-yellow-500/20 rounded-full animate-spin-reverse-slow flex items-center justify-center">
                <div className="absolute top-0 w-3 h-3 bg-yellow-500 rounded-full shadow-lg"></div>
            </div>
            {/* Particles */}
            <div className="absolute inset-0 animate-spin-medium opacity-50">
                 <div className="absolute top-10 left-10 w-2 h-2 bg-yellow-500 rounded-full"></div>
                 <div className="absolute bottom-10 right-10 w-2 h-2 bg-yellow-500 rounded-full"></div>
            </div>
            <style>{`
                .transform-style-3d { transform-style: preserve-3d; }
                .animate-spin-reverse-slow { animation: spin-reverse 10s linear infinite; }
                @keyframes spin-reverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
            `}</style>
        </div>
    );
};

const SecurityLayers3D = ({ t }: { t: any }) => {
    return (
        <div className="relative w-48 h-64 transform-style-3d animate-float">
            {[...Array(5)].map((_, i) => (
                <div 
                    key={i}
                    className="absolute inset-0 bg-blue-500/10 border border-blue-500/30 rounded-xl backdrop-blur-sm flex items-center justify-center"
                    style={{ 
                        transform: `translateZ(${i * 20}px) rotateX(10deg) rotateY(-10deg)`,
                        zIndex: 10 - i 
                    }}
                >
                    <div className="text-[10px] font-mono text-blue-400 opacity-50">{t('enc_vis_layer')}_0{i+1}</div>
                </div>
            ))}
             <div className="absolute inset-0 flex items-center justify-center" style={{ transform: `translateZ(120px) rotateX(10deg) rotateY(-10deg)` }}>
                <ShieldCheck className="w-16 h-16 text-blue-500 drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
             </div>
        </div>
    );
};

export default function Encrypt() {
  const [input, setInput] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<{ password: string; cipher: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  
  // Feedback states
  const [copiedPass, setCopiedPass] = useState(false);
  const [copiedCipher, setCopiedCipher] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleGeneratePassword = () => {
    setPassword(generateStrongPassword());
  };

  const handleEncrypt = async () => {
    if (!input.trim() || !password.trim()) return;

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const { cipherText, iv, salt } = await encryptData(input, password);
      
      const portable = {
          iv, 
          salt,
          cipherText,
          createdAt: Date.now() 
      };
      const finalCipher = btoa(JSON.stringify(portable));

      setResult({ password, cipher: finalCipher });
      logTelemetryAction('test');
    } catch (e) {
      alert("Encryption Error");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, setFn: React.Dispatch<React.SetStateAction<boolean>>) => {
    navigator.clipboard.writeText(text);
    setFn(true);
    setTimeout(() => setFn(false), 2000);
  };

  const handleCopyAll = () => {
    if (!result) return;
    const text = `${t('enc_copy_blob_prefix')} ${result.cipher}\n${t('enc_copy_pass_prefix')} ${result.password}`;
    copyToClipboard(text, setCopiedAll);
  };

  const handleDownloadJSON = () => {
    if (!result) return;
    const data = {
      pimx_version: "4.1",
      security: "AES-GCM-256",
      storage_mode: "VOLATILE_SERVER_FREE",
      password_reminder: result.password, 
      payload: result.cipher 
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PIMX-SECURE-BUBBLE-${Date.now().toString().slice(-6)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reset = () => {
    setInput('');
    setPassword('');
    setResult(null);
  };

  return (
    <div className="container mx-auto px-4 md:px-0 pt-12 md:pt-24">
    <div className="max-w-7xl mx-auto w-full flex flex-col gap-16 pb-12">
      
      {/* Header */}
      <div className="mb-8 md:mb-12 border-b border-pimx-border pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h2 className="text-2xl md:text-4xl font-black text-pimx-text mb-3 flex items-center gap-3">
              <ShieldCheck className="text-yellow-500 w-8 h-8 md:w-10 md:h-10" />
              {t('encrypt_title')}
            </h2>
            <p className="text-pimx-muted text-sm md:text-base max-w-3xl leading-7 text-justify">
              {t('encrypt_desc')}
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-green-500 border border-green-500/30 px-4 py-2 rounded-lg bg-green-500/5 shadow-lg shadow-green-500/10">
            <Activity className="w-4 h-4 animate-pulse" />
            <span className="tracking-widest font-bold">{t('enc_engine_online')}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start mb-16 relative">
          
          {/* ANIMATED LOADING OVERLAY */}
          {loading && (
             <div className="absolute inset-0 bg-pimx-bg/90 backdrop-blur-sm z-50 flex items-center justify-center rounded-2xl border border-pimx-border">
                <div className="flex flex-col items-center gap-6">
                   <div className="relative w-32 h-32">
                      <div className="absolute inset-0 border-4 border-pimx-border rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-yellow-500 rounded-full border-t-transparent animate-spin"></div>
                      <div className="absolute inset-4 border-4 border-blue-500 rounded-full border-b-transparent animate-spin-slow"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                         <Lock className="w-10 h-10 text-yellow-500 animate-pulse" />
                      </div>
                   </div>
                   <div className="text-center">
                      <h3 className="text-xl font-bold text-pimx-text mb-2">{t('enc_calculating')}</h3>
                      <p className="text-xs font-mono text-pimx-muted">{t('dec_validating')}</p>
                   </div>
                </div>
             </div>
          )}

          {/* Input Section */}
          <div className="space-y-6">
            
            {/* Password Field */}
            <div className="bg-pimx-card border border-pimx-border rounded-xl p-5 shadow-sm hover:border-yellow-500/30 transition-colors">
                <label className="block text-xs font-bold text-yellow-600 mb-2 uppercase tracking-wider flex justify-between select-none">
                    {t('password_label')}
                    <span onClick={handleGeneratePassword} className="cursor-pointer hover:text-pimx-text underline text-[10px] transition-colors">{t('enc_gen_strong')}</span>
                </label>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t('password_placeholder')}
                        className="w-full bg-pimx-bg border border-pimx-border rounded-lg p-3 text-pimx-text font-mono text-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 transition-all shadow-inner"
                    />
                </div>
            </div>

            {/* RAM ONLY ZERO PERSISTENCE INFO BADGE */}
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 flex items-start gap-4">
               <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
               <div>
                  <h4 className="text-xs font-bold text-blue-400 mb-1">{t('enc_op_sec_notice')}</h4>
                  <p className="text-[10px] text-pimx-muted leading-4 text-justify">
                     {t('enc_volatile_details')}
                  </p>
               </div>
            </div>

            <div className="relative">
                <label className="block text-sm font-semibold text-pimx-text mb-3 flex justify-between items-center flex-wrap gap-2">
                  <span>{t('input_label')}</span>
                  <div className="flex gap-2">
                     <span className="text-[10px] px-2 py-1 rounded bg-pimx-surface text-pimx-muted border border-pimx-border font-mono">{t('enc_utf8')}</span>
                     <span className="text-[10px] px-2 py-1 rounded bg-pimx-surface text-pimx-muted border border-pimx-border font-mono">{t('enc_nolimit')}</span>
                  </div>
                </label>

                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t('input_placeholder')}
                  className="w-full h-64 md:h-80 bg-pimx-card border border-pimx-border rounded-xl p-6 text-pimx-text focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all resize-none placeholder-pimx-border/60 font-light leading-7 text-sm shadow-inner"
                />
                
                <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 flex items-center gap-3 max-w-md">
                      <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                      <p className="text-[10px] md:text-xs text-amber-500/90 leading-4">{t('warn_48h')}</p>
                  </div>
                  <button
                    onClick={handleEncrypt}
                    disabled={loading || !input || !password}
                    className={`w-full sm:w-auto min-w-[200px] py-4 px-8 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                      loading || !input || !password
                      ? 'bg-pimx-border text-pimx-muted cursor-not-allowed border border-transparent' 
                      : 'bg-yellow-500 hover:bg-yellow-600 text-black hover:shadow-yellow-500/20 hover:scale-105'
                    }`}
                  >
                    <Lock className="w-4 h-4" />
                    {t('btn_exec_encrypt')}
                  </button>
                </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            {result ? (
              <div className="flex flex-col h-full bg-pimx-card border border-pimx-border rounded-xl p-6 md:p-8 shadow-2xl animate-fade-in-up relative overflow-hidden ring-1 ring-yellow-500/20">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-bl-full pointer-events-none"></div>

                <div className="bg-yellow-900/10 border border-yellow-700/30 rounded-lg p-4 mb-8 flex items-start gap-4">
                  <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-yellow-600">{t('enc_immediate')}</p>
                    <p className="text-xs text-yellow-600/80 leading-5 text-justify">
                        {t('warn_48h')}
                    </p>
                  </div>
                </div>

                 {/* Password Reminder */}
                 <div className="mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-mono text-pimx-text uppercase tracking-widest flex items-center gap-2">
                      <Lock className="w-3 h-3 text-red-500" />
                      {t('enc_pass_save_this')}
                    </label>
                    <button
                      onClick={() => copyToClipboard(result.password, setCopiedPass)}
                      className="flex items-center gap-1 text-[10px] text-pimx-muted hover:text-pimx-text transition-colors bg-pimx-surface px-3 py-1.5 rounded-md border border-pimx-border hover:border-yellow-500 uppercase font-medium cursor-pointer"
                    >
                      {copiedPass ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                      <span>{t('enc_copy_btn')}</span>
                    </button>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 font-mono text-sm text-center text-red-500 select-all break-all shadow-inner font-bold tracking-widest">
                    {result.password}
                  </div>
                </div>

                {/* Cipher Display */}
                <div className="flex-grow mb-8 text-left">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-mono text-pimx-muted uppercase tracking-widest flex items-center gap-2">
                      <Terminal className="w-3 h-3 text-yellow-500" />
                      {t('enc_full_blob_copy')}
                    </label>
                    <button
                      onClick={() => copyToClipboard(result.cipher, setCopiedCipher)}
                      className="flex items-center gap-1 text-[10px] text-pimx-muted hover:text-pimx-text transition-colors bg-pimx-surface px-3 py-1.5 rounded-md border border-pimx-border hover:border-yellow-500 uppercase font-medium cursor-pointer"
                    >
                      {copiedCipher ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                      <span>{t('enc_copy_btn')}</span>
                    </button>
                  </div>
                  <div className="bg-pimx-bg border border-yellow-500/30 rounded-lg p-4 font-mono text-yellow-500 leading-relaxed text-[10px] h-48 overflow-y-auto shadow-inner select-all custom-scrollbar break-all">
                    {result.cipher}
                  </div>
                </div>

                {/* Main Actions */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                   <button
                    onClick={handleCopyAll}
                    className="flex items-center justify-center gap-3 py-4 bg-pimx-surface border border-yellow-500/30 text-pimx-text rounded-xl hover:bg-yellow-500 hover:text-black transition-all group shadow-sm cursor-pointer"
                   >
                     {copiedAll ? <Check className="w-5 h-5" /> : <Files className="w-5 h-5" />}
                     <div className="flex flex-col items-start leading-3">
                        <span className="font-bold text-xs">{t('enc_smart_copy')}</span>
                     </div>
                   </button>
                   
                   <button
                    onClick={handleDownloadJSON}
                    className="flex items-center justify-center gap-3 py-4 bg-pimx-surface border border-pimx-border text-pimx-text rounded-xl hover:bg-pimx-text hover:text-pimx-bg transition-all shadow-sm cursor-pointer"
                   >
                     <Download className="w-5 h-5" />
                     <div className="flex flex-col items-start leading-3">
                        <span className="font-bold text-xs">{t('enc_dl')}</span>
                     </div>
                   </button>
                </div>

                <button 
                  onClick={reset}
                  className="w-full py-4 border-t border-pimx-border text-pimx-muted hover:text-red-400 hover:bg-red-500/5 transition-colors flex items-center justify-center gap-2 text-xs mt-auto pt-4 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>{t('enc_reset')}</span>
                </button>

              </div>
            ) : (
              <div className="h-full flex flex-col gap-6">
                <div className="flex-grow flex flex-col items-center justify-center border-2 border-dashed border-pimx-border rounded-xl p-8 md:p-12 text-center bg-pimx-surface/20 min-h-[300px] group hover:border-yellow-500/30 transition-colors">
                  <div className="w-24 h-24 bg-pimx-bg rounded-full flex items-center justify-center mb-6 border border-pimx-border group-hover:scale-110 transition-transform duration-500">
                    <Eye className="w-10 h-10 text-pimx-border group-hover:text-yellow-500 transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-pimx-text mb-2">{t('enc_sandbox')}</h3>
                  <p className="text-sm text-pimx-muted max-w-xs leading-6 mb-6">
                    {t('enc_sandbox_desc')}
                  </p>
                  <div className="flex gap-4 text-[10px] text-pimx-border font-mono border-t border-pimx-border/30 pt-4">
                    <span>{t('enc_ram_ok')}</span>
                    <span>|</span>
                    <span>{t('enc_cpu_ok')}</span>
                    <span>|</span>
                    <span>{t('enc_net_blocked')}</span>
                  </div>
                </div>
                
                <div className="bg-pimx-bg border border-pimx-border rounded-xl p-5 shadow-inner">
                   <h4 className="text-xs font-bold text-pimx-text uppercase mb-4 flex items-center gap-2">
                     <Binary className="w-4 h-4 text-yellow-500" />
                     {t('enc_tech_title')}
                   </h4>
                   <div className="space-y-3 text-[11px] text-pimx-muted font-mono leading-5 text-left">
                      <p className="flex gap-2"><span className="text-yellow-500">•</span> {t('enc_tech_step1')}</p>
                      <p className="flex gap-2"><span className="text-yellow-500">•</span> {t('enc_tech_step2')}</p>
                      <p className="flex gap-2"><span className="text-yellow-500">•</span> {t('enc_tech_step3')}</p>
                      <p className="flex gap-2"><span className="text-yellow-500">•</span> {t('enc_tech_step4')}</p>
                      <p className="flex gap-2"><span className="text-yellow-500">•</span> {t('enc_tech_step5')}</p>
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- 3D Cipher Reactor --- */}
        <div className="flex flex-col md:flex-row items-center gap-12 mb-20 bg-gradient-to-br from-yellow-500/5 to-transparent border border-yellow-500/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl"></div>
            
            <div className="flex-1 w-full relative z-10 order-2 md:order-1">
               <div className="inline-flex items-center gap-2 text-yellow-500 font-bold mb-4 uppercase tracking-widest text-xs">
                  <Zap className="w-4 h-4" />
                  {t('enc_vis_core')}
               </div>
               <h2 className="text-3xl font-black text-pimx-text mb-6">{t('enc_reactor_title')}</h2>
               <p className="text-pimx-muted leading-7 mb-6 text-justify">
                  {t('enc_reactor_desc')}
               </p>
               <div className="flex gap-4 font-mono text-xs">
                  <div className="bg-pimx-bg border border-pimx-border px-3 py-2 rounded text-yellow-500">
                     {t('enc_vis_rounds')}
                  </div>
                  <div className="bg-pimx-bg border border-pimx-border px-3 py-2 rounded text-yellow-500">
                     {t('enc_vis_keysize')}
                  </div>
               </div>
            </div>

            <div className="flex-1 flex justify-center order-1 md:order-2 perspective-1000">
               <CipherReactor3D t={t} />
            </div>
        </div>

        {/* --- Entropy Grid (Non-3D) --- */}
        <div className="mb-20">
            <div className="text-center mb-8">
               <h2 className="text-2xl font-bold text-pimx-text mb-2">{t('enc_entropy_viz_title')}</h2>
               <p className="text-pimx-muted text-sm">{t('enc_entropy_viz_desc')}</p>
            </div>
            <div className="bg-pimx-bg border border-pimx-border rounded-xl p-6 font-mono text-[10px] grid grid-cols-8 md:grid-cols-16 gap-2 opacity-60">
                {Array.from({length: 64}).map((_, i) => (
                    <div key={i} className={`p-2 rounded text-center transition-colors duration-500 ${Math.random() > 0.8 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-pimx-surface text-pimx-muted'}`}>
                        {Math.floor(Math.random()*255).toString(16).padStart(2,'0').toUpperCase()}
                    </div>
                ))}
            </div>
        </div>

        {/* --- AES Layers (3D) --- */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-12 mb-20">
            <div className="flex-1 w-full">
               <div className="inline-flex items-center gap-2 text-blue-500 font-bold mb-4 uppercase tracking-widest text-xs">
                  <Layers className="w-4 h-4" />
                  {t('enc_vis_defense')}
               </div>
               <h2 className="text-3xl font-black text-pimx-text mb-6">{t('enc_layers_title')}</h2>
               <p className="text-pimx-muted leading-7 mb-6 text-justify">
                  {t('enc_layers_desc')}
               </p>
            </div>
            
            <div className="flex-1 flex justify-center perspective-1000">
               <SecurityLayers3D t={t} />
            </div>
        </div>

        {/* --- System Terminal (Non-3D) --- */}
        <div className="bg-white dark:bg-[#0c0c0c] border border-gray-200 dark:border-gray-800 rounded-lg p-4 font-mono text-xs text-gray-800 dark:text-gray-400 shadow-2xl ring-8 ring-gray-100 dark:ring-gray-800/50" dir="ltr">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-200 dark:border-gray-800 pb-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-2 text-gray-500">{t('enc_sys_check_exe')}</span>
            </div>
            <div className="space-y-1">
                <p>&gt; {t('enc_term_init')}</p>
                <p>&gt; {t('enc_term_mem')} <span className="text-green-600 dark:text-green-500">{t('enc_term_none')}</span></p>
                <p>&gt; {t('enc_term_rng')} <span className="text-green-600 dark:text-green-500">{t('enc_term_high')}</span></p>
                <p>&gt; {t('enc_term_gcm')} <span className="text-green-600 dark:text-green-500">{t('enc_term_ok')}</span></p>
                <p className="animate-pulse text-yellow-600 dark:text-yellow-500">&gt; {t('enc_term_ready')}</p>
            </div>
        </div>

      </div>
    </div>
  );
}
