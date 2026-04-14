import { useEffect, useState } from 'react';
import { X, RefreshCw, Sparkles } from 'lucide-react';

export default function BrainModal({ isOpen, onClose }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchStats();
    }
  }, [isOpen]);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/brain/stats');
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      setStats(data);
    } catch (err) {
      setError(err.message || 'Failed to load stats');
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
      <div 
        className="relative w-full max-w-2xl bg-surface-container shadow-luminous overflow-hidden animate-in fade-in zoom-in-95 duration-200 steps-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="scanline" />
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-surface-container-high border-none">
          <div className="flex items-center gap-4">
            <div className="flex gap-1.5">
              <div className="w-2 h-2 bg-error" />
              <div className="w-2 h-2 bg-secondary" />
              <div className="w-2 h-2 bg-accent" />
            </div>
            <h2 className="text-xl font-bold tracking-tighter uppercase font-headline text-[#eaffde] flex items-center gap-3">
              KNOWLEDGE_BRAIN_V3.1
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-outline/40 hover:text-accent transition-none"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 max-h-[70vh] overflow-y-auto no-scrollbar bg-black">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-6">
              <Sparkles size={32} className="text-accent animate-pulse" />
              <span className="text-[0.7rem] font-bold tracking-[0.4em] text-accent uppercase animate-pulse">
                INITIALIZING_NEURAL_MAP...
              </span>
            </div>
          ) : error ? (
            <div className="p-6 bg-error/10 border border-error/20 text-error text-[0.8rem] font-bold uppercase tracking-widest leading-relaxed">
              [ CRITICAL_FAILURE ]: {error}
            </div>
          ) : stats ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center text-[0.6rem] font-bold tracking-[0.2em] text-accent uppercase">
                <span>[ RAW_DATA_STREAM ]</span>
                <span className="text-outline/40">Handshake: Verified</span>
              </div>
              <pre className="text-sm whitespace-pre-wrap font-mono p-6 bg-surface-container-lowest text-[#eaffde] opacity-90 leading-relaxed border-none">
                {JSON.stringify(stats, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="text-center py-20 text-outline/20 text-[0.7rem] font-bold uppercase tracking-[0.3em]">
              NO_BRAIN_METRICS_FOUND
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex bg-surface-container-high border-none">
          <button 
            onClick={fetchStats} 
            className="flex-1 flex items-center justify-center gap-3 py-5 text-[0.7rem] font-bold uppercase tracking-widest text-[#eaffde] hover:bg-surface-container transition-none"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            RE_SYNC
          </button>
          <div className="w-px bg-outline/10" />
          <button 
            onClick={() => {}} 
            className="flex-1 py-5 text-[0.7rem] font-bold uppercase tracking-widest bg-accent text-black hover:bg-white transition-none"
          >
            DEEP_INSIGHTS
          </button>
        </div>
      </div>
    </div>
  );
}