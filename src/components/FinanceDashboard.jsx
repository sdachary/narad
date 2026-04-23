import React, { useState, useEffect, useRef } from 'react';
import { useFinance } from '../hooks/useFinance';
import { Plus, X, Check, AlertCircle } from 'lucide-react';

function formatINR(num) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num || 0);
}

function EditableCell({ value, onSave, type = 'text', className = '' }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    setVal(value);
    if (editing && inputRef.current) inputRef.current.focus();
  }, [value, editing]);

  const save = () => {
    setEditing(false);
    if (String(val) !== String(value)) onSave(val);
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        type={type}
        value={val}
        onChange={e => setVal(e.target.value)}
        onBlur={save}
        onKeyDown={e => e.key === 'Enter' && save()}
        className={`w-full px-2 py-1 bg-[#1a1a24] border border-[#10b981] rounded text-white text-sm focus:outline-none ${className}`}
      />
    );
  }
  return (
    <span onClick={() => setEditing(true)} className={`cursor-pointer hover:text-[#10b981] px-2 py-1 block min-h-[28px] ${className}`}>
      {type === 'number' ? formatINR(parseFloat(val)) : val}
    </span>
  );
}

function ProgressBar({ progress, className = '' }) {
  const pct = Math.min(100, Math.max(0, parseFloat(progress) || 0));
  const color = pct >= 100 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444';
  return (
    <div className={`w-full h-2 bg-[#2a2a34] rounded-full overflow-hidden ${className}`}>
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  );
}

function AddRow({ onAdd, fields }) {
  const [row, setRow] = useState(fields.reduce((acc, f) => ({ ...acc, [f.key]: '' }), {}));

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(row);
    setRow(fields.reduce((acc, f) => ({ ...acc, [f.key]: '' }), {}));
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-2 bg-[#1a1a24] border-t border-[#2a2a34]">
      {fields.map(field => (
        <input
          key={field.key}
          type={field.type || 'text'}
          placeholder={field.placeholder}
          value={row[field.key]}
          onChange={e => setRow({ ...row, [field.key]: e.target.value })}
          className="flex-1 min-w-[80px] px-2 py-1 bg-[#141418] border border-[#2a2a34] rounded text-white text-sm focus:border-[#10b981] focus:outline-none"
        />
      ))}
      <button type="submit" className="px-3 py-1 bg-[#10b981] hover:bg-[#059669] text-white text-sm rounded font-medium">
        <Plus size={14} />
      </button>
    </form>
  );
}

function DataTable({ title, data, columns, onUpdate, onDelete, onAdd, addFields, footer }) {
  const [rows, setRows] = useState(data);

  useEffect(() => setRows(data), [data]);

  return (
    <div className="bg-[#141418] rounded-xl border border-[#2a2a34] overflow-hidden flex flex-col">
      <div className="px-4 py-3 bg-gradient-to-r from-[#1c1c28] to-[#181824] border-b border-[#2a2a34]">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#0d0d10] text-[#8b8b96]">
              {columns.map(col => (
                <th key={col.key} className={`px-3 py-2 text-left font-medium ${col.align || 'text-left'}`}>
                  {col.label}
                </th>
              ))}
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.id || idx} className="border-b border-[#1f1f28] hover:bg-[#1a1a24]">
                {columns.map(col => (
                  <td key={col.key} className={`p-1 ${col.align || 'text-left'}`}>
                    <EditableCell
                      value={row[col.key]}
                      onSave={v => onUpdate(row.id, { [col.key]: col.type === 'number' ? parseFloat(v) : v })}
                      type={col.type}
                      className={col.align === 'text-right' ? 'text-right' : ''}
                    />
                  </td>
                ))}
                <td className="p-1 text-center">
                  <button onClick={() => onDelete(row.id)} className="text-[#8b8b96] hover:text-[#ef4444] p-1">
                    <X size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="p-8 text-center text-[#8b8b96]">
                  No data yet
                </td>
              </tr>
            )}
          </tbody>
          {footer && (
            <tfoot>
              <tr className="bg-[#181824]">
                {columns.map((col, idx) => (
                  <td key={col.key} className={`px-3 py-2 font-semibold text-white ${idx === 0 ? 'text-left' : 'text-right'}`}>
                    {idx === 0 ? 'Total' : footer[col.key]}
                  </td>
                ))}
                <td></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
      {onAdd && (
        <AddRow fields={addFields} onAdd={onAdd} />
      )}
    </div>
  );
}

