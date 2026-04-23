// narad/src/hooks/useFinance.js
import { useState, useEffect } from 'react';

export function useFinance() {
  const [loans, setLoans] = useState([]);
  const [cards, setCards] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFinance = async () => {
    try {
      const res = await fetch('/api/finance/insights');
      if (!res.ok) throw new Error('Failed to fetch finance insights');
      const data = await res.json();
      setLoans(data.loans || []);
      setCards(data.cards || []);
      setBankAccounts(data.bankAccounts || []);
      setWallets(data.wallets || []);
      setInvestments(data.investments || []);
      setExpenses(data.expenses || []);
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

  const addBankAccount = async (account) => {
    const res = await fetch('/api/finance/bank-account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(account)
    });
    if (res.ok) fetchFinance();
    return res.ok;
  };

  const addWallet = async (wallet) => {
    const res = await fetch('/api/finance/wallet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(wallet)
    });
    if (res.ok) fetchFinance();
    return res.ok;
  };

  const addLoan = async (loan) => {
    const res = await fetch('/api/finance/loan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loan)
    });
    if (res.ok) fetchFinance();
    return res.ok;
  };

  const addCreditCard = async (card) => {
    const res = await fetch('/api/finance/credit-card', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(card)
    });
    if (res.ok) fetchFinance();
    return res.ok;
  };

  const totalAssets = [...bankAccounts, ...wallets, ...investments]
    .reduce((sum, item) => sum + parseFloat(item.balance || item.current_value || 0), 0);

  const totalLiabilities = [...loans, ...cards]
    .reduce((sum, item) => sum + parseFloat(item.principal_amount || item.current_balance || 0), 0);

  const netWorth = totalAssets - totalLiabilities;

  return {
    loans, cards, bankAccounts, wallets, investments, expenses,
    loading, error, netWorth, totalAssets, totalLiabilities,
    refresh: fetchFinance,
    addBankAccount, addWallet, addLoan, addCreditCard
  };
}