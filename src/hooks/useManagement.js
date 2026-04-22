// narad/src/hooks/useManagement.js
import { useState, useEffect } from 'react';

export function useManagement() {
  const [investments, setInvestments] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInvestments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/management/investments');
      const data = await res.json();
      setInvestments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/management/accounts');
      const data = await res.json();
      setAccounts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/management/expenses');
      const data = await res.json();
      setExpenses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveInvestment = async (item) => {
    const method = item.id ? 'PATCH' : 'POST';
    const url = item.id ? `/api/management/investments/${item.id}` : '/api/management/investments';
    
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    const saved = await res.json();
    fetchInvestments();
    return saved;
  };

  const saveAccount = async (table, item) => {
    const method = item.id ? 'PATCH' : 'POST';
    const url = item.id ? `/api/management/accounts/${table}/${item.id}` : `/api/management/accounts/${table}`;
    
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    const saved = await res.json();
    fetchAccounts();
    return saved;
  };

  const saveExpense = async (item) => {
    const method = item.id ? 'PATCH' : 'POST';
    const url = item.id ? `/api/management/expenses/${item.id}` : '/api/management/expenses';
    
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    const saved = await res.json();
    fetchExpenses();
    return saved;
  };

  const deleteInvestment = async (id) => {
    await fetch(`/api/management/investments/${id}`, { method: 'DELETE' });
    fetchInvestments();
  };

  const deleteAccount = async (table, id) => {
    await fetch(`/api/management/accounts/${table}/${id}`, { method: 'DELETE' });
    fetchAccounts();
  };

  const deleteExpense = async (id) => {
    await fetch(`/api/management/expenses/${id}`, { method: 'DELETE' });
    fetchExpenses();
  };

  useEffect(() => {
    fetchInvestments();
    fetchAccounts();
    fetchExpenses();
  }, []);

  return {
    investments,
    accounts,
    expenses,
    loading,
    error,
    saveInvestment,
    deleteInvestment,
    saveAccount,
    deleteAccount,
    saveExpense,
    deleteExpense,
    refresh: () => { fetchInvestments(); fetchAccounts(); fetchExpenses(); }
  };
}