function MiniTable({ title, data, valueKey, nameKey = 'name', onUpdate, onDelete, onAdd, total }) {
  const formatVal = (v) => formatINR(parseFloat(v) || 0);
  const sum = data.reduce((s, r) => s + parseFloat(r[valueKey] || 0), 0);

  return (
    <div className="bg-[#141418] rounded-xl border border-[#2a2a34] overflow-hidden">
      <div className="px-4 py-3 bg-gradient-to-r from-[#1c1c28] to-[#181824] border-b border-[#2a2a34] flex justify-between items-center">
        <h2 className="text-base font-semibold text-white">{title}</h2>
        <span className="text-[#10b981] font-bold">{formatVal(total !== undefined ? total : sum)}</span>
      </div>
      <div className="p-2 space-y-1 max-h-48 overflow-y-auto">
        {data.map((item, idx) => (
          <div key={item.id || idx} className="flex items-center gap-2 py-1 px-2 rounded hover:bg-[#1a1a24] group">
            <EditableCell
              value={item[nameKey]}
              onSave={v => onUpdate(item.id, { [nameKey]: v })}
              className="flex-1 text-white"
            />
            <EditableCell
              value={item[valueKey]}
              onSave={v => onUpdate(item.id, { [valueKey]: parseFloat(v) })}
              type="number"
              className="w-24 text-right text-white"
            />
            <button onClick={() => onDelete(item.id)} className="opacity-0 group-hover:opacity-100 text-[#8b8b96] hover:text-[#ef4444]">
              <X size={12} />
            </button>
          </div>
        ))}
        {data.length === 0 && (
          <div className="text-center py-4 text-[#8b8b96] text-sm">No data</div>
        )}
      </div>
      {onAdd && (
        <div className="flex gap-1 p-2 border-t border-[#2a2a34]">
          <input
            placeholder="Name"
            onKeyDown={e => {
              if (e.key === 'Enter') {
                const name = e.target.nextSibling;
                if (name) onAdd({ [nameKey]: e.target.value, [valueKey]: 0 });
                e.target.value = '';
              }
            }}
            className="flex-1 px-2 py-1 bg-[#0d0d10] border border-[#2a2a34] rounded text-white text-sm"
          />
          <input
            type="number"
            placeholder="₹"
            onKeyDown={e => {
              if (e.key === 'Enter') {
                const name = e.target.previousSibling;
                if (name && name.value) onAdd({ [nameKey]: name.value, [valueKey]: parseFloat(e.target.value) || 0 });
              }
            }}
            className="w-20 px-2 py-1 bg-[#0d0d10] border border-[#2a2a34] rounded text-white text-sm text-right"
          />
        </div>
      )}
    </div>
  );
}

