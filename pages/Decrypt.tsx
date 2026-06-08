import React, { useState } from 'react';
import { decryptData } from '../services/cipherService';
import { logTelemetryAction } from '../services/telemetryService';
import { Unlock, FileCheck, AlertTriangle, Key, Shield, Lock, FileSearch, ShieldCheck, Database, FileCode } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

// --- 3D Components ---

const UnlockMech3D = () => {
    return (
        <div className="relative w-64 h-64 flex items-center justify-center transform-style-3d">
            {/* Cylinder 1 */}
            <div className="absolute w-48 h-48 border-[10px] border-dashed border-blue-500/20 rounded-full animate-spin-slow"></div>
            {/* Cylinder 2 */}
            <div className="absolute w-32 h-32 border-[10px] border-dashed border-blue-500/40 rounded-full animate-spin-reverse-slow"></div>
            {/* Cylinder 3 */}
            <div className="absolute w-16 h-16 border-[5px] border-blue-500 rounded-full shadow-[0_0_30px_#3b82f6] flex items-center justify-center bg-blue-500/10">
                <Unlock className="w-6 h-6 text-blue-400" />
            </div>
            {/* Alignment Line */}
            <div className="absolute w-1 h-64 bg-blue-500/20"></div>
             <style>{`
                .transform-style-3d { transform-style: preserve-3d; }
                .animate-spin-reverse-slow { animation: spin-reverse 15s linear infinite; }
                @keyframes spin-reverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
            `}</style>
        </div>
    );
};

const DataExtraction3D = () => {
    return (
        <div className="relative w-48 h-64 transform-style-3d animate-float">
            {/* Base */}
             <div className="absolute bottom-0 w-32 h-32 bg-purple-500/10 border border-purple-500/30 rounded-full transform rotate-x-60"></div>
             
             {/* Beam */}
             <div className="absolute bottom-16 w-12 h-40 bg-gradient-to-t from-purple-500/30 to-transparent blur-md"></div>
             
             {/* Floating Block */}
             <div className="absolute top-10 w-20 h-20 bg-purple-500/20 border border-purple-500 rounded-xl backdrop-blur-md flex items-center justify-center animate-bounce-slow shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                <FileCheck className="w-8 h-8 text-white" />
             </div>
             
             <style>{`
                .rotate-x-60 { transform: rotateX(60deg); }
                .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
             `}</style>
        </div>
    );
};

