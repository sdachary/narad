import React, { useState, useEffect, useRef } from 'react';
import { usePortfolio } from '../hooks/usePortfolio';
import { X } from 'lucide-react';

function formatINR(num) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num || 0);
}

function EditableCell({ value, onSave, type = 'text', className = '' }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => { setVal(value); }, [value]);
  useEffect(() => { if (editing && inputRef.current) inputRef.current.focus(); }, [editing]);

  const save = () => { setEditing(false); if (String(val) !== String(value)) onSave(val); };

  if (editing) {
    return (
      <input ref={inputRef} type={type} value={val} onChange={e => setVal(e.target.value)} onBlur={save} onKeyDown={e => e.key === 'Enter' && save()}
        className={`w-full px-1 py-0.5 bg-[#1a1a24] border border-[#10b981] rounded text-white text-xs focus:outline-none ${className}`} />
    );
  }
  return (
    <span onClick={() => setEditing(true)} className={`cursor-pointer hover:text-[#10b981] px-1 py-0.5 block ${className}`}>
      {type === 'number' ? formatINR(parseFloat(val)) : val}
    </span>
  );
}

function CompactTable({ title, data, columns, onUpdate, onDelete, onAdd, footer }) {
  return (
    <div className="bg-[#141418] rounded-lg border border-[#2a2a34] overflow-hidden">
      <div className="px-3 py-2 bg-[#1c1c24] border-b border-[#2a2a34]">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-[#0d0d10] text-[#8b8b96]">
              {columns.map(col => <th key={col.key} className={`px-2 py-1.5 text-${col.align || 'left'} font-medium`}>{col.label}</th>)}
              <th className="w-6"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={row.id || idx} className="border-b border-[#1f1f28] hover:bg-[#1a1a24]">
                {columns.map(col => (
                  <td key={col.key} className={`px-2 py-1 ${col.align === 'right' ? 'text-right' : ''}`}>
                    <EditableCell value={row[col.key]} onSave={v => onUpdate(row.id, { [col.key]: col.type === 'number' ? parseFloat(v) : v })} type={col.type}
                      className={col.align === 'right' ? 'text-right' : ''} />
                  </td>
                ))}
                <td className="px-1 text-center">
                  <button onClick={() => onDelete(row.id)} className="text-[#8b8b96] hover:text-[#ef4444]"><X size={12} /></button>
                </td>
              </tr>
            ))}
            {data.length === 0 && <tr><td colSpan={columns.length + 1} className="p-4 text-center text-[#8b8b96]">No data</td></tr>}
          </tbody>
          {footer && <tfoot><tr className="bg-[#181824]">{footer}</tr></tfoot>}
        </table>
      </div>
    </div>
  );
}

