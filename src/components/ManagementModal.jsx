// narad/src/components/ManagementModal.jsx
import React, { useState } from 'react';
import { X, Plus, Trash2, Edit2, Save, ArrowLeft } from 'lucide-react';
import { useManagement } from '../hooks/useManagement';

export default function ManagementModal({ isOpen, onClose, initialTab = 'portfolio' }) {
  const [tab, setTab] = useState(initialTab);
  const [editingItem, setEditingItem] = useState(null);
  const { investments, accounts, expenses, loading, saveInvestment, deleteInvestment, saveAccount, deleteAccount, saveExpense, deleteExpense } = useManagement();

  if (!isOpen) return null;

  const handleEdit = (item) => {
    setEditingItem({ ...item });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (tab === 'portfolio') {
      await saveInvestment(editingItem);
    } else if (editingItem._table === 'expenses') {
      await saveExpense(editingItem);
    } else {
      await saveAccount(editingItem._table, editingItem);
    }
    setEditingItem(null);
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
      <form onSubmit={handleSave} className="space-y-4 animate-in slide-in-from-right duration-200">
        <div className="flex items-center gap-2 mb-4">
          <button type="button" onClick={() => setEditingItem(null)} className="p-1 hover:bg-[var(--bg-elevated)] rounded">
            <ArrowLeft size={18} />
          </button>
          <h4 className="font-bold">{isNew ? 'Add New' : 'Edit Item'}</h4>
        </div>

        {tab === 'finance' && isNew && (
          <div>
            <label className="text-xs text-[var(--text-secondary)] uppercase font-bold mb-1 block">Category</label>
            <select 
              className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] p-2 rounded-lg"
              value={editingItem._table || 'bank_accounts'}
              onChange={(e) => setEditingItem({ ...editingItem, _table: e.target.value })}
            >
              {tables.map(t => <option key={t} value={t}>{t.replace('_', ' ').toUpperCase()}</option>)}
            </select>
          </div>
        )}

        {fields.map(field => (
          <div key={field}>
            <label className="text-xs text-[var(--text-secondary)] uppercase font-bold mb-1 block">{field.replace('_', ' ')}</label>
            <input 
              type={field.includes('value') || field.includes('quantity') || field.includes('balance') || field.includes('amount') ? 'number' : 'text'}
              step="any"
              className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] p-2 rounded-lg text-sm"
              value={editingItem[field] || ''}
              onChange={(e) => setEditingItem({ ...editingItem, [field]: e.target.value })}
              required
            />
          </div>
        ))}
        
        <button 
          type="submit" 
          className="w-full bg-[var(--accent)] text-white font-bold py-2 rounded-xl mt-4 flex items-center justify-center gap-2"
        >
          <Save size={18} /> Save Changes
        </button>
      </form>
    );
  };

  const renderList = () => {
    let items = [];
    if (tab === 'portfolio') {
      items = investments.map(i => ({ ...i, _table: 'investments' }));
    } else {
      items = [
        ...accounts,
        ...expenses.map(e => ({ ...e, _table: 'expenses' }))
      ];
    }

    const totalPortfolio = investments.reduce((sum, i) => sum + (parseFloat(i.current_value) || 0), 0);
    
    return (
      <div className="space-y-2 animate-in fade-in duration-200">
        {tab === 'finance' && (
          <div className="mb-6 space-y-4">
            <button 
              onClick={() => {
                window.dispatchEvent(new CustomEvent('narad:send-chat', { 
                  detail: { text: 'Act as my personal financial adviser. Provide an overview of my finances and suggest improvements based on my current net worth.' } 
                }));
                onClose();
              }}
              className="w-full p-3 rounded-xl border border-[var(--accent)] bg-[var(--accent)]/5 text-[var(--accent)] text-sm font-bold flex items-center justify-center gap-2 hover:bg-[var(--accent)]/10 transition-all"
            >
              Ask Financial Adviser
            </button>

            <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-between opacity-80 grayscale-[0.5]">
              <div>
                <div className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">Portfolio Sync</div>
                <div className="text-sm font-bold text-[var(--text-primary)]">Total Investments</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-mono font-bold text-[var(--accent)]">
                  ₹{totalPortfolio.toLocaleString()}
                </div>
                <div className="text-[9px] text-[var(--text-secondary)]">Managed in Portfolio Tile</div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-bold text-[var(--text-secondary)] uppercase">{items.length} {tab === 'portfolio' ? 'Investments' : 'Items'}</span>
          <button 
            onClick={() => handleEdit(tab === 'portfolio' ? { is_active: true } : { _table: 'bank_accounts' })}
            className="flex items-center gap-1 text-[var(--accent)] text-xs font-bold hover:underline"
          >
            <Plus size={14} /> Add New
          </button>
        </div>

        {items.map(item => (
          <div key={`${item._table}-${item.id}`} className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-between group">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-[var(--text-primary)]">{item.name}</span>
              <span className="text-[10px] text-[var(--text-secondary)] uppercase">
                {item._table === 'investments' ? `${item.symbol} · ${item.type}` : `${item._table?.replace('_', ' ')} · ${item.type || item.category || 'Item'}`}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right mr-2">
                <div className="text-sm font-mono font-bold text-[var(--text-primary)]">
                  ₹{(item.current_value || item.balance || item.amount || 0).toLocaleString()}
                </div>
              </div>
              <button onClick={() => handleEdit(item)} className="p-2 rounded-lg hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
                <Edit2 size={16} />
              </button>
              <button 
                onClick={() => {
                  if (item._table === 'investments') deleteInvestment(item.id);
                  else if (item._table === 'expenses') deleteExpense(item.id);
                  else deleteAccount(item._table, item.id);
                }} 
                className="p-2 rounded-lg hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--status-error)] transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        {items.length === 0 && !loading && (
          <div className="text-center py-12 text-[var(--text-secondary)] text-sm italic">
            No items found. Click "Add New" to begin.
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-[var(--bg-surface)] rounded-[var(--radius-xl)] shadow-2xl overflow-hidden border border-[var(--border-subtle)]">
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)]">
          <div className="flex gap-4">
            <button 
              onClick={() => { setTab('portfolio'); setEditingItem(null); }}
              className={`text-sm font-bold transition-colors ${tab === 'portfolio' ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            >
              Investments
            </button>
            <button 
              onClick={() => { setTab('finance'); setEditingItem(null); }}
              className={`text-sm font-bold transition-colors ${tab === 'finance' ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            >
              Accounts
            </button>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)]">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {editingItem ? renderForm() : renderList()}
        </div>
      </div>
    </div>
  );
}
