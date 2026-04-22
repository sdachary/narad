// narad/src/hooks/useFinance.js
import { useState, useEffect } from 'react';

export function useFinance() {
  const [data, setData] = useState({
    netWorth: 0,
    totalLiability: 0,
    upcomingCount: 0,
    loading: true,
    error: null
  });

  const fetchFinance = async () => {
    try {
      const res = await fetch('/api/finance/insights');
      if (!res.ok) throw new Error('Failed to fetch finance insights');
      const insights = await res.json();
      setData({
        netWorth: insights.netWorth || 0,
        totalLiability: insights.totalLiabilities || 0,
        upcomingCount: insights.summary?.upcomingDues || 0,
        loading: false,
        error: null
      });
    } catch (err) {
      setData(prev => ({ ...prev, loading: false, error: err.message }));
    }
  };

  useEffect(() => {
    fetchFinance();
    const interval = setInterval(fetchFinance, 600000); // 10 min
    return () => clearInterval(interval);
  }, []);

  return { ...data, refetch: fetchFinance };
}
