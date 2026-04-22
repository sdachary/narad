// narad/src/hooks/usePortfolio.js
import { useState, useEffect } from 'react';

export function usePortfolio() {
  const [data, setData] = useState({
    totalValue: 0,
    change: 0,
    changePercent: 0,
    loading: true,
    error: null
  });

  const fetchPortfolio = async () => {
    try {
      const res = await fetch('/api/portfolio/summary');
      if (!res.ok) throw new Error('Failed to fetch portfolio summary');
      const summary = await res.json();
      setData({
        ...summary,
        loading: false,
        error: null
      });
    } catch (err) {
      setData(prev => ({ ...prev, loading: false, error: err.message }));
    }
  };

  useEffect(() => {
    fetchPortfolio();
    const interval = setInterval(fetchPortfolio, 600000); // 10 min
    return () => clearInterval(interval);
  }, []);

  return { ...data, refetch: fetchPortfolio };
}
