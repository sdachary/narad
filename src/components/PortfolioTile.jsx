// narad/src/components/PortfolioTile.jsx
import React from 'react';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';

export default function PortfolioTile({ onClick }) {
  const { totalValue, change, changePercent, loading } = usePortfolio();
  const isPositive = change >= 0;

  if (loading) {
    return (
      <div className="p-5 rounded-[var(--radius-lg)] animate-pulse" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
        <div className="h-4 w-24 bg-[var(--bg-elevated)] rounded mb-3"></div>
        <div className="h-8 w-32 bg-[var(--bg-elevated)] rounded mb-2"></div>
        <div className="h-4 w-20 bg-[var(--bg-elevated)] rounded"></div>
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
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-[var(--accent)]" />
          <span className="font-semibold text-[var(--text-primary)]">Portfolio</span>
        </div>
        {isPositive ? (
          <TrendingUp className="w-5 h-5 text-[var(--status-online)]" />
        ) : (
          <TrendingDown className="w-5 h-5 text-[var(--status-error)]" />
        )}
      </div>
      <div className="text-2xl font-bold text-[var(--text-primary)]">
        ₹{totalValue.toLocaleString()}
      </div>
      <div className={`text-sm mt-1 ${isPositive ? 'text-[var(--status-online)]' : 'text-[var(--status-error)]'}`}>
        {isPositive ? '+' : ''}{change.toLocaleString()} ({changePercent}%)
      </div>
    </div>
  );
}
