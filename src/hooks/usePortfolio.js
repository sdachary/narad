// narad/src/hooks/usePortfolio.js
import { useState, useEffect } from 'react';

const API_BASE = '/api/portfolio';

export function usePortfolio() {
  const [stocks, setStocks] = useState([]);
  const [dividends, setDividends] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPortfolio = async () => {
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setStocks(data.stocks || []);
      setDividends(data.dividends || []);
      setSummary(data.summary?.[0] || null);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
    const interval = setInterval(fetchPortfolio, 600000);
    return () => clearInterval(interval);
  }, []);

  // Stocks
  const addStock = async (item) => {
    const res = await fetch(`${API_BASE}/stock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...item, is_active: true })
    });
    if (res.ok) fetchPortfolio();
    return res.ok;
  };

  const updateStock = async (id, data) => {
    const res = await fetch(`${API_BASE}/stock/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) fetchPortfolio();
    return res.ok;
  };

  const deleteStock = async (id) => {
    const res = await fetch(`${API_BASE}/stock/${id}`, { method: 'DELETE' });
    if (res.ok) fetchPortfolio();
    return res.ok;
  };

  // Dividends
  const addDividend = async (item) => {
    const res = await fetch(`${API_BASE}/dividend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...item, is_active: true })
    });
    if (res.ok) fetchPortfolio();
    return res.ok;
  };

  const updateDividend = async (id, data) => {
    const res = await fetch(`${API_BASE}/dividend/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) fetchPortfolio();
    return res.ok;
  };

  const deleteDividend = async (id) => {
    const res = await fetch(`${API_BASE}/dividend/${id}`, { method: 'DELETE' });
    if (res.ok) fetchPortfolio();
    return res.ok;
  };

  // Summary
  const updateSummary = async (data) => {
    const res = await fetch(`${API_BASE}/summary`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) fetchPortfolio();
    return res.ok;
  };

  const totalInvested = stocks.reduce((s, r) => s + parseFloat(r.invested || 0), 0) + dividends.reduce((s, r) => s + parseFloat(r.invested || 0), 0);
  const totalCurrent = stocks.reduce((s, r) => s + parseFloat(r.current_value || 0), 0) + dividends.reduce((s, r) => s + parseFloat(r.current_value || 0), 0);
  const totalPL = totalCurrent - totalInvested;
  const targetInvestment = (summary?.target_investment || 0);

  return {
    stocks, dividends, summary, loading, error,
    totalInvested, totalCurrent, totalPL, targetInvestment,
    refresh: fetchPortfolio,
    addStock, updateStock, deleteStock,
    addDividend, updateDividend, deleteDividend,
    updateSummary
  };
}