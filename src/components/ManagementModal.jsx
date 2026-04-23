// narad/src/components/ManagementModal.jsx
import React, { useState } from 'react';
import { X, Plus, Trash2, Edit2, Save, ArrowLeft, TrendingUp, Wallet, Landmark, CreditCard, Receipt } from 'lucide-react';
import { useManagement } from '../hooks/useManagement';

export default function ManagementModal({ isOpen, onClose, initialTab = 'portfolio' }) {
  const [tab, setTab] = useState(initialTab);
  const [editingItem, setEditingItem] = useState(null);
  const { investments, accounts, expenses, loading, saveInvestment, deleteInvestment, saveAccount, deleteAccount, saveExpense, deleteExpense } = useManagement();

  if (!isOpen) return null;

  const safeInvestments = Array.isArray(investments) ? investments : [];
  const safeAccounts = Array.isArray(accounts) ? accounts : [];
  const safeExpenses = Array.isArray(expenses) ? expenses : [];

  const handleEdit = (item) => {
    setEditingItem({ ...item });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (tab === 'portfolio') {
        await saveInvestment(editingItem);
      } else if (editingItem?._table === 'expenses') {
        await saveExpense(editingItem);
      } else if (editingItem?._table) {
        await saveAccount(editingItem._table, editingItem);
      }
      setEditingItem(null);
    } catch (err) {
      console.error('Failed to save:', err);
    }
  };

  const renderForm = () => {
    if (!editingItem) return null;

    let fields = [];
    if (tab === 'portfolio') {
      fields = ['name', 'symbol', 'quantity', 'current_value', 'type', 'sector'];
    } else if (editingItem._table === 'expenses') {
      fields = ['name', 'amount', 'category', 'frequency', 'status'];
    } else {
      fields = ['name', 'balance', 'type', 'status'];
    }

    const isNew = !editingItem.id;
    const tables = ['bank_accounts', 'credit_cards', 'loans', 'wallets', 'expenses'];

    return (
      <div className="animate-in slide-in-from-right duration-300">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setEditingItem(null)} className="p-2 hover:bg-[var(--bg-elevated)] rounded-xl text-[var(--text-secondary)] transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h4 className="text-xl font-bold text-[var(--text-primary)]">{isNew ? 'Create New' : 'Edit Entry'}</h4>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {tab === 'finance' && isNew && (
            <div>
              <label className="text-[10px] text-[var(--text-secondary)] uppercase font-black tracking-widest mb-2 block">Category</label>
              <div className="grid grid-cols-3 gap-2">
                {tables.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setEditingItem({ ...editingItem, _table: t })}
                    className={`p-3 rounded-xl border text-[10px] font-bold transition-all ${editingItem._table === t ? 'bg-[var(--accent)]/10 border-[var(--accent)] text-[var(--accent)]' : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--text-secondary)]'}`}
                  >
                    {t.replace('_', ' ').toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map(field => (
              <div key={field} className={field === 'name' ? 'md:col-span-2' : ''}>
                <label className="text-[10px] text-[var(--text-secondary)] uppercase font-black tracking-widest mb-1.5 block">{field.replace('_', ' ')}</label>
                <input 
                  type={field.includes('value') || field.includes('quantity') || field.includes('balance') || field.includes('amount') ? 'number' : 'text'}
                  step="any"
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] px-4 py-3 rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]/50 transition-all"
                  value={editingItem[field] || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, [field]: e.target.value })}
                  required
                />
              </div>
            ))}
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-[var(--accent)] text-white font-black py-4 rounded-2xl mt-4 flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-[var(--accent)]/20"
          >
            <Save size={20} /> Save Entry
          </button>
        </form>
      </div>
    );
  };

  const renderPortfolio = () => {
    const totalVal = safeInvestments.reduce((sum, i) => sum + (parseFloat(i.current_value) || 0), 0);
    return (
      <div className="space-y-4 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[var(--accent)]/20 to-transparent border border-[var(--accent)]/10">
            <div className="flex items-center gap-2 text-[var(--accent)] mb-2">
              <TrendingUp size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">Total Value</span>
            </div>
            <div className="text-3xl font-black text-[var(--text-primary)]">
              ₹{(totalVal || 0).toLocaleString()}
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex flex-col justify-center">
            <div className="text-[10px] font-bold text-[var(--text-secondary)] uppercase mb-1">Active Assets</div>
            <div className="text-2xl font-bold text-[var(--text-primary)]">{safeInvestments.length}</div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-black text-[var(--text-secondary)] uppercase tracking-widest">Asset List</h3>
          <button 
            onClick={() => handleEdit({ type: 'Stock', is_active: true })}
            className="flex items-center gap-2 bg-[var(--accent)]/10 text-[var(--accent)] px-4 py-2 rounded-xl text-xs font-bold hover:bg-[var(--accent)]/20 transition-all"
          >
            <Plus size={16} /> Add Asset
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {safeInvestments.map(item => (
            <div key={item.id} className="group p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--accent)]/30 transition-all flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--bg-surface)] flex items-center justify-center border border-[var(--border-subtle)] group-hover:border-[var(--accent)]/20 transition-all">
                  <span className="text-xs font-black text-[var(--accent)]">{item.symbol?.substring(0, 3).toUpperCase() || 'INV'}</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-[var(--text-primary)]">{item.name}</div>
                  <div className="text-[10px] text-[var(--text-secondary)] uppercase font-medium">{item.type} · {item.sector || 'General'}</div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-sm font-mono font-bold text-[var(--text-primary)]">₹{parseFloat(item.current_value || 0).toLocaleString()}</div>
                  <div className="text-[9px] text-[var(--text-secondary)]">{item.quantity} units</div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleEdit(item)} className="p-2 rounded-lg hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-all">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => deleteInvestment(item.id)} className="p-2 rounded-lg hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--status-error)] transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderFinance = () => {
    const items = [
      ...safeAccounts.map(a => ({ ...a, icon: a._table === 'credit_cards' ? <CreditCard size={18} /> : a._table === 'loans' ? <Landmark size={18} /> : <Wallet size={18} /> })),
      ...safeExpenses.map(e => ({ ...e, _table: 'expenses', icon: <Receipt size={18} /> }))
    ];
    const totalPortfolio = safeInvestments.reduce((sum, i) => sum + (parseFloat(i.current_value) || 0), 0);

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="space-y-3">
          <button 
            onClick={() => {
              window.dispatchEvent(new CustomEvent('narad:send-chat', { 
                detail: { text: 'Act as my personal financial adviser. Provide an overview of my finances and suggest improvements based on my current net worth.' } 
              }));
              onClose();
            }}
            className="w-full p-4 rounded-2xl border border-[var(--accent)] bg-[var(--accent)]/5 text-[var(--accent)] text-sm font-black flex items-center justify-center gap-3 hover:bg-[var(--accent)]/10 transition-all shadow-sm"
          >
            <TrendingUp size={18} /> Get Financial Advisory Insights
          </button>

          <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[var(--bg-surface)] text-[var(--accent)]">
                <TrendingUp size={18} />
              </div>
              <div>
                <div className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Portfolio Linked</div>
                <div className="text-sm font-bold text-[var(--text-primary)]">Investment Assets</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-mono font-bold text-[var(--accent)]">
                ₹{(totalPortfolio || 0).toLocaleString()}
              </div>
              <div className="text-[9px] text-[var(--text-secondary)]">Live from Portfolio</div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <h3 className="text-sm font-black text-[var(--text-secondary)] uppercase tracking-widest">Accounts & Expenses</h3>
          <button 
            onClick={() => handleEdit({ _table: 'bank_accounts' })}
            className="flex items-center gap-2 bg-[var(--accent)]/10 text-[var(--accent)] px-4 py-2 rounded-xl text-xs font-bold hover:bg-[var(--accent)]/20 transition-all"
          >
            <Plus size={16} /> Add Entry
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {items.map(item => (
            <div key={`${item._table}-${item.id}`} className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--accent)]/20 transition-all flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-[var(--bg-surface)] text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-all">
                  {item.icon}
                </div>
                <div>
                  <div className="text-sm font-bold text-[var(--text-primary)]">{item.name}</div>
                  <div className="text-[10px] text-[var(--text-secondary)] uppercase font-medium">
                    {item._table?.replace('_', ' ')} · {item.type || item.category || 'Entry'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm font-mono font-bold text-[var(--text-primary)]">
                    ₹{(item.balance || item.amount || 0).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleEdit(item)} className="p-2 rounded-lg hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-all">
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => {
                      if (item._table === 'expenses') deleteExpense(item.id);
                      else deleteAccount(item._table, item.id);
                    }} 
                    className="p-2 rounded-lg hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--status-error)] transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xl animate-in fade-in duration-500" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-[var(--bg-surface)] rounded-[var(--radius-xl)] shadow-2xl overflow-hidden border border-[var(--border-subtle)] animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <div className="flex gap-8">
            <button 
              onClick={() => { setTab('portfolio'); setEditingItem(null); }}
              className={`relative text-xs font-black uppercase tracking-widest transition-all ${tab === 'portfolio' ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            >
              Portfolio
              {tab === 'portfolio' && <div className="absolute -bottom-5 left-0 right-0 h-0.5 bg-[var(--accent)]" />}
            </button>
            <button 
              onClick={() => { setTab('finance'); setEditingItem(null); }}
              className={`relative text-xs font-black uppercase tracking-widest transition-all ${tab === 'finance' ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            >
              Finance
              {tab === 'finance' && <div className="absolute -bottom-5 left-0 right-0 h-0.5 bg-[var(--accent)]" />}
            </button>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 max-h-[80vh] overflow-y-auto custom-scrollbar bg-[var(--bg-canvas)]/30">
          {editingItem ? renderForm() : (tab === 'portfolio' ? renderPortfolio() : renderFinance())}
        </div>
      </div>
    </div>
  );
}
