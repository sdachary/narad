// narad/pages/services/portfolio.js
import { supabaseQuery } from './supabase-client.js';

export async function getPortfolioSummary(env) {
  const [stocks, dividends, summary] = await Promise.all([
    supabaseQuery(env, 'finance.portfolio_stocks'),
    supabaseQuery(env, 'finance.portfolio_dividends'),
    supabaseQuery(env, 'finance.portfolio_summary')
  ]);
  // For now we ignore dividends in the UI, but they are fetched for completeness
  return {
    totalValue: summary.totalValue,
    change: summary.change,
    changePercent: summary.changePercent,
    assets: stocks.map(s => ({
      name: s.name,
      current_value: s.current_value,
      type: s.type,
      sector: s.sector,
      quantity: s.quantity,
      symbol: s.symbol
    }))
  };
}
