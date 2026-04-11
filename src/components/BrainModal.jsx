import { useEffect, useState } from 'react';
import { X, Brain, RefreshCw } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg glass-card p-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Brain size={20} />
            Narad Brain
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-terminal-bg-tertiary rounded">
            <X size={20} />
          </button>
        </div>
        <div className="mb-4">
          {loading ? (
            <div className="text-terminal-text-muted">Loading...</div>
          ) : stats ? (
            <pre className="text-sm text-terminal-text-secondary whitespace-pre-wrap">
              {JSON.stringify(stats, null, 2)}
            </pre>
          ) : (
            <div className="text-terminal-text-muted">No data</div>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={fetchStats} className="btn flex items-center gap-2">
            <RefreshCw size={14} /> Refresh
          </button>
          <button onClick={() => {}} className="btn">
            View Insights
          </button>
        </div>
      </div>
    </div>
  );
}