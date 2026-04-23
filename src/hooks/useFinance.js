// narad/src/hooks/useFinance.js
import { useState, useEffect } from 'react';

const API_BASE = '/api/finance';

export function useFinance() {
  const [loans, setLoans] = useState([]);
  const [cards, setCards] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [savings, setSavings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFinance = async () => {
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setLoans(data.loans || []);
      setCards(data.cards || []);
      setBankAccounts(data.bankAccounts || []);
      setWallets(data.wallets || []);
      setInvestments(data.investments || []);
      setSavings(data.savings || []);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinance();
    const interval = setInterval(fetchFinance, 600000);
    return () => clearInterval(interval);
  }, []);

  // Bank Accounts
  const addBankAccount = async (item) => {
    const res = await fetch(`${API_BASE}/bank-account`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...item, is_active: true })
    });
    if (res.ok) fetchFinance();
    return res.ok;
  };

  const updateBankAccount = async (id, data) => {
    const res = await fetch(`${API_BASE}/bank-account/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) fetchFinance();
    return res.ok;
  };

  const deleteBankAccount = async (id) => {
    const res = await fetch(`${API_BASE}/bank-account/${id}`, { method: 'DELETE' });
    if (res.ok) fetchFinance();
    return res.ok;
  };

  // Wallets
  const addWallet = async (item) => {
    const res = await fetch(`${API_BASE}/wallet`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...item, is_active: true })
    });
    if (res.ok) fetchFinance();
    return res.ok;
  };

  const updateWallet = async (id, data) => {
    const res = await fetch(`${API_BASE}/wallet/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) fetchFinance();
    return res.ok;
  };

  const deleteWallet = async (id) => {
    const res = await fetch(`${API_BASE}/wallet/${id}`, { method: 'DELETE' });
    if (res.ok) fetchFinance();
    return res.ok;
  };

  // Investments
  const addInvestment = async (item) => {
    const res = await fetch(`${API_BASE}/investment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...item, is_active: true })
    });
    if (res.ok) fetchFinance();
    return res.ok;
  };

  const updateInvestment = async (id, data) => {
    const res = await fetch(`${API_BASE}/investment/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) fetchFinance();
    return res.ok;
  };

  const deleteInvestment = async (id) => {
    const res = await fetch(`${API_BASE}/investment/${id}`, { method: 'DELETE' });
    if (res.ok) fetchFinance();
    return res.ok;
  };

  // Loans
  const addLoan = async (item) => {
    const res = await fetch(`${API_BASE}/loan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...item, status: 'active' })
    });
    if (res.ok) fetchFinance();
    return res.ok;
  };

  const updateLoan = async (id, data) => {
    const res = await fetch(`${API_BASE}/loan/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) fetchFinance();
    return res.ok;
  };

  const deleteLoan = async (id) => {
    const res = await fetch(`${API_BASE}/loan/${id}`, { method: 'DELETE' });
    if (res.ok) fetchFinance();
    return res.ok;
  };

  // Credit Cards
  const addCreditCard = async (item) => {
    const res = await fetch(`${API_BASE}/credit-card`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...item, status: 'active' })
    });
    if (res.ok) fetchFinance();
    return res.ok;
  };

  const updateCreditCard = async (id, data) => {
    const res = await fetch(`${API_BASE}/credit-card/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) fetchFinance();
    return res.ok;
  };

  const deleteCreditCard = async (id) => {
    const res = await fetch(`${API_BASE}/credit-card/${id}`, { method: 'DELETE' });
    if (res.ok) fetchFinance();
    return res.ok;
  };

  // Planned Savings
  const addSavings = async (item) => {
    const res = await fetch(`${API_BASE}/savings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...item, is_active: true })
    });
    if (res.ok) fetchFinance();
    return res.ok;
  };

  const updateSavings = async (id, data) => {
    const res = await fetch(`${API_BASE}/savings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) fetchFinance();
    return res.ok;
  };

  const deleteSavings = async (id) => {
    const res = await fetch(`${API_BASE}/savings/${id}`, { method: 'DELETE' });
    if (res.ok) fetchFinance();
    return res.ok;
  };

  const balances = [...(bankAccounts || []), ...(wallets || [])];

  const totalBalances = balances.reduce((s, r) => s + parseFloat(r.balance || 0), 0);
  const totalInvestments = investments.reduce((s, r) => s + parseFloat(r.current_value || 0), 0);
  const totalLoans = loans.reduce((s, r) => s + parseFloat(r.principal_amount || 0), 0);
  const totalCards = cards.reduce((s, r) => s + parseFloat(r.current_balance || 0), 0);
  const totalPlanned = savings.reduce((s, r) => s + parseFloat(r.planned_saving || 0), 0);
  const totalActual = savings.reduce((s, r) => s + parseFloat(r.actual_saving || 0), 0);
  const totalPending = savings.reduce((s, r) => s + parseFloat(r.pending || 0), 0);

  const netWorth = totalBalances + totalInvestments - totalLoans - totalCards;

  return {
    loans, cards, bankAccounts, wallets, investments, savings,
    loading, error, netWorth,
    totalBalances, totalInvestments, totalLoans, totalCards,
    totalPlanned, totalActual, totalPending,
    refresh: fetchFinance,
    addBankAccount, updateBankAccount, deleteBankAccount,
    addWallet, updateWallet, deleteWallet,
    addInvestment, updateInvestment, deleteInvestment,
    addLoan, updateLoan, deleteLoan,
    addCreditCard, updateCreditCard, deleteCreditCard,
    addSavings, updateSavings, deleteSavings,
    balances, totalAssets: totalBalances + totalInvestments,
    totalLiabilities: totalLoans + totalCards
  };
}