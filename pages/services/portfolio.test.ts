import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getPortfolioSummary } from './portfolio';
import * as supabaseClient from './supabase-client.js';

vi.mock('./supabase-client.js', () => ({
  supabaseQuery: vi.fn()
}));

describe('Portfolio Service', () => {
  const mockEnv = { SUPABASE_URL: 'https://test.supabase.co', SUPABASE_KEY: 'test-key' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return summary with assets and change', async () => {
    const mockInvestments = [
      { id: 1, name: 'ABC Corp', current_value: '10000', type: 'Equity' },
      { id: 2, name: 'ETF XYZ', current_value: '5000', type: 'ETF' }
    ];
    const mockDividends = [];
    const mockSummary = { totalValue: 15000, change: 225, changePercent: 1.5 };

    (supabaseClient.supabaseQuery as any).mockImplementation((env, table) => {
      if (table === 'finance.portfolio_stocks') return Promise.resolve(mockInvestments);
      if (table === 'finance.portfolio_dividends') return Promise.resolve(mockDividends);
      if (table === 'finance.portfolio_summary') return Promise.resolve(mockSummary);
      return Promise.resolve([]);
    });

    const result = await getPortfolioSummary(mockEnv);
    expect(result.totalValue).toBe(15000);
    expect(result.change).toBe(225);
    expect(result.changePercent).toBe(1.5);
    expect(result.assets).toHaveLength(2);
  });
});
