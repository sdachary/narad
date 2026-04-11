import { useEffect, useState } from 'react';
import { X, Brain, RefreshCw, Sparkles } from 'lucide-react';

export default function BrainModal({ isOpen, onClose }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchStats();
    }
  }, [isOpen]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/brain/stats');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      setStats({ error: 'Failed to load stats' });
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div 
        className="relative w-full max-w-lg bg-chat-bg rounded-2xl shadow-soft-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-chat-border">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-chat-text">
            <div className="w-8 h-8 rounded-lg bg-chat-accent flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <span>Knowledge Brain</span>
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 rounded-lg hover:bg-chat-bg-tertiary text-chat-text-secondary hover:text-chat-text transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8 text-chat-text-muted">
              <Sparkles size={20} className="animate-pulse mr-2" />
              Loading...
            </div>
          ) : stats ? (
            <pre className="text-sm text-chat-text-secondary whitespace-pre-wrap font-mono bg-chat-bg-tertiary rounded-xl p-4">
              {JSON.stringify(stats, null, 2)}
            </pre>
          ) : (
            <div className="text-chat-text-muted text-center py-8">
              No brain data available
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 p-4 border-t border-chat-border">
          <button 
            onClick={fetchStats} 
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-chat-bg-tertiary text-chat-text hover:bg-chat-border-hover transition-colors"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <button 
            onClick={() => {}} 
            className="flex-1 py-2.5 rounded-xl bg-chat-accent text-white hover:bg-chat-accent-hover transition-colors"
          >
            View Insights
          </button>
        </div>
      </div>
    </div>
  );
}