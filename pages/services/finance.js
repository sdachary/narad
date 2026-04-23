// narad/pages/services/finance.js
import { supabaseQuery, supabaseInsert, supabaseUpdate } from './supabase-client.js';

export async function getFinanceInsights(env) {
  const [loans, cards, expenses, bankAccounts, wallets, investments] = await Promise.all([
    supabaseQuery(env, 'finance.loans'),
    supabaseQuery(env, 'finance.credit_cards'),
    supabaseQuery(env, 'finance.expenses'),
    supabaseQuery(env, 'finance.bank_accounts'),
    supabaseQuery(env, 'finance.wallets'),
    supabaseQuery(env, 'finance.investments')
  ]);

  const totalAssets = [
    ...bankAccounts.map(a => parseFloat(a.balance)),
    ...wallets.map(w => parseFloat(w.balance)),
    ...investments.map(i => parseFloat(i.current_value))
  ].reduce((a, b) => a + b, 0);

  const totalLiabilities = [
    ...loans.map(l => parseFloat(l.principal_amount) * (1 - (l.paid_emis / l.total_emis))),
    ...cards.map(c => parseFloat(c.current_balance))
  ].reduce((a, b) => a + b, 0);

  const netWorth = totalAssets - totalLiabilities;

return {
    netWorth,
    totalAssets,
    totalLiabilities,
    loans: loans.filter(l => l.status === 'active'),
    cards: cards.filter(c => c.status === 'active'),
    expenses: expenses.filter(e => e.is_active),
    bankAccounts: bankAccounts.filter(a => a.is_active),
    wallets: wallets.filter(w => w.is_active),
    investments: investments.filter(i => i.is_active && i.current_value > 0),
    summary: {
      loanCount: loans.length,
      cardCount: cards.length,
      bankAccountCount: bankAccounts.length,
      walletCount: wallets.length,
      upcomingDues: 0
    }
  };
}

export async function handleFinanceCommand(env, message) {
  const lower = message.toLowerCase();
  
  if (lower.includes('paid emi')) {
    // Simple regex to find which loan
    const loans = await supabaseQuery(env, 'finance.loans', '?status=eq.active');
    const loan = loans.find(l => lower.includes(l.name.toLowerCase()));
    
    if (loan) {
      const updated = await supabaseUpdate(env, 'finance.loans', loan.id, {
        paid_emis: loan.paid_emis + 1,
        updated_at: new Date().toISOString()
      });
      return {
        reply: `Updated! You've paid ${updated[0].paid_emis} of ${updated[0].total_emis} EMIs for your ${loan.name}.`,
        data: updated[0]
      };
    }
    return { reply: "I couldn't find which loan you're referring to. Please specify the loan name." };
  }
  
  if (lower.includes('net worth')) {
    const insights = await getFinanceInsights(env);
    return {
      reply: `Your current net worth is ₹${insights.netWorth.toLocaleString()}. Assets: ₹${insights.totalAssets.toLocaleString()}, Liabilities: ₹${insights.totalLiabilities.toLocaleString()}.`,
      data: insights
    };
  }

  return null; // Not a finance command I can handle yet
}
