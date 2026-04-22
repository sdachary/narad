import { CircleUser } from 'lucide-react';
import { useFinance } from '../hooks/useFinance';

export default function FinanceTile({ onClick }) {
  const { netWorth, loading } = useFinance();

  if (loading) {
    return (
      <div className="p-5 rounded-[var(--radius-lg)] animate-pulse" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
        <div className="h-4 w-24 bg-[var(--bg-elevated)] rounded mb-3"></div>
        <div className="h-8 w-32 bg-[var(--bg-elevated)] rounded mb-2"></div>
      </div>
    );
  }

  return (
    <div 
      onClick={onClick}
      className="p-5 rounded-[var(--radius-lg)] cursor-pointer transition-all duration-300 hover:scale-[1.02]"
      style={{ 
        backgroundColor: 'var(--bg-surface)',
        boxShadow: 'var(--shadow-tile)',
        border: '1px solid var(--border-subtle)'
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <CircleUser className="w-5 h-5 text-[var(--accent-alt)]" />
        <span className="font-semibold text-[var(--text-primary)]">Finance Adviser</span>
      </div>
      <div className="text-2xl font-bold text-[var(--text-primary)]">
        ₹{netWorth.toLocaleString()}
      </div>
      <div className="text-sm text-[var(--text-secondary)] mt-1">
        Personal Consultant
      </div>
    </div>
  );
}
