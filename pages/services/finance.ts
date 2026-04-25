// narad/pages/services/finance.ts
import { supabaseQuery, supabaseInsert, supabaseUpdate } from './supabase-client.js';

export interface Loan {
  id: string | number;
  name: string;
  principal_amount: string | number;
  paid_emis: number;
  total_emis: number;
  status: string;
  updated_at?: string;
}

export interface CreditCard {
  id: string | number;
  name: string;
  current_balance: string | number;
  status: string;
}

export interface BankAccount {
  id: string | number;
  name: string;
  balance: string | number;
  is_active: boolean;
}

export interface Wallet {
  id: string | number;
  name: string;
  balance: string | number;
  is_active: boolean;
}

export interface Investment {
  id: string | number;
  name: string;
  current_value: string | number;
  is_active: boolean;
}

export interface Expense {
  id: string | number;
  is_active: boolean;
  [key: string]: any;
}

export interface FinanceInsights {
  netWorth: number;
  totalAssets: number;
  totalLiabilities: number;
  loans: Loan[];
  cards: CreditCard[];
  expenses: Expense[];
  bankAccounts: BankAccount[];
  wallets: Wallet[];
  investments: Investment[];
  summary: {
    loanCount: number;
    cardCount: number;
    bankAccountCount: number;
    walletCount: number;
    upcomingDues: number;
  };
}

export async function getFinanceInsights(env: any): Promise<FinanceInsights> {
  const [loans, cards, expenses, bankAccounts, wallets, investments] = await Promise.all([
    supabaseQuery(env, 'finance.loans') as Promise<Loan[]>,
    supabaseQuery(env, 'finance.credit_cards') as Promise<CreditCard[]>,
    supabaseQuery(env, 'finance.expenses') as Promise<Expense[]>,
    supabaseQuery(env, 'finance.bank_accounts') as Promise<BankAccount[]>,
    supabaseQuery(env, 'finance.wallets') as Promise<Wallet[]>,
    supabaseQuery(env, 'finance.investments') as Promise<Investment[]>
  ]);

  const totalAssets = [
    ...bankAccounts.map(a => parseFloat(a.balance as string)),
    ...wallets.map(w => parseFloat(w.balance as string)),
    ...investments.map(i => parseFloat(i.current_value as string))
  ].reduce((a, b) => a + b, 0);

  const totalLiabilities = [
    ...loans.map(l => parseFloat(l.principal_amount as string) * (1 - (l.paid_emis / l.total_emis))),
    ...cards.map(c => parseFloat(c.current_balance as string))
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
    investments: investments.filter(i => i.is_active && parseFloat(i.current_value as string) > 0),
    summary: {
      loanCount: loans.length,
      cardCount: cards.length,
      bankAccountCount: bankAccounts.length,
      walletCount: wallets.length,
      upcomingDues: 0
    }
  };
}

export async function handleFinanceCommand(env: any, message: string): Promise<{ reply: string; data?: any } | null> {
  const lower = message.toLowerCase();
  
  if (lower.includes('paid emi')) {
    const loans = await supabaseQuery(env, 'finance.loans', '?status=eq.active') as Loan[];
    const loan = loans.find(l => lower.includes(l.name.toLowerCase()));
    
    if (loan) {
      const updated = await supabaseUpdate(env, 'finance.loans', loan.id, {
        paid_emis: loan.paid_emis + 1,
        updated_at: new Date().toISOString()
      }) as Loan[];
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

  return null;
}

export default { getFinanceInsights, handleFinanceCommand };