export default function PortfolioDashboard() {
  const { stocks, dividends, summary, loading, totalInvested, totalCurrent, totalPL, targetInvestment, addStock, updateStock, deleteStock, addDividend, updateDividend, deleteDividend } = usePortfolio();

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#10b981]"></div></div>;

  const stockTotalInvested = stocks.reduce((s, r) => s + parseFloat(r.invested || 0), 0);
  const stockTotalCurrent = stocks.reduce((s, r) => s + parseFloat(r.current_value || 0), 0);
  const stockTotalPL = stockTotalCurrent - stockTotalInvested;

  const divTotalInvested = dividends.reduce((s, r) => s + parseFloat(r.invested || 0), 0);
  const divTotalCurrent = dividends.reduce((s, r) => s + parseFloat(r.current_value || 0), 0);
  const divTotalPL = divTotalCurrent - divTotalInvested;

  const targetPayout = summary?.target_monthly_payout || 3000;
  const actualPayout = summary?.actual_monthly_payout || 71.28;
  const monthlySIP = summary?.monthly_sip || 5000;
  const actualSIP = summary?.actual_sip || 6198;
  const extra = actualSIP - monthlySIP;

  return (
    <div className="p-4 lg:p-6 bg-[#0a0a0f] min-h-screen">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white to-[#8b8b96] bg-clip-text text-transparent">Portfolio</h1>
          <p className="text-[#8b8b96] text-sm mt-1">Stock & Dividend tracking</p>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div><span className="text-[#8b8b96]">Invested</span><p className="text-white font-semibold">{formatINR(totalInvested)}</p></div>
          <div><span className="text-[#8b8b96]">Current</span><p className="text-[#10b981] font-semibold">{formatINR(totalCurrent)}</p></div>
          <div><span className="text-[#8b8b96]">P&L</span><p className={totalPL >= 0 ? 'text-[#10b981]' : 'text-[#ef4444]'}>{formatINR(totalPL)}</p></div>
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="bg-[#141418] rounded-xl border border-[#2a2a34] p-4 mb-6">
        <h3 className="text-sm font-semibold text-white mb-3">Monthly Summary</h3>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div><p className="text-[#8b8b96] text-xs">Target Payout</p><EditableCell value={targetPayout} onSave={() => {}} type="number" className="text-white font-semibold" /></div>
          <div><p className="text-[#8b8b96] text-xs">Actual Payout</p><EditableCell value={actualPayout} onSave={() => {}} type="number" className="text-white font-semibold" /></div>
          <div><p className="text-[#8b8b96] text-xs">Monthly SIP</p><EditableCell value={monthlySIP} onSave={() => {}} type="number" className="text-white font-semibold" /></div>
          <div><p className="text-[#8b8b96] text-xs">Actual SIP</p><EditableCell value={actualSIP} onSave={() => {}} type="number" className="text-white font-semibold" /></div>
          <div><p className="text-[#8b8b96] text-xs">Extra</p><p className={extra >= 0 ? 'text-[#10b981]' : 'text-[#ef4444]'}>{formatINR(extra)}</p></div>
        </div>
      </div>

      {/* Stock Portfolio */}
      <div className="mb-6">
        <CompactTable title="Stock Portfolio (SIP)" data={stocks} columns={[
          { key: 'instrument', label: 'NSE' },
          { key: 'company_name', label: 'Name' },
          { key: 'ltp', label: 'LTP', type: 'number' },
          { key: 'allocation_percent', label: 'Alloc %', type: 'number' },
          { key: 'monthly_sip', label: 'Monthly SIP', type: 'number' },
          { key: 'quantity', label: 'Qty', type: 'number' },
          { key: 'avg_cost', label: 'Avg Cost', type: 'number' },
          { key: 'invested', label: 'Invested', type: 'number' },
          { key: 'current_value', label: 'Current', type: 'number' },
          { key: 'pl', label: 'P&L', type: 'number' }
        ]} onUpdate={updateStock} onDelete={deleteStock} onAdd={addStock}
          footer={[<td key="t" colSpan={7} className="text-right text-white font-semibold px-2 py-1">Total</td>,
            <td key="i" className="text-right text-white font-semibold px-2">{formatINR(stockTotalInvested)}</td>,
            <td key="c" className="text-right text-white font-semibold px-2">{formatINR(stockTotalCurrent)}</td>,
            <td key="p" className={`text-right font-semibold px-2 ${stockTotalPL >= 0 ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>{formatINR(stockTotalPL)}</td>]} />
      </div>

      {/* Dividend Portfolio */}
      <div className="mb-6">
        <CompactTable title="Dividend Portfolio" data={dividends} columns={[
          { key: 'instrument', label: 'NSE' },
          { key: 'company_name', label: 'Name' },
          { key: 'ltp', label: 'LTP', type: 'number' },
          { key: 'avg_cost', label: 'Avg Cost', type: 'number' },
          { key: 'quantity', label: 'Qty', type: 'number' },
          { key: 'invested', label: 'Invested', type: 'number' },
          { key: 'current_value', label: 'Current', type: 'number' },
          { key: 'pl', label: 'P&L', type: 'number' },
          { key: 'target_invest', label: 'Target', type: 'number' },
          { key: 'target_achieved', label: 'Achieved %', type: 'number' }
        ]} onUpdate={updateDividend} onDelete={deleteDividend} onAdd={addDividend}
          footer={[<td key="t" colSpan={5} className="text-right text-white font-semibold px-2 py-1">Total</td>,
            <td key="i" className="text-right text-white font-semibold px-2">{formatINR(divTotalInvested)}</td>,
            <td key="c" className="text-right text-white font-semibold px-2">{formatINR(divTotalCurrent)}</td>,
            <td key="p" className={`text-right font-semibold px-2 ${divTotalPL >= 0 ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>{formatINR(divTotalPL)}</td>,
            <td key="ti" className="text-right text-white font-semibold px-2">{formatINR(targetInvestment)}</td>]} />
      </div>

      {/* Totals */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#141418] rounded-lg p-4 border border-[#2a2a34]">
          <p className="text-[#8b8b96] text-xs">Total Invested</p>
          <p className="text-lg text-white">{formatINR(totalInvested)}</p>
        </div>
        <div className="bg-[#141418] rounded-lg p-4 border border-[#2a2a34]">
          <p className="text-[#8b8b96] text-xs">Total Current</p>
          <p className="text-lg text-[#10b981]">{formatINR(totalCurrent)}</p>
        </div>
        <div className="bg-[#141418] rounded-lg p-4 border border-[#2a2a34]">
          <p className="text-[#8b8b96] text-xs">Total P&L</p>
          <p className={`text-lg ${totalPL >= 0 ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>{formatINR(totalPL)}</p>
        </div>
        <div className="bg-[#141418] rounded-lg p-4 border border-[#2a2a34]">
          <p className="text-[#8b8b96] text-xs">Target Investment</p>
          <p className="text-lg text-white">{formatINR(targetInvestment)}</p>
        </div>
      </div>
    </div>
  );
}