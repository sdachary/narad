import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getFinanceInsights, handleFinanceCommand } from './finance';
import * as supabaseClient from './supabase-client.js';

// Mock supabase-client
vi.mock('./supabase-client.js', () => ({
  supabaseQuery: vi.fn(),
  supabaseInsert: vi.fn(),
  supabaseUpdate: vi.fn(),
}));

describe('Finance Service', () => {
  const mockEnv = {
    SUPABASE_URL: 'https://test.supabase.co',
    SUPABASE_KEY: 'test-key',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getFinanceInsights', () => {
    it('should calculate net worth and assets correctly', async () => {
      // Mock data
      const mockLoans = [
        { id: 1, name: 'Home Loan', principal_amount: '1000000', paid_emis: 10, total_emis: 100, status: 'active' }
      ];
      const mockCards = [
        { id: 1, name: 'Visa', current_balance: '5000', status: 'active' }
      ];
      const mockBankAccounts = [
        { id: 1, name: 'HDFC', balance: '50000', is_active: true }
      ];
      const mockWallets = [
        { id: 1, name: 'Paytm', balance: '1000', is_active: true }
      ];
      const mockInvestments = [
        { id: 1, name: 'Stocks', current_value: '20000', is_active: true }
      ];
      const mockExpenses = [];

      (supabaseClient.supabaseQuery as any).mockImplementation((env, table) => {
        if (table === 'finance.loans') return Promise.resolve(mockLoans);
        if (table === 'finance.credit_cards') return Promise.resolve(mockCards);
        if (table === 'finance.expenses') return Promise.resolve(mockExpenses);
        if (table === 'finance.bank_accounts') return Promise.resolve(mockBankAccounts);
        if (table === 'finance.wallets') return Promise.resolve(mockWallets);
        if (table === 'finance.investments') return Promise.resolve(mockInvestments);
        return Promise.resolve([]);
      });

      const insights = await getFinanceInsights(mockEnv);

      // Assets: 50000 + 1000 + 20000 = 71000
      // Liabilities: Loan(1000000 * (1 - 10/100) = 900000) + Card(5000) = 905000
      // Net Worth: 71000 - 905000 = -834000

      expect(insights.totalAssets).toBe(71000);
      expect(insights.totalLiabilities).toBe(905000);
      expect(insights.netWorth).toBe(-834000);
      expect(insights.summary.loanCount).toBe(1);
    });
  });

  describe('handleFinanceCommand', () => {
    it('should handle "net worth" command', async () => {
      // Mock insights data
      (supabaseClient.supabaseQuery as any).mockResolvedValue([]);

      const result = await handleFinanceCommand(mockEnv, 'What is my net worth?');
      
      expect(result).not.toBeNull();
      expect(result?.reply).toContain('Your current net worth is');
      expect(result?.data).toBeDefined();
    });

    it('should handle "paid emi" command', async () => {
      const mockLoan = { id: 1, name: 'Home Loan', principal_amount: '1000000', paid_emis: 10, total_emis: 100, status: 'active' };
      
      (supabaseClient.supabaseQuery as any).mockResolvedValue([mockLoan]);
      (supabaseClient.supabaseUpdate as any).mockResolvedValue([{ ...mockLoan, paid_emis: 11 }]);

      const result = await handleFinanceCommand(mockEnv, 'I paid emi for Home Loan');
      
      expect(result).not.toBeNull();
      expect(result?.reply).toContain('Updated! You\'ve paid 11 of 100 EMIs');
      expect(supabaseClient.supabaseUpdate).toHaveBeenCalledWith(
        mockEnv, 
        'finance.loans', 
        mockLoan.id, 
        expect.objectContaining({ paid_emis: 11 })
      );
    });

    it('should return null for unknown commands', async () => {
      const result = await handleFinanceCommand(mockEnv, 'Hello there');
      expect(result).toBeNull();
    });
  });
});
