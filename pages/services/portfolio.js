// narad/pages/services/portfolio.js
import { supabaseQuery } from './supabase-client.js';

export async function getPortfolioSummary(env) {
  const investments = await supabaseQuery(env, 'investments', '?is_active=eq.true');
  
  const totalValue = investments.reduce((sum, inv) => sum + parseFloat(inv.current_value || 0), 0);
  
  // Mocking change data for now
  const change = totalValue * 0.015; // +1.5% mock
  const changePercent = 1.5;

  return {
    totalValue,
    change,
    changePercent,
    assets: investments.map(inv => ({
      name: inv.name,
      value: inv.current_value,
      type: inv.type
    }))
  };
}
