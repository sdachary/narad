import React, { useState, useEffect } from 'react';
import { useFinance } from '../hooks/useFinance';
import { Plus, Edit2, Trash2, X, DollarSign, CreditCard, TrendingUp, Wallet } from 'lucide-react';

function LoanModal({ loan, onSave, onClose }) {
  const [form, setForm] = useState(loan || {
    name: '', loan_type: 'personal', principal_amount: '', interest_rate: '', 
    tenure_months: '', emi_amount: '', start_date: '', total_emis: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1c1c22] p-6 rounded-xl w-full max-w-md border border-[#2a2a32]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#e4e4e8]">{loan ? 'Edit' : 'Add'} Loan</h3>
          <button onClick={onClose} className="text-[#8b8b96] hover:text-white"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required placeholder="Loan Name" className="w-full p-3 bg-[#141418] border border-[#2a2a32] rounded-lg text-white" 
            value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <select className="w-full p-3 bg-[#141418] border border-[#2a2a32] rounded-lg text-white"
            value={form.loan_type} onChange={e => setForm({...form, loan_type: e.target.value})}>
            <option value="home">Home</option>
            <option value="car">Car</option>
            <option value="personal">Personal</option>
            <option value="education">Education</option>
            <option value="gold">Gold</option>
          </select>
          <div className="grid grid-cols-2 gap-4">
            <input required type="number" placeholder="Amount" className="p-3 bg-[#141418] border border-[#2a2a32] rounded-lg text-white"
              value={form.principal_amount} onChange={e => setForm({...form, principal_amount: e.target.value})} />
            <input required type="number" placeholder="Interest %" className="p-3 bg-[#141418] border border-[#2a2a32] rounded-lg text-white"
              value={form.interest_rate} onChange={e => setForm({...form, interest_rate: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input required type="number" placeholder="Tenure (months)" className="p-3 bg-[#141418] border border-[#2a2a32] rounded-lg text-white"
              value={form.tenure_months} onChange={e => setForm({...form, tenure_months: e.target.value})} />
            <input required type="number" placeholder="EMI" className="p-3 bg-[#141418] border border-[#2a2a32] rounded-lg text-white"
              value={form.emi_amount} onChange={e => setForm({...form, emi_amount: e.target.value})} />
          </div>
          <input required type="date" className="w-full p-3 bg-[#141418] border border-[#2a2a32] rounded-lg text-white"
            value={form.start_date} onChange={e => setForm({...form, start_date: e.target.value})} />
          <button type="submit" className="w-full py-3 bg-[#10b981] hover:bg-[#059669] text-white font-semibold rounded-lg">
            Save Loan
          </button>
        </form>
      </div>
    </div>
  );
}

function CardModal({ card, onSave, onClose }) {
  const [form, setForm] = useState(card || {
    name: '', bank: '', card_type: 'credit', limit_amount: '', current_balance: '', billing_cycle_day: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1c1c22] p-6 rounded-xl w-full max-w-md border border-[#2a2a32]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#e4e4e8]">{card ? 'Edit' : 'Add'} Card</h3>
          <button onClick={onClose} className="text-[#8b8b96] hover:text-white"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required placeholder="Card Name" className="w-full p-3 bg-[#141418] border border-[#2a2a32] rounded-lg text-white"
            value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <input required placeholder="Bank Name" className="w-full p-3 bg-[#141418] border border-[#2a2a32] rounded-lg text-white"
            value={form.bank} onChange={e => setForm({...form, bank: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <input required type="number" placeholder="Limit" className="p-3 bg-[#141418] border border-[#2a2a32] rounded-lg text-white"
              value={form.limit_amount} onChange={e => setForm({...form, limit_amount: e.target.value})} />
            <input required type="number" placeholder="Balance" className="p-3 bg-[#141418] border border-[#2a2a32] rounded-lg text-white"
              value={form.current_balance} onChange={e => setForm({...form, current_balance: e.target.value})} />
          </div>
          <button type="submit" className="w-full py-3 bg-[#10b981] hover:bg-[#059669] text-white font-semibold rounded-lg">
            Save Card
          </button>
        </form>
      </div>
    </div>
  );
}

export default function FinanceDashboard() {
  const { loans, cards, investments, bankAccounts, wallets, loading, refresh } = useFinance();
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [editingLoan, setEditingLoan] = useState(null);
  const [editingCard, setEditingCard] = useState(null);

  const totalAssets = [...(bankAccounts || []), ...(wallets || []), ...(investments || [])]
    .reduce((sum, item) => sum + parseFloat(item.balance || item.current_value || 0), 0);

  const totalLiabilities = [...(loans || []), ...(cards || [])]
    .reduce((sum, item) => sum + parseFloat(item.principal_amount || item.current_balance || 0), 0);

  const netWorth = totalAssets - totalLiabilities;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#10b981]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <h1 className="text-2xl font-bold text-[#e4e4e8] mb-6">Finance Dashboard</h1>

      {/* Net Worth Card */}
      <div className="bg-gradient-to-r from-[#10b981] to-[#059669] rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="w-6 h-6 text-white/80" />
          <span className="text-white/80">Net Worth</span>
        </div>
        <div className="text-4xl font-bold text-white">{formatCurrency(netWorth)}</div>
        <div className="flex gap-6 mt-4">
          <div>
            <div className="text-white/60 text-sm">Assets</div>
            <div className="text-white font-semibold">{formatCurrency(totalAssets)}</div>
          </div>
          <div>
            <div className="text-white/60 text-sm">Liabilities</div>
            <div className="text-white font-semibold">{formatCurrency(totalLiabilities)}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Loans Section */}
        <div className="bg-[#1c1c22] rounded-xl p-6 border border-[#2a2a32]">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#10b981]" />
              <h2 className="text-lg font-semibold text-[#e4e4e8]">Loans</h2>
            </div>
            <button onClick={() => setShowLoanModal(true)} className="p-2 bg-[#10b981] rounded-lg hover:bg-[#059669]">
              <Plus className="w-4 h-4 text-white" />
            </button>
          </div>
          
          <div className="space-y-3">
            {(loans || []).map(loan => {
              const progress = loan.total_emis ? (loan.paid_emis / loan.total_emis) * 100 : 0;
              return (
                <div key={loan.id} className="p-4 bg-[#141418] rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium text-white">{loan.name}</div>
                      <div className="text-sm text-[#8b8b96]">{loan.loan_type} • {formatCurrency(loan.emi_amount)}/mo</div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => { setEditingLoan(loan); setShowLoanModal(true); }} className="p-1.5 text-[#8b8b96] hover:text-[#10b981]">
                        <Edit2 size={14} />
                      </button>
                      <button className="p-1.5 text-[#8b8b96] hover:text-[#ef4444]">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="text-lg font-semibold text-white mb-2">{formatCurrency(loan.principal_amount)}</div>
                  <div className="w-full h-2 bg-[#2a2a32] rounded-full overflow-hidden">
                    <div className="h-full bg-[#10b981] rounded-full" style={{ width: `${progress}%` }}></div>
                  </div>
                  <div className="text-xs text-[#8b8b96] mt-1">{loan.paid_emis}/{loan.total_emis} EMIs paid</div>
                </div>
              );
            })}
            {(!loans || loans.length === 0) && (
              <div className="text-center py-8 text-[#8b8b96]">No loans added yet</div>
            )}
          </div>
        </div>

        {/* Credit Cards Section */}
        <div className="bg-[#1c1c22] rounded-xl p-6 border border-[#2a2a32]">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#8b5cf6]" />
              <h2 className="text-lg font-semibold text-[#e4e4e8]">Credit Cards</h2>
            </div>
            <button onClick={() => setShowCardModal(true)} className="p-2 bg-[#8b5cf6] rounded-lg hover:bg-[#7c3aed]">
              <Plus className="w-4 h-4 text-white" />
            </button>
          </div>
          
          <div className="space-y-3">
            {(cards || []).map(card => {
              const usage = card.limit_amount ? (card.current_balance / card.limit_amount) * 100 : 0;
              const usageColor = usage > 80 ? '#ef4444' : usage > 50 ? '#f59e0b' : '#10b981';
              return (
                <div key={card.id} className="p-4 bg-[#141418] rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium text-white">{card.name}</div>
                      <div className="text-sm text-[#8b8b96]">{card.bank}</div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => { setEditingCard(card); setShowCardModal(true); }} className="p-1.5 text-[#8b8b96] hover:text-[#8b5cf6]">
                        <Edit2 size={14} />
                      </button>
                      <button className="p-1.5 text-[#8b8b96] hover:text-[#ef4444]">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#8b8b96]">Balance</span>
                    <span className="text-white">{formatCurrency(card.current_balance)}</span>
                  </div>
                  <div className="w-full h-2 bg-[#2a2a32] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${usage}%`, backgroundColor: usageColor }}></div>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-[#8b8b96]">{usage.toFixed(0)}% used</span>
                    <span className="text-[#8b8b96]">Limit: {formatCurrency(card.limit_amount)}</span>
                  </div>
                </div>
              );
            })}
            {(!cards || cards.length === 0) && (
              <div className="text-center py-8 text-[#8b8b96]">No cards added yet</div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showLoanModal && (
        <LoanModal 
          loan={editingLoan} 
          onSave={(data) => { console.log('Save loan:', data); setShowLoanModal(false); setEditingLoan(null); }} 
          onClose={() => { setShowLoanModal(false); setEditingLoan(null); }} 
        />
      )}
      {showCardModal && (
        <CardModal 
          card={editingCard} 
          onSave={(data) => { console.log('Save card:', data); setShowCardModal(false); setEditingCard(null); }} 
          onClose={() => { setShowCardModal(false); setEditingCard(null); }} 
        />
      )}
    </div>
  );
}