export default function FinanceDashboard() {
  const {
    bankAccounts, wallets, investments, loans, cards, savings,
    loading, error, netWorth,
    totalBalances, totalInvestments, totalLoans, totalCards,
    totalPlanned, totalActual, totalPending,
    refresh,
    addBankAccount, updateBankAccount, deleteBankAccount,
    addWallet, updateWallet, deleteWallet,
    addInvestment, updateInvestment, deleteInvestment,
    addLoan, updateLoan, deleteLoan,
    addCreditCard, updateCreditCard, deleteCreditCard,
    addSavings, updateSavings, deleteSavings
  } = useFinance();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#10b981]"></div>
      </div>
    );
  }

  const balances = [...(bankAccounts || []), ...(wallets || [])];
  const balanceTotal = balances.reduce((s, r) => s + parseFloat(r.balance || 0), 0);

  return (
    <div className="p-4 lg:p-6 bg-[#0a0a0f] min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white to-[#8b8b96] bg-clip-text text-transparent">
            Finance
          </h1>
          <p className="text-[#8b8b96] text-sm mt-1">Track your wealth & savings goals</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[#8b8b96] text-xs uppercase tracking-wider">Net Worth</p>
            <p className="text-2xl lg:text-3xl font-bold text-[#10b981]">{formatINR(netWorth)}</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-gradient-to-br from-[#141418] to-[#1c1c24] rounded-xl p-4 border border-[#2a2a34]">
          <p className="text-[#8b8b96] text-xs uppercase tracking-wider mb-1">Balances</p>
          <p className="text-xl lg:text-2xl font-bold text-white">{formatINR(totalBalances)}</p>
        </div>
        <div className="bg-gradient-to-br from-[#141418] to-[#1c1c24] rounded-xl p-4 border border-[#2a2a34]">
          <p className="text-[#8b8b96] text-xs uppercase tracking-wider mb-1">Investments</p>
          <p className="text-xl lg:text-2xl font-bold text-[#8b5cf6]">{formatINR(totalInvestments)}</p>
        </div>
        <div className="bg-gradient-to-br from-[#141418] to-[#1c1c24] rounded-xl p-4 border border-[#2a2a34]">
          <p className="text-[#8b8b96] text-xs uppercase tracking-wider mb-1">Loans</p>
          <p className="text-xl lg:text-2xl font-bold text-[#ef4444]">{formatINR(totalLoans)}</p>
        </div>
        <div className="bg-gradient-to-br from-[#141418] to-[#1c1c24] rounded-xl p-4 border border-[#2a2a34]">
          <p className="text-[#8b8b96] text-xs uppercase tracking-wider mb-1">Credit Cards</p>
          <p className="text-xl lg:text-2xl font-bold text-[#f59e0b]">{formatINR(totalCards)}</p>
        </div>
      </div>

      {/* Main Tables */}
      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <MiniTable
          title="Bank Balances"
          data={balances}
          valueKey="balance"
          onUpdate={async (id, data) => {
            const acc = balances.find(b => b.id === id);
            if (acc?.balance !== undefined) await updateBankAccount(id, data);
            else await updateWallet(id, data);
          }}
          onDelete={async (id) => {
            const acc = balances.find(b => b.id === id);
            if (acc?.balance !== undefined) await deleteBankAccount(id);
            else await deleteWallet(id);
          }}
          onAdd={addBankAccount}
          total={balanceTotal}
        />
        <MiniTable
          title="Investments"
          data={investments}
          valueKey="current_value"
          onUpdate={updateInvestment}
          onDelete={deleteInvestment}
          onAdd={addInvestment}
          total={totalInvestments}
        />
      </div>

      {/* Planned Savings */}
      <div className="mb-6">
        <DataTable
          title="Planned Savings"
          data={savings}
          columns={[
            { key: 'id', label: 'ID', type: 'text' },
            { key: 'category', label: 'Category', type: 'text' },
            { key: 'name', label: 'Name', type: 'text' },
            { key: 'target_amount', label: 'Target', type: 'number' },
            { key: 'frequency', label: 'Frequency', type: 'text' },
            { key: 'start_date', label: 'Start', type: 'text' },
            { key: 'monthly_saving', label: 'Monthly', type: 'number' },
            { key: 'planned_saving', label: 'Planned', type: 'number' },
            { key: 'actual_saving', label: 'Actual', type: 'number' },
            { key: 'pending', label: 'Pending', type: 'number' },
            { key: 'progress', label: 'Progress', type: 'text' }
          ]}
          onUpdate={updateSavings}
          onDelete={deleteSavings}
          onAdd={addSavings}
          addFields={[
            { key: 'name', placeholder: 'Name' },
            { key: 'category', placeholder: 'Category' },
            { key: 'target_amount', placeholder: 'Target', type: 'number' }
          ]}
          footer={{ planned_saving: formatINR(totalPlanned), actual_saving: formatINR(totalActual), pending: formatINR(totalPending) }}
        />
      </div>

      {/* Loans & Cards */}
      <div className="grid lg:grid-cols-2 gap-4">
        <MiniTable
          title="Loans"
          data={loans}
          valueKey="principal_amount"
          nameKey="name"
          onUpdate={updateLoan}
          onDelete={deleteLoan}
          onAdd={addLoan}
          total={totalLoans}
        />
        <MiniTable
          title="Credit Cards"
          data={cards}
          valueKey="current_balance"
          nameKey="name"
          onUpdate={updateCreditCard}
          onDelete={deleteCreditCard}
          onAdd={addCreditCard}
          total={totalCards}
        />
      </div>
    </div>
  );
}