import { useEffect, useState } from 'react';
import { X, Brain, RefreshCw, Sparkles } from 'lucide-react';

const styles = {
  modal: { backgroundColor: 'var(--bg)', borderColor: 'var(--border)' },
  headerText: { color: 'var(--text)' },
  contentText: { color: 'var(--text-secondary)' },
  muted: { color: 'var(--text-muted)' },
  accent: { backgroundColor: 'var(--accent)' },
  border: { borderColor: 'var(--border)' },
  tertiary: { backgroundColor: 'var(--bg-tertiary)' },
  buttonHover: { backgroundColor: 'var(--bg-secondary)' },
};

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div 
        className="relative w-full max-w-lg rounded-2xl shadow-lg overflow-hidden"
        style={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b" style={styles.border}>
          <h2 className="text-lg font-semibold flex items-center gap-2" style={styles.headerText}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={styles.accent}>
              <Sparkles size={16} className="text-white" />
            </div>
            <span>Knowledge Brain</span>
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 rounded-lg hover:opacity-80 transition-colors"
            style={styles.contentText}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8" style={styles.muted}>
              <Sparkles size={20} className="animate-pulse mr-2" />
              Loading...
            </div>
          ) : error ? (
            <div className="text-center py-8" style={{ color: 'var(--error)' }}>
              Error: {error}
            </div>
          ) : stats ? (
            <pre className="text-sm whitespace-pre-wrap font-mono rounded-xl p-4" style={styles.tertiary}>
              {JSON.stringify(stats, null, 2)}
            </pre>
          ) : (
            <div className="text-center py-8" style={styles.muted}>
              No brain data available
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 p-4 border-t" style={styles.border}>
          <button 
            onClick={fetchStats} 
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-colors"
            style={{ ...styles.tertiary, color: 'var(--text)' }}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <button 
            onClick={() => {}} 
            className="flex-1 py-2.5 rounded-xl text-white transition-colors"
            style={styles.accent}
          >
            View Insights
          </button>
        </div>
      </div>
    </div>
  );
}