export default function Decrypt() {
  const [bubbleInput, setBubbleInput] = useState('');
  const [password, setPassword] = useState('');
  const [decryptedText, setDecryptedText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const handleDecrypt = async () => {
    setError(null);
    setDecryptedText(null);
    
    const token = bubbleInput.trim();

    if (!token) {
      setError(t('err_req_key'));
      return;
    }
    if (!password.trim()) {
       setError(t('err_req_pass'));
       return;
    }

    setLoading(true);

    // Try parsing bubble input as JSON from Base64
    let parsedData: { iv: string; salt: string; cipherText: string } | null = null;
    try {
      const decodedPayload = atob(token);
      parsedData = JSON.parse(decodedPayload);
    } catch (e) {
      // Input is not valid Base64 or JSON
      setTimeout(() => {
        setError(t('err_integrity'));
        setLoading(false);
      }, 500);
      return;
    }

    if (!parsedData || !parsedData.iv || !parsedData.salt || !parsedData.cipherText) {
      setTimeout(() => {
        setError(t('err_integrity'));
        setLoading(false);
      }, 500);
      return;
    }

    try {
      const result = await decryptData(
        parsedData.cipherText, 
        parsedData.iv, 
        parsedData.salt, 
        password.trim()
      );
      setDecryptedText(result);
      logTelemetryAction('test');
    } catch (e) {
      setError(t('err_integrity'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-0 pt-12 md:pt-24 font-sans">
    <div className="max-w-7xl mx-auto w-full flex flex-col gap-16 pb-12">
      
      {/* Header */}
      <div className="mb-10 text-center border-b border-pimx-border pb-10">
          <div className="inline-flex items-center gap-2 bg-green-900/10 text-green-500 text-[10px] md:text-xs px-4 py-1.5 rounded-full mb-6 border border-green-900/20 font-mono tracking-widest uppercase">
             <Shield className="w-3 h-3" />
             {t('dec_secure_channel')}
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-pimx-text mb-4 inline-flex items-center gap-4">
            <Unlock className="text-blue-500 w-8 h-8 md:w-12 md:h-12" />
            {t('decrypt_title')}
          </h2>
          <p className="text-pimx-muted mt-4 text-sm md:text-base max-w-xl mx-auto leading-7">
            {t('decrypt_desc')}
            <span className="text-yellow-600 font-bold block mt-2">{t('dec_note_ram')}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 font-sans">
            
            {/* INPUT PANEL */}
            <div className="lg:col-span-2 bg-pimx-card border border-pimx-border rounded-xl p-6 sm:p-10 shadow-2xl space-y-8 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                
                {/* ID Input */}
                <div>
                    <label className="block text-sm font-bold text-pimx-text mb-3 flex items-center justify-between select-none">
                    <div className="flex items-center gap-2">
                        <Key className="w-4 h-4 text-yellow-500" />
                        {t('key_input')}
                    </div>
                    </label>
                    <textarea 
                      value={bubbleInput}
                      onChange={(e) => setBubbleInput(e.target.value)}
                      className="w-full h-36 bg-pimx-bg border border-pimx-border rounded-lg p-4 text-yellow-500 font-mono text-xs focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 transition-all placeholder-pimx-border/30 shadow-inner resize-none break-all"
                      placeholder="eyJpdiI6IkFBQUFCQ... (Paste physical encrypted bubble text here)"
                      autoComplete="off"
                    />
                </div>

                {/* Password Input */}
                <div>
                    <label className="block text-sm font-bold text-pimx-text mb-3 flex items-center justify-between select-none">
                    <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-yellow-500" />
                        {t('password_input')}
                    </div>
                    </label>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-pimx-bg border border-pimx-border rounded-lg p-4 text-pimx-text font-mono text-center text-lg md:text-xl focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 transition-all placeholder-pimx-border/50 shadow-inner"
                      placeholder="••••••••••••"
                      autoComplete="off"
                    />
                </div>

                {/* Action */}
                <button
                    onClick={handleDecrypt}
                    disabled={loading}
                    className={`w-full py-4 rounded-xl font-bold text-base tracking-wide transition-all shadow-md transform hover:scale-[1.01] cursor-pointer ${
                    loading
                        ? 'bg-pimx-border text-pimx-muted cursor-wait'
                        : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-lg hover:shadow-blue-900/20'
                    }`}
                >
                    {loading ? (
                    <span className="flex items-center justify-center gap-3">
                        <span className="w-2.5 h-2.5 bg-white rounded-full animate-ping"></span>
                        {t('dec_validating')}
                    </span>
                    ) : t('btn_exec_decrypt')}
                </button>

                {/* Error State */}
                {error && (
                    <div className="bg-red-900/5 border-s-4 border-red-600 p-6 rounded-r-lg flex items-start gap-4 animate-fade-in-up mt-4">
                    <AlertTriangle className="w-6 h-6 text-red-500 shrink-0 mt-1" />
                    <div className="flex flex-col gap-2 w-full">
                        <span className="font-bold text-red-500 text-sm">{t('dec_op_failed')}</span>
                        <p className="text-red-400/80 text-xs leading-5 text-justify">{error}</p>
                        <div className="mt-2 text-[10px] text-red-500/50 font-mono border-t border-red-500/20 pt-2 w-full">
                            {t('dec_err_code')}
                        </div>
                    </div>
                    </div>
                )}
            </div>

            {/* INFO PANEL */}
            <div className="bg-pimx-bg border border-pimx-border rounded-xl p-6 lg:p-8 space-y-6">
                 <h3 className="font-bold text-pimx-text flex items-center gap-2 border-b border-pimx-border pb-4">
                    <ShieldCheck className="text-green-500 w-5 h-5" />
                    {t('dec_tech_title')}
                 </h3>
                 <div className="space-y-4 font-sans">
                    <div className="flex gap-3">
                       <span className="flex items-center justify-center w-6 h-6 rounded-full bg-pimx-surface text-[10px] font-bold shrink-0">1</span>
                       <p className="text-xs text-pimx-muted leading-5">{t('dec_tech_p1')}</p>
                    </div>
                    <div className="flex gap-3">
                       <span className="flex items-center justify-center w-6 h-6 rounded-full bg-pimx-surface text-[10px] font-bold shrink-0">2</span>
                       <p className="text-xs text-pimx-muted leading-5">{t('dec_tech_p2')}</p>
                    </div>
                    <div className="flex gap-3">
                       <span className="flex items-center justify-center w-6 h-6 rounded-full bg-pimx-surface text-[10px] font-bold shrink-0">3</span>
                       <p className="text-xs text-pimx-muted leading-5">{t('dec_tech_p3')}</p>
                    </div>
                 </div>
                 <div className="bg-blue-500/5 p-4 rounded-lg border border-blue-500/10 mt-4">
                    <FileSearch className="w-8 h-8 text-blue-500/30 mb-2" />
                    <p className="text-[10px] font-mono text-blue-400">{t('dec_vis_gcm_active')} <span className="text-green-500">{t('dec_vis_active')}</span></p>
                 </div>
            </div>
        </div>

        {/* Success State with Matrix Rain Background */}
        {decryptedText && (
        <div className="mt-12 pt-10 border-t border-pimx-border animate-fade-in-up mb-16 relative">
            
            <div className="flex items-center gap-3 mb-6 text-green-500 bg-green-500/10 px-6 py-3 rounded-xl w-fit border border-green-500/20 shadow-lg shadow-green-500/5 relative z-10">
               <FileCheck className="w-6 h-6" />
               <h3 className="font-bold text-base">{t('dec_success_title')}</h3>
            </div>
            
            <div className="bg-pimx-card border border-green-500/20 rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-2xl group transition-all">
                {/* Matrix Rain Effect Overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                   <div className="w-full h-full bg-[url('https://thumbs.gfycat.com/BriefGoodDegus-size_restricted.gif')] bg-cover bg-center mix-blend-screen grayscale filter contrast-150"></div>
                </div>
                
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-300"></div>
                
                <div className="relative z-10">
                    <p className="text-pimx-text text-base md:text-lg leading-8 md:leading-10 whitespace-pre-wrap font-light select-all break-words font-sans">
                        {decryptedText}
                    </p>
                </div>
                
                <div className="mt-10 pt-6 border-t border-pimx-border flex flex-col sm:flex-row gap-4 justify-between items-center opacity-70 relative z-10">
                   <div className="text-[10px] text-green-500/70 text-left font-mono bg-green-500/5 px-3 py-1 rounded">
                      {t('dec_vis_checksum')} {Math.random().toString(36).substring(2, 15).toUpperCase()}
                   </div>
                   <span className="text-[10px] text-green-600 bg-green-500/10 px-3 py-1 rounded font-bold uppercase tracking-wide">{t('dec_success_footer')}</span>
                </div>
            </div>
        </div>
        )}

        {/* --- 3D Unlock Mechanism --- */}
        <div className="flex flex-col md:flex-row items-center gap-12 mb-20 bg-gradient-to-br from-blue-500/5 to-transparent border border-blue-500/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden font-sans">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
            
            <div className="flex-1 w-full relative z-10 order-2 md:order-1">
               <div className="inline-flex items-center gap-2 text-blue-500 font-bold mb-4 uppercase tracking-widest text-xs">
                  <Unlock className="w-4 h-4" />
                  {t('dec_vis_access')}
               </div>
               <h2 className="text-3xl font-black text-pimx-text mb-6">{t('dec_align_title')}</h2>
               <p className="text-pimx-muted leading-7 mb-6 text-justify">
                  {t('dec_align_desc')}
               </p>
            </div>

            <div className="flex-1 flex justify-center order-1 md:order-2 perspective-1000">
               <UnlockMech3D />
            </div>
        </div>

        {/* --- Auth Tag Scanner (Non-3D) --- */}
        <div className="mb-20 font-sans">
             <div className="text-center mb-8">
               <h2 className="text-2xl font-bold text-pimx-text mb-2">{t('dec_gcm_title')}</h2>
               <p className="text-pimx-muted text-sm">{t('dec_gcm_desc')}</p>
            </div>
            <div className="bg-pimx-bg border border-pimx-border rounded-xl p-6 relative overflow-hidden">
                <div className="flex items-center justify-between mb-4 font-mono text-xs">
                    <span className="text-green-500">{t('dec_vis_stored')}</span>
                    <span className="text-blue-500">{t('dec_vis_computed')}</span>
                </div>
                <div className="h-20 flex items-center justify-center relative">
                     {/* Static Wave */}
                     <div className="absolute w-full h-px bg-green-500/30"></div>
                     <svg className="w-full h-full absolute" viewBox="0 0 100 20" preserveAspectRatio="none">
                         <path d="M0 10 Q 25 20 50 10 T 100 10" fill="none" stroke="#22c55e" strokeWidth="2" className="opacity-50" />
                     </svg>
                     {/* Animated Wave */}
                     <svg className="w-full h-full absolute" viewBox="0 0 100 20" preserveAspectRatio="none">
                         <path d="M0 10 Q 25 0 50 10 T 100 10" fill="none" stroke="#3b82f6" strokeWidth="2" className="opacity-50 animate-pulse" />
                     </svg>
                     <div className="absolute bg-pimx-bg px-4 py-1 border border-pimx-border rounded text-[10px] font-bold text-pimx-text">{t('dec_vis_matching')}</div>
                </div>
            </div>
        </div>

        {/* --- Data Extraction (3D) --- */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-12 mb-20 font-sans">
            <div className="flex-1 w-full">
               <div className="inline-flex items-center gap-2 text-purple-500 font-bold mb-4 uppercase tracking-widest text-xs">
                  <Database className="w-4 h-4" />
                  {t('dec_vis_extract')}
               </div>
               <h2 className="text-3xl font-black text-pimx-text mb-6">{t('dec_payload_title')}</h2>
               <p className="text-pimx-muted leading-7 mb-6 text-justify">
                  {t('dec_payload_desc')}
               </p>
            </div>
            
            <div className="flex-1 flex justify-center perspective-1000">
               <DataExtraction3D />
            </div>
        </div>

        {/* --- Hex Dump (Non-3D) --- */}
        <div className="bg-white dark:bg-[#0f111a] border border-gray-200 dark:border-gray-800 rounded-lg p-4 font-mono text-[10px] md:text-xs text-gray-500 shadow-xl overflow-hidden ring-8 ring-gray-100 dark:ring-gray-800/50" dir="ltr">
             <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-2 mb-2">
                 <span>{t('dec_vis_hex')}</span>
                 <svg className="w-4 h-4 text-blue-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                 </svg>
             </div>
             <div className="grid grid-cols-8 gap-2 opacity-70">
                {Array.from({length: 40}).map((_, i) => (
                    <span key={i} className={`transition-colors ${Math.random() > 0.9 ? 'text-gray-900 dark:text-white font-bold' : ''}`}>
                        {Math.floor(Math.random()*255).toString(16).padStart(2,'0').toUpperCase()}
                    </span>
                ))}
             </div>
             <div className="mt-2 text-green-600 dark:text-green-500 animate-pulse">&gt; {t('dec_vis_complete')}</div>
        </div>

      </div>
    </div>
  );